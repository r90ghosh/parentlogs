import { BudgetTemplate, BudgetPeriod, Family } from '@/types'
import { isPregnancyStage } from './pregnancy-utils'

/** Shared shape for anything that provides stage/week context (Family or Baby) */
type BudgetSource = Pick<Family, 'stage' | 'current_week'>

export type BudgetTimelineCategory = BudgetPeriod

export interface BudgetTimelineCategoryInfo {
  id: BudgetTimelineCategory
  label: string
  color: string
}

export const BUDGET_TIMELINE_CATEGORIES: BudgetTimelineCategoryInfo[] = [
  // Pregnancy phases - warm rose/blush tones
  { id: '1st Trimester', label: 'Trimester 1', color: 'rgba(244, 163, 177, 0.35)' },
  { id: '2nd Trimester', label: 'Trimester 2', color: 'rgba(236, 132, 155, 0.4)' },
  { id: '3rd Trimester', label: 'Trimester 3', color: 'rgba(219, 112, 147, 0.45)' },
  // Post-birth phases - cool violet/indigo tones
  { id: '0-3 Months', label: '0-3 mo', color: 'rgba(167, 139, 250, 0.4)' },
  { id: '3-6 Months', label: '3-6 mo', color: 'rgba(139, 128, 245, 0.42)' },
  { id: '6-12 Months', label: '6-12 mo', color: 'rgba(115, 137, 245, 0.44)' },
  { id: '12+ Months', label: '12+ mo', color: 'rgba(99, 149, 238, 0.46)' },
]

/**
 * Get the timeline category for a budget item — just returns its period
 */
export function getBudgetTimelineCategory(
  template: BudgetTemplate
): BudgetTimelineCategory {
  return template.period
}

/**
 * Get the current budget timeline category based on family stage and week
 */
export function getCurrentBudgetCategory(source: BudgetSource): BudgetTimelineCategory {
  const { stage, current_week } = source

  if (isPregnancyStage(stage)) {
    if (stage === 'first-trimester' || (stage === 'pregnancy' && current_week <= 13)) {
      return '1st Trimester'
    }
    if (stage === 'second-trimester' || (stage === 'pregnancy' && current_week <= 27)) {
      return '2nd Trimester'
    }
    return '3rd Trimester'
  }

  // Post-birth
  if (current_week <= 12) return '0-3 Months'
  if (current_week <= 24) return '3-6 Months'
  if (current_week <= 52) return '6-12 Months'
  return '12+ Months'
}

export interface BudgetCategoryStats {
  itemCount: number
  totalMin: number // in cents
  totalMax: number // in cents
}

/**
 * Get budget stats by timeline category (excludes tip items from totals)
 */
export function getBudgetStatsByCategory(
  templates: BudgetTemplate[]
): Record<BudgetTimelineCategory, BudgetCategoryStats> {
  const stats: Record<BudgetTimelineCategory, BudgetCategoryStats> = {
    '1st Trimester': { itemCount: 0, totalMin: 0, totalMax: 0 },
    '2nd Trimester': { itemCount: 0, totalMin: 0, totalMax: 0 },
    '3rd Trimester': { itemCount: 0, totalMin: 0, totalMax: 0 },
    '0-3 Months': { itemCount: 0, totalMin: 0, totalMax: 0 },
    '3-6 Months': { itemCount: 0, totalMin: 0, totalMax: 0 },
    '6-12 Months': { itemCount: 0, totalMin: 0, totalMax: 0 },
    '12+ Months': { itemCount: 0, totalMin: 0, totalMax: 0 },
  }

  templates.forEach(template => {
    const category = getBudgetTimelineCategory(template)
    stats[category].itemCount++
    // Exclude tip items from totals
    if (template.priority !== 'tip') {
      stats[category].totalMin += template.price_min || 0
      stats[category].totalMax += template.price_max || 0
    }
  })

  return stats
}

/**
 * Format price in dollars from cents
 */
export function formatBudgetPrice(cents: number): string {
  if (cents >= 100000) {
    return `$${(cents / 100000).toFixed(1)}k`
  }
  return `$${Math.round(cents / 100)}`
}
