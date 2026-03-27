import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/components/providers/AuthProvider'
import { useServiceContext } from './use-service-context'
import { taskService } from '@/lib/services'
import type { TriageAction } from '@tdc/shared/types'

export function useBacklogTasks() {
  const { family } = useAuth()
  const ctx = useServiceContext()
  return useQuery({
    queryKey: ['backlog-tasks', family?.id],
    queryFn: () => taskService.getBacklogTasks(ctx),
    enabled: !!family?.id,
  })
}

export function useBacklogCount() {
  const { family } = useAuth()
  const ctx = useServiceContext()
  return useQuery({
    queryKey: ['backlog-count', family?.id],
    queryFn: () => taskService.getBacklogCount(ctx),
    enabled: !!family?.id,
  })
}

export function useTriageTask() {
  const queryClient = useQueryClient()
  const { family } = useAuth()
  const ctx = useServiceContext()
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: TriageAction }) =>
      taskService.triageTask(id, action, ctx),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backlog-tasks', family?.id] })
      queryClient.invalidateQueries({ queryKey: ['backlog-count', family?.id] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
