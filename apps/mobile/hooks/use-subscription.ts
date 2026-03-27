import { useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useRevenueCat, ENTITLEMENT_ID } from '@/components/providers/RevenueCatProvider'
import { useAuth } from '@/components/providers/AuthProvider'
import { supabase } from '@/lib/supabase'
import { isInGracePeriod, gracePeriodDaysRemaining } from '@tdc/shared/utils/subscription-utils'
import type { PremiumFeature } from '@tdc/shared/types'

/**
 * Unified subscription check combining RevenueCat entitlements + Supabase profile.
 * Handles cross-platform subscriptions: RevenueCat (mobile) and Stripe (web).
 * Note: AuthProvider already normalizes subscription_tier based on expiration/grace period,
 * so checking profile.subscription_tier here is sufficient.
 */
export function useSubscription() {
  const { isPro, customerInfo, isReady } = useRevenueCat()
  const { profile } = useAuth()

  // AuthProvider normalizes tier to 'free' when expired past grace period
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

/**
 * Per-feature premium check.
 * Returns whether the current user has access to a specific premium feature.
 */
export function useHasFeature(feature: PremiumFeature) {
  const { isSubscribed, tier, isReady } = useSubscription()

  return {
    hasFeature: isSubscribed,
    isLoading: !isReady,
    tier,
  }
}

/**
 * Gate hook for conditionally showing a paywall overlay.
 * Returns `shouldShowPaywall: true` when the user is on the free tier.
 */
export function usePremiumGate() {
  const { isSubscribed, tier, isReady } = useSubscription()

  return {
    isPremium: isSubscribed,
    isLoading: !isReady,
    tier,
    shouldShowPaywall: isReady && !isSubscribed,
  }
}

/**
 * Redirect-based premium gate. Pushes to the upgrade screen if the user
 * is not subscribed. Returns a `requirePremium()` callback that returns
 * `false` (and navigates) when the user lacks access.
 */
export function useRequirePremium() {
  const router = useRouter()
  const { isSubscribed, isReady } = useSubscription()

  const requirePremium = useCallback(() => {
    if (isReady && !isSubscribed) {
      router.push('/(screens)/upgrade')
      return false
    }
    return true
  }, [isSubscribed, isReady, router])

  return {
    isPremium: isSubscribed,
    isLoading: !isReady,
    requirePremium,
  }
}

/**
 * Grace period status for showing renewal banners.
 * Uses the shared utility to calculate days remaining after subscription expiry.
 */
export function useGracePeriodStatus() {
  const { profile } = useAuth()
  const expiresAt = profile?.subscription_expires_at ?? null

  return useMemo(() => {
    const inGrace = isInGracePeriod(expiresAt)
    const daysRemaining = gracePeriodDaysRemaining(expiresAt)
    return {
      isInGracePeriod: inGrace,
      daysRemaining,
      expiresAt,
    }
  }, [expiresAt])
}
