import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/components/providers/AuthProvider'
import { taskService } from '@/lib/services'
import type { TriageAction } from '@tdc/shared/types'

export function useBacklogTasks() {
  const { family } = useAuth()
  return useQuery({
    queryKey: ['backlog-tasks', family?.id],
    queryFn: () => taskService.getBacklogTasks(),
    enabled: !!family?.id,
  })
}

export function useBacklogCount() {
  const { family } = useAuth()
  return useQuery({
    queryKey: ['backlog-count', family?.id],
    queryFn: () => taskService.getBacklogCount(),
    enabled: !!family?.id,
  })
}

export function useTriageTask() {
  const queryClient = useQueryClient()
  const { family } = useAuth()
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: TriageAction }) =>
      taskService.triageTask(id, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backlog-tasks', family?.id] })
      queryClient.invalidateQueries({ queryKey: ['backlog-count', family?.id] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
