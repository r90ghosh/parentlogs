'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { familyService } from '@/lib/services'
import type { ServiceContext } from '@tdc/services'
import { Family } from '@tdc/shared/types'
import { useOptionalUser } from '@/components/user-provider'

function useServiceContext(): Partial<ServiceContext> | undefined {
  const userData = useOptionalUser()
  if (!userData?.user) return undefined
  return {
    userId: userData.user.id,
    familyId: userData.profile?.family_id ?? undefined,
    subscriptionTier: userData.profile?.subscription_tier ?? undefined,
  } as Partial<ServiceContext>
}

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
