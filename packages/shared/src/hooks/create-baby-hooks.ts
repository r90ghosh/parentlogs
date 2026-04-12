/**
 * Factory for baby-related React Query hooks.
 *
 * Both web and mobile apps call `createBabyHooks(deps)` with their
 * platform-specific service context hook and baby service instance,
 * then re-export the returned hooks.
 *
 * NOTE: Mobile's `useSwitchBaby`, `useAddBaby`, `useUpdateBaby`, and
 * `useArchiveBaby` call `refreshProfile()` after mutation. The factory
 * supports an optional `onBabyMutationSuccess` callback for this.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../constants/query-keys'
import type { ServiceContext } from '../types/service-context'
import type { Baby } from '../types'

// ---------------------------------------------------------------------------
// Dependency types
// ---------------------------------------------------------------------------

/** Minimal surface the factory needs from each platform's baby service. */
export interface BabyServiceLike {
  getBabies(ctx?: Partial<ServiceContext>): Promise<any>
  getBaby(babyId: string): Promise<any>
  addBaby(baby: { baby_name?: string; due_date?: string; birth_date?: string; stage?: string }, ctx?: Partial<ServiceContext>): Promise<any>
  updateBaby(babyId: string, updates: Partial<{ baby_name: string; due_date: string; birth_date: string }>, ctx?: Partial<ServiceContext>): Promise<any>
  setActiveBaby(babyId: string, ctx?: Partial<ServiceContext>): Promise<any>
  archiveBaby(babyId: string, ctx?: Partial<ServiceContext>): Promise<any>
}

export interface CreateBabyHooksDeps {
  useServiceContext: () => Partial<ServiceContext> | undefined
  babyService: BabyServiceLike
  /**
   * Optional callback fired after any baby mutation succeeds.
   * Mobile uses this to call `refreshProfile()`.
   */
  onBabyMutationSuccess?: () => void | Promise<void>
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createBabyHooks(deps: CreateBabyHooksDeps) {
  const { useServiceContext, babyService, onBabyMutationSuccess } = deps

  function invalidateAll(queryClient: ReturnType<typeof useQueryClient>) {
    queryClient.invalidateQueries({ queryKey: queryKeys.babies.all })
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
  }

  function useBabies() {
    const ctx = useServiceContext()
    return useQuery({
      queryKey: queryKeys.babies.list(ctx?.familyId!),
      queryFn: () => babyService.getBabies(ctx),
      enabled: !!ctx?.familyId,
      staleTime: 1000 * 60 * 5,
    })
  }

  function useBaby(babyId: string | undefined) {
    return useQuery({
      queryKey: queryKeys.babies.detail(babyId!),
      queryFn: () => babyService.getBaby(babyId!),
      enabled: !!babyId,
      staleTime: 1000 * 60 * 5,
    })
  }

  function useAddBaby() {
    const queryClient = useQueryClient()
    const ctx = useServiceContext()
    return useMutation({
      mutationFn: (baby: { baby_name?: string; due_date?: string; birth_date?: string; stage?: string }) =>
        babyService.addBaby(baby, ctx),
      onSuccess: async () => {
        if (onBabyMutationSuccess) await onBabyMutationSuccess()
        invalidateAll(queryClient)
        queryClient.invalidateQueries({ queryKey: queryKeys.family.all })
      },
    })
  }

  function useUpdateBaby() {
    const queryClient = useQueryClient()
    const ctx = useServiceContext()
    return useMutation({
      mutationFn: ({ babyId, updates }: {
        babyId: string
        updates: Partial<{ baby_name: string; due_date: string; birth_date: string }>
      }) => babyService.updateBaby(babyId, updates, ctx),
      onSuccess: async () => {
        if (onBabyMutationSuccess) await onBabyMutationSuccess()
        invalidateAll(queryClient)
        queryClient.invalidateQueries({ queryKey: queryKeys.family.all })
      },
    })
  }

  function useSwitchBaby() {
    const queryClient = useQueryClient()
    const ctx = useServiceContext()
    return useMutation({
      mutationFn: (babyId: string) => babyService.setActiveBaby(babyId, ctx),
      onSuccess: async () => {
        if (onBabyMutationSuccess) await onBabyMutationSuccess()
        // Switching baby invalidates nearly everything
        queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all })
        queryClient.invalidateQueries({ queryKey: queryKeys.briefings.all })
        queryClient.invalidateQueries({ queryKey: queryKeys.checklists.all })
        queryClient.invalidateQueries({ queryKey: queryKeys.budget.all })
        queryClient.invalidateQueries({ queryKey: queryKeys.tracker.all })
        queryClient.invalidateQueries({ queryKey: queryKeys.babies.all })
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
      },
    })
  }

  function useArchiveBaby() {
    const queryClient = useQueryClient()
    const ctx = useServiceContext()
    return useMutation({
      mutationFn: (babyId: string) => babyService.archiveBaby(babyId, ctx),
      onSuccess: async () => {
        if (onBabyMutationSuccess) await onBabyMutationSuccess()
        invalidateAll(queryClient)
        queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all })
        queryClient.invalidateQueries({ queryKey: queryKeys.family.all })
      },
    })
  }

  return {
    useBabies,
    useBaby,
    useAddBaby,
    useUpdateBaby,
    useSwitchBaby,
    useArchiveBaby,
  }
}
