import { FamilyTask, BacklogCategory } from '@/types'

/**
 * Categorize a backlog task based on its properties
 * - window_passed: Time-sensitive tasks past their window
 * - probably_done: Tasks commonly completed early in pregnancy
 * - still_relevant: Everything else that can still be done
 */
export function categorizeBacklogTask(
  task: FamilyTask,
  currentWeek: number
): BacklogCategory {
  const weeksPastDue = currentWeek - (task.week_due || 0)

  // Time-sensitive with closed window
  if (task.is_time_sensitive && weeksPastDue > (task.window_weeks || 4)) {
    return 'window_passed'
  }

  // Common early tasks (things like prenatal vitamins, finding a doctor, etc.)
  if (task.commonly_completed_early && (task.week_due || 0) < 12) {
    return 'probably_done'
  }

  return 'still_relevant'
}

/**
 * Get a context message explaining why we're asking about this task
 */
export function getTriageContextMessage(
  task: FamilyTask,
  category: BacklogCategory,
  currentWeek: number
): string {
  const weeksPast = currentWeek - (task.week_due || 0)

  switch (category) {
    case 'window_passed':
      return `This was scheduled for Week ${task.week_due}, which was ${weeksPast} weeks ago. Since it was time-sensitive, the window has passed. You can safely skip this.`
    case 'probably_done':
      return `This is typically one of the first things parents do. We're just confirming you've got this covered!`
    case 'still_relevant':
      return weeksPast <= 4
        ? `This was scheduled for Week ${task.week_due}, just ${weeksPast} weeks ago. You still have plenty of time!`
        : `Originally scheduled for Week ${task.week_due}, but there's no deadline. We recommend adding it to your active list.`
  }
}

/**
 * Sort backlog tasks for triage - prioritize "probably_done" first (quick wins),
 * then "still_relevant", then "window_passed" (easy skips)
 */
export function sortBacklogTasks(
  tasks: FamilyTask[],
  currentWeek: number
): FamilyTask[] {
  return [...tasks].sort((a, b) => {
    const catA = categorizeBacklogTask(a, currentWeek)
    const catB = categorizeBacklogTask(b, currentWeek)

    const order: Record<BacklogCategory, number> = {
      probably_done: 0,
      still_relevant: 1,
      window_passed: 2
    }

    // First sort by category
    if (order[catA] !== order[catB]) {
      return order[catA] - order[catB]
    }

    // Then by week
    return (a.week_due || 0) - (b.week_due || 0)
  })
}

/**
 * Get task stats including catch-up queue count
 */
export function getTaskStats(
  tasks: FamilyTask[] | undefined,
  currentWeek: number
): {
  dueToday: number
  thisWeek: number
  completed: number
  partnerTasks: number
  catchUpQueue: number
} {
  if (!tasks) {
    return { dueToday: 0, thisWeek: 0, completed: 0, partnerTasks: 0, catchUpQueue: 0 }
  }

  const activeTasks = tasks.filter(t => !t.is_backlog || t.backlog_status === 'triaged')
  const backlogTasks = tasks.filter(t => t.is_backlog && t.backlog_status === 'pending')

  return {
    dueToday: activeTasks.filter(t =>
      t.status === 'pending' && t.week_due === currentWeek
    ).length,
    thisWeek: activeTasks.filter(t =>
      t.status === 'pending' &&
      t.week_due !== null &&
      t.week_due !== undefined &&
      t.week_due >= currentWeek &&
      t.week_due <= currentWeek + 1
    ).length,
    completed: tasks.filter(t => t.status === 'completed').length,
    partnerTasks: activeTasks.filter(t =>
      t.assigned_to === 'mom' && t.status === 'pending'
    ).length,
    catchUpQueue: backlogTasks.length
  }
}

/**
 * Format time estimate for display
 */
export function formatTimeEstimate(minutes: number | null | undefined): string {
  if (!minutes) return ''
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}
