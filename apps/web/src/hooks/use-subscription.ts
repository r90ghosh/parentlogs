'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { subscriptionService } from '@/lib/services'
import { createCheckoutSession, createPortalSession, type PricingPlan } from '@/lib/stripe/checkout'
import { PremiumFeature, SubscriptionTier } from '@tdc/shared/types'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { useUser } from '@/components/user-provider'
import { isInGracePeriod, gracePeriodDaysRemaining } from '@tdc/shared/utils/subscription-utils'
import { useServiceContext } from './use-service-context'

export function useSubscription() {
  const ctx = useServiceContext()

  return useQuery({
    queryKey: ['subscription'],
    queryFn: () => subscriptionService.getSubscription(ctx),
    enabled: !!ctx,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  })
}

export function useSubscriptionTier() {
  const ctx = useServiceContext()

  return useQuery({
    queryKey: ['subscription-tier'],
    queryFn: () => subscriptionService.getSubscriptionTier(ctx),
    enabled: !!ctx,
    staleTime: 1000 * 60 * 5,
  })
}

export function useIsPremium() {
  const { data: tier, isLoading } = useSubscriptionTier()
  return {
    isPremium: tier === 'premium' || tier === 'lifetime',
    isLifetime: tier === 'lifetime',
    tier: tier || 'free',
    isLoading,
  }
}

export function useHasFeature(feature: PremiumFeature) {
  const { isPremium, isLoading } = useIsPremium()

  // All premium features are available to premium/lifetime users
  return {
    hasFeature: isPremium,
    isLoading,
  }
}

export function useCheckout() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const checkoutMutation = useMutation({
    mutationFn: async (plan: PricingPlan) => {
      const result = await createCheckoutSession(plan)
      if (result.error) throw new Error(result.error)
      return result.url
    },
    onSuccess: (url) => {
      if (url) {
        window.location.href = url
      }
    },
  })

  const portalMutation = useMutation({
    mutationFn: async () => {
      const result = await createPortalSession()
      if (result.error) throw new Error(result.error)
      return result.url
    },
    onSuccess: (url) => {
      if (url) {
        window.location.href = url
      }
    },
  })

  return {
    checkout: checkoutMutation.mutate,
    isCheckingOut: checkoutMutation.isPending,
    checkoutError: checkoutMutation.error?.message,

    openPortal: portalMutation.mutate,
    isOpeningPortal: portalMutation.isPending,
    portalError: portalMutation.error?.message,
  }
}

// Hook to require premium access - redirects to upgrade page if not premium
export function useRequirePremium(feature?: PremiumFeature) {
  const router = useRouter()
  const { isPremium, isLoading } = useIsPremium()

  const requirePremium = useCallback(() => {
    if (!isLoading && !isPremium) {
      router.push('/upgrade')
      return false
    }
    return true
  }, [isPremium, isLoading, router])

  return {
    isPremium,
    isLoading,
    requirePremium,
  }
}

// Component wrapper for premium-only content
export function usePremiumGate() {
  const { isPremium, isLoading, tier } = useIsPremium()

  return {
    isPremium,
    isLoading,
    tier,
    shouldShowPaywall: !isLoading && !isPremium,
  }
}

// Grace period status for showing renewal banners
export function useGracePeriodStatus() {
  const { profile } = useUser()
  const expiresAt = profile.subscription_expires_at ?? null

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
