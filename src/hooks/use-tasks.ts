'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { taskService, TaskFilters } from '@/services/task-service'
import { FamilyTask, TaskAssignee, TaskStatus } from '@/types'

export type CreateTaskInput = {
  title: string
  description: string
  due_date: string
  assigned_to: TaskAssignee
  priority: 'must-do' | 'good-to-do'
  category: string
  status: TaskStatus
}

export function useTasks(filters: TaskFilters = {}) {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => taskService.getTasks(filters),
  })
}

export function useTask(id: string) {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => taskService.getTaskById(id),
    enabled: !!id,
  })
}

export function useCompleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => taskService.completeTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useSnoozeTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, until }: { id: string; until: string }) =>
      taskService.snoozeTask(id, until),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useSkipTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => taskService.skipTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (task: CreateTaskInput) => taskService.createTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<FamilyTask> }) =>
      taskService.updateTask(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

/**
 * Fetch all tasks for timeline display (ignores premium gating)
 */
export function useAllTasksForTimeline() {
  return useQuery({
    queryKey: ['tasks-timeline'],
    queryFn: () => taskService.getAllTasksForTimeline(),
  })
}
