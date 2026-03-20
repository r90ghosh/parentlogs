'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { babyService, ServiceContext } from '@/services/baby-service'
import { useUser } from '@/components/user-provider'

function useServiceContext(): Partial<ServiceContext> | undefined {
  const { user, profile } = useUser()
  if (!user || !profile?.family_id) return undefined
  return { userId: user.id, familyId: profile.family_id }
}

export function useBabies() {
  const ctx = useServiceContext()

  return useQuery({
    queryKey: ['babies', ctx?.familyId],
    queryFn: () => babyService.getBabies(ctx),
    enabled: !!ctx?.familyId,
    staleTime: 1000 * 60 * 5,
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

export function useAddBaby() {
  const queryClient = useQueryClient()
  const ctx = useServiceContext()

  return useMutation({
    mutationFn: (baby: { baby_name?: string; due_date?: string; birth_date?: string; stage?: string }) =>
      babyService.addBaby(baby, ctx),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['babies'] })
      queryClient.invalidateQueries({ queryKey: ['family'] })
    },
  })
}

export function useUpdateBaby() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ babyId, updates }: { babyId: string; updates: Partial<{ baby_name: string; due_date: string; birth_date: string }> }) =>
      babyService.updateBaby(babyId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['babies'] })
      queryClient.invalidateQueries({ queryKey: ['baby'] })
      queryClient.invalidateQueries({ queryKey: ['family'] })
    },
  })
}

export function useSwitchBaby() {
  const queryClient = useQueryClient()
  const ctx = useServiceContext()

  return useMutation({
    mutationFn: (babyId: string) => babyService.setActiveBaby(babyId, ctx),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['tasks-timeline'] })
      queryClient.invalidateQueries({ queryKey: ['backlog-tasks'] })
      queryClient.invalidateQueries({ queryKey: ['backlog-count'] })
      queryClient.invalidateQueries({ queryKey: ['current-briefing'] })
      queryClient.invalidateQueries({ queryKey: ['checklists'] })
      queryClient.invalidateQueries({ queryKey: ['checklist'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['babies'] })
      queryClient.invalidateQueries({ queryKey: ['baby'] })
      queryClient.invalidateQueries({ queryKey: ['tracker-logs'] })
      queryClient.invalidateQueries({ queryKey: ['shift-briefing'] })
      queryClient.invalidateQueries({ queryKey: ['daily-summary'] })
      queryClient.invalidateQueries({ queryKey: ['weekly-summary'] })
    },
  })
}

export function useArchiveBaby() {
  const queryClient = useQueryClient()
  const ctx = useServiceContext()

  return useMutation({
    mutationFn: (babyId: string) => babyService.archiveBaby(babyId, ctx),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['babies'] })
      queryClient.invalidateQueries({ queryKey: ['family'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
