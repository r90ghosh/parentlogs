'use client'

import { createTaskHooks } from '@tdc/shared/hooks'
import { taskService } from '@/lib/services'
import { trackActivity } from '@/lib/track-activity'
import { useServiceContext } from './use-service-context'

export type { CreateTaskInput, TaskFilters } from '@tdc/shared/hooks'

const {
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
} = createTaskHooks({
  useServiceContext,
  taskService,
  onTaskCompleted: (userId) => trackActivity(userId, 'task_completed'),
})

export {
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
