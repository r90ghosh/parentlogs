import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/components/providers/AuthProvider'
import { dadJourneyService } from '@/lib/services'
import type { ContentPhase, DadProfile, MoodLevel } from '@tdc/shared/types/dad-journey'
import { familyStageToContentPhase } from '@tdc/shared/utils/stage-mapping'
import type { FamilyStage } from '@tdc/shared/types'

export function useCurrentPhase(): ContentPhase {
  const { family } = useAuth()

  if (!family?.stage) return 'trimester-1'

  const currentWeek = family?.current_week ?? undefined

  return familyStageToContentPhase(
    family.stage as FamilyStage,
    currentWeek ?? 1
  )
}

export function useJourneyContent(phase: ContentPhase) {
  return useQuery({
    queryKey: ['dad-challenge-content', phase],
    queryFn: () => dadJourneyService.getContentForPhase(phase),
    enabled: !!phase,
    staleTime: 1000 * 60 * 10,
  })
}

export function useDadProfile() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['dad-profile', user?.id],
    queryFn: () => dadJourneyService.getDadProfile(user!.id),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  })
}

export function useMoodHistory(limit = 7) {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['mood-history', user?.id, limit],
    queryFn: () => dadJourneyService.getRecentCheckins(user!.id, limit),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2,
  })
}

export function useSubmitMood() {
  const queryClient = useQueryClient()
  const { user, family } = useAuth()

  return useMutation({
    mutationFn: (params: { mood: MoodLevel; situationFlags?: string[]; note?: string; phase?: ContentPhase }) =>
      dadJourneyService.submitMoodCheckin({
        userId: user!.id,
        familyId: family!.id,
        ...params,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mood-history', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useUpsertDadProfile() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (profile: Partial<DadProfile>) =>
      dadJourneyService.upsertDadProfile(user!.id, profile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dad-profile', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
