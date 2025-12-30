'use client'

import { useQuery } from '@tanstack/react-query'
import { briefingService } from '@/services/briefing-service'

export function useCurrentBriefing() {
  return useQuery({
    queryKey: ['current-briefing'],
    queryFn: () => briefingService.getCurrentBriefing(),
  })
}

export function useBriefingByWeek(stage: string, week: number) {
  return useQuery({
    queryKey: ['briefing', stage, week],
    queryFn: () => briefingService.getBriefingByWeek(stage, week),
  })
}

export function useBriefings() {
  return useQuery({
    queryKey: ['briefings'],
    queryFn: () => briefingService.getAllBriefings(),
  })
}
