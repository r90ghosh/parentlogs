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
      <div className="flex items-center justify-between text-xs text-surface-400">
        <span className="font-medium">Budget by Phase</span>
        <span className="italic text-surface-500">Median prices shown</span>
      </div>

      {/* Timeline Bar - Glassmorphism container */}
      <div className="relative">
        <div className="flex h-14 rounded-xl overflow-hidden backdrop-blur-md bg-white/[0.03] border border-white/10 shadow-lg shadow-black/20">
          {BUDGET_TIMELINE_CATEGORIES.map((category, index) => {
            const stat = stats[category.id]
            const isSelected = selectedCategory === category.id
            const isCurrent = currentCategory === category.id
            const hasNoItems = stat.itemCount === 0
            const isFirst = index === 0
            const isLast = index === BUDGET_TIMELINE_CATEGORIES.length - 1

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
                  "relative flex-1 flex flex-col items-center justify-center transition-all duration-200",
                  "border-r border-white/[0.06] last:border-r-0",
                  "backdrop-blur-sm",
                  hasNoItems ? "cursor-default opacity-60" : "hover:bg-white/[0.08] cursor-pointer",
                  isSelected && "ring-1 ring-white/60 ring-inset z-10 bg-white/[0.12]",
                  isCurrent && !isSelected && "ring-1 ring-accent-400/50 ring-inset",
                  isFirst && "rounded-l-xl",
                  isLast && "rounded-r-xl"
                )}
                style={{
                  backgroundColor: hasNoItems ? undefined : category.color,
                }}
                title={`${category.label}: ${stat.itemCount} items, ${formatBudgetPrice(stat.medianTotal)}`}
              >
                <span className={cn(
                  "text-sm font-semibold",
                  hasNoItems ? "text-white/40" : "text-white drop-shadow-sm"
                )}>
                  {formatBudgetPrice(stat.medianTotal)}
                </span>
                <span className={cn(
                  "text-[10px]",
                  hasNoItems ? "text-white/30" : "text-white/70"
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
          <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-l-transparent border-r-transparent border-b-accent-400" />
          <span className="text-[9px] text-accent-400 font-semibold mt-0.5 tracking-wide">NOW</span>
        </div>
      </div>

      {/* Legend with labels */}
      <div className="flex justify-between text-[10px] text-surface-500 px-0.5 mt-4">
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
                "flex-1 text-center transition-all py-1 rounded-md",
                stat.itemCount > 0 && "hover:bg-white/5 cursor-pointer",
                stat.itemCount === 0 && "opacity-40 cursor-default",
                isSelected && "bg-white/10 ring-1 ring-white/30 text-white",
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
            className="px-3 py-1 rounded-full text-white text-xs font-medium backdrop-blur-sm border border-white/20"
            style={{
              backgroundColor: BUDGET_TIMELINE_CATEGORIES.find(c => c.id === selectedCategory)?.color
            }}
          >
            {BUDGET_TIMELINE_CATEGORIES.find(c => c.id === selectedCategory)?.label} ({formatBudgetPrice(stats[selectedCategory].medianTotal)})
          </span>
          <button
            onClick={() => onCategoryClick(null)}
            className="text-accent-400 hover:text-accent-300 text-xs font-medium hover:underline transition-colors"
          >
            Show all
          </button>
        </div>
      )}

      {/* Total budget summary */}
      {!selectedCategory && (
        <div className="text-center text-xs text-surface-500">
          Total estimated budget: <span className="text-white/90 font-medium">{formatBudgetPrice(totalBudget)}</span> (median)
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
