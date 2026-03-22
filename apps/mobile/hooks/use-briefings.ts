import { useQuery } from '@tanstack/react-query'
import { briefingService } from '@/lib/services'
import { useAuth } from '@/components/providers/AuthProvider'

export function useCurrentBriefing() {
  const { family } = useAuth()
  const stage = family?.stage
  const currentWeek = family?.current_week ?? undefined

  return useQuery({
    queryKey: ['current-briefing', family?.id],
    queryFn: () => briefingService.getCurrentBriefing(),
    enabled: !!family?.id && !!stage && currentWeek != null,
    staleTime: 1000 * 60 * 10,
  })
}

export function useBriefingByWeek(stage: string, week: number) {
  return useQuery({
    queryKey: ['briefing', stage, week],
    queryFn: () => briefingService.getBriefingByWeek(stage, week),
    enabled: !!stage && week > 0,
    staleTime: 1000 * 60 * 10,
  })
}

export function useBriefingsList() {
  return useQuery({
    queryKey: ['briefings-list'],
    queryFn: () => briefingService.getAllBriefings(),
    staleTime: 1000 * 60 * 10,
  })
}
