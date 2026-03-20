'use client'

import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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
  const currentIndex = BUDGET_TIMELINE_CATEGORIES.findIndex(c => c.id === currentCategory)

  const canGoPrev = currentIndex > 0
  const canGoNext = currentIndex < BUDGET_TIMELINE_CATEGORIES.length - 1

  const handleNav = (direction: -1 | 1) => {
    const targetIndex = currentIndex + direction
    if (targetIndex >= 0 && targetIndex < BUDGET_TIMELINE_CATEGORIES.length) {
      const targetId = BUDGET_TIMELINE_CATEGORIES[targetIndex].id
      onCategoryClick(targetId)
    }
  }

  // Active category stats (selected or current)
  const activeId = selectedCategory || currentCategory
  const activeStat = stats[activeId]
  const activeInfo = BUDGET_TIMELINE_CATEGORIES.find(c => c.id === activeId)

  const totalMin = Object.values(stats).reduce((sum, s) => sum + s.totalMin, 0)
  const totalMax = Object.values(stats).reduce((sum, s) => sum + s.totalMax, 0)
  const totalItems = Object.values(stats).reduce((sum, s) => sum + s.itemCount, 0)

  return (
    <div className="space-y-3">
      {/* Label */}
      <div className="flex items-center justify-between text-xs text-[--muted]">
        <span className="font-medium font-ui">Budget by Phase</span>
        {selectedCategory && (
          <button
            onClick={() => onCategoryClick(null)}
            className="text-copper hover:text-copper/80 text-xs font-ui font-medium hover:underline transition-colors"
          >
            Show all
          </button>
        )}
      </div>

      {/* Pill Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => handleNav(-1)}
          disabled={!canGoPrev}
          className={cn(
            'hidden md:flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm font-ui text-[--muted] transition-colors',
            canGoPrev ? 'hover:bg-[--card] hover:text-[--cream]' : 'opacity-30 cursor-not-allowed'
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-1.5 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 flex-1 min-w-0" style={{ scrollbarWidth: 'none' }}>
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
                title={`${category.label}: ${stat.itemCount} items, ${formatBudgetPrice(stat.totalMin)}-${formatBudgetPrice(stat.totalMax)}`}
                className={cn(
                  'flex-shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-medium font-ui transition-all whitespace-nowrap',
                  hasNoItems && 'opacity-30 cursor-default',
                  !hasNoItems && !isSelected && !isCurrent && 'text-[--muted] hover:bg-[--card] hover:text-[--cream]',
                  isCurrent && !isSelected && 'bg-copper/20 text-copper',
                  isSelected && 'bg-copper text-[--white]',
                )}
              >
                {category.label}
              </button>
            )
          })}
        </div>

        <button
          onClick={() => handleNav(1)}
          disabled={!canGoNext}
          className={cn(
            'hidden md:flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm font-ui text-[--muted] transition-colors',
            canGoNext ? 'hover:bg-[--card] hover:text-[--cream]' : 'opacity-30 cursor-not-allowed'
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Active phase summary */}
      <div className="flex items-center justify-center gap-3 text-xs text-[--muted] font-ui">
        {selectedCategory ? (
          <>
            <span className="inline-flex items-center gap-1.5 bg-copper-dim text-copper px-2.5 py-1 rounded-full text-xs font-semibold">
              {activeInfo?.label}
            </span>
            <span>
              <span className="text-[--cream] font-medium">
                {formatBudgetPrice(activeStat.totalMin)}-{formatBudgetPrice(activeStat.totalMax)}
              </span>
              {' '}&middot; {activeStat.itemCount} {activeStat.itemCount === 1 ? 'item' : 'items'}
            </span>
          </>
        ) : (
          <span>
            Est. total: <span className="text-[--cream] font-medium">{formatBudgetPrice(totalMin)}-{formatBudgetPrice(totalMax)}</span> &middot; {totalItems} items
          </span>
        )}
      </div>
    </div>
  )
}
