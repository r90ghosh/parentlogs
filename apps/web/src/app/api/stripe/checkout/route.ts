import { NextRequest, NextResponse } from 'next/server'
import { stripe, PRICING_CONFIG, PlanType } from '@/lib/stripe/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  const supabaseAdmin = getSupabaseAdmin()
  try {
    const { plan } = await request.json() as { plan: PlanType }

    if (!plan || !PRICING_CONFIG[plan]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Get user from auth header
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user with Supabase
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user already has a Stripe customer ID
    const { data: subscription } = await supabaseAdmin
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    let customerId = subscription?.stripe_customer_id

    // Create customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      })
      customerId = customer.id

      // Upsert subscription record with customer ID
      await supabaseAdmin
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          stripe_customer_id: customerId,
          tier: 'free',
          status: 'active',
        }, {
          onConflict: 'user_id',
        })
    }

    const config = PRICING_CONFIG[plan]
    const isLifetime = plan === 'lifetime'

    const appUrl = process.env.NEXT_PUBLIC_APP_URL
    if (!appUrl) {
      console.error('NEXT_PUBLIC_APP_URL is not set')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }
    // Only block localhost in production — local dev legitimately uses localhost
    if (process.env.NODE_ENV === 'production' && appUrl.includes('localhost')) {
      console.error('NEXT_PUBLIC_APP_URL is localhost in production')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    if (!config.priceId) {
      console.error(`Missing Stripe price ID for plan: ${plan}`)
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: config.mode,
      payment_method_types: ['card'],
      line_items: [
        {
          price: config.priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/subscription?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/upgrade?canceled=true`,
      metadata: {
        user_id: user.id,
        plan,
      },
      subscription_data: isLifetime ? undefined : {
        metadata: {
          user_id: user.id,
          plan,
        },
      },
      payment_intent_data: isLifetime ? {
        metadata: {
          user_id: user.id,
          plan,
        },
      } : undefined,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
