import { useMemo } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import type { ServiceContext } from '@tdc/services'

/**
 * Constructs a ServiceContext from the auth provider to pass to shared service calls.
 * This eliminates redundant getUser() + profile lookup DB calls inside each service method.
 * Returns undefined when the user is not authenticated.
 */
export function useServiceContext(): Partial<ServiceContext> | undefined {
  const { user, profile, family } = useAuth()

  return useMemo(() => {
    if (!user || !profile?.family_id) return undefined
    return {
      userId: user.id,
      familyId: profile.family_id,
      subscriptionTier: profile.subscription_tier ?? undefined,
      babyId: profile.active_baby_id ?? undefined,
    }
  }, [user?.id, profile?.family_id, profile?.subscription_tier, profile?.active_baby_id])
}
