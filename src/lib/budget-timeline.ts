import { BudgetTemplate, Family } from '@/types'
import { isPregnancyStage } from './pregnancy-utils'

export type BudgetTimelineCategory =
  | 'first-trimester'
  | 'second-trimester'
  | 'third-trimester'
  | 'delivery'
  | '0-3 months'
  | '3-6 months'
  | '6-12 months'
  | '12-18 months'
  | '18-24 months'

export interface BudgetTimelineCategoryInfo {
  id: BudgetTimelineCategory
  label: string
  color: string
}

export const BUDGET_TIMELINE_CATEGORIES: BudgetTimelineCategoryInfo[] = [
  // Pregnancy phases - warm rose/blush tones (subtle gradient from light to deeper)
  { id: 'first-trimester', label: 'Trimester 1', color: 'rgba(244, 163, 177, 0.35)' },
  { id: 'second-trimester', label: 'Trimester 2', color: 'rgba(236, 132, 155, 0.4)' },
  { id: 'third-trimester', label: 'Trimester 3', color: 'rgba(219, 112, 147, 0.45)' },
  { id: 'delivery', label: 'Delivery', color: 'rgba(199, 95, 138, 0.5)' },
  // Post-birth phases - cool violet/indigo tones (elegant transition)
  { id: '0-3 months', label: '0-3 mo', color: 'rgba(167, 139, 250, 0.4)' },
  { id: '3-6 months', label: '3-6 mo', color: 'rgba(139, 128, 245, 0.42)' },
  { id: '6-12 months', label: '6-12 mo', color: 'rgba(115, 137, 245, 0.44)' },
  { id: '12-18 months', label: '12-18 mo', color: 'rgba(99, 149, 238, 0.46)' },
  { id: '18-24 months', label: '18-24 mo', color: 'rgba(96, 165, 230, 0.48)' },
]

/**
 * Get the timeline category for a budget item based on its week range
 */
export function getBudgetTimelineCategory(
  template: BudgetTemplate
): BudgetTimelineCategory {
  const { stage, week_end } = template

  if (isPregnancyStage(stage)) {
    // Handle trimester stages - check week_end for delivery categorization
    if (stage === 'first-trimester') return 'first-trimester'
    if (stage === 'second-trimester') return 'second-trimester'
    if (stage === 'third-trimester') {
      // Items due close to delivery (week 39+) go in delivery bucket
      if (week_end >= 39) return 'delivery'
      return 'third-trimester'
    }

    // Legacy 'pregnancy' stage - determine by week_end
    if (week_end <= 13) return 'first-trimester'
    if (week_end <= 27) return 'second-trimester'
    if (week_end <= 38) return 'third-trimester'
    return 'delivery' // Week 39-42 is close to delivery
  } else {
    // Post-birth stage items
    if (week_end <= 12) return '0-3 months'
    if (week_end <= 24) return '3-6 months'
    if (week_end <= 52) return '6-12 months'
    if (week_end <= 78) return '12-18 months'
    return '18-24 months'
  }
}

/**
 * Get the current budget timeline category based on family stage and week
 */
export function getCurrentBudgetCategory(family: Family): BudgetTimelineCategory {
  const { stage, current_week } = family

  if (isPregnancyStage(stage)) {
    // Handle trimester stages directly
    if (stage === 'first-trimester') return 'first-trimester'
    if (stage === 'second-trimester') return 'second-trimester'
    if (stage === 'third-trimester') {
      // Check if close to delivery
      if (current_week >= 39) return 'delivery'
      return 'third-trimester'
    }

    // Legacy 'pregnancy' stage - determine by week
    if (current_week <= 13) return 'first-trimester'
    if (current_week <= 27) return 'second-trimester'
    if (current_week <= 38) return 'third-trimester'
    return 'delivery'
  } else {
    if (current_week <= 12) return '0-3 months'
    if (current_week <= 24) return '3-6 months'
    if (current_week <= 52) return '6-12 months'
    if (current_week <= 78) return '12-18 months'
    return '18-24 months'
  }
}

export interface BudgetCategoryStats {
  itemCount: number
  medianTotal: number // in cents
}

/**
 * Get budget stats by timeline category
 */
export function getBudgetStatsByCategory(
  templates: BudgetTemplate[],
  tier: 'budget' | 'premium' = 'budget'
): Record<BudgetTimelineCategory, BudgetCategoryStats> {
  const stats: Record<BudgetTimelineCategory, BudgetCategoryStats> = {
    'first-trimester': { itemCount: 0, medianTotal: 0 },
    'second-trimester': { itemCount: 0, medianTotal: 0 },
    'third-trimester': { itemCount: 0, medianTotal: 0 },
    'delivery': { itemCount: 0, medianTotal: 0 },
    '0-3 months': { itemCount: 0, medianTotal: 0 },
    '3-6 months': { itemCount: 0, medianTotal: 0 },
    '6-12 months': { itemCount: 0, medianTotal: 0 },
    '12-18 months': { itemCount: 0, medianTotal: 0 },
    '18-24 months': { itemCount: 0, medianTotal: 0 },
  }

  // Filter out Admin items
  templates.filter(t => t.category !== 'Admin').forEach(template => {
    const category = getBudgetTimelineCategory(template)
    stats[category].itemCount++
    // Use tier-specific price
    stats[category].medianTotal += tier === 'budget' ? template.price_low : template.price_high
  })

  return stats
}

/**
 * Format price in dollars from cents
 */
export function formatBudgetPrice(cents: number): string {
  if (cents >= 100000) {
    // $1,000+ show as $X.Xk
    return `$${(cents / 100000).toFixed(1)}k`
  }
  return `$${Math.round(cents / 100)}`
}
