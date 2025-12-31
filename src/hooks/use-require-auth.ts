'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { useOptionalUser } from '@/components/user-provider'

/**
 * @deprecated Server-side auth in layouts handles route protection now.
 * This hook is kept for compatibility but is largely unnecessary.
 */
export function useRequireAuth(redirectTo = '/login') {
  const { user } = useAuth()
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Give a brief moment for client-side auth to sync
    const timeout = setTimeout(() => {
      setIsReady(true)
      if (!user) {
        router.push(redirectTo)
      }
    }, 100)

    return () => clearTimeout(timeout)
  }, [user, redirectTo, router])

  return { user, isLoading: !isReady }
}

/**
 * @deprecated Server-side auth in layouts handles route protection now.
 * This hook is kept for compatibility but is largely unnecessary.
 */
export function useRequireFamily(redirectTo = '/onboarding') {
  const userData = useOptionalUser()
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsReady(true)
      if (userData?.profile && !userData.profile.family_id) {
        router.push(redirectTo)
      }
    }, 100)

    return () => clearTimeout(timeout)
  }, [userData, redirectTo, router])

  return {
    profile: userData?.profile ?? null,
    isLoading: !isReady,
    hasFamily: !!userData?.profile?.family_id
  }
}

/**
 * @deprecated Use useIsPremium hook instead.
 */
export function useRequirePremium() {
  const userData = useOptionalUser()

  const isPremium = userData?.profile?.subscription_tier === 'premium' ||
                    userData?.profile?.subscription_tier === 'lifetime'

  return {
    isPremium,
    isLoading: false,
    tier: userData?.profile?.subscription_tier ?? 'free'
  }
}
