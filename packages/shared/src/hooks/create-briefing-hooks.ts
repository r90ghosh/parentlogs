/**
 * Factory for briefing-related React Query hooks.
 *
 * Briefings are largely read-only (no mutations), so this factory is
 * simpler than tasks/budget. The `useCurrentBriefing` hook needs a richer
 * context (stage + currentWeek), which is provided by a platform-specific
 * `useBriefingContext` callback.
 */
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../constants/query-keys'
import type { BriefingContext } from '../types/service-context'

// ---------------------------------------------------------------------------
// Dependency types
// ---------------------------------------------------------------------------

/** Minimal surface the factory needs from each platform's briefing service. */
export interface BriefingServiceLike {
  getCurrentBriefing(ctx?: Partial<BriefingContext>): Promise<any>
  getBriefingByWeek(stage: string, week: number): Promise<any>
  getAllBriefings(): Promise<any>
}

export interface CreateBriefingHooksDeps {
  /**
   * Returns the extended briefing context (stage + currentWeek).
   * This is platform-specific because web reads from activeBaby/family
   * differently than mobile.
   */
  useBriefingContext: () => { ctx: Partial<BriefingContext> | undefined; babyId?: string | null }
  briefingService: BriefingServiceLike
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createBriefingHooks(deps: CreateBriefingHooksDeps) {
  const { useBriefingContext, briefingService } = deps

  function useCurrentBriefing() {
    const { ctx, babyId } = useBriefingContext()
    return useQuery({
      queryKey: queryKeys.briefings.current(babyId),
      queryFn: () => briefingService.getCurrentBriefing(ctx),
      enabled: !!ctx,
      staleTime: 1000 * 60 * 10,
    })
  }

  function useBriefingByWeek(stage: string, week: number) {
    return useQuery({
      queryKey: queryKeys.briefings.byWeek(stage, week),
      queryFn: () => briefingService.getBriefingByWeek(stage, week),
      enabled: !!stage && week > 0,
      staleTime: 1000 * 60 * 10,
    })
  }

  function useBriefings() {
    return useQuery({
      queryKey: queryKeys.briefings.list(),
      queryFn: () => briefingService.getAllBriefings(),
      staleTime: 1000 * 60 * 10,
    })
  }

  return {
    useCurrentBriefing,
    useBriefingByWeek,
    useBriefings,
  }
}
