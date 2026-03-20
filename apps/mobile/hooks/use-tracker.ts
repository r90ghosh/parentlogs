import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/components/providers/AuthProvider'
import { trackerService } from '@/lib/services'
import type { LogType } from '@tdc/shared/types'

export type CreateLogInput = {
  log_type: LogType
  log_data: Record<string, any>
  logged_at?: string
  notes?: string
}

export function useRecentLogs(limit = 20) {
  const { family } = useAuth()
  return useQuery({
    queryKey: ['tracker-logs', family?.id, { limit }],
    queryFn: () => trackerService.getLogs({ limit }),
    enabled: !!family?.id,
  })
}

export function useTrackerLogs(filters: { log_type?: LogType; limit?: number } = {}) {
  const { family } = useAuth()
  return useQuery({
    queryKey: ['tracker-logs', family?.id, filters],
    queryFn: () => trackerService.getLogs(filters),
    enabled: !!family?.id,
  })
}

export function useShiftBriefing() {
  const { family } = useAuth()
  return useQuery({
    queryKey: ['shift-briefing', family?.id],
    queryFn: () => trackerService.getShiftBriefing(),
    enabled: !!family?.id,
    refetchInterval: 60000,
  })
}

export function useCreateLog() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (log: CreateLogInput) => trackerService.createLog(log),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracker-logs'] })
      queryClient.invalidateQueries({ queryKey: ['shift-briefing'] })
    },
  })
}

export function useDeleteLog() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => trackerService.deleteLog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracker-logs'] })
      queryClient.invalidateQueries({ queryKey: ['shift-briefing'] })
    },
  })
}
