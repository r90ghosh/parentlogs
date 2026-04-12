'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { familyService } from '@/lib/services'
import { Family } from '@tdc/shared/types'
import { useServiceContext } from './use-service-context'

export function useFamily() {
  const ctx = useServiceContext()

  return useQuery({
    queryKey: ['family', ctx?.familyId],
    queryFn: () => familyService.getFamily(ctx),
    enabled: !!ctx?.familyId,
    staleTime: 1000 * 60 * 5, // 5 minutes - family data rarely changes
  })
}

export function useFamilyMembers() {
  const ctx = useServiceContext()

  return useQuery({
    queryKey: ['family-members'],
    queryFn: () => familyService.getFamilyMembers(ctx),
    enabled: !!ctx?.familyId,
    staleTime: 1000 * 60 * 5, // 5 minutes - family members rarely change
  })
}

export function useCreateFamily() {
  const queryClient = useQueryClient()
  const ctx = useServiceContext()

  return useMutation({
    mutationFn: (data: { due_date?: string; birth_date?: string; baby_name?: string }) =>
      familyService.createFamily(data, ctx),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family'] })
      queryClient.invalidateQueries({ queryKey: ['family-members'] })
    },
  })
}

export function useJoinFamily() {
  const queryClient = useQueryClient()
  const ctx = useServiceContext()

  return useMutation({
    mutationFn: (inviteCode: string) => familyService.joinFamily(inviteCode, ctx),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family'] })
      queryClient.invalidateQueries({ queryKey: ['family-members'] })
    },
  })
}

export function useUpdateFamily() {
  const queryClient = useQueryClient()
  const ctx = useServiceContext()

  return useMutation({
    mutationFn: (updates: Partial<Pick<Family, 'due_date' | 'birth_date' | 'baby_name' | 'stage'>>) =>
      familyService.updateFamily(updates, ctx),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family'] })
    },
  })
}
