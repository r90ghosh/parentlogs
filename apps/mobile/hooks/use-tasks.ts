import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTaskHooks } from '@tdc/shared/hooks'
import { queryKeys } from '@tdc/shared/constants'
import { taskService } from '@/lib/services'
import { useServiceContext } from './use-service-context'

export type { CreateTaskInput, TaskFilters } from '@tdc/shared/hooks'

const _hooks = createTaskHooks({
  useServiceContext,
  taskService,
})

// Mobile previously named this useTaskById — keep the alias for compatibility
const useTaskById = _hooks.useTask

/**
 * Mobile-specific snooze hook that accepts `{ id, days }` (default 7)
 * instead of `{ id, until }`. This preserves backward compatibility
 * with existing mobile callers.
 */
function useSnoozeTask() {
  const queryClient = useQueryClient()
  const ctx = useServiceContext()
  return useMutation({
    mutationFn: ({ id, days = 7 }: { id: string; days?: number }) => {
      const snoozeUntil = new Date()
      snoozeUntil.setDate(snoozeUntil.getDate() + days)
      return taskService.snoozeTask(id, snoozeUntil.toISOString().split('T')[0], ctx)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
    },
  })
}

export const useTasks = _hooks.useTasks
export const useTask = _hooks.useTask
export const useAllTasksForTimeline = _hooks.useAllTasksForTimeline
export const useBacklogTasks = _hooks.useBacklogTasks
export const useBacklogCount = _hooks.useBacklogCount
export const useCompleteTask = _hooks.useCompleteTask
export const useSkipTask = _hooks.useSkipTask
export const useCreateTask = _hooks.useCreateTask
export const useUpdateTask = _hooks.useUpdateTask
export const useDeleteTask = _hooks.useDeleteTask
export const useTriageTask = _hooks.useTriageTask
export const useBulkTriageTasks = _hooks.useBulkTriageTasks
export const useFocusTask = _hooks.useFocusTask
export const useThisWeekTasks = _hooks.useThisWeekTasks
export const useTaskProgress = _hooks.useTaskProgress
export const useSnoozeToTomorrow = _hooks.useSnoozeToTomorrow
export const useSnoozeDays = _hooks.useSnoozeDays

export {
  useTaskById,
  useSnoozeTask,
}
