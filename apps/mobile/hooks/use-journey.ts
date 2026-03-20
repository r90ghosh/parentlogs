import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/components/providers/AuthProvider'
import { dadJourneyService } from '@/lib/services'
import type { ContentPhase } from '@tdc/shared/types/dad-journey'
import { familyStageToContentPhase } from '@tdc/shared/utils/stage-mapping'
import type { FamilyStage } from '@tdc/shared/types'

export function useCurrentPhase(): ContentPhase {
  const { family } = useAuth()

  if (!family?.stage) return 'trimester-1'

  const currentWeek = (family as any)?.current_week as number | undefined

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
