/**
 * Factory for baby tracker (log) related React Query hooks.
 *
 * Both web and mobile apps call `createTrackerHooks(deps)` with their
 * platform-specific service context hook and tracker service instance,
 * then re-export the returned hooks.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../constants/query-keys'
import type { ServiceContext } from '../types/service-context'
import type { BabyLog, LogType } from '../types'

// ---------------------------------------------------------------------------
// Dependency types
// ---------------------------------------------------------------------------

export type CreateLogInput = {
  log_type: LogType
  log_data: Record<string, any>
  logged_at?: string
  notes?: string
}

export interface LogFilters {
  log_type?: LogType
  date_from?: string
  date_to?: string
  limit?: number
  offset?: number
}

/** Minimal surface the factory needs from each platform's tracker service. */
export interface TrackerServiceLike {
  getLogs(filters: LogFilters, ctx?: Partial<ServiceContext>): Promise<BabyLog[]>
  getLogById(id: string): Promise<BabyLog | null>
  createLog(log: CreateLogInput, ctx?: Partial<ServiceContext>): Promise<any>
  updateLog(id: string, updates: Partial<Pick<BabyLog, 'log_type' | 'log_data' | 'logged_at' | 'notes'>>): Promise<any>
  deleteLog(id: string, ctx?: Partial<ServiceContext>): Promise<any>
  getShiftBriefing(ctx?: Partial<ServiceContext>): Promise<any>
  getDailySummary?(date: string, ctx?: Partial<ServiceContext>): Promise<any>
  getWeeklySummary?(ctx?: Partial<ServiceContext>): Promise<any>
}

export interface CreateTrackerHooksDeps {
  useServiceContext: () => Partial<ServiceContext> | undefined
  trackerService: TrackerServiceLike
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createTrackerHooks(deps: CreateTrackerHooksDeps) {
  const { useServiceContext, trackerService } = deps

  function invalidateTrackerKeys(queryClient: ReturnType<typeof useQueryClient>) {
    queryClient.invalidateQueries({ queryKey: queryKeys.tracker.all })
  }

  // -----------------------------------------------------------------------
  // Queries
  // -----------------------------------------------------------------------

  function useTrackerLogs(filters: LogFilters = {}) {
    const ctx = useServiceContext()
    return useQuery({
      queryKey: queryKeys.tracker.logs(ctx?.familyId!, filters as Record<string, unknown>),
      queryFn: () => trackerService.getLogs(filters, ctx),
      enabled: !!ctx?.familyId,
    })
  }

  function useRecentLogs(limit = 20) {
    const ctx = useServiceContext()
    return useQuery({
      queryKey: queryKeys.tracker.logs(ctx?.familyId!, { limit }),
      queryFn: () => trackerService.getLogs({ limit }, ctx),
      enabled: !!ctx?.familyId,
    })
  }

  function useTrackerLog(id: string) {
    return useQuery({
      queryKey: queryKeys.tracker.detail(id),
      queryFn: () => trackerService.getLogById(id),
      enabled: !!id,
    })
  }

  function useShiftBriefing() {
    const ctx = useServiceContext()
    return useQuery({
      queryKey: queryKeys.tracker.shiftBriefing(ctx?.familyId!),
      queryFn: () => trackerService.getShiftBriefing(ctx),
      enabled: !!ctx?.familyId,
      refetchInterval: 60000,
    })
  }

  function useDailySummary(date: string) {
    const ctx = useServiceContext()
    return useQuery({
      queryKey: queryKeys.tracker.dailySummary(ctx?.familyId!, date),
      queryFn: () => trackerService.getDailySummary!(date, ctx),
      enabled: !!date && !!ctx?.familyId && !!trackerService.getDailySummary,
    })
  }

  function useWeeklySummary() {
    const ctx = useServiceContext()
    return useQuery({
      queryKey: queryKeys.tracker.weeklySummary(ctx?.familyId!),
      queryFn: () => trackerService.getWeeklySummary!(ctx),
      enabled: !!ctx?.familyId && !!trackerService.getWeeklySummary,
    })
  }

  function useTrackerSummary(days: number) {
    const ctx = useServiceContext()
    const dateFrom = new Date()
    dateFrom.setDate(dateFrom.getDate() - days)
    dateFrom.setHours(0, 0, 0, 0)
    const dateFromStr = dateFrom.toISOString().replace(/\.\d+Z$/, '')

    return useQuery({
      queryKey: queryKeys.tracker.summary(ctx?.familyId!, days),
      queryFn: () => trackerService.getLogs({ date_from: dateFromStr }, ctx),
      enabled: !!ctx?.familyId,
      staleTime: 1000 * 60 * 2,
    })
  }

  // -----------------------------------------------------------------------
  // Mutations
  // -----------------------------------------------------------------------

  function useCreateLog() {
    const queryClient = useQueryClient()
    const ctx = useServiceContext()
    return useMutation({
      mutationFn: (log: CreateLogInput) => trackerService.createLog(log, ctx),
      onSuccess: () => invalidateTrackerKeys(queryClient),
    })
  }

  function useUpdateLog() {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ id, updates }: {
        id: string
        updates: Partial<Pick<BabyLog, 'log_type' | 'log_data' | 'logged_at' | 'notes'>>
      }) => trackerService.updateLog(id, updates),
      onSuccess: () => invalidateTrackerKeys(queryClient),
    })
  }

  function useDeleteLog() {
    const queryClient = useQueryClient()
    const ctx = useServiceContext()
    return useMutation({
      mutationFn: (id: string) => trackerService.deleteLog(id, ctx),
      onSuccess: () => invalidateTrackerKeys(queryClient),
    })
  }

  return {
    useTrackerLogs,
    useRecentLogs,
    useTrackerLog,
    useShiftBriefing,
    useDailySummary,
    useWeeklySummary,
    useTrackerSummary,
    useCreateLog,
    useUpdateLog,
    useDeleteLog,
  }
}
