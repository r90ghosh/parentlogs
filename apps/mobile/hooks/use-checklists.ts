import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/components/providers/AuthProvider'
import { useServiceContext } from './use-service-context'
import { checklistService } from '@/lib/services'

export function useChecklists() {
  const { family } = useAuth()
  const ctx = useServiceContext()

  return useQuery({
    queryKey: ['checklists', family?.id],
    queryFn: () => checklistService.getChecklists(ctx),
    enabled: !!family?.id,
    staleTime: 1000 * 60 * 5,
  })
}

export function useChecklistById(checklistId: string) {
  const { family } = useAuth()
  const ctx = useServiceContext()

  return useQuery({
    queryKey: ['checklist', checklistId, family?.id],
    queryFn: () => checklistService.getChecklistById(checklistId, ctx),
    enabled: !!checklistId && !!family?.id,
  })
}

export function useResetChecklist() {
  const queryClient = useQueryClient()
  const { family } = useAuth()
  const ctx = useServiceContext()
  return useMutation({
    mutationFn: (checklistId: string) =>
      checklistService.resetChecklist(checklistId, ctx),
    onSuccess: (_, checklistId) => {
      queryClient.invalidateQueries({
        queryKey: ['checklist', checklistId, family?.id],
      })
      queryClient.invalidateQueries({ queryKey: ['checklists', family?.id] })
    },
  })
}

export function useToggleChecklistItem() {
  const queryClient = useQueryClient()
  const { family } = useAuth()
  const ctx = useServiceContext()

  return useMutation({
    mutationFn: ({
      checklistId,
      itemId,
      completed,
    }: {
      checklistId: string
      itemId: string
      completed: boolean
    }) => checklistService.toggleItem(checklistId, itemId, completed, ctx),

    // Optimistic update for instant UI feedback
    onMutate: async ({ checklistId, itemId, completed }) => {
      const fullKey = ['checklist', checklistId, family?.id]
      await queryClient.cancelQueries({ queryKey: fullKey })
      const previousChecklist = queryClient.getQueryData(fullKey)

      queryClient.setQueryData(fullKey, (old: any) => {
        if (!old) return old
        const updatedItems = old.items.map((item: any) =>
          item.item_id === itemId ? { ...item, completed } : item
        )
        const completedCount = updatedItems.filter((item: any) => item.completed).length
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

      return { previousChecklist }
    },

    // Rollback on error
    onError: (_err, variables, context) => {
      if (context?.previousChecklist) {
        queryClient.setQueryData(
          ['checklist', variables.checklistId, family?.id],
          context.previousChecklist
        )
      }
    },

    // Refetch to ensure consistency
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['checklists', family?.id] })
    },
  })
}
