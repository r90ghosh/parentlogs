'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { checklistService } from '@/services/checklist-service'

export function useChecklists() {
  return useQuery({
    queryKey: ['checklists'],
    queryFn: () => checklistService.getChecklists(),
  })
}

export function useChecklist(checklistId: string) {
  return useQuery({
    queryKey: ['checklist', checklistId],
    queryFn: () => checklistService.getChecklistById(checklistId),
    enabled: !!checklistId,
  })
}

export function useToggleChecklistItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ checklistId, itemId, completed }: {
      checklistId: string
      itemId: string
      completed: boolean
    }) => checklistService.toggleItem(checklistId, itemId, completed),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['checklist', variables.checklistId] })
      queryClient.invalidateQueries({ queryKey: ['checklists'] })
    },
  })
}

export function useResetChecklist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (checklistId: string) => checklistService.resetChecklist(checklistId),
    onSuccess: (_, checklistId) => {
      queryClient.invalidateQueries({ queryKey: ['checklist', checklistId] })
      queryClient.invalidateQueries({ queryKey: ['checklists'] })
    },
  })
}
