import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/components/providers/AuthProvider'
import { familyService } from '@/lib/services'

export function useFamilyMembers() {
  const { family } = useAuth()
  return useQuery({
    queryKey: ['family-members', family?.id],
    queryFn: () => familyService.getFamilyMembers(),
    enabled: !!family?.id,
  })
}

export function useUpdateFamily() {
  const queryClient = useQueryClient()
  const { family } = useAuth()
  return useMutation({
    mutationFn: (updates: { baby_name?: string; due_date?: string; birth_date?: string }) =>
      familyService.updateFamily(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family-members', family?.id] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useRegenerateInviteCode() {
  const queryClient = useQueryClient()
  const { family } = useAuth()
  return useMutation({
    mutationFn: () => familyService.regenerateInviteCode(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family-members', family?.id] })
    },
  })
}
