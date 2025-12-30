'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { subscriptionService, PricingPlan } from '@/services/subscription-service'
import { PremiumFeature, SubscriptionTier } from '@/types'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export function useSubscription() {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: () => subscriptionService.getSubscription(),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  })
}

export function useSubscriptionTier() {
  return useQuery({
    queryKey: ['subscription-tier'],
    queryFn: () => subscriptionService.getSubscriptionTier(),
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
      const result = await subscriptionService.createCheckoutSession(plan)
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
      const result = await subscriptionService.createPortalSession()
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
