import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/components/providers/AuthProvider'
import { babyService } from '@/lib/services'

export function useBabies() {
  const { family } = useAuth()

  return useQuery({
    queryKey: ['babies', family?.id],
    queryFn: () => babyService.getBabies(),
    enabled: !!family?.id,
    staleTime: 1000 * 60 * 5,
  })
}

export function useSwitchBaby() {
  const queryClient = useQueryClient()
  const { refreshProfile } = useAuth()

  return useMutation({
    mutationFn: async (babyId: string) => {
      const result = await babyService.setActiveBaby(babyId)
      if (result.error) throw result.error
      return result
    },
    onSuccess: async () => {
      await refreshProfile()
      queryClient.invalidateQueries({ queryKey: ['babies'] })
      queryClient.invalidateQueries({ queryKey: ['baby'] })
      queryClient.invalidateQueries({ queryKey: ['tasks-due'] })
      queryClient.invalidateQueries({ queryKey: ['current-briefing'] })
      queryClient.invalidateQueries({ queryKey: ['mood-today'] })
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

  return useMutation({
    mutationFn: async (baby: { baby_name?: string; due_date?: string; birth_date?: string }) => {
      const result = await babyService.addBaby(baby)
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
