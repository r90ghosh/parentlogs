// RevenueCat webhook handler for mobile IAP subscription events.
// Mirrors the Stripe webhook at api/stripe/webhook/route.ts:
//   - Validates via Authorization header (shared secret)
//   - Deduplicates via revenucat_webhook_events table
//   - Updates profiles.subscription_tier + subscriptions table
//   - Propagates tier changes to all family members

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { triggerEmail } from '@/lib/email/trigger-email'

// --- RevenueCat payload types ---

interface RevenueCatWebhookBody {
  api_version: string
  event: RevenueCatEvent
}

interface RevenueCatEvent {
  id: string
  type: string
  app_user_id: string
  aliases: string[]
  product_id: string
  entitlement_ids: string[] | null
  store: string // APP_STORE, PLAY_STORE
  environment: string // PRODUCTION, SANDBOX
  purchased_at_ms: number
  expiration_at_ms: number | null
  period_type: string // NORMAL, TRIAL, INTRO
  is_family_share: boolean | null
  presented_offering_id: string | null
  original_app_user_id: string
  currency: string | null
  price_in_purchased_currency: number | null
}

// RevenueCat event types we handle
const ACTIVE_EVENT_TYPES = [
  'INITIAL_PURCHASE',
  'RENEWAL',
  'UNCANCELLATION',
  'PRODUCT_CHANGE',
  'NON_RENEWING_PURCHASE',
] as const

const CANCELLATION_EVENT_TYPES = ['CANCELLATION'] as const

const EXPIRATION_EVENT_TYPES = [
  'EXPIRATION',
  'SUBSCRIPTION_PAUSED',
] as const

const BILLING_ISSUE_EVENT_TYPES = [
  'BILLING_ISSUE',
] as const

// --- Product ID to tier mapping ---

type SubscriptionTier = 'free' | 'premium' | 'lifetime'

function mapProductIdToTier(productId: string): SubscriptionTier {
  const lower = productId.toLowerCase()
  if (lower.includes('lifetime')) return 'lifetime'
  // Monthly and annual subscriptions both map to premium
  if (lower.includes('monthly') || lower.includes('annual') || lower.includes('yearly')) return 'premium'
  // RevenueCat package IDs from the mobile app: $rc_monthly, $rc_annual, $rc_lifetime
  if (lower.includes('rc_monthly') || lower.includes('rc_annual')) return 'premium'
  if (lower.includes('rc_lifetime')) return 'lifetime'
  // Fallback: any recognized product is premium (e.g. tdc_monthly_499, tdc_annual_3999)
  if (lower.includes('tdc_')) return 'premium'
  // Unknown product — log and default to premium to avoid wrongly denying access
  console.warn(`[RevenueCat Webhook] Unknown product_id "${productId}", defaulting to premium`)
  return 'premium'
}

function mapStoreToPlatform(store: string): 'ios' | 'android' {
  return store === 'PLAY_STORE' ? 'android' : 'ios'
}

// --- Main handler ---

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.REVENUECAT_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('[RevenueCat Webhook] REVENUECAT_WEBHOOK_SECRET is not configured')
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  // RevenueCat sends the secret in the Authorization header as a Bearer token
  const authHeader = request.headers.get('authorization')
  if (!authHeader || authHeader !== `Bearer ${webhookSecret}`) {
    return NextResponse.json({ error: 'Invalid authorization' }, { status: 401 })
  }

  let body: RevenueCatWebhookBody

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const event = body.event
  if (!event || !event.type || !event.app_user_id) {
    return NextResponse.json({ error: 'Invalid event payload' }, { status: 400 })
  }

  // Skip sandbox events in production
  if (process.env.NODE_ENV === 'production' && event.environment === 'SANDBOX') {
    console.log('[RevenueCat Webhook] Skipping sandbox event:', event.type)
    return NextResponse.json({ received: true, skipped: 'sandbox' })
  }

  const supabaseAdmin = getSupabaseAdmin()

  // Atomic idempotency via revenucat_webhook_events table (same pattern as Stripe webhook)
  const eventId = event.id || `${event.app_user_id}_${event.type}_${event.purchased_at_ms}`

  const { data: inserted, error: dedupeError } = await supabaseAdmin
    .from('revenucat_webhook_events')
    .upsert(
      { event_id: eventId, event_type: event.type, processed_at: new Date().toISOString() },
      { onConflict: 'event_id', ignoreDuplicates: true }
    )
    .select('id')
    .single()

  if (dedupeError) {
    if (dedupeError.code === 'PGRST116') {
      // Event already processed (conflict) — skip
      return NextResponse.json({ received: true, duplicate: true })
    }
    // Real database error — return 500 so RevenueCat retries
    console.error('[RevenueCat Webhook] Idempotency check failed:', dedupeError)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
  if (!inserted) {
    return NextResponse.json({ received: true, duplicate: true })
  }

  try {
    const eventType = event.type

    if ((ACTIVE_EVENT_TYPES as readonly string[]).includes(eventType)) {
      await handleActiveSubscription(event)
    } else if ((CANCELLATION_EVENT_TYPES as readonly string[]).includes(eventType)) {
      await handleCancellation(event)
    } else if ((EXPIRATION_EVENT_TYPES as readonly string[]).includes(eventType)) {
      await handleExpiration(event)
    } else if ((BILLING_ISSUE_EVENT_TYPES as readonly string[]).includes(eventType)) {
      await handleBillingIssue(event)
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[RevenueCat Webhook] Unhandled event type: ${eventType}`)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[RevenueCat Webhook] Processing error:', error)
    // Return 200 to prevent RevenueCat from retrying non-retryable errors.
    // Auth/validation failures (above) still return 4xx since those are retryable.
    return NextResponse.json({ received: true, error: 'Processing failed' }, { status: 200 })
  }
}

// --- Event handlers ---

async function handleActiveSubscription(event: RevenueCatEvent) {
  const userId = event.app_user_id
  const tier = mapProductIdToTier(event.product_id)
  const platform = mapStoreToPlatform(event.store)
  const supabaseAdmin = getSupabaseAdmin()

  // Verify user exists
  const { data: profile, error: profileLookupError } = await supabaseAdmin
    .from('profiles')
    .select('id, family_id')
    .eq('id', userId)
    .single()

  if (profileLookupError || !profile) {
    console.error(`[RevenueCat Webhook] No profile found for user: ${userId}`)
    return
  }

  const periodEnd = event.expiration_at_ms
    ? new Date(event.expiration_at_ms).toISOString()
    : null
  const periodStart = event.purchased_at_ms
    ? new Date(event.purchased_at_ms).toISOString()
    : new Date().toISOString()

  // Upsert subscription record
  const { error: subError } = await supabaseAdmin
    .from('subscriptions')
    .upsert({
      user_id: userId,
      tier,
      status: 'active',
      platform,
      revenucat_app_user_id: event.original_app_user_id,
      store_product_id: event.product_id,
      current_period_start: periodStart,
      current_period_end: periodEnd,
      cancel_at_period_end: false,
      last_verified_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
  if (subError) throw subError

  // Update subscriber's profile
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({
      subscription_tier: tier,
      subscription_expires_at: tier === 'lifetime' ? null : periodEnd,
    })
    .eq('id', userId)
  if (profileError) throw profileError

  // Propagate to all family members
  if (profile.family_id) {
    await supabaseAdmin
      .from('profiles')
      .update({
        subscription_tier: tier,
        subscription_expires_at: tier === 'lifetime' ? null : periodEnd,
      })
      .eq('family_id', profile.family_id)
      .neq('id', userId) // Don't double-update the subscriber
  }

  // Trigger confirmation email for initial purchases
  if (event.type === 'INITIAL_PURCHASE' || event.type === 'NON_RENEWING_PURCHASE') {
    triggerEmail('subscription_confirmed', userId, { plan: tier }).catch((err) =>
      console.error('[RevenueCat Webhook] Email trigger failed:', err)
    )
  }

  console.log(`[RevenueCat Webhook] ${event.type}: user=${userId} tier=${tier} platform=${platform}`)
}

async function handleCancellation(event: RevenueCatEvent) {
  const userId = event.app_user_id
  const supabaseAdmin = getSupabaseAdmin()

  const { data: profile, error: profileLookupError } = await supabaseAdmin
    .from('profiles')
    .select('id, family_id')
    .eq('id', userId)
    .single()

  if (profileLookupError || !profile) {
    console.error(`[RevenueCat Webhook] No profile found for user: ${userId}`)
    return
  }

  // Calculate grace period: use expiration_at_ms or 7 days from now, whichever is later
  // (mirrors Stripe webhook handleSubscriptionCanceled)
  const expirationDate = event.expiration_at_ms
    ? new Date(event.expiration_at_ms)
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // fallback 7 days
  const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const expiresAt = expirationDate > sevenDaysFromNow ? expirationDate : sevenDaysFromNow

  // Mark subscription as canceled but keep tier active until grace period ends
  const { error: subError } = await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'canceled',
      cancel_at_period_end: true,
      current_period_end: expiresAt.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
  if (subError) throw new Error(`Failed to update subscription: ${subError.message}`)

  // Keep tier as 'premium' during grace period (same approach as Stripe webhook).
  // subscription_expires_at marks when access actually ends.
  // A cron job or on-read check downgrades tier to 'free' after expiry.
  if (profile.family_id) {
    const { error: familyError } = await supabaseAdmin
      .from('profiles')
      .update({ subscription_expires_at: expiresAt.toISOString() })
      .eq('family_id', profile.family_id)
    if (familyError) throw new Error(`Failed to update family profiles: ${familyError.message}`)
  } else {
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ subscription_expires_at: expiresAt.toISOString() })
      .eq('id', userId)
    if (profileError) throw new Error(`Failed to update profile: ${profileError.message}`)
  }

  const daysRemaining = Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  triggerEmail('subscription_expiring', userId, { days_remaining: daysRemaining }).catch((err) =>
    console.error('[RevenueCat Webhook] Email trigger failed:', err)
  )

  console.log(`[RevenueCat Webhook] CANCELLATION: user=${userId} expires=${expiresAt.toISOString()} daysRemaining=${daysRemaining}`)
}

async function handleExpiration(event: RevenueCatEvent) {
  const userId = event.app_user_id
  const supabaseAdmin = getSupabaseAdmin()

  const { data: profile, error: profileLookupError } = await supabaseAdmin
    .from('profiles')
    .select('id, family_id')
    .eq('id', userId)
    .single()

  if (profileLookupError || !profile) {
    console.error(`[RevenueCat Webhook] No profile found for user: ${userId}`)
    return
  }

  // Update subscription to expired
  const { error: subError } = await supabaseAdmin
    .from('subscriptions')
    .update({
      tier: 'free',
      status: 'expired',
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
  if (subError) throw subError

  // Downgrade subscriber's profile
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({
      subscription_tier: 'free',
      subscription_expires_at: null,
    })
    .eq('id', userId)
  if (profileError) throw profileError

  // Downgrade all family members
  if (profile.family_id) {
    await supabaseAdmin
      .from('profiles')
      .update({
        subscription_tier: 'free',
        subscription_expires_at: null,
      })
      .eq('family_id', profile.family_id)
      .neq('id', userId)
  }

  console.log(`[RevenueCat Webhook] EXPIRATION: user=${userId} downgraded to free`)
}

async function handleBillingIssue(event: RevenueCatEvent) {
  const userId = event.app_user_id
  const supabaseAdmin = getSupabaseAdmin()

  // Mark as past_due (same as Stripe invoice.payment_failed)
  const { error: updateError } = await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'past_due',
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
  if (updateError) throw updateError

  triggerEmail('payment_failed', userId).catch((err) =>
    console.error('[RevenueCat Webhook] Email trigger failed:', err)
  )

  console.warn(`[RevenueCat Webhook] BILLING_ISSUE: user=${userId} product=${event.product_id}`)
}
