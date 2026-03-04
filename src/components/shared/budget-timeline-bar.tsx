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
      <div className="flex items-center justify-between text-xs text-[--muted]">
        <span className="font-medium font-ui">Budget by Phase</span>
        <span className="italic text-[--dim] font-body">Median prices shown</span>
      </div>

      {/* Timeline Bar - Glassmorphism container with horizontal scroll on mobile */}
      <div className="relative overflow-x-auto overflow-y-hidden -mx-4 px-4 md:mx-0 md:px-0 md:overflow-visible" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="flex h-14 rounded-xl overflow-hidden backdrop-blur-md bg-white/[0.03] border border-[--border] shadow-lg shadow-black/20 min-w-[500px] md:min-w-0">
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
                  isCurrent && !isSelected && "ring-1 ring-copper/50 ring-inset",
                  isFirst && "rounded-l-xl",
                  isLast && "rounded-r-xl"
                )}
                style={{
                  backgroundColor: hasNoItems ? undefined : category.color,
                }}
                title={`${category.label}: ${stat.itemCount} items, ${formatBudgetPrice(stat.medianTotal)}`}
              >
                <span className={cn(
                  "text-sm font-semibold tabular-nums font-ui",
                  hasNoItems ? "text-white/40" : "text-white drop-shadow-sm"
                )}>
                  {formatBudgetPrice(stat.medianTotal)}
                </span>
                <span className={cn(
                  "text-[10px] font-ui",
                  hasNoItems ? "text-white/30" : "text-white/70"
                )}>
                  {stat.itemCount} {stat.itemCount === 1 ? 'item' : 'items'}
                </span>
              </button>
            )
          })}
        </div>

        {/* Current stage indicator - hidden on mobile scroll */}
        <div
          className="absolute -bottom-3 flex-col items-center hidden md:flex"
          style={{
            left: `${getCategoryCenter(currentCategory)}%`,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-l-transparent border-r-transparent border-b-copper" />
          <span className="text-[9px] text-copper font-semibold mt-0.5 tracking-wide font-ui">NOW</span>
        </div>
      </div>

      {/* Legend with labels - horizontally scrollable on mobile */}
      <div className="flex text-[10px] text-[--dim] px-0.5 mt-4 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0.5 md:overflow-visible md:justify-between" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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
                "flex-shrink-0 min-w-[80px] md:min-w-0 md:flex-1 text-center transition-all py-1 px-2 md:px-0.5 rounded-md font-ui",
                stat.itemCount > 0 && "hover:bg-white/5 cursor-pointer",
                stat.itemCount === 0 && "opacity-40 cursor-default",
                isSelected && "bg-white/10 ring-1 ring-white/30 text-[--cream]",
                isCurrent && !isSelected && "text-copper"
              )}
            >
              <div className="truncate">{category.label}</div>
            </button>
          )
        })}
      </div>

      {/* Selected filter indicator */}
      {selectedCategory && (
        <div className="flex items-center justify-center gap-2 text-sm text-[--muted] pt-1">
          <span className="font-body">Showing:</span>
          <span
            className="px-3 py-1 rounded-full text-white text-xs font-medium backdrop-blur-sm border border-white/20 font-ui"
            style={{
              backgroundColor: BUDGET_TIMELINE_CATEGORIES.find(c => c.id === selectedCategory)?.color
            }}
          >
            {BUDGET_TIMELINE_CATEGORIES.find(c => c.id === selectedCategory)?.label} ({formatBudgetPrice(stats[selectedCategory].medianTotal)})
          </span>
          <button
            onClick={() => onCategoryClick(null)}
            className="text-copper hover:text-copper/80 text-xs font-medium hover:underline transition-colors font-ui"
          >
            Show all
          </button>
        </div>
      )}

      {/* Total budget summary */}
      {!selectedCategory && (
        <div className="text-center text-xs text-[--dim] font-body">
          Total estimated budget: <span className="text-[--cream] font-medium tabular-nums">{formatBudgetPrice(totalBudget)}</span> (median)
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
