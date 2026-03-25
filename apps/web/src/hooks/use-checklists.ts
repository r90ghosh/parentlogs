'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { checklistService } from '@/lib/services'
import type { ChecklistWithItems, ServiceContext } from '@tdc/services'
import { ChecklistItemTemplate } from '@tdc/shared/types'
import { useUser } from '@/components/user-provider'

type ChecklistItem = ChecklistItemTemplate & { completed?: boolean }

function useServiceContext(): Partial<ServiceContext> | undefined {
  const { user, profile } = useUser()
  if (!user || !profile?.family_id) return undefined
  return {
    userId: user.id,
    familyId: profile.family_id,
    subscriptionTier: profile.subscription_tier ?? undefined,
    babyId: profile.active_baby_id ?? undefined,
  }
}

export function useChecklists() {
  const { profile } = useUser()
  const ctx = useServiceContext()

  return useQuery({
    queryKey: ['checklists', profile?.active_baby_id],
    queryFn: () => checklistService.getChecklists(ctx),
    enabled: !!ctx,
  })
}

export function useChecklist(checklistId: string) {
  const { profile } = useUser()
  const ctx = useServiceContext()

  return useQuery({
    queryKey: ['checklist', checklistId, profile?.active_baby_id],
    queryFn: () => checklistService.getChecklistById(checklistId, ctx),
    enabled: !!checklistId && !!ctx,
  })
}

export function useToggleChecklistItem() {
  const queryClient = useQueryClient()
  const { profile } = useUser()
  const ctx = useServiceContext()

  return useMutation({
    mutationFn: ({ checklistId, itemId, completed }: {
      checklistId: string
      itemId: string
      completed: boolean
    }) => checklistService.toggleItem(checklistId, itemId, completed, ctx),

    // Optimistic update - instant UI feedback
    onMutate: async ({ checklistId, itemId, completed }) => {
      const fullKey = ['checklist', checklistId, profile?.active_baby_id]

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: fullKey })

      // Snapshot the previous value
      const previousChecklist = queryClient.getQueryData(fullKey)

      // Optimistically update the cache
      queryClient.setQueryData<ChecklistWithItems | null>(fullKey, (old) => {
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
          ['checklist', variables.checklistId, profile?.active_baby_id],
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
