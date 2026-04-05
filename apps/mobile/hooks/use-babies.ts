import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/components/providers/AuthProvider'
import { useServiceContext } from './use-service-context'
import { babyService } from '@/lib/services'

export function useBabies() {
  const { family } = useAuth()
  const ctx = useServiceContext()

  return useQuery({
    queryKey: ['babies', family?.id],
    queryFn: () => babyService.getBabies(ctx),
    enabled: !!family?.id,
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
      queryClient.invalidateQueries({ queryKey: ['babies'] })
      queryClient.invalidateQueries({ queryKey: ['baby'] })
      queryClient.invalidateQueries({ queryKey: ['tasks-due'] })
      queryClient.invalidateQueries({ queryKey: ['current-briefing'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['tracker-logs'] })
      queryClient.invalidateQueries({ queryKey: ['checklists'] })
      queryClient.invalidateQueries({ queryKey: ['budget'] })
      queryClient.invalidateQueries({ queryKey: ['shift-briefing'] })
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
      queryClient.invalidateQueries({ queryKey: ['babies'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useBaby(babyId: string | undefined) {
  return useQuery({
    queryKey: ['baby', babyId],
    queryFn: () => babyService.getBaby(babyId!),
    enabled: !!babyId,
    staleTime: 1000 * 60 * 5,
  })
}

export function useUpdateBaby() {
  const queryClient = useQueryClient()
  const { refreshProfile } = useAuth()
  const ctx = useServiceContext()

  return useMutation({
    mutationFn: async ({ babyId, updates }: { babyId: string; updates: Partial<{ baby_name: string; due_date: string; birth_date: string }> }) => {
      const { error } = await babyService.updateBaby(babyId, updates, ctx)
      if (error) throw error
    },
    onSuccess: async () => {
      await refreshProfile()
      queryClient.invalidateQueries({ queryKey: ['babies'] })
      queryClient.invalidateQueries({ queryKey: ['baby'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
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
      queryClient.invalidateQueries({ queryKey: ['babies'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
