'use client'

import { useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { startOfWeek, endOfWeek, isPast, isToday, addDays } from 'date-fns'
import { taskService, TaskFilters } from '@/services/task-service'
import { FamilyTask, TaskAssignee, TaskStatus, TriageAction } from '@/types'

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

/**
 * Get the highest priority focus task for today
 * Priority: overdue must-do > overdue > today must-do > today > this week must-do > this week
 */
export function useFocusTask() {
  const { data: tasks, ...rest } = useTasks({ status: 'pending' })

  const focusTask = useMemo(() => {
    if (!tasks || tasks.length === 0) return null

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Score each task for priority
    const scoredTasks = tasks
      .filter((t) => t.status === 'pending')
      .map((task) => {
        const dueDate = new Date(task.due_date)
        dueDate.setHours(0, 0, 0, 0)

        const isOverdue = isPast(dueDate) && !isToday(dueDate)
        const isDueToday = isToday(dueDate)
        const isMustDo = task.priority === 'must-do'

        let score = 0
        if (isOverdue) score += 1000
        if (isDueToday) score += 500
        if (isMustDo) score += 100

        // Earlier due dates get higher priority
        const daysUntilDue = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        score -= Math.max(0, daysUntilDue) // Subtract days to prioritize sooner tasks

        return { task, score }
      })
      .sort((a, b) => b.score - a.score)

    return scoredTasks[0]?.task || null
  }, [tasks])

  return { focusTask, ...rest }
}

/**
 * Get tasks due this week (excluding the focus task)
 */
export function useThisWeekTasks(excludeFocusTaskId?: string) {
  const { data: tasks, ...rest } = useTasks({ status: 'pending' })

  const weekTasks = useMemo(() => {
    if (!tasks) return []

    const now = new Date()
    const weekStart = startOfWeek(now, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 })

    return tasks
      .filter((task) => {
        if (excludeFocusTaskId && task.id === excludeFocusTaskId) return false
        const dueDate = new Date(task.due_date)
        return dueDate >= weekStart && dueDate <= weekEnd && task.status === 'pending'
      })
      .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
  }, [tasks, excludeFocusTaskId])

  return { weekTasks, ...rest }
}

/**
 * Get task completion progress statistics
 */
export function useTaskProgress() {
  const { data: allTasks } = useAllTasksForTimeline()

  return useMemo(() => {
    if (!allTasks) {
      return {
        thisWeek: { completed: 0, total: 0 },
        overall: { completed: 0, total: 0 },
        overdueCount: 0,
      }
    }

    const now = new Date()
    const weekStart = startOfWeek(now, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 })

    // This week's tasks
    const thisWeekTasks = allTasks.filter((t) => {
      const dueDate = new Date(t.due_date)
      return dueDate >= weekStart && dueDate <= weekEnd
    })

    const thisWeekCompleted = thisWeekTasks.filter((t) => t.status === 'completed').length

    // Overall stats
    const overallCompleted = allTasks.filter((t) => t.status === 'completed').length

    // Overdue count (pending tasks past due date)
    const overdueCount = allTasks.filter((t) => {
      if (t.status !== 'pending') return false
      const dueDate = new Date(t.due_date)
      return isPast(dueDate) && !isToday(dueDate)
    }).length

    return {
      thisWeek: { completed: thisWeekCompleted, total: thisWeekTasks.length },
      overall: { completed: overallCompleted, total: allTasks.length },
      overdueCount,
    }
  }, [allTasks])
}

/**
 * Snooze a task to tomorrow (convenience wrapper)
 */
export function useSnoozeToTomorrow() {
  const snoozeTask = useSnoozeTask()

  return useMutation({
    mutationFn: (taskId: string) => {
      const tomorrow = addDays(new Date(), 1).toISOString().split('T')[0]
      return snoozeTask.mutateAsync({ id: taskId, until: tomorrow })
    },
  })
}

/**
 * Snooze a task by a number of days
 */
export function useSnoozeDays() {
  const snoozeTask = useSnoozeTask()

  return useMutation({
    mutationFn: ({ taskId, days }: { taskId: string; days: number }) => {
      const until = addDays(new Date(), days).toISOString().split('T')[0]
      return snoozeTask.mutateAsync({ id: taskId, until })
    },
  })
}

/**
 * Get backlog tasks (tasks from before signup week that need triage)
 */
export function useBacklogTasks() {
  return useQuery({
    queryKey: ['backlog-tasks'],
    queryFn: () => taskService.getBacklogTasks(),
  })
}

/**
 * Get count of pending backlog tasks
 */
export function useBacklogCount() {
  return useQuery({
    queryKey: ['backlog-count'],
    queryFn: () => taskService.getBacklogCount(),
  })
}

/**
 * Triage a single backlog task
 */
export function useTriageTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: TriageAction }) =>
      taskService.triageTask(id, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['backlog-tasks'] })
      queryClient.invalidateQueries({ queryKey: ['backlog-count'] })
      queryClient.invalidateQueries({ queryKey: ['tasks-timeline'] })
    },
  })
}

/**
 * Bulk triage multiple tasks
 */
export function useBulkTriageTasks() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ ids, action }: { ids: string[]; action: TriageAction }) =>
      taskService.bulkTriageTasks(ids, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['backlog-tasks'] })
      queryClient.invalidateQueries({ queryKey: ['backlog-count'] })
      queryClient.invalidateQueries({ queryKey: ['tasks-timeline'] })
    },
  })
}
