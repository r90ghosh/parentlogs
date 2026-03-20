import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/components/providers/AuthProvider'
import { checklistService } from '@/lib/services'

export function useChecklists() {
  const { family } = useAuth()

  return useQuery({
    queryKey: ['checklists', family?.id],
    queryFn: () => checklistService.getChecklists(),
    enabled: !!family?.id,
    staleTime: 1000 * 60 * 5,
  })
}

export function useChecklistById(checklistId: string) {
  const { family } = useAuth()

  return useQuery({
    queryKey: ['checklist', checklistId, family?.id],
    queryFn: () => checklistService.getChecklistById(checklistId),
    enabled: !!checklistId && !!family?.id,
  })
}

export function useToggleChecklistItem() {
  const queryClient = useQueryClient()
  const { family } = useAuth()

  return useMutation({
    mutationFn: ({
      checklistId,
      itemId,
      completed,
    }: {
      checklistId: string
      itemId: string
      completed: boolean
    }) => checklistService.toggleItem(checklistId, itemId, completed),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['checklist', variables.checklistId, family?.id],
      })
      queryClient.invalidateQueries({ queryKey: ['checklists', family?.id] })
    },
  })
}
