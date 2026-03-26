'use client'

import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  TIMELINE_CATEGORIES,
  TimelineCategory,
  ChecklistCategoryStats,
} from '@tdc/shared/utils'

// Short pill labels for each category
const PILL_LABELS: Record<TimelineCategory, string> = {
  'first-trimester': 'Trimester 1',
  'second-trimester': 'Trimester 2',
  'third-trimester': 'Trimester 3',
  'delivery': 'Delivery',
  '0-3 months': '0-3 Months',
  '3-6 months': '3-6 Months',
  '6-12 months': '6-12 Months',
  '12-18 months': '12-18 Months',
  '18-24 months': '18+ Months',
}

interface ChecklistTimelineBarProps {
  stats: Record<TimelineCategory, ChecklistCategoryStats>
  currentCategory: TimelineCategory
  selectedCategory: TimelineCategory | null
  onCategoryClick: (category: TimelineCategory | null) => void
}

export function ChecklistTimelineBar({
  stats,
  currentCategory,
  selectedCategory,
  onCategoryClick,
}: ChecklistTimelineBarProps) {
  const currentIndex = TIMELINE_CATEGORIES.findIndex(c => c.id === currentCategory)

  const canGoPrev = currentIndex > 0
  const canGoNext = currentIndex < TIMELINE_CATEGORIES.length - 1

  const handleNav = (direction: -1 | 1) => {
    const targetIndex = currentIndex + direction
    if (targetIndex >= 0 && targetIndex < TIMELINE_CATEGORIES.length) {
      const targetId = TIMELINE_CATEGORIES[targetIndex].id
      onCategoryClick(targetId)
    }
  }

  // Active category stats (selected or current)
  const activeId = selectedCategory || currentCategory
  const activeStat = stats[activeId]
  const activeInfo = TIMELINE_CATEGORIES.find(c => c.id === activeId)

  const totalStats = Object.values(stats).reduce(
    (sum, stat) => ({
      checklistCount: sum.checklistCount + stat.checklistCount,
      totalItems: sum.totalItems + stat.totalItems,
      completedItems: sum.completedItems + stat.completedItems,
    }),
    { checklistCount: 0, totalItems: 0, completedItems: 0 }
  )

  return (
    <div className="space-y-3">
      {/* Label */}
      <div className="flex items-center justify-between text-xs text-[--muted]">
        <span className="font-ui font-medium">Checklists by Phase</span>
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
          {TIMELINE_CATEGORIES.map((category) => {
            const stat = stats[category.id]
            const isSelected = selectedCategory === category.id
            const isCurrent = currentCategory === category.id
            const hasNoChecklists = stat.checklistCount === 0

            return (
              <button
                key={category.id}
                onClick={() => {
                  if (stat.checklistCount > 0) {
                    onCategoryClick(isSelected ? null : category.id)
                  }
                }}
                disabled={hasNoChecklists}
                title={`${category.label}: ${stat.checklistCount} checklists`}
                className={cn(
                  'flex-shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-medium font-ui transition-all whitespace-nowrap',
                  hasNoChecklists && 'opacity-30 cursor-default',
                  !hasNoChecklists && !isSelected && !isCurrent && 'text-[--muted] hover:bg-[--card] hover:text-[--cream]',
                  isCurrent && !isSelected && 'bg-copper/20 text-copper',
                  isSelected && 'bg-copper text-[--white]',
                )}
              >
                {PILL_LABELS[category.id]}
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
              <span className="text-[--cream] font-medium">{activeStat.completedItems}</span>/{activeStat.totalItems} items done across {activeStat.checklistCount} checklists
            </span>
          </>
        ) : (
          <span>
            <span className="text-[--cream] font-medium">{totalStats.completedItems}</span>/{totalStats.totalItems} items across {totalStats.checklistCount} checklists
          </span>
        )}
      </div>
    </div>
  )
}
