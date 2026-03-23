import { createClient } from '@/lib/supabase/client'

// Pricing configuration
export const PRICING = {
  monthly: {
    price: 499, // $4.99 in cents
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY || '',
    label: '$4.99/month',
    period: 'month',
  },
  yearly: {
    price: 3999, // $39.99 in cents (save ~33%)
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ANNUAL || '',
    label: '$39.99/year',
    period: 'year',
    savings: 'Save 33%',
  },
  lifetime: {
    price: 9999, // $99.99 one-time
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_LIFETIME || '',
    label: '$99.99 one-time',
    period: 'lifetime',
    savings: 'Best value',
  },
} as const

export type PricingPlan = keyof typeof PRICING

// Create checkout session
export async function createCheckoutSession(plan: PricingPlan): Promise<{ url: string | null; error: string | null }> {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.access_token) {
      return { url: null, error: 'You must be logged in to purchase a subscription' }
    }

    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ plan }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { url: null, error: data.error || 'Failed to create checkout session' }
    }

    return { url: data.url, error: null }
  } catch {
    return { url: null, error: 'Failed to create checkout session' }
  }
}

// Create customer portal session
export async function createPortalSession(): Promise<{ url: string | null; error: string | null }> {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.access_token) {
      return { url: null, error: 'You must be logged in to access the portal' }
    }

    const response = await fetch('/api/stripe/portal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return { url: null, error: data.error || 'Failed to create portal session' }
    }

    return { url: data.url, error: null }
  } catch {
    return { url: null, error: 'Failed to create portal session' }
  }
}
