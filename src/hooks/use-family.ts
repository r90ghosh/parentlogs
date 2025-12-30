'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { familyService } from '@/services/family-service'
import { Family } from '@/types'

export function useFamily() {
  return useQuery({
    queryKey: ['family'],
    queryFn: () => familyService.getFamily(),
  })
}

export function useFamilyMembers() {
  return useQuery({
    queryKey: ['family-members'],
    queryFn: () => familyService.getFamilyMembers(),
  })
}

export function useCreateFamily() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { due_date?: string; birth_date?: string; baby_name?: string }) =>
      familyService.createFamily(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family'] })
      queryClient.invalidateQueries({ queryKey: ['family-members'] })
    },
  })
}

export function useJoinFamily() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (inviteCode: string) => familyService.joinFamily(inviteCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family'] })
      queryClient.invalidateQueries({ queryKey: ['family-members'] })
    },
  })
}

export function useUpdateFamily() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (updates: Partial<Family>) => familyService.updateFamily(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family'] })
    },
  })
}
