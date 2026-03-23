import { useQuery } from '@tanstack/react-query'
import { useRevenueCat, ENTITLEMENT_ID } from '@/components/providers/RevenueCatProvider'
import { useAuth } from '@/components/providers/AuthProvider'
import { supabase } from '@/lib/supabase'

/**
 * Unified subscription check combining RevenueCat entitlements + Supabase profile.
 * Handles cross-platform subscriptions: RevenueCat (mobile) and Stripe (web).
 */
export function useSubscription() {
  const { isPro, customerInfo, isReady } = useRevenueCat()
  const { profile } = useAuth()

  const supabasePremium =
    profile?.subscription_tier === 'premium' ||
    profile?.subscription_tier === 'lifetime'

  const isSubscribed = isPro || supabasePremium

  const tier: 'free' | 'premium' | 'lifetime' = profile?.subscription_tier === 'lifetime'
    ? 'lifetime'
    : isSubscribed
      ? 'premium'
      : 'free'

  const activeEntitlement = customerInfo?.entitlements.active[ENTITLEMENT_ID]

  return {
    isSubscribed,
    tier,
    isReady,
    expirationDate: activeEntitlement?.expirationDate ?? null,
    willRenew: activeEntitlement?.willRenew ?? false,
    productIdentifier: activeEntitlement?.productIdentifier ?? null,
  }
}

/**
 * Fetches subscription record from Supabase for status checks (past_due, canceling).
 * Handles cross-platform: detects Stripe subscription issues even on mobile.
 */
export function useSubscriptionStatus() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['subscription-status', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('status, cancel_at_period_end, current_period_end')
        .eq('user_id', user!.id)
        .single()
      if (error && error.code !== 'PGRST116') throw error
      return data as {
        status: string
        cancel_at_period_end: boolean
        current_period_end: string | null
      } | null
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  })
}
