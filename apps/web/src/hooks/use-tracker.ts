'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { trackerService, LogFilters, LogType } from '@/services/tracker-service'
import { BabyLog } from '@/types'
import { useUser } from '@/components/user-provider'

export type CreateLogInput = {
  log_type: LogType
  log_data: Record<string, any>
  logged_at?: string
  notes?: string
}

function useServiceContext() {
  const { user, profile } = useUser()
  if (!user || !profile?.family_id) return undefined
  return {
    userId: user.id,
    familyId: profile.family_id,
    subscriptionTier: profile.subscription_tier ?? undefined,
  }
}

export function useTrackerLogs(filters: LogFilters = {}) {
  const { profile } = useUser()
  const ctx = useServiceContext()

  return useQuery({
    queryKey: ['tracker-logs', filters, profile?.family_id],
    queryFn: () => trackerService.getLogs(filters, ctx),
    enabled: !!profile?.family_id,
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
  const { profile } = useUser()
  const ctx = useServiceContext()

  return useQuery({
    queryKey: ['shift-briefing', profile?.family_id],
    queryFn: () => trackerService.getShiftBriefing(ctx),
    enabled: !!profile?.family_id,
    refetchInterval: 60000, // Refetch every minute
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

export function useUpdateLog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Pick<BabyLog, 'log_type' | 'log_data' | 'logged_at' | 'notes'>> }) =>
      trackerService.updateLog(id, updates),
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

export function useDailySummary(date: string) {
  const { profile } = useUser()
  const ctx = useServiceContext()

  return useQuery({
    queryKey: ['daily-summary', date, profile?.family_id],
    queryFn: () => trackerService.getDailySummary(date, ctx),
    enabled: !!date && !!profile?.family_id,
  })
}

export function useWeeklySummary() {
  const { profile } = useUser()
  const ctx = useServiceContext()

  return useQuery({
    queryKey: ['weekly-summary', profile?.family_id],
    queryFn: () => trackerService.getWeeklySummary(ctx),
    enabled: !!profile?.family_id,
  })
}
