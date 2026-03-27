import { useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { startOfWeek, endOfWeek, isPast, isToday } from 'date-fns'
import { useAuth } from '@/components/providers/AuthProvider'
import { useServiceContext } from './use-service-context'
import { taskService } from '@/lib/services'
import type { TaskAssignee, TaskStatus, TriageAction } from '@tdc/shared/types'

export function useTasks(filters?: { assignee?: TaskAssignee; category?: string }) {
  const { family } = useAuth()
  const ctx = useServiceContext()

  return useQuery({
    queryKey: ['tasks', family?.id, filters?.assignee, filters?.category],
    queryFn: () =>
      taskService.getTasks({
        status: 'all',
        assignee: filters?.assignee,
        category: filters?.category,
      }, ctx),
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
  const { family } = useAuth()
  const ctx = useServiceContext()

  return useMutation({
    mutationFn: (id: string) => taskService.completeTask(id, ctx),
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
  const ctx = useServiceContext()

  return useMutation({
    mutationFn: ({ id, days = 7 }: { id: string; days?: number }) => {
      const snoozeUntil = new Date()
      snoozeUntil.setDate(snoozeUntil.getDate() + days)
      return taskService.snoozeTask(id, snoozeUntil.toISOString().split('T')[0], ctx)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', family?.id] })
      queryClient.invalidateQueries({ queryKey: ['tasks-due', family?.id] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()
  const { family } = useAuth()
  const ctx = useServiceContext()

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string
      updates: Partial<Pick<import('@tdc/shared/types').FamilyTask, 'title' | 'description' | 'due_date' | 'assigned_to' | 'priority' | 'category' | 'status' | 'notes'>>
    }) => taskService.updateTask(id, updates, ctx),
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
  const ctx = useServiceContext()

  return useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id, ctx),
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
  const ctx = useServiceContext()

  return useMutation({
    mutationFn: (id: string) => taskService.skipTask(id, ctx),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', family?.id] })
      queryClient.invalidateQueries({ queryKey: ['tasks-due', family?.id] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  const { family } = useAuth()
  const ctx = useServiceContext()

  return useMutation({
    mutationFn: (task: {
      title: string
      description: string
      due_date: string
      assigned_to: TaskAssignee
      priority: 'must-do' | 'good-to-do'
      category: string
      status: TaskStatus
    }) => taskService.createTask(task, ctx),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', family?.id] })
      queryClient.invalidateQueries({ queryKey: ['tasks-due', family?.id] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

/**
 * Fetch all tasks for timeline display (ignores premium gating)
 */
export function useAllTasksForTimeline() {
  const { family } = useAuth()
  const ctx = useServiceContext()

  return useQuery({
    queryKey: ['tasks-timeline', family?.id],
    queryFn: () => taskService.getAllTasksForTimeline(ctx),
    enabled: !!family?.id,
  })
}

/**
 * Get the highest priority focus task for today
 * Priority: overdue must-do > overdue > today must-do > today > this week must-do > this week
 */
export function useFocusTask() {
  const { data: tasks, ...rest } = useTasks()

  const focusTask = useMemo(() => {
    if (!tasks || tasks.length === 0) return null

    const today = new Date()
    today.setHours(0, 0, 0, 0)

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

        const daysUntilDue = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        score -= Math.max(0, daysUntilDue)

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
  const { data: tasks, ...rest } = useTasks()

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

    const thisWeekTasks = allTasks.filter((t) => {
      const dueDate = new Date(t.due_date)
      return dueDate >= weekStart && dueDate <= weekEnd
    })

    const thisWeekCompleted = thisWeekTasks.filter((t) => t.status === 'completed').length
    const overallCompleted = allTasks.filter((t) => t.status === 'completed').length

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
 * Bulk triage multiple tasks
 */
export function useBulkTriageTasks() {
  const queryClient = useQueryClient()
  const { family } = useAuth()
  const ctx = useServiceContext()

  return useMutation({
    mutationFn: ({ ids, action }: { ids: string[]; action: TriageAction }) =>
      taskService.bulkTriageTasks(ids, action, ctx),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', family?.id] })
      queryClient.invalidateQueries({ queryKey: ['tasks-due', family?.id] })
      queryClient.invalidateQueries({ queryKey: ['tasks-timeline', family?.id] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['backlog-tasks', family?.id] })
      queryClient.invalidateQueries({ queryKey: ['backlog-count', family?.id] })
    },
  })
}
