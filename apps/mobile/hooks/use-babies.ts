import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/components/providers/AuthProvider'
import { useServiceContext } from './use-service-context'
import { babyService } from '@/lib/services'
import { queryKeys } from '@tdc/shared/constants'

/**
 * Mobile baby hooks are NOT created via the shared factory because
 * mutations need to call `refreshProfile()` from useAuth(), which is
 * a React hook value unavailable at module scope. The shared query keys
 * are still used so invalidation stays in sync with web.
 */

export function useBabies() {
  const { family } = useAuth()
  const ctx = useServiceContext()

  return useQuery({
    queryKey: queryKeys.babies.list(family?.id ?? ''),
    queryFn: () => babyService.getBabies(ctx),
    enabled: !!family?.id,
    staleTime: 1000 * 60 * 5,
  })
}

export function useBaby(babyId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.babies.detail(babyId ?? ''),
    queryFn: () => babyService.getBaby(babyId!),
    enabled: !!babyId,
    staleTime: 1000 * 60 * 5,
  })
}

export function useSwitchBaby() {
  const queryClient = useQueryClient()
  const { refreshProfile } = useAuth()
  const ctx = useServiceContext()

  return useMutation({
    mutationFn: async (babyId: string) => {
      const { error } = await babyService.setActiveBaby(babyId, ctx)
      if (error) throw error
    },
    onSuccess: async () => {
      await refreshProfile()
      queryClient.invalidateQueries({ queryKey: queryKeys.babies.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.briefings.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.checklists.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.budget.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.tracker.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
    },
  })
}

export function useAddBaby() {
  const queryClient = useQueryClient()
  const { refreshProfile } = useAuth()
  const ctx = useServiceContext()

  return useMutation({
    mutationFn: async (baby: { baby_name?: string; due_date?: string; birth_date?: string }) => {
      const result = await babyService.addBaby(baby, ctx)
      if (result.error) throw result.error
      return result.baby
    },
    onSuccess: async () => {
      await refreshProfile()
      queryClient.invalidateQueries({ queryKey: queryKeys.babies.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
    },
  })
}

export function useUpdateBaby() {
  const queryClient = useQueryClient()
  const { refreshProfile } = useAuth()
  const ctx = useServiceContext()

  return useMutation({
    mutationFn: async ({ babyId, updates }: {
      babyId: string
      updates: Partial<{ baby_name: string; due_date: string; birth_date: string }>
    }) => {
      const { error } = await babyService.updateBaby(babyId, updates, ctx)
      if (error) throw error
    },
    onSuccess: async () => {
      await refreshProfile()
      queryClient.invalidateQueries({ queryKey: queryKeys.babies.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
    },
  })
}

export function useArchiveBaby() {
  const queryClient = useQueryClient()
  const { refreshProfile } = useAuth()
  const ctx = useServiceContext()

  return useMutation({
    mutationFn: async (babyId: string) => {
      const { error } = await babyService.archiveBaby(babyId, ctx)
      if (error) throw error
    },
    onSuccess: async () => {
      await refreshProfile()
      queryClient.invalidateQueries({ queryKey: queryKeys.babies.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all })
    },
  })
}
