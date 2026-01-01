import { FamilyTask, Family } from '@/types'
import { differenceInDays, startOfDay, endOfWeek, startOfWeek } from 'date-fns'
import { isPregnancyStage } from './pregnancy-utils'

export type TimelineCategory =
  | 'first-trimester'
  | 'second-trimester'
  | 'third-trimester'
  | 'delivery'
  | '0-3 months'
  | '3-6 months'
  | '6-12 months'
  | '12-18 months'
  | '18-24 months'

export interface TimelineCategoryInfo {
  id: TimelineCategory
  label: string
  color: string
  bgColor: string
}

export const TIMELINE_CATEGORIES: TimelineCategoryInfo[] = [
  { id: 'first-trimester', label: 'T1', color: '#9b6b80', bgColor: 'bg-rose-950/60' },
  { id: 'second-trimester', label: 'T2', color: '#8b5a6a', bgColor: 'bg-rose-900/60' },
  { id: 'third-trimester', label: 'T3', color: '#7d4a5a', bgColor: 'bg-rose-800/60' },
  { id: 'delivery', label: 'Delivery', color: '#8b4d5c', bgColor: 'bg-rose-700/60' },
  { id: '0-3 months', label: '0-3 mo', color: '#6b5270', bgColor: 'bg-fuchsia-900/50' },
  { id: '3-6 months', label: '3-6 mo', color: '#5c5680', bgColor: 'bg-violet-900/50' },
  { id: '6-12 months', label: '6-12 mo', color: '#4d5a87', bgColor: 'bg-indigo-900/50' },
  { id: '12-18 months', label: '12-18 mo', color: '#4a6085', bgColor: 'bg-blue-900/50' },
  { id: '18-24 months', label: '18-24 mo', color: '#4b6580', bgColor: 'bg-slate-700/60' },
]

/**
 * Get pregnancy week from days until due date
 * Week 1 = 40 weeks (280 days) before due, Week 40 = due date
 */
function getPregnancyWeekFromDays(daysFromDueDate: number): number {
  // daysFromDueDate is negative for dates before due date
  // Week 40 is at due date (0 days), Week 1 is at -280 days
  const daysUntilDue = -daysFromDueDate
  const weeksUntilDue = Math.ceil(daysUntilDue / 7)
  return Math.max(1, Math.min(40, 40 - weeksUntilDue + 1))
}

/**
 * Get the timeline category for a task based on its due date relative to the family's reference date
 */
export function getTaskTimelineCategory(
  taskDueDate: string,
  family: Family
): TimelineCategory {
  const dueDate = new Date(taskDueDate)
  const isPregnancy = isPregnancyStage(family.stage)
  const referenceDate = isPregnancy
    ? new Date(family.due_date!)
    : new Date(family.birth_date!)

  const daysFromReference = differenceInDays(dueDate, referenceDate)

  if (isPregnancy) {
    // For pregnancy, reference is due_date
    // Delivery: -7 to +14 days around due date
    if (daysFromReference >= -7 && daysFromReference <= 14) {
      return 'delivery'
    }

    // Before delivery window - determine trimester
    if (daysFromReference < -7) {
      const pregnancyWeek = getPregnancyWeekFromDays(daysFromReference)
      if (pregnancyWeek <= 13) return 'first-trimester'
      if (pregnancyWeek <= 27) return 'second-trimester'
      return 'third-trimester'
    }

    // Post-birth categories (after delivery window)
    if (daysFromReference <= 90) return '0-3 months'
    if (daysFromReference <= 180) return '3-6 months'
    if (daysFromReference <= 365) return '6-12 months'
    if (daysFromReference <= 540) return '12-18 months'
    return '18-24 months'
  } else {
    // For post-birth, reference is birth_date
    // Pre-birth tasks (shouldn't happen normally but handle gracefully)
    if (daysFromReference < -189) return 'first-trimester' // Week 1-13
    if (daysFromReference < -84) return 'second-trimester' // Week 14-27
    if (daysFromReference < -7) return 'third-trimester' // Week 28-40
    if (daysFromReference < 0) return 'delivery'

    // Post-birth categories
    if (daysFromReference <= 90) return '0-3 months'
    if (daysFromReference <= 180) return '3-6 months'
    if (daysFromReference <= 365) return '6-12 months'
    if (daysFromReference <= 540) return '12-18 months'
    return '18-24 months'
  }
}

/**
 * Get the current timeline category based on today's date
 */
export function getCurrentTimelineCategory(family: Family): TimelineCategory {
  const today = new Date()
  const isPregnancy = isPregnancyStage(family.stage)
  const referenceDate = isPregnancy
    ? new Date(family.due_date!)
    : new Date(family.birth_date!)

  const daysFromReference = differenceInDays(today, referenceDate)

  if (isPregnancy) {
    // Delivery window: -7 to +14 days from due date
    if (daysFromReference >= -7 && daysFromReference <= 14) {
      return 'delivery'
    }

    // Before delivery window - determine trimester by current week
    if (daysFromReference < -7) {
      const currentWeek = family.current_week || 1
      if (currentWeek <= 13) return 'first-trimester'
      if (currentWeek <= 27) return 'second-trimester'
      return 'third-trimester'
    }

    // Post-birth (shouldn't happen for pregnancy stage)
    if (daysFromReference <= 90) return '0-3 months'
    if (daysFromReference <= 180) return '3-6 months'
    if (daysFromReference <= 365) return '6-12 months'
    if (daysFromReference <= 540) return '12-18 months'
    return '18-24 months'
  } else {
    if (daysFromReference < 0) return 'delivery'
    if (daysFromReference <= 90) return '0-3 months'
    if (daysFromReference <= 180) return '3-6 months'
    if (daysFromReference <= 365) return '6-12 months'
    if (daysFromReference <= 540) return '12-18 months'
    return '18-24 months'
  }
}

/**
 * Group tasks by timeline category and count them
 */
export function getTaskCountsByCategory(
  tasks: FamilyTask[],
  family: Family
): Record<TimelineCategory, number> {
  const counts: Record<TimelineCategory, number> = {
    'first-trimester': 0,
    'second-trimester': 0,
    'third-trimester': 0,
    'delivery': 0,
    '0-3 months': 0,
    '3-6 months': 0,
    '6-12 months': 0,
    '12-18 months': 0,
    '18-24 months': 0,
  }

  tasks.forEach(task => {
    const category = getTaskTimelineCategory(task.due_date, family)
    counts[category]++
  })

  return counts
}

export type TaskTimeGroup = 'previous' | 'current' | 'future'

/**
 * Group tasks by time period (previous, current week, future)
 */
export function groupTasksByTimePeriod(tasks: FamilyTask[]): Record<TaskTimeGroup, FamilyTask[]> {
  const today = startOfDay(new Date())
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }) // Monday
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 }) // Sunday

  const groups: Record<TaskTimeGroup, FamilyTask[]> = {
    previous: [],
    current: [],
    future: [],
  }

  tasks.forEach(task => {
    const taskDate = startOfDay(new Date(task.due_date))

    if (taskDate < weekStart) {
      groups.previous.push(task)
    } else if (taskDate <= weekEnd) {
      groups.current.push(task)
    } else {
      groups.future.push(task)
    }
  })

  return groups
}

/**
 * Group tasks by week within a time period
 */
export function groupTasksByWeek(tasks: FamilyTask[]): Record<string, FamilyTask[]> {
  const groups: Record<string, FamilyTask[]> = {}

  tasks.forEach(task => {
    const taskDate = new Date(task.due_date)
    const weekStart = startOfWeek(taskDate, { weekStartsOn: 1 })
    const weekKey = weekStart.toISOString().split('T')[0]

    if (!groups[weekKey]) {
      groups[weekKey] = []
    }
    groups[weekKey].push(task)
  })

  return groups
}
