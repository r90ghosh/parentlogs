import type { Subscription, SubscriptionTier, PremiumFeature } from '@tdc/shared/types'
import { isPremiumTier, isInGracePeriod } from '@tdc/shared/utils/subscription-utils'
import type { AppSupabaseClient, ServiceContext } from './types'

// Define which features are available for each tier
const PREMIUM_FEATURES: PremiumFeature[] = [
  'tasks_beyond_14_days', // Legacy key — now means 30-day window
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
]

const TIER_FEATURES: Record<SubscriptionTier, PremiumFeature[]> = {
  free: [],
  premium: PREMIUM_FEATURES,
  lifetime: PREMIUM_FEATURES,
}

export function createSubscriptionService(supabase: AppSupabaseClient) {
  async function resolveUserId(ctx?: Partial<ServiceContext>): Promise<string | null> {
    if (ctx?.userId) return ctx.userId
    const { data: { user } } = await supabase.auth.getUser()
    return user?.id ?? null
  }

  async function getSubscriptionTier(ctx?: Partial<ServiceContext>): Promise<SubscriptionTier> {
    const userId = await resolveUserId(ctx)
    if (!userId) return 'free'

    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier, subscription_expires_at')
      .eq('id', userId)
      .single()

    if (!profile) return 'free'

    // Check if subscription has expired (with 7-day grace period)
    if (profile.subscription_expires_at && profile.subscription_tier !== 'lifetime') {
      const expiresAt = new Date(profile.subscription_expires_at)
      if (expiresAt < new Date()) {
        // Expired — check if still within grace period
        if (isInGracePeriod(profile.subscription_expires_at)) {
          return (profile.subscription_tier as SubscriptionTier) || 'free'
        }
        return 'free'
      }
    }

    return (profile.subscription_tier as SubscriptionTier) || 'free'
  }

  return {
    // Get current user's subscription
    async getSubscription(ctx?: Partial<ServiceContext>): Promise<Subscription | null> {
      const userId = await resolveUserId(ctx)
      if (!userId) return null

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      if (error || !data) return null
      return data as Subscription
    },

    // Get user's subscription tier from profile
    getSubscriptionTier,

    // Check if user has access to a specific feature
    async hasFeature(feature: PremiumFeature, ctx?: Partial<ServiceContext>): Promise<boolean> {
      const tier = await getSubscriptionTier(ctx)
      return TIER_FEATURES[tier].includes(feature)
    },

    // Check if user is premium (any paid tier)
    async isPremium(ctx?: Partial<ServiceContext>): Promise<boolean> {
      const tier = await getSubscriptionTier(ctx)
      return isPremiumTier(tier)
    },

    // Get feature list for display
    getFeatureList(): Array<{ name: string; free: boolean; premium: boolean }> {
      return [
        { name: 'Weekly briefings (4 weeks from signup)', free: true, premium: true },
        { name: 'Task management (30-day rolling window)', free: true, premium: true },
        { name: 'Basic baby tracker (3 log types)', free: true, premium: true },
        { name: 'All checklists', free: true, premium: true },
        { name: 'Mood check-ins & 7-day history', free: true, premium: true },
        { name: 'Dad Journey challenge tiles (current phase)', free: true, premium: true },
        { name: 'Full task timeline (pregnancy → 24 months)', free: false, premium: true },
        { name: 'All weekly briefings (40+ weeks)', free: false, premium: true },
        { name: 'Push notifications & reminders', free: false, premium: true },
        { name: 'Partner sync & coordination', free: false, premium: true },
        { name: 'Advanced tracker + full history', free: false, premium: true },
        { name: 'Mood trends & insights', free: false, premium: true },
        { name: 'Complete budget planner', free: false, premium: true },
        { name: 'Task snooze & reschedule', free: false, premium: true },
        { name: 'Full catch-up backlog triage', free: false, premium: true },
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
}

export type SubscriptionService = ReturnType<typeof createSubscriptionService>
