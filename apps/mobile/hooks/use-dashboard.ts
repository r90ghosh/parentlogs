import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/components/providers/AuthProvider'
import { taskService, briefingService, dadJourneyService } from '@/lib/services'
import type { MoodLevel } from '@tdc/shared/types/dad-journey'

export function useDashboardData() {
  const { user, profile, family } = useAuth()

  const tasksQuery = useQuery({
    queryKey: ['tasks-due', family?.id],
    queryFn: () => taskService.getTasks({ status: 'pending', limit: 5 }),
    enabled: !!family?.id,
  })

  const briefingQuery = useQuery({
    queryKey: ['current-briefing', family?.id],
    queryFn: () => briefingService.getCurrentBriefing(),
    enabled: !!family?.id,
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
