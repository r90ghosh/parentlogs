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
    mutationFn: ({ id, days = 7 }: { id: string; days?: number }) => {
      const snoozeUntil = new Date()
      snoozeUntil.setDate(snoozeUntil.getDate() + days)
      return taskService.snoozeTask(id, snoozeUntil.toISOString().split('T')[0])
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', family?.id] })
      queryClient.invalidateQueries({ queryKey: ['tasks-due', family?.id] })
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()
  const { family } = useAuth()

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string
      updates: Partial<Pick<import('@tdc/shared/types').FamilyTask, 'title' | 'description' | 'due_date' | 'assigned_to' | 'priority' | 'category' | 'status' | 'notes'>>
    }) => taskService.updateTask(id, updates),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', family?.id] })
      queryClient.invalidateQueries({ queryKey: ['tasks-due', family?.id] })
      queryClient.invalidateQueries({ queryKey: ['task', id] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()
  const { family } = useAuth()

  return useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', family?.id] })
      queryClient.invalidateQueries({ queryKey: ['tasks-due', family?.id] })
      queryClient.invalidateQueries({ queryKey: ['task', id] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
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
