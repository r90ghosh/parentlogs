'use client'

import { useQuery } from '@tanstack/react-query'
import { briefingService } from '@/services/briefing-service'

export function useCurrentBriefing() {
  return useQuery({
    queryKey: ['current-briefing'],
    queryFn: () => briefingService.getCurrentBriefing(),
    staleTime: 1000 * 60 * 10, // 10 minutes - briefing content is static
  })
}

export function useBriefingByWeek(stage: string, week: number) {
  return useQuery({
    queryKey: ['briefing', stage, week],
    queryFn: () => briefingService.getBriefingByWeek(stage, week),
    enabled: !!stage && week > 0,
    staleTime: 1000 * 60 * 10, // 10 minutes - briefing content is static
  })
}

export function useBriefings() {
  return useQuery({
    queryKey: ['briefings'],
    queryFn: () => briefingService.getAllBriefings(),
    staleTime: 1000 * 60 * 10, // 10 minutes - briefing content is static
  })
}
