import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { profileService } from '@/lib/services'

export function useWelcomeAnimation() {
  const { profile, user, refreshProfile } = useAuth()

  const shouldShow =
    profile?.onboarding_completed === true &&
    profile?.has_seen_welcome === false

  const [isVisible, setIsVisible] = useState(shouldShow)

  // Sync visibility when profile changes (e.g. on initial load)
  useEffect(() => {
    setIsVisible(shouldShow)
  }, [shouldShow])

  const dismiss = useCallback(async () => {
    setIsVisible(false)

    if (!user?.id) return

    await profileService.markWelcomeSeen(user.id)

    await refreshProfile()
  }, [user?.id, refreshProfile])

  return { isVisible, dismiss }
}
