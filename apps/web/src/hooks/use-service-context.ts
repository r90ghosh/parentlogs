'use client'

import type { ServiceContext } from '@tdc/services'
import { useOptionalUser } from '@/components/user-provider'

/**
 * Constructs a ServiceContext from the user provider to pass to shared service calls.
 * Returns undefined when the user is not authenticated or UserProvider is absent.
 */
export function useServiceContext(): Partial<ServiceContext> | undefined {
  const userData = useOptionalUser()
  if (!userData?.user) return undefined
  return {
    userId: userData.user.id,
    familyId: userData.profile?.family_id ?? undefined,
    subscriptionTier: userData.profile?.subscription_tier ?? undefined,
    babyId: userData.profile?.active_baby_id ?? undefined,
  }
}
