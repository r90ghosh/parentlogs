'use client'

import { useState, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useUser } from '@/components/user-provider'
import { profileService } from '@/lib/services'

export function useWelcomeAnimation() {
  const { profile, user } = useUser()
  const queryClient = useQueryClient()

  const shouldShow = profile.onboarding_completed === true && profile.has_seen_welcome === false

  const [isVisible, setIsVisible] = useState(shouldShow)

  const markSeen = useMutation({
    mutationFn: () => profileService.markWelcomeSeen(user.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })

  const dismiss = useCallback(() => {
    setIsVisible(false)
    markSeen.mutate()
  }, [markSeen])

  return { isVisible, dismiss }
}
