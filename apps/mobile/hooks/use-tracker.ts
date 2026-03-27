import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/components/providers/AuthProvider'
import { useServiceContext } from './use-service-context'
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
  const ctx = useServiceContext()
  return useQuery({
    queryKey: ['tracker-logs', family?.id, { limit }],
    queryFn: () => trackerService.getLogs({ limit }, ctx),
    enabled: !!family?.id,
  })
}

export function useTrackerLogs(filters: { log_type?: LogType; limit?: number } = {}) {
  const { family } = useAuth()
  const ctx = useServiceContext()
  return useQuery({
    queryKey: ['tracker-logs', family?.id, filters],
    queryFn: () => trackerService.getLogs(filters, ctx),
    enabled: !!family?.id,
  })
}

export function useShiftBriefing() {
  const { family } = useAuth()
  const ctx = useServiceContext()
  return useQuery({
    queryKey: ['shift-briefing', family?.id],
    queryFn: () => trackerService.getShiftBriefing(ctx),
    enabled: !!family?.id,
    refetchInterval: 60000,
  })
}

export function useCreateLog() {
  const queryClient = useQueryClient()
  const ctx = useServiceContext()
  return useMutation({
    mutationFn: (log: CreateLogInput) => trackerService.createLog(log, ctx),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracker-logs'] })
      queryClient.invalidateQueries({ queryKey: ['shift-briefing'] })
    },
  })
}

export function useDeleteLog() {
  const queryClient = useQueryClient()
  const ctx = useServiceContext()
  return useMutation({
    mutationFn: (id: string) => trackerService.deleteLog(id, ctx),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracker-logs'] })
      queryClient.invalidateQueries({ queryKey: ['shift-briefing'] })
    },
  })
}

export function useUpdateLog() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string
      updates: Partial<Pick<import('@tdc/shared/types').BabyLog, 'log_type' | 'log_data' | 'logged_at' | 'notes'>>
    }) => trackerService.updateLog(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracker-logs'] })
      queryClient.invalidateQueries({ queryKey: ['shift-briefing'] })
    },
  })
}
