import { FamilyStage, BudgetPeriod } from '@tdc/shared/types'
import { ContentPhase } from '@tdc/shared/types/dad-journey'
import { TimelineCategory } from '@/lib/task-timeline'
import { isPregnancyStage } from '@/lib/pregnancy-utils'

/**
 * Canonical stage mapping — single source of truth for converting between
 * FamilyStage, ContentPhase, BudgetPeriod, TimelineCategory, and display labels.
 */

// ---------------------------------------------------------------------------
// Display labels
// ---------------------------------------------------------------------------

export const STAGE_DISPLAY_LABELS: Record<string, string> = {
  // FamilyStage
  'first-trimester': 'Trimester 1',
  'second-trimester': 'Trimester 2',
  'third-trimester': 'Trimester 3',
  'pregnancy': 'Pregnancy',
  'post-birth': 'Post-Birth',
  // TimelineCategory extras
  'delivery': 'Delivery',
  '0-3 months': '0-3 Months',
  '3-6 months': '3-6 Months',
  '6-12 months': '6-12 Months',
  '12-18 months': '12-18 Months',
  '18-24 months': '18-24 Months',
}

// ---------------------------------------------------------------------------
// ContentPhase <-> FamilyStage
// ---------------------------------------------------------------------------

/** Map a ContentPhase to the corresponding FamilyStage (trimester-level). */
export function contentPhaseToFamilyStage(phase: ContentPhase): FamilyStage {
  switch (phase) {
    case 'pre-pregnancy': return 'pregnancy'
    case 'trimester-1': return 'first-trimester'
    case 'trimester-2': return 'second-trimester'
    case 'trimester-3': return 'third-trimester'
    default: return 'post-birth' // 0-3-months through 18-plus
  }
}

/** Derive ContentPhase from a FamilyStage + current week number. */
export function familyStageToContentPhase(stage: FamilyStage, currentWeek: number): ContentPhase {
  if (isPregnancyStage(stage)) {
    if (currentWeek <= 13) return 'trimester-1'
    if (currentWeek <= 27) return 'trimester-2'
    return 'trimester-3'
  }

  // Post-birth (currentWeek = weeks since birth)
  if (currentWeek <= 13) return '0-3-months'
  if (currentWeek <= 26) return '3-6-months'
  if (currentWeek <= 52) return '6-12-months'
  if (currentWeek <= 78) return '12-18-months'
  return '18-plus'
}

// ---------------------------------------------------------------------------
// ContentPhase <-> BudgetPeriod
// ---------------------------------------------------------------------------

const CONTENT_PHASE_TO_BUDGET: Record<ContentPhase, BudgetPeriod> = {
  'pre-pregnancy': '1st Trimester',
  'trimester-1': '1st Trimester',
  'trimester-2': '2nd Trimester',
  'trimester-3': '3rd Trimester',
  '0-3-months': '0-3 Months',
  '3-6-months': '3-6 Months',
  '6-12-months': '6-12 Months',
  '12-18-months': '12+ Months',
  '18-plus': '12+ Months',
}

/** Map a ContentPhase to its BudgetPeriod. */
export function contentPhaseToBudgetPeriod(phase: ContentPhase): BudgetPeriod {
  return CONTENT_PHASE_TO_BUDGET[phase]
}

const BUDGET_TO_CONTENT_PHASE: Record<BudgetPeriod, ContentPhase> = {
  '1st Trimester': 'trimester-1',
  '2nd Trimester': 'trimester-2',
  '3rd Trimester': 'trimester-3',
  '0-3 Months': '0-3-months',
  '3-6 Months': '3-6-months',
  '6-12 Months': '6-12-months',
  '12+ Months': '12-18-months',
}

/** Map a BudgetPeriod to the closest ContentPhase. */
export function budgetPeriodToContentPhase(period: BudgetPeriod): ContentPhase {
  return BUDGET_TO_CONTENT_PHASE[period]
}

// ---------------------------------------------------------------------------
// TimelineCategory <-> ContentPhase
// ---------------------------------------------------------------------------

const TIMELINE_TO_CONTENT_PHASE: Partial<Record<TimelineCategory, ContentPhase>> = {
  'first-trimester': 'trimester-1',
  'second-trimester': 'trimester-2',
  'third-trimester': 'trimester-3',
  '0-3 months': '0-3-months',
  '3-6 months': '3-6-months',
  '6-12 months': '6-12-months',
  '12-18 months': '12-18-months',
  '18-24 months': '18-plus',
}

/** Map a TimelineCategory to a ContentPhase (null for 'delivery' which has no content phase). */
export function timelineCategoryToContentPhase(cat: TimelineCategory): ContentPhase | null {
  return TIMELINE_TO_CONTENT_PHASE[cat] ?? null
}

// ---------------------------------------------------------------------------
// FamilyStage -> BudgetPeriod (convenience shortcut)
// ---------------------------------------------------------------------------

/** Derive BudgetPeriod directly from a FamilyStage + week, going through ContentPhase internally. */
export function familyStageToBudgetPeriod(stage: FamilyStage, currentWeek: number): BudgetPeriod {
  return contentPhaseToBudgetPeriod(familyStageToContentPhase(stage, currentWeek))
}
