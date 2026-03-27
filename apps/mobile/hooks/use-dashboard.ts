import { useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/components/providers/AuthProvider'
import { useServiceContext } from './use-service-context'
import { taskService, briefingService, dadJourneyService } from '@/lib/services'
import type { MoodLevel } from '@tdc/shared/types/dad-journey'

export function useDashboardData() {
  const { user, profile, family } = useAuth()
  const ctx = useServiceContext()

  // BriefingContext needs stage + currentWeek in addition to ServiceContext fields
  const briefingCtx = useMemo(() => {
    if (!user || !profile?.family_id || !family?.stage || family?.current_week == null) return undefined
    return {
      userId: user.id,
      familyId: profile.family_id,
      subscriptionTier: profile.subscription_tier ?? undefined,
      babyId: profile.active_baby_id ?? undefined,
      stage: family.stage,
      currentWeek: family.current_week,
    }
  }, [user?.id, profile?.family_id, profile?.subscription_tier, profile?.active_baby_id, family?.stage, family?.current_week])

  const tasksQuery = useQuery({
    queryKey: ['tasks-due', family?.id],
    queryFn: () => taskService.getTasks({ status: 'pending', limit: 5 }, ctx),
    enabled: !!family?.id,
  })

  const briefingQuery = useQuery({
    queryKey: ['current-briefing', family?.id],
    queryFn: () => briefingService.getCurrentBriefing(briefingCtx),
    enabled: !!briefingCtx,
    staleTime: 1000 * 60 * 10,
  })

  const moodQuery = useQuery({
    queryKey: ['mood-today', user?.id],
    queryFn: () => dadJourneyService.getLastCheckin(user!.id),
    enabled: !!user?.id,
    staleTime: 1000 * 30,
  })

  return { tasksQuery, briefingQuery, moodQuery, user, profile, family }
}

export function useSubmitMood() {
  const queryClient = useQueryClient()
  const { user, family } = useAuth()

  return useMutation({
    mutationFn: (mood: MoodLevel) => {
      if (!user?.id || !family?.id) throw new Error('Not authenticated')
      return dadJourneyService.submitMoodCheckin({
        userId: user.id,
        familyId: family.id,
        mood,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mood-today', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
