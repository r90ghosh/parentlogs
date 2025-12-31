'use client'

import { cn } from '@/lib/utils'
import {
  BUDGET_TIMELINE_CATEGORIES,
  BudgetTimelineCategory,
  BudgetCategoryStats,
  formatBudgetPrice,
} from '@/lib/budget-timeline'

interface BudgetTimelineBarProps {
  stats: Record<BudgetTimelineCategory, BudgetCategoryStats>
  currentCategory: BudgetTimelineCategory
  selectedCategory: BudgetTimelineCategory | null
  onCategoryClick: (category: BudgetTimelineCategory | null) => void
}

export function BudgetTimelineBar({
  stats,
  currentCategory,
  selectedCategory,
  onCategoryClick,
}: BudgetTimelineBarProps) {
  const totalBudget = Object.values(stats).reduce((sum, s) => sum + s.medianTotal, 0)

  return (
    <div className="space-y-3">
      {/* Label */}
      <div className="flex items-center justify-between text-xs text-surface-500">
        <span>Budget by Stage</span>
        <span className="italic">Median prices shown</span>
      </div>

      {/* Timeline Bar */}
      <div className="relative">
        <div className="flex h-12 rounded-lg overflow-hidden border border-surface-700">
          {BUDGET_TIMELINE_CATEGORIES.map((category) => {
            const stat = stats[category.id]
            const isSelected = selectedCategory === category.id
            const isCurrent = currentCategory === category.id
            const hasNoItems = stat.itemCount === 0

            return (
              <button
                key={category.id}
                onClick={() => {
                  if (stat.itemCount > 0) {
                    onCategoryClick(isSelected ? null : category.id)
                  }
                }}
                disabled={hasNoItems}
                className={cn(
                  "relative flex-1 flex flex-col items-center justify-center transition-all border-r border-surface-700/50 last:border-r-0",
                  hasNoItems ? "cursor-default" : "hover:brightness-110 cursor-pointer",
                  isSelected && "ring-2 ring-white ring-inset z-10",
                  isCurrent && !isSelected && "ring-2 ring-accent-400 ring-inset"
                )}
                style={{
                  backgroundColor: hasNoItems ? `${category.color}40` : category.color,
                }}
                title={`${category.label}: ${stat.itemCount} items, ${formatBudgetPrice(stat.medianTotal)}`}
              >
                <span className={cn(
                  "text-sm font-bold drop-shadow-sm",
                  hasNoItems ? "text-white/50" : "text-white"
                )}>
                  {formatBudgetPrice(stat.medianTotal)}
                </span>
                <span className={cn(
                  "text-[10px] drop-shadow-sm",
                  hasNoItems ? "text-white/40" : "text-white/80"
                )}>
                  {stat.itemCount} {stat.itemCount === 1 ? 'item' : 'items'}
                </span>
              </button>
            )
          })}
        </div>

        {/* Current stage indicator */}
        <div
          className="absolute -bottom-3 flex flex-col items-center"
          style={{
            left: `${getCategoryCenter(currentCategory)}%`,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-accent-500" />
          <span className="text-[10px] text-accent-500 font-medium mt-0.5">NOW</span>
        </div>
      </div>

      {/* Legend with labels */}
      <div className="flex justify-between text-[10px] text-surface-500 px-1 mt-4">
        {BUDGET_TIMELINE_CATEGORIES.map((category) => {
          const stat = stats[category.id]
          const isSelected = selectedCategory === category.id
          const isCurrent = currentCategory === category.id

          return (
            <button
              key={category.id}
              onClick={() => {
                if (stat.itemCount > 0) {
                  onCategoryClick(isSelected ? null : category.id)
                }
              }}
              disabled={stat.itemCount === 0}
              className={cn(
                "flex-1 text-center transition-all py-1 rounded",
                stat.itemCount > 0 && "hover:bg-surface-800 cursor-pointer",
                stat.itemCount === 0 && "opacity-50 cursor-default",
                isSelected && "bg-surface-700 ring-1 ring-white",
                isCurrent && !isSelected && "text-accent-400"
              )}
            >
              <div className="truncate px-0.5">{category.label}</div>
            </button>
          )
        })}
      </div>

      {/* Selected filter indicator */}
      {selectedCategory && (
        <div className="flex items-center justify-center gap-2 text-sm text-surface-400 pt-1">
          <span>Showing:</span>
          <span
            className="px-2 py-0.5 rounded text-white text-xs font-medium"
            style={{
              backgroundColor: BUDGET_TIMELINE_CATEGORIES.find(c => c.id === selectedCategory)?.color
            }}
          >
            {BUDGET_TIMELINE_CATEGORIES.find(c => c.id === selectedCategory)?.label} ({formatBudgetPrice(stats[selectedCategory].medianTotal)})
          </span>
          <button
            onClick={() => onCategoryClick(null)}
            className="text-accent-500 hover:text-accent-400 text-xs underline"
          >
            Show all
          </button>
        </div>
      )}

      {/* Total budget summary */}
      {!selectedCategory && (
        <div className="text-center text-xs text-surface-500">
          Total estimated budget: <span className="text-white font-medium">{formatBudgetPrice(totalBudget)}</span> (median)
        </div>
      )}
    </div>
  )
}

function getCategoryCenter(category: BudgetTimelineCategory): number {
  const index = BUDGET_TIMELINE_CATEGORIES.findIndex(c => c.id === category)
  if (index === -1) return 50

  const segmentWidth = 100 / BUDGET_TIMELINE_CATEGORIES.length
  return (index * segmentWidth) + (segmentWidth / 2)
}
