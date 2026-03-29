import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { supabase } from '@/lib/supabase'

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

    await supabase
      .from('profiles')
      .update({ has_seen_welcome: true })
      .eq('id', user.id)

    await refreshProfile()
  }, [user?.id, refreshProfile])

  return { isVisible, dismiss }
}
