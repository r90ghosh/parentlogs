import { BudgetTemplate, Family } from '@/types'

export type BudgetTimelineCategory =
  | 'pregnancy'
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
  { id: 'pregnancy', label: 'Pregnancy', color: '#7d5a6a' },
  { id: 'delivery', label: 'Delivery', color: '#8b4d5c' },
  { id: '0-3 months', label: '0-3 mo', color: '#6b5270' },
  { id: '3-6 months', label: '3-6 mo', color: '#5c5680' },
  { id: '6-12 months', label: '6-12 mo', color: '#4d5a87' },
  { id: '12-18 months', label: '12-18 mo', color: '#4a6085' },
  { id: '18-24 months', label: '18-24 mo', color: '#4b6580' },
]

/**
 * Get the timeline category for a budget item based on its week range
 */
export function getBudgetTimelineCategory(
  template: BudgetTemplate
): BudgetTimelineCategory {
  const { stage, week_end } = template

  if (stage === 'pregnancy') {
    // Pregnancy stage items
    if (week_end <= 28) return 'pregnancy'
    return 'delivery' // Week 29-42 is close to delivery
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

  if (stage === 'pregnancy') {
    if (current_week <= 28) return 'pregnancy'
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
  templates: BudgetTemplate[]
): Record<BudgetTimelineCategory, BudgetCategoryStats> {
  const stats: Record<BudgetTimelineCategory, BudgetCategoryStats> = {
    'pregnancy': { itemCount: 0, medianTotal: 0 },
    'delivery': { itemCount: 0, medianTotal: 0 },
    '0-3 months': { itemCount: 0, medianTotal: 0 },
    '3-6 months': { itemCount: 0, medianTotal: 0 },
    '6-12 months': { itemCount: 0, medianTotal: 0 },
    '12-18 months': { itemCount: 0, medianTotal: 0 },
    '18-24 months': { itemCount: 0, medianTotal: 0 },
  }

  templates.forEach(template => {
    const category = getBudgetTimelineCategory(template)
    stats[category].itemCount++
    stats[category].medianTotal += template.price_mid
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
