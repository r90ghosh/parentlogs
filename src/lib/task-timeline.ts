import { FamilyTask, Family } from '@/types'
import { differenceInDays, startOfDay, endOfWeek, startOfWeek, addDays } from 'date-fns'

export type TimelineCategory =
  | 'pregnancy'
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
  { id: 'pregnancy', label: 'Pregnancy', color: '#7d5a6a', bgColor: 'bg-rose-900/60' },
  { id: 'delivery', label: 'Delivery', color: '#8b4d5c', bgColor: 'bg-rose-800/60' },
  { id: '0-3 months', label: '0-3 mo', color: '#6b5270', bgColor: 'bg-fuchsia-900/50' },
  { id: '3-6 months', label: '3-6 mo', color: '#5c5680', bgColor: 'bg-violet-900/50' },
  { id: '6-12 months', label: '6-12 mo', color: '#4d5a87', bgColor: 'bg-indigo-900/50' },
  { id: '12-18 months', label: '12-18 mo', color: '#4a6085', bgColor: 'bg-blue-900/50' },
  { id: '18-24 months', label: '18-24 mo', color: '#4b6580', bgColor: 'bg-slate-700/60' },
]

/**
 * Get the timeline category for a task based on its due date relative to the family's reference date
 */
export function getTaskTimelineCategory(
  taskDueDate: string,
  family: Family
): TimelineCategory {
  const dueDate = new Date(taskDueDate)
  const referenceDate = family.stage === 'pregnancy'
    ? new Date(family.due_date!)
    : new Date(family.birth_date!)

  const daysFromReference = differenceInDays(dueDate, referenceDate)

  if (family.stage === 'pregnancy') {
    // For pregnancy, reference is due_date
    // Pregnancy: before -7 days from due date
    if (daysFromReference < -7) {
      return 'pregnancy'
    }
    // Delivery: -7 to +14 days around due date
    if (daysFromReference <= 14) {
      return 'delivery'
    }
    // Post-birth categories
    if (daysFromReference <= 90) return '0-3 months'
    if (daysFromReference <= 180) return '3-6 months'
    if (daysFromReference <= 365) return '6-12 months'
    if (daysFromReference <= 540) return '12-18 months'
    return '18-24 months'
  } else {
    // For post-birth, reference is birth_date
    // Pre-birth tasks
    if (daysFromReference < -7) {
      return 'pregnancy'
    }
    if (daysFromReference < 0) {
      return 'delivery'
    }
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
  const referenceDate = family.stage === 'pregnancy'
    ? new Date(family.due_date!)
    : new Date(family.birth_date!)

  const daysFromReference = differenceInDays(today, referenceDate)

  if (family.stage === 'pregnancy') {
    if (daysFromReference < -7) return 'pregnancy'
    if (daysFromReference <= 14) return 'delivery'
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
    'pregnancy': 0,
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
