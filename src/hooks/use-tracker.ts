'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { trackerService, LogFilters, LogType } from '@/services/tracker-service'
import { BabyLog } from '@/types'

export type CreateLogInput = {
  log_type: LogType
  log_data: Record<string, any>
  logged_at?: string
  notes?: string
}

export function useTrackerLogs(filters: LogFilters = {}) {
  return useQuery({
    queryKey: ['tracker-logs', filters],
    queryFn: () => trackerService.getLogs(filters),
  })
}

export function useTrackerLog(id: string) {
  return useQuery({
    queryKey: ['tracker-log', id],
    queryFn: () => trackerService.getLogById(id),
    enabled: !!id,
  })
}

export function useShiftBriefing() {
  return useQuery({
    queryKey: ['shift-briefing'],
    queryFn: () => trackerService.getShiftBriefing(),
    refetchInterval: 60000, // Refetch every minute
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

export function useUpdateLog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<BabyLog> }) =>
      trackerService.updateLog(id, updates),
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

export function useDailySummary(date: string) {
  return useQuery({
    queryKey: ['daily-summary', date],
    queryFn: () => trackerService.getDailySummary(date),
    enabled: !!date,
  })
}

export function useWeeklySummary() {
  return useQuery({
    queryKey: ['weekly-summary'],
    queryFn: () => trackerService.getWeeklySummary(),
  })
}
