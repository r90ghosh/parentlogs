'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { checklistService, ChecklistWithItems } from '@/services/checklist-service'
import { ChecklistItemTemplate } from '@/types'

type ChecklistItem = ChecklistItemTemplate & { completed?: boolean }

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

    // Optimistic update - instant UI feedback
    onMutate: async ({ checklistId, itemId, completed }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['checklist', checklistId] })

      // Snapshot the previous value
      const previousChecklist = queryClient.getQueryData(['checklist', checklistId])

      // Optimistically update the cache
      queryClient.setQueryData<ChecklistWithItems | null>(['checklist', checklistId], (old) => {
        if (!old) return old

        const updatedItems = old.items.map((item: ChecklistItem) =>
          item.item_id === itemId ? { ...item, completed } : item
        )

        const completedCount = updatedItems.filter((item: ChecklistItem) => item.completed).length

        return {
          ...old,
          items: updatedItems,
          progress: {
            completed: completedCount,
            total: updatedItems.length,
            percentage: updatedItems.length > 0
              ? Math.round((completedCount / updatedItems.length) * 100)
              : 0,
          },
        }
      })

      // Return context with the previous value
      return { previousChecklist }
    },

    // Rollback on error
    onError: (err, variables, context) => {
      if (context?.previousChecklist) {
        queryClient.setQueryData(
          ['checklist', variables.checklistId],
          context.previousChecklist
        )
      }
    },

    // Refetch after success or error to ensure consistency
    onSettled: (_, __, variables) => {
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
