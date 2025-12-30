'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'

export function useRequireAuth(redirectTo = '/login') {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(redirectTo)
    }
  }, [user, isLoading, redirectTo, router])

  return { user, isLoading }
}

export function useRequireFamily(redirectTo = '/onboarding') {
  const { profile, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && profile && !profile.family_id) {
      router.push(redirectTo)
    }
  }, [profile, isLoading, redirectTo, router])

  return { profile, isLoading, hasFamily: !!profile?.family_id }
}

export function useRequirePremium() {
  const { profile, isLoading } = useAuth()

  const isPremium = profile?.subscription_tier === 'premium' || profile?.subscription_tier === 'lifetime'

  return {
    isPremium,
    isLoading,
    tier: profile?.subscription_tier ?? 'free'
  }
}
