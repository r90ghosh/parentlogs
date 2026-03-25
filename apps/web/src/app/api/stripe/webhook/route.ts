// IMPORTANT: This is the canonical Next.js Stripe webhook handler.
// It handles grace period logic for subscription cancellations.
// The duplicate at supabase/functions/stripe-webhook/index.ts is DEPRECATED — do not
// register it in the Stripe Dashboard. This route is the single source of truth.

import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { triggerEmail } from '@/lib/email/trigger-email'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    // 400 for signature failures — Stripe should retry with a valid signature
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabaseAdmin = getSupabaseAdmin()

  // Atomic idempotency: INSERT with ON CONFLICT uses the UNIQUE constraint on event_id
  // to prevent duplicate processing even under concurrent requests
  const { data: inserted, error: dedupeError } = await supabaseAdmin
    .from('stripe_webhook_events')
    .upsert(
      { event_id: event.id, event_type: event.type, processed_at: new Date().toISOString() },
      { onConflict: 'event_id', ignoreDuplicates: true }
    )
    .select('id')
    .single()

  if (dedupeError || !inserted) {
    // Event already processed (conflict) or error — skip
    return NextResponse.json({ received: true, duplicate: true })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutComplete(session)
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdate(subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionCanceled(subscription)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentSucceeded(invoice)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailed(invoice)
        break
      }

      default:
        if (process.env.NODE_ENV === 'development') {
          console.log(`Unhandled event type: ${event.type}`)
        }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    // Return 200 to prevent Stripe from retrying non-retryable errors.
    // Signature failures (above) still return 400 since those are retryable.
    return NextResponse.json({ received: true, error: 'Processing failed' }, { status: 200 })
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id
  const plan = session.metadata?.plan

  if (!userId) {
    console.error('No user_id in checkout session metadata')
    return
  }

  // For lifetime purchase (payment mode)
  if (session.mode === 'payment' && plan === 'lifetime') {
    const { error: subError } = await getSupabaseAdmin()
      .from('subscriptions')
      .upsert({
        user_id: userId,
        stripe_customer_id: session.customer as string,
        tier: 'lifetime',
        status: 'active',
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      })
    if (subError) throw subError

    // Update profile
    const { error: profileError } = await getSupabaseAdmin()
      .from('profiles')
      .update({
        subscription_tier: 'lifetime',
        subscription_expires_at: null, // Lifetime never expires
      })
      .eq('id', userId)
    if (profileError) throw profileError

    triggerEmail('subscription_confirmed', userId, { plan: 'lifetime' }).catch((err) => console.error('Email trigger failed:', err))
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  // Find user by customer ID
  const { data: subRecord } = await getSupabaseAdmin()
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!subRecord) {
    console.error('No subscription record found for customer:', customerId)
    return
  }

  const userId = subRecord.user_id
  const status = subscription.status

  // Access items to get period end - Stripe API structure
  const rawPeriodEnd = subscription.items?.data[0]?.current_period_end
  const rawPeriodStart = subscription.items?.data[0]?.current_period_start

  if (!rawPeriodEnd) {
    console.warn(`Stripe subscription ${subscription.id} missing period_end, using 30-day fallback`)
  }
  if (!rawPeriodStart) {
    console.warn(`Stripe subscription ${subscription.id} missing period_start, using now as fallback`)
  }

  const currentPeriodEnd = rawPeriodEnd ?? Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60
  const currentPeriodStart = rawPeriodStart ?? Math.floor(Date.now() / 1000)

  const periodEnd = new Date(currentPeriodEnd * 1000)
  const periodStart = new Date(currentPeriodStart * 1000)

  // Determine tier based on subscription status
  let tier: 'free' | 'premium' | 'lifetime' = 'free'
  if (status === 'active' || status === 'trialing') {
    tier = 'premium'
  }

  // Update subscription record
  const { error: subError } = await getSupabaseAdmin()
    .from('subscriptions')
    .update({
      stripe_subscription_id: subscription.id,
      tier,
      status,
      current_period_start: periodStart.toISOString(),
      current_period_end: periodEnd.toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
  if (subError) throw subError

  // Update profile
  const { error: profileError } = await getSupabaseAdmin()
    .from('profiles')
    .update({
      subscription_tier: tier,
      subscription_expires_at: periodEnd.toISOString(),
    })
    .eq('id', userId)
  if (profileError) throw profileError

  const isNewSubscription = subscription.status === 'active'
    && tier === 'premium'
    && (Date.now() / 1000 - subscription.created) < 300
  if (isNewSubscription) {
    triggerEmail('subscription_confirmed', userId, { plan: 'premium' }).catch((err) => console.error('Email trigger failed:', err))
  }
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  const { data: subRecord } = await getSupabaseAdmin()
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!subRecord) return

  // Calculate grace period: use current_period_end or 7 days from now, whichever is later
  const currentPeriodEnd = subscription.items?.data[0]?.current_period_end
    ?? Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 // fallback to 7 days
  const periodEnd = new Date(currentPeriodEnd * 1000)
  const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const expiresAt = periodEnd > sevenDaysFromNow ? periodEnd : sevenDaysFromNow

  // Update subscription to canceled but keep premium until grace period expires
  const { error: subError } = await getSupabaseAdmin()
    .from('subscriptions')
    .update({
      status: 'canceled',
      current_period_end: expiresAt.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', subRecord.user_id)
  if (subError) throw new Error(`Failed to update subscription: ${subError.message}`)

  // Look up user's family to apply family-wide downgrade
  const { data: userProfile } = await getSupabaseAdmin()
    .from('profiles')
    .select('family_id')
    .eq('id', subRecord.user_id)
    .single()

  if (userProfile?.family_id) {
    // Keep tier as 'premium' during grace period so client-side isPremium checks
    // continue to work. The subscription_expires_at marks when access ends.
    // A cron job or on-read check should downgrade tier to 'free' after expiry.
    const { error: familyError } = await getSupabaseAdmin()
      .from('profiles')
      .update({
        subscription_expires_at: expiresAt.toISOString(),
      })
      .eq('family_id', userProfile.family_id)
    if (familyError) throw new Error(`Failed to update family profiles: ${familyError.message}`)
  } else {
    // No family — just update the canceling user's profile
    const { error: profileError } = await getSupabaseAdmin()
      .from('profiles')
      .update({
        subscription_expires_at: expiresAt.toISOString(),
      })
      .eq('id', subRecord.user_id)
    if (profileError) throw new Error(`Failed to update profile: ${profileError.message}`)
  }

  const daysRemaining = Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  triggerEmail('subscription_expiring', subRecord.user_id, { days_remaining: daysRemaining }).catch((err) => console.error('Email trigger failed:', err))
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  // Payment succeeded - subscription is active
  console.log('Payment succeeded for invoice:', invoice.id)
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string

  const { data: subRecord } = await getSupabaseAdmin()
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!subRecord) return

  // Update status to past_due
  const { error: updateError } = await getSupabaseAdmin()
    .from('subscriptions')
    .update({
      status: 'past_due',
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', subRecord.user_id)
  if (updateError) throw updateError

  triggerEmail('payment_failed', subRecord.user_id).catch((err) => console.error('Email trigger failed:', err))
}
