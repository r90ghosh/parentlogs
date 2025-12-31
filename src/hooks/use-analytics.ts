'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { trackPageView, analytics, identifyUser, resetUser } from '@/lib/analytics'
import { useAuth } from '@/lib/auth/auth-context'
import { useOptionalUser } from '@/components/user-provider'

// Hook to track page views automatically
export function usePageTracking() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : '')
    trackPageView(url)
  }, [pathname, searchParams])
}

// Hook to identify user for analytics
export function useUserIdentification() {
  const { user } = useAuth()
  const userData = useOptionalUser()

  useEffect(() => {
    if (user && userData?.profile) {
      identifyUser(user.id, {
        role: userData.profile.role,
        subscription_tier: userData.profile.subscription_tier,
        has_family: !!userData.profile.family_id,
      })
    } else if (!user) {
      resetUser()
    }
  }, [user, userData])
}

// Re-export analytics helpers for convenience
export { analytics, trackEvent, trackPageView } from '@/lib/analytics'
