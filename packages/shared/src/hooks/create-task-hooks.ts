/**
 * Factory for task-related React Query hooks.
 *
 * Both web and mobile apps call `createTaskHooks(deps)` with their
 * platform-specific service context hook and task service instance,
 * then re-export the returned hooks.
 */
import { useMemo, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { startOfWeek, endOfWeek, isPast, isToday, addDays } from 'date-fns'
import { queryKeys } from '../constants/query-keys'
import type { ServiceContext } from '../types/service-context'
import type { FamilyTask, TaskAssignee, TaskStatus, TriageAction } from '../types'

// ---------------------------------------------------------------------------
// Dependency types
// ---------------------------------------------------------------------------

export type CreateTaskInput = {
  title: string
  description: string
  due_date: string
  assigned_to: TaskAssignee
  priority: 'must-do' | 'good-to-do'
  category: string
  status: TaskStatus
}

export interface TaskFilters {
  status?: TaskStatus | 'all'
  assignee?: TaskAssignee
  category?: string
  search?: string
  limit?: number
  offset?: number
  includeBacklog?: boolean
}

/** Minimal surface the factory needs from each platform's task service. */
export interface TaskServiceLike {
  getTasks(filters: TaskFilters, ctx?: Partial<ServiceContext>): Promise<FamilyTask[]>
  getTaskById(id: string): Promise<FamilyTask | null>
  completeTask(id: string, ctx?: Partial<ServiceContext>): Promise<any>
  snoozeTask(id: string, until: string, ctx?: Partial<ServiceContext>): Promise<any>
  skipTask(id: string, ctx?: Partial<ServiceContext>): Promise<any>
  createTask(task: CreateTaskInput, ctx?: Partial<ServiceContext>): Promise<any>
  updateTask(id: string, updates: Partial<Pick<FamilyTask, 'title' | 'description' | 'due_date' | 'assigned_to' | 'priority' | 'category' | 'status' | 'notes'>>, ctx?: Partial<ServiceContext>): Promise<any>
  deleteTask(id: string, ctx?: Partial<ServiceContext>): Promise<any>
  getAllTasksForTimeline(ctx?: Partial<ServiceContext>): Promise<FamilyTask[]>
  getBacklogTasks(ctx?: Partial<ServiceContext>): Promise<FamilyTask[]>
  getBacklogCount(ctx?: Partial<ServiceContext>): Promise<number>
  triageTask(id: string, action: TriageAction, ctx?: Partial<ServiceContext>): Promise<any>
  bulkTriageTasks(ids: string[], action: TriageAction, ctx?: Partial<ServiceContext>): Promise<any>
}

export interface CreateTaskHooksDeps {
  useServiceContext: () => Partial<ServiceContext> | undefined
  taskService: TaskServiceLike
  /** Optional callback fired after a task is completed (e.g. analytics). */
  onTaskCompleted?: (userId: string) => void
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createTaskHooks(deps: CreateTaskHooksDeps) {
  const { useServiceContext, taskService, onTaskCompleted } = deps

  // ---- helper for broad invalidation after mutations ----
  function invalidateTaskKeys(queryClient: ReturnType<typeof useQueryClient>) {
    queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all })
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
  }

  // -----------------------------------------------------------------------
  // Queries
  // -----------------------------------------------------------------------

  function useTasks(filters: TaskFilters = {}) {
    const ctx = useServiceContext()
    return useQuery({
      queryKey: queryKeys.tasks.list(ctx?.familyId!, ctx?.babyId, filters as Record<string, unknown>),
      queryFn: () => taskService.getTasks(filters, ctx),
      enabled: !!ctx?.familyId,
    })
  }

  function useTask(id: string) {
    return useQuery({
      queryKey: queryKeys.tasks.detail(id),
      queryFn: () => taskService.getTaskById(id),
      enabled: !!id,
    })
  }

  function useAllTasksForTimeline() {
    const ctx = useServiceContext()
    return useQuery({
      queryKey: queryKeys.tasks.timeline(ctx?.familyId!, ctx?.babyId),
      queryFn: () => taskService.getAllTasksForTimeline(ctx),
      enabled: !!ctx?.familyId,
    })
  }

  function useBacklogTasks() {
    const ctx = useServiceContext()
    return useQuery({
      queryKey: queryKeys.tasks.backlog(ctx?.familyId!, ctx?.babyId),
      queryFn: () => taskService.getBacklogTasks(ctx),
      enabled: !!ctx?.familyId,
    })
  }

  function useBacklogCount() {
    const ctx = useServiceContext()
    return useQuery({
      queryKey: queryKeys.tasks.backlogCount(ctx?.familyId!, ctx?.babyId),
      queryFn: () => taskService.getBacklogCount(ctx),
      enabled: !!ctx?.familyId,
    })
  }

  // -----------------------------------------------------------------------
  // Mutations
  // -----------------------------------------------------------------------

  function useCompleteTask() {
    const queryClient = useQueryClient()
    const ctx = useServiceContext()
    return useMutation({
      mutationFn: (id: string) => taskService.completeTask(id, ctx),
      onSuccess: () => {
        if (ctx?.userId && onTaskCompleted) onTaskCompleted(ctx.userId)
        invalidateTaskKeys(queryClient)
      },
    })
  }

  function useSnoozeTask() {
    const queryClient = useQueryClient()
    const ctx = useServiceContext()
    return useMutation({
      mutationFn: ({ id, until }: { id: string; until: string }) =>
        taskService.snoozeTask(id, until, ctx),
      onSuccess: () => invalidateTaskKeys(queryClient),
    })
  }

  function useSkipTask() {
    const queryClient = useQueryClient()
    const ctx = useServiceContext()
    return useMutation({
      mutationFn: (id: string) => taskService.skipTask(id, ctx),
      onSuccess: () => invalidateTaskKeys(queryClient),
    })
  }

  function useCreateTask() {
    const queryClient = useQueryClient()
    const ctx = useServiceContext()
    return useMutation({
      mutationFn: (task: CreateTaskInput) => taskService.createTask(task, ctx),
      onSuccess: () => invalidateTaskKeys(queryClient),
    })
  }

  function useUpdateTask() {
    const queryClient = useQueryClient()
    const ctx = useServiceContext()
    return useMutation({
      mutationFn: ({ id, updates }: {
        id: string
        updates: Partial<Pick<FamilyTask, 'title' | 'description' | 'due_date' | 'assigned_to' | 'priority' | 'category' | 'status' | 'notes'>>
      }) => taskService.updateTask(id, updates, ctx),
      onSuccess: () => invalidateTaskKeys(queryClient),
    })
  }

  function useDeleteTask() {
    const queryClient = useQueryClient()
    const ctx = useServiceContext()
    return useMutation({
      mutationFn: (id: string) => taskService.deleteTask(id, ctx),
      onSuccess: () => invalidateTaskKeys(queryClient),
    })
  }

  function useTriageTask() {
    const queryClient = useQueryClient()
    const ctx = useServiceContext()
    return useMutation({
      mutationFn: ({ id, action }: { id: string; action: TriageAction }) =>
        taskService.triageTask(id, action, ctx),
      onSuccess: () => invalidateTaskKeys(queryClient),
    })
  }

  function useBulkTriageTasks() {
    const queryClient = useQueryClient()
    const ctx = useServiceContext()
    return useMutation({
      mutationFn: ({ ids, action }: { ids: string[]; action: TriageAction }) =>
        taskService.bulkTriageTasks(ids, action, ctx),
      onSuccess: () => invalidateTaskKeys(queryClient),
    })
  }

  // -----------------------------------------------------------------------
  // Derived / computed hooks
  // -----------------------------------------------------------------------

  function useFocusTask() {
    const { data: tasks, ...rest } = useTasks({ status: 'pending' })

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

          const daysUntilDue = Math.floor(
            (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
          )
          score -= Math.max(0, daysUntilDue)

          return { task, score }
        })
        .sort((a, b) => b.score - a.score)

      return scoredTasks[0]?.task || null
    }, [tasks])

    return { focusTask, ...rest }
  }

  function useThisWeekTasks(excludeFocusTaskId?: string) {
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

  function useTaskProgress() {
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

  function useSnoozeToTomorrow() {
    const snooze = useSnoozeTask()
    const snoozeToTomorrow = useCallback(
      (taskId: string) => {
        const tomorrow = addDays(new Date(), 1).toISOString().split('T')[0]
        return snooze.mutate({ id: taskId, until: tomorrow })
      },
      [snooze],
    )
    return { snoozeToTomorrow, ...snooze }
  }

  function useSnoozeDays() {
    const snooze = useSnoozeTask()
    const snoozeDays = useCallback(
      ({ taskId, days }: { taskId: string; days: number }) => {
        const until = addDays(new Date(), days).toISOString().split('T')[0]
        return snooze.mutate({ id: taskId, until })
      },
      [snooze],
    )
    return { snoozeDays, ...snooze }
  }

  return {
    useTasks,
    useTask,
    useAllTasksForTimeline,
    useBacklogTasks,
    useBacklogCount,
    useCompleteTask,
    useSnoozeTask,
    useSkipTask,
    useCreateTask,
    useUpdateTask,
    useDeleteTask,
    useTriageTask,
    useBulkTriageTasks,
    useFocusTask,
    useThisWeekTasks,
    useTaskProgress,
    useSnoozeToTomorrow,
    useSnoozeDays,
  }
}
