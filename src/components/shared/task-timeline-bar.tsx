'use client'

import { cn } from '@/lib/utils'
import {
  TIMELINE_CATEGORIES,
  TimelineCategory,
} from '@/lib/task-timeline'

interface TaskTimelineBarProps {
  counts: Record<TimelineCategory, number>
  currentCategory: TimelineCategory
  selectedCategory: TimelineCategory | null
  onCategoryClick: (category: TimelineCategory | null) => void
}

export function TaskTimelineBar({
  counts,
  currentCategory,
  selectedCategory,
  onCategoryClick,
}: TaskTimelineBarProps) {
  const totalTasks = Object.values(counts).reduce((sum, count) => sum + count, 0)

  return (
    <div className="space-y-3">
      {/* Timeline Bar - Shows ALL categories */}
      <div className="relative">
        <div className="flex h-10 rounded-lg overflow-hidden border border-surface-700">
          {TIMELINE_CATEGORIES.map((category) => {
            const count = counts[category.id] || 0
            const isSelected = selectedCategory === category.id
            const isCurrent = currentCategory === category.id
            const hasNoTasks = count === 0

            return (
              <button
                key={category.id}
                onClick={() => {
                  if (count > 0) {
                    onCategoryClick(isSelected ? null : category.id)
                  }
                }}
                disabled={hasNoTasks}
                className={cn(
                  "relative flex-1 flex flex-col items-center justify-center transition-all border-r border-surface-700/50 last:border-r-0",
                  hasNoTasks ? "cursor-default" : "hover:brightness-110 cursor-pointer",
                  isSelected && "ring-2 ring-white ring-inset z-10",
                  isCurrent && !isSelected && "ring-2 ring-accent-400 ring-inset"
                )}
                style={{
                  backgroundColor: hasNoTasks ? `${category.color}40` : category.color,
                }}
                title={`${category.label}: ${count} tasks`}
              >
                <span className={cn(
                  "text-xs font-bold drop-shadow-sm",
                  hasNoTasks ? "text-white/50" : "text-white"
                )}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Current stage indicator - arrow pointing up */}
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
        {TIMELINE_CATEGORIES.map((category) => {
          const count = counts[category.id] || 0
          const isSelected = selectedCategory === category.id
          const isCurrent = currentCategory === category.id

          return (
            <button
              key={category.id}
              onClick={() => {
                if (count > 0) {
                  onCategoryClick(isSelected ? null : category.id)
                }
              }}
              disabled={count === 0}
              className={cn(
                "flex-1 text-center transition-all py-1 rounded",
                count > 0 && "hover:bg-surface-800 cursor-pointer",
                count === 0 && "opacity-50 cursor-default",
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
          <span>Filtered:</span>
          <span
            className="px-2 py-0.5 rounded text-white text-xs font-medium"
            style={{
              backgroundColor: TIMELINE_CATEGORIES.find(c => c.id === selectedCategory)?.color
            }}
          >
            {TIMELINE_CATEGORIES.find(c => c.id === selectedCategory)?.label} ({counts[selectedCategory]} tasks)
          </span>
          <button
            onClick={() => onCategoryClick(null)}
            className="text-accent-500 hover:text-accent-400 text-xs underline"
          >
            Show all
          </button>
        </div>
      )}

      {/* Total tasks summary */}
      {!selectedCategory && (
        <div className="text-center text-xs text-surface-500">
          {totalTasks} total tasks across your journey
        </div>
      )}
    </div>
  )
}

function getCategoryCenter(category: TimelineCategory): number {
  const index = TIMELINE_CATEGORIES.findIndex(c => c.id === category)
  if (index === -1) return 50

  const segmentWidth = 100 / TIMELINE_CATEGORIES.length
  return (index * segmentWidth) + (segmentWidth / 2)
}
