'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { checklistService, ChecklistWithItems, ServiceContext } from '@/services/checklist-service'
import { ChecklistItemTemplate } from '@/types'
import { useUser } from '@/components/user-provider'

type ChecklistItem = ChecklistItemTemplate & { completed?: boolean }

function useServiceContext(): Partial<ServiceContext> | undefined {
  const { user, profile } = useUser()
  if (!user || !profile?.family_id) return undefined
  return {
    userId: user.id,
    familyId: profile.family_id,
    subscriptionTier: profile.subscription_tier ?? undefined,
  }
}

export function useChecklists() {
  const ctx = useServiceContext()

  return useQuery({
    queryKey: ['checklists'],
    queryFn: () => checklistService.getChecklists(ctx),
    enabled: !!ctx,
  })
}

export function useChecklist(checklistId: string) {
  const ctx = useServiceContext()

  return useQuery({
    queryKey: ['checklist', checklistId],
    queryFn: () => checklistService.getChecklistById(checklistId, ctx),
    enabled: !!checklistId && !!ctx,
  })
}

export function useToggleChecklistItem() {
  const queryClient = useQueryClient()
  const ctx = useServiceContext()

  return useMutation({
    mutationFn: ({ checklistId, itemId, completed }: {
      checklistId: string
      itemId: string
      completed: boolean
    }) => checklistService.toggleItem(checklistId, itemId, completed, ctx),

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
  const ctx = useServiceContext()

  return useMutation({
    mutationFn: (checklistId: string) => checklistService.resetChecklist(checklistId, ctx),
    onSuccess: (_, checklistId) => {
      queryClient.invalidateQueries({ queryKey: ['checklist', checklistId] })
      queryClient.invalidateQueries({ queryKey: ['checklists'] })
    },
  })
}
