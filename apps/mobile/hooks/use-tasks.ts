import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/components/providers/AuthProvider'
import { taskService } from '@/lib/services'
import type { TaskAssignee, TaskStatus } from '@tdc/shared/types'

export function useTasks(filters?: { assignee?: TaskAssignee; category?: string }) {
  const { family } = useAuth()

  return useQuery({
    queryKey: ['tasks', family?.id, filters?.assignee, filters?.category],
    queryFn: () =>
      taskService.getTasks({
        status: 'all',
        assignee: filters?.assignee,
        category: filters?.category,
      }),
    enabled: !!family?.id,
  })
}

export function useTaskById(id: string) {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => taskService.getTaskById(id),
    enabled: !!id,
  })
}

export function useCompleteTask() {
  const queryClient = useQueryClient()
  const { family, user } = useAuth()

  return useMutation({
    mutationFn: (id: string) => taskService.completeTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', family?.id] })
      queryClient.invalidateQueries({ queryKey: ['tasks-due', family?.id] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useSnoozeTask() {
  const queryClient = useQueryClient()
  const { family } = useAuth()

  return useMutation({
    mutationFn: (id: string) => {
      const snoozeUntil = new Date()
      snoozeUntil.setDate(snoozeUntil.getDate() + 7)
      return taskService.snoozeTask(id, snoozeUntil.toISOString().split('T')[0])
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', family?.id] })
      queryClient.invalidateQueries({ queryKey: ['tasks-due', family?.id] })
    },
  })
}

export function useSkipTask() {
  const queryClient = useQueryClient()
  const { family } = useAuth()

  return useMutation({
    mutationFn: (id: string) => taskService.skipTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', family?.id] })
      queryClient.invalidateQueries({ queryKey: ['tasks-due', family?.id] })
    },
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  const { family } = useAuth()

  return useMutation({
    mutationFn: (task: {
      title: string
      description: string
      due_date: string
      assigned_to: TaskAssignee
      priority: 'must-do' | 'good-to-do'
      category: string
      status: TaskStatus
    }) => taskService.createTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', family?.id] })
      queryClient.invalidateQueries({ queryKey: ['tasks-due', family?.id] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
