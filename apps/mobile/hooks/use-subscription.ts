import { useRevenueCat, ENTITLEMENT_ID } from '@/components/providers/RevenueCatProvider'
import { useAuth } from '@/components/providers/AuthProvider'

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
