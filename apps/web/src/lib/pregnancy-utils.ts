import { FamilyStage, PregnancyTrimester } from '@/types'

/**
 * Trimester week ranges based on medical standards
 */
export const TRIMESTER_WEEK_RANGES = {
  'first-trimester': { start: 1, end: 13, label: 'First Trimester' },
  'second-trimester': { start: 14, end: 27, label: 'Second Trimester' },
  'third-trimester': { start: 28, end: 40, label: 'Third Trimester' },
} as const

/**
 * Check if a stage is any pregnancy stage (including legacy 'pregnancy')
 */
export function isPregnancyStage(stage: FamilyStage): boolean {
  return (
    stage === 'pregnancy' ||
    stage === 'first-trimester' ||
    stage === 'second-trimester' ||
    stage === 'third-trimester'
  )
}

/**
 * Get the appropriate trimester based on pregnancy week
 */
export function getTrimesterFromWeek(week: number): PregnancyTrimester {
  if (week <= 13) return 'first-trimester'
  if (week <= 27) return 'second-trimester'
  return 'third-trimester'
}

/**
 * Get human-readable label for a stage
 */
export function getTrimesterLabel(stage: FamilyStage): string {
  const labels: Record<FamilyStage, string> = {
    'first-trimester': 'First Trimester',
    'second-trimester': 'Second Trimester',
    'third-trimester': 'Third Trimester',
    'pregnancy': 'Pregnancy', // Legacy
    'post-birth': 'Post-Birth',
  }
  return labels[stage] || 'Unknown'
}

/**
 * Get short label for a stage (for compact displays)
 */
export function getTrimesterShortLabel(stage: FamilyStage): string {
  const labels: Record<FamilyStage, string> = {
    'first-trimester': 'T1',
    'second-trimester': 'T2',
    'third-trimester': 'T3',
    'pregnancy': 'Pregnancy',
    'post-birth': 'Post-Birth',
  }
  return labels[stage] || 'Unknown'
}

/**
 * Get the week range for a specific trimester
 */
export function getWeekRangeForTrimester(
  trimester: PregnancyTrimester
): { start: number; end: number } {
  return TRIMESTER_WEEK_RANGES[trimester]
}

/**
 * Check if a given week falls within a specific trimester
 */
export function isWeekInTrimester(week: number, trimester: PregnancyTrimester): boolean {
  const range = TRIMESTER_WEEK_RANGES[trimester]
  return week >= range.start && week <= range.end
}

/**
 * Check if the current stage/week matches a specific trimester
 */
export function isCurrentTrimester(
  currentStage: FamilyStage,
  currentWeek: number,
  trimester: PregnancyTrimester
): boolean {
  // If stage is already a specific trimester, check directly
  if (currentStage === trimester) return true

  // For legacy 'pregnancy' stage, check by week
  if (currentStage === 'pregnancy') {
    return isWeekInTrimester(currentWeek, trimester)
  }

  return false
}

/**
 * Get all pregnancy stages (for filtering/iteration)
 */
export function getAllPregnancyStages(): FamilyStage[] {
  return ['first-trimester', 'second-trimester', 'third-trimester']
}

/**
 * Normalize a legacy 'pregnancy' stage to the appropriate trimester
 */
export function normalizePregnancyStage(stage: FamilyStage, week: number): FamilyStage {
  if (stage === 'pregnancy') {
    return getTrimesterFromWeek(week)
  }
  return stage
}
