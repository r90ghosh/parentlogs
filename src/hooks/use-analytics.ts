'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { trackPageView, analytics, identifyUser, resetUser } from '@/lib/analytics'
import { useAuth } from '@/lib/auth/auth-context'

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
  const { user, profile } = useAuth()

  useEffect(() => {
    if (user && profile) {
      identifyUser(user.id, {
        role: profile.role,
        subscription_tier: profile.subscription_tier,
        has_family: !!profile.family_id,
      })
    } else {
      resetUser()
    }
  }, [user, profile])
}

// Re-export analytics helpers for convenience
export { analytics, trackEvent, trackPageView } from '@/lib/analytics'
