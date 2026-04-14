import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/components/providers/AuthProvider'
import { useServiceContext } from './use-service-context'
import { familyService } from '@/lib/services'

export function usePartnerActivity() {
  const { family } = useAuth()
  return useQuery({
    queryKey: ['partner-activity', family?.id],
    queryFn: () => familyService.getPartnerActivity(family!.id),
    enabled: !!family?.id,
    staleTime: 1000 * 60 * 2,
  })
}

export function useFamilyMembers() {
  const { family } = useAuth()
  const ctx = useServiceContext()
  return useQuery({
    queryKey: ['family-members', family?.id],
    queryFn: () => familyService.getFamilyMembers(ctx),
    enabled: !!family?.id,
    staleTime: 1000 * 60 * 5,
  })
}

export function useUpdateFamily() {
  const queryClient = useQueryClient()
  const { family } = useAuth()
  const ctx = useServiceContext()
  return useMutation({
    mutationFn: (updates: { baby_name?: string; due_date?: string; birth_date?: string }) =>
      familyService.updateFamily(updates, ctx),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family-members', family?.id] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useRegenerateInviteCode() {
  const queryClient = useQueryClient()
  const { family } = useAuth()
  const ctx = useServiceContext()
  return useMutation({
    mutationFn: () => familyService.regenerateInviteCode(ctx),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family-members', family?.id] })
    },
  })
}
