import { TimelineCategory, TIMELINE_CATEGORIES } from './task-timeline'

export interface ChecklistCategoryStats {
  checklistCount: number
  totalItems: number
  completedItems: number
}

/**
 * Parse week_relevant string into a numeric range.
 * Examples: "35-36" -> {start:35, end:36}, "8+" -> {start:8, end:null}, "0" -> {start:0, end:0}
 */
function parseWeekRange(weekRelevant: string): { start: number; end: number | null } {
  const trimmed = weekRelevant.trim()

  // Open-ended range: "8+"
  if (trimmed.endsWith('+')) {
    return { start: parseInt(trimmed.slice(0, -1), 10), end: null }
  }

  // Fixed range: "35-36"
  if (trimmed.includes('-')) {
    const [startStr, endStr] = trimmed.split('-')
    return { start: parseInt(startStr, 10), end: parseInt(endStr, 10) }
  }

  // Single week: "0"
  const week = parseInt(trimmed, 10)
  return { start: week, end: week }
}

// Pregnancy week -> trimester mapping
function pregnancyWeekToCategory(week: number): TimelineCategory {
  if (week <= 13) return 'first-trimester'
  if (week <= 27) return 'second-trimester'
  return 'third-trimester'
}

// Post-birth week -> phase mapping
function postBirthWeekToCategory(week: number): TimelineCategory {
  if (week === 0) return 'delivery'
  if (week <= 12) return '0-3 months'
  if (week <= 26) return '3-6 months'
  if (week <= 52) return '6-12 months'
  if (week <= 78) return '12-18 months'
  return '18-24 months'
}

// All post-birth categories in order
const POST_BIRTH_CATEGORIES: TimelineCategory[] = [
  'delivery',
  '0-3 months',
  '3-6 months',
  '6-12 months',
  '12-18 months',
  '18-24 months',
]

// All pregnancy categories in order
const PREGNANCY_CATEGORIES: TimelineCategory[] = [
  'first-trimester',
  'second-trimester',
  'third-trimester',
]

/**
 * Get the primary timeline category for a checklist.
 * Pregnancy: week 1-13=T1, 14-27=T2, 28-40=T3
 * Post-birth: 0=delivery, 1-12=0-3mo, 13-26=3-6mo, 27-52=6-12mo, 53-78=12-18mo, 79+=18-24mo
 */
export function getChecklistTimelineCategory(
  stage: string,
  weekRelevant: string
): TimelineCategory {
  const { start, end } = parseWeekRange(weekRelevant)
  const isPregnancy = stage === 'pregnancy' || stage === 'first-trimester' ||
    stage === 'second-trimester' || stage === 'third-trimester'

  if (isPregnancy) {
    return pregnancyWeekToCategory(start)
  }

  // Post-birth: ranges starting at 0 go to '0-3 months', not 'delivery'
  // Covers both "0-1" (fixed range) and "0+" (open-ended)
  if (start === 0 && (end === null || end > 0)) {
    return '0-3 months'
  }

  return postBirthWeekToCategory(start)
}

/**
 * Check if a checklist overlaps with a given timeline category.
 * For open-ended ranges like "4+", returns true for all applicable phases.
 * For fixed ranges like "20-28", returns true only for phases the range falls in.
 */
export function checklistOverlapsCategory(
  stage: string,
  weekRelevant: string,
  category: TimelineCategory
): boolean {
  const { start, end } = parseWeekRange(weekRelevant)
  const isPregnancy = stage === 'pregnancy' || stage === 'first-trimester' ||
    stage === 'second-trimester' || stage === 'third-trimester'

  if (isPregnancy) {
    const startCat = pregnancyWeekToCategory(start)

    if (end === null) {
      // Open-ended: all categories from startCat onwards
      const startIdx = PREGNANCY_CATEGORIES.indexOf(startCat)
      const targetIdx = PREGNANCY_CATEGORIES.indexOf(category)
      return targetIdx >= 0 && targetIdx >= startIdx
    }

    const endCat = pregnancyWeekToCategory(end)
    const startIdx = PREGNANCY_CATEGORIES.indexOf(startCat)
    const endIdx = PREGNANCY_CATEGORIES.indexOf(endCat)
    const targetIdx = PREGNANCY_CATEGORIES.indexOf(category)
    return targetIdx >= 0 && targetIdx >= startIdx && targetIdx <= endIdx
  }

  // Post-birth
  const startCat = start === 0 && (end === null || end > 0)
    ? '0-3 months' as TimelineCategory
    : postBirthWeekToCategory(start)

  if (end === null) {
    // Open-ended: all categories from startCat onwards
    const startIdx = POST_BIRTH_CATEGORIES.indexOf(startCat)
    const targetIdx = POST_BIRTH_CATEGORIES.indexOf(category)
    return targetIdx >= 0 && targetIdx >= startIdx
  }

  const endCat = postBirthWeekToCategory(end)
  const startIdx = POST_BIRTH_CATEGORIES.indexOf(startCat)
  const endIdx = POST_BIRTH_CATEGORIES.indexOf(endCat)
  const targetIdx = POST_BIRTH_CATEGORIES.indexOf(category)
  return targetIdx >= 0 && targetIdx >= startIdx && targetIdx <= endIdx
}

/**
 * Get checklist stats grouped by timeline category.
 */
export function getChecklistStatsByCategory(
  checklists: Array<{
    stage: string
    week_relevant: string
    progress: { total: number; completed: number }
  }>
): Record<TimelineCategory, ChecklistCategoryStats> {
  const stats = {} as Record<TimelineCategory, ChecklistCategoryStats>
  for (const cat of TIMELINE_CATEGORIES) {
    stats[cat.id] = { checklistCount: 0, totalItems: 0, completedItems: 0 }
  }

  for (const checklist of checklists) {
    const category = getChecklistTimelineCategory(checklist.stage, checklist.week_relevant)
    stats[category].checklistCount++
    stats[category].totalItems += checklist.progress.total
    stats[category].completedItems += checklist.progress.completed
  }

  return stats
}
