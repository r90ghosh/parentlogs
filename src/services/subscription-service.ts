import { createClient } from '@/lib/supabase/client'
import { Subscription, SubscriptionTier, PremiumFeature } from '@/types'

const supabase = createClient()

// Define which features are available for each tier
const TIER_FEATURES: Record<SubscriptionTier, PremiumFeature[]> = {
  free: [],
  premium: [
    'tasks_beyond_14_days',
    'briefings_beyond_4_weeks',
    'tracker_history',
    'tracker_summaries',
    'tracker_advanced_logs',
    'budget_full_access',
    'budget_edit',
    'premium_checklists',
    'partner_sync',
    'push_notifications',
    'export_data',
  ],
  lifetime: [
    'tasks_beyond_14_days',
    'briefings_beyond_4_weeks',
    'tracker_history',
    'tracker_summaries',
    'tracker_advanced_logs',
    'budget_full_access',
    'budget_edit',
    'premium_checklists',
    'partner_sync',
    'push_notifications',
    'export_data',
  ],
}

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

export const subscriptionService = {
  // Get current user's subscription
  async getSubscription(): Promise<Subscription | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error || !data) return null
    return data as Subscription
  },

  // Get user's subscription tier from profile
  async getSubscriptionTier(): Promise<SubscriptionTier> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return 'free'

    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier, subscription_expires_at')
      .eq('id', user.id)
      .single()

    if (!profile) return 'free'

    // Check if subscription has expired
    if (profile.subscription_expires_at) {
      const expiresAt = new Date(profile.subscription_expires_at)
      if (expiresAt < new Date() && profile.subscription_tier !== 'lifetime') {
        return 'free'
      }
    }

    return (profile.subscription_tier as SubscriptionTier) || 'free'
  },

  // Check if user has access to a specific feature
  async hasFeature(feature: PremiumFeature): Promise<boolean> {
    const tier = await this.getSubscriptionTier()
    return TIER_FEATURES[tier].includes(feature)
  },

  // Check if user is premium (any paid tier)
  async isPremium(): Promise<boolean> {
    const tier = await this.getSubscriptionTier()
    return tier === 'premium' || tier === 'lifetime'
  },

  // Create checkout session
  async createCheckoutSession(plan: PricingPlan): Promise<{ url: string | null; error: string | null }> {
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { url: null, error: data.error || 'Failed to create checkout session' }
      }

      return { url: data.url, error: null }
    } catch (error) {
      return { url: null, error: 'Failed to create checkout session' }
    }
  },

  // Create customer portal session
  async createPortalSession(): Promise<{ url: string | null; error: string | null }> {
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (!response.ok) {
        return { url: null, error: data.error || 'Failed to create portal session' }
      }

      return { url: data.url, error: null }
    } catch (error) {
      return { url: null, error: 'Failed to create portal session' }
    }
  },

  // Get feature list for display
  getFeatureList(): Array<{ name: string; free: boolean; premium: boolean }> {
    return [
      { name: 'Weekly briefings (first 4 weeks)', free: true, premium: true },
      { name: 'Task management (14-day view)', free: true, premium: true },
      { name: 'Basic baby tracker', free: true, premium: true },
      { name: 'Hospital bag checklist', free: true, premium: true },
      { name: 'Full task timeline', free: false, premium: true },
      { name: 'All weekly briefings', free: false, premium: true },
      { name: 'Advanced tracker logs', free: false, premium: true },
      { name: 'Tracker history & summaries', free: false, premium: true },
      { name: 'Complete budget planner', free: false, premium: true },
      { name: 'All premium checklists', free: false, premium: true },
      { name: 'Partner sync & notifications', free: false, premium: true },
      { name: 'Data export', free: false, premium: true },
    ]
  },

  // Format price for display
  formatPrice(cents: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100)
  },
}
