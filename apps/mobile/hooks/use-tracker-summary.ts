import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/components/providers/AuthProvider'
import { useServiceContext } from './use-service-context'
import { trackerService } from '@/lib/services'
import { subDays, startOfDay, format } from 'date-fns'

export function useTrackerSummary(days: number) {
  const { family } = useAuth()
  const ctx = useServiceContext()
  const dateFrom = format(startOfDay(subDays(new Date(), days)), "yyyy-MM-dd'T'HH:mm:ss")

  return useQuery({
    queryKey: ['tracker-summary', family?.id, days],
    queryFn: () => trackerService.getLogs({ date_from: dateFrom }, ctx),
    enabled: !!family?.id,
    staleTime: 1000 * 60 * 2,
  })
}
