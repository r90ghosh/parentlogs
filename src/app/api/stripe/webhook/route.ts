import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
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
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
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
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
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
    await supabaseAdmin
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

    // Update profile
    await supabaseAdmin
      .from('profiles')
      .update({
        subscription_tier: 'lifetime',
        subscription_expires_at: null, // Lifetime never expires
      })
      .eq('id', userId)
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  // Find user by customer ID
  const { data: subRecord } = await supabaseAdmin
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
  const currentPeriodEnd = subscription.items?.data[0]?.current_period_end
    ?? Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60 // fallback to 30 days
  const currentPeriodStart = subscription.items?.data[0]?.current_period_start
    ?? Math.floor(Date.now() / 1000)

  const periodEnd = new Date(currentPeriodEnd * 1000)
  const periodStart = new Date(currentPeriodStart * 1000)

  // Determine tier based on subscription status
  let tier: 'free' | 'premium' | 'lifetime' = 'free'
  if (status === 'active' || status === 'trialing') {
    tier = 'premium'
  }

  // Update subscription record
  await supabaseAdmin
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

  // Update profile
  await supabaseAdmin
    .from('profiles')
    .update({
      subscription_tier: tier,
      subscription_expires_at: periodEnd.toISOString(),
    })
    .eq('id', userId)
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  const { data: subRecord } = await supabaseAdmin
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!subRecord) return

  // Update subscription to canceled/free
  await supabaseAdmin
    .from('subscriptions')
    .update({
      tier: 'free',
      status: 'canceled',
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', subRecord.user_id)

  // Update profile
  await supabaseAdmin
    .from('profiles')
    .update({
      subscription_tier: 'free',
    })
    .eq('id', subRecord.user_id)
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  // Payment succeeded - subscription is active
  console.log('Payment succeeded for invoice:', invoice.id)
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string

  const { data: subRecord } = await supabaseAdmin
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!subRecord) return

  // Update status to past_due
  await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'past_due',
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', subRecord.user_id)
}
