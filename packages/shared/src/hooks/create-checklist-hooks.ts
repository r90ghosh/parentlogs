/**
 * Factory for checklist-related React Query hooks.
 *
 * Both web and mobile apps call `createChecklistHooks(deps)` with their
 * platform-specific service context hook and checklist service instance,
 * then re-export the returned hooks.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../constants/query-keys'
import type { ServiceContext } from '../types/service-context'

// ---------------------------------------------------------------------------
// Dependency types
// ---------------------------------------------------------------------------

/** Minimal surface the factory needs from each platform's checklist service. */
export interface ChecklistServiceLike {
  getChecklists(ctx?: Partial<ServiceContext>): Promise<any[]>
  getChecklistById(checklistId: string, ctx?: Partial<ServiceContext>): Promise<any>
  toggleItem(checklistId: string, itemId: string, completed: boolean, ctx?: Partial<ServiceContext>): Promise<any>
  resetChecklist(checklistId: string, ctx?: Partial<ServiceContext>): Promise<any>
}

export interface CreateChecklistHooksDeps {
  useServiceContext: () => Partial<ServiceContext> | undefined
  checklistService: ChecklistServiceLike
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createChecklistHooks(deps: CreateChecklistHooksDeps) {
  const { useServiceContext, checklistService } = deps

  function useChecklists() {
    const ctx = useServiceContext()
    return useQuery({
      queryKey: queryKeys.checklists.list(ctx?.familyId!, ctx?.babyId),
      queryFn: () => checklistService.getChecklists(ctx),
      enabled: !!ctx?.familyId,
      staleTime: 1000 * 60 * 5,
    })
  }

  function useChecklist(checklistId: string) {
    const ctx = useServiceContext()
    return useQuery({
      queryKey: queryKeys.checklists.detail(checklistId, ctx?.familyId!, ctx?.babyId),
      queryFn: () => checklistService.getChecklistById(checklistId, ctx),
      enabled: !!checklistId && !!ctx?.familyId,
    })
  }

  function useToggleChecklistItem() {
    const queryClient = useQueryClient()
    const ctx = useServiceContext()

    return useMutation({
      mutationFn: ({ checklistId, itemId, completed }: {
        checklistId: string
        itemId: string
        completed: boolean
      }) => checklistService.toggleItem(checklistId, itemId, completed, ctx),

      // Optimistic update for instant UI feedback
      onMutate: async ({ checklistId, itemId, completed }) => {
        const fullKey = queryKeys.checklists.detail(checklistId, ctx?.familyId!, ctx?.babyId)

        await queryClient.cancelQueries({ queryKey: fullKey })
        const previousChecklist = queryClient.getQueryData(fullKey)

        queryClient.setQueryData(fullKey, (old: any) => {
          if (!old) return old
          const updatedItems = old.items.map((item: any) =>
            item.item_id === itemId ? { ...item, completed } : item,
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
            queryKeys.checklists.detail(variables.checklistId, ctx?.familyId!, ctx?.babyId),
            context.previousChecklist,
          )
        }
      },

      // Refetch to ensure consistency
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.checklists.all })
      },
    })
  }

  function useResetChecklist() {
    const queryClient = useQueryClient()
    const ctx = useServiceContext()

    return useMutation({
      mutationFn: (checklistId: string) => checklistService.resetChecklist(checklistId, ctx),
      onSuccess: (_, checklistId) => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.checklists.detail(checklistId, ctx?.familyId!, ctx?.babyId),
        })
        queryClient.invalidateQueries({ queryKey: queryKeys.checklists.all })
      },
    })
  }

  return {
    useChecklists,
    useChecklist,
    useToggleChecklistItem,
    useResetChecklist,
  }
}
