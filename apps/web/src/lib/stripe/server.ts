import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Missing STRIPE_SECRET_KEY environment variable')
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-02-25.clover',
      typescript: true,
    })
  }
  return _stripe
}

/** @deprecated Use getStripe() for lazy initialization */
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

export const PRICING_CONFIG = {
  monthly: {
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID || '',
    mode: 'subscription' as const,
  },
  yearly: {
    priceId: process.env.STRIPE_YEARLY_PRICE_ID || '',
    mode: 'subscription' as const,
  },
  lifetime: {
    priceId: process.env.STRIPE_LIFETIME_PRICE_ID || '',
    mode: 'payment' as const,
  },
}

// Alternative names used in .env.local (for compatibility)
export const PRICING_CONFIG_ALT = {
  monthly: {
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID || process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY || '',
    mode: 'subscription' as const,
  },
  yearly: {
    priceId: process.env.STRIPE_YEARLY_PRICE_ID || process.env.NEXT_PUBLIC_STRIPE_PRICE_ANNUAL || '',
    mode: 'subscription' as const,
  },
  lifetime: {
    priceId: process.env.STRIPE_LIFETIME_PRICE_ID || process.env.NEXT_PUBLIC_STRIPE_PRICE_LIFETIME || '',
    mode: 'payment' as const,
  },
}

export type PlanType = keyof typeof PRICING_CONFIG
