'use client'

import { cn } from '@/lib/utils'
import {
  TIMELINE_CATEGORIES,
  TimelineCategory,
  TaskCategoryStats,
} from '@/lib/task-timeline'

interface TaskTimelineBarProps {
  stats: Record<TimelineCategory, TaskCategoryStats>
  currentCategory: TimelineCategory
  selectedCategory: TimelineCategory | null
  onCategoryClick: (category: TimelineCategory | null) => void
}

export function TaskTimelineBar({
  stats,
  currentCategory,
  selectedCategory,
  onCategoryClick,
}: TaskTimelineBarProps) {
  const totalStats = Object.values(stats).reduce(
    (sum, stat) => ({
      total: sum.total + stat.total,
      completed: sum.completed + stat.completed,
      pending: sum.pending + stat.pending,
    }),
    { total: 0, completed: 0, pending: 0 }
  )

  return (
    <div className="space-y-3">
      {/* Label */}
      <div className="flex items-center justify-between text-xs text-surface-400">
        <span className="font-medium">Tasks by Phase</span>
        <span className="italic text-surface-500">Click to filter</span>
      </div>

      {/* Timeline Bar - Glassmorphism container */}
      <div className="relative">
        <div className="flex h-14 rounded-xl overflow-hidden backdrop-blur-md bg-white/[0.03] border border-white/10 shadow-lg shadow-black/20">
          {TIMELINE_CATEGORIES.map((category, index) => {
            const stat = stats[category.id]
            const isSelected = selectedCategory === category.id
            const isCurrent = currentCategory === category.id
            const hasNoTasks = stat.total === 0
            const isFirst = index === 0
            const isLast = index === TIMELINE_CATEGORIES.length - 1

            return (
              <button
                key={category.id}
                onClick={() => {
                  if (stat.total > 0) {
                    onCategoryClick(isSelected ? null : category.id)
                  }
                }}
                disabled={hasNoTasks}
                className={cn(
                  "relative flex-1 flex flex-col items-center justify-center transition-all duration-200",
                  "border-r border-white/[0.06] last:border-r-0",
                  "backdrop-blur-sm",
                  hasNoTasks ? "cursor-default opacity-60" : "hover:bg-white/[0.08] cursor-pointer",
                  isSelected && "ring-1 ring-white/60 ring-inset z-10 bg-white/[0.12]",
                  isCurrent && !isSelected && "ring-1 ring-accent-400/50 ring-inset",
                  isFirst && "rounded-l-xl",
                  isLast && "rounded-r-xl"
                )}
                style={{
                  backgroundColor: hasNoTasks ? undefined : category.color,
                }}
                title={`${category.label}: ${stat.completed}/${stat.total} tasks completed`}
              >
                <span className={cn(
                  "text-sm font-semibold",
                  hasNoTasks ? "text-white/40" : "text-white drop-shadow-sm"
                )}>
                  {stat.total}
                </span>
                <span className={cn(
                  "text-[10px]",
                  hasNoTasks ? "text-white/30" : "text-white/70"
                )}>
                  {stat.completed}/{stat.total}
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
        {TIMELINE_CATEGORIES.map((category) => {
          const stat = stats[category.id]
          const isSelected = selectedCategory === category.id
          const isCurrent = currentCategory === category.id

          return (
            <button
              key={category.id}
              onClick={() => {
                if (stat.total > 0) {
                  onCategoryClick(isSelected ? null : category.id)
                }
              }}
              disabled={stat.total === 0}
              className={cn(
                "flex-1 text-center transition-all py-1 rounded-md",
                stat.total > 0 && "hover:bg-white/5 cursor-pointer",
                stat.total === 0 && "opacity-40 cursor-default",
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
              backgroundColor: TIMELINE_CATEGORIES.find(c => c.id === selectedCategory)?.color
            }}
          >
            {TIMELINE_CATEGORIES.find(c => c.id === selectedCategory)?.label} ({stats[selectedCategory].completed}/{stats[selectedCategory].total} done)
          </span>
          <button
            onClick={() => onCategoryClick(null)}
            className="text-accent-400 hover:text-accent-300 text-xs font-medium hover:underline transition-colors"
          >
            Show all
          </button>
        </div>
      )}

      {/* Total tasks summary */}
      {!selectedCategory && (
        <div className="text-center text-xs text-surface-500">
          Total: <span className="text-white/90 font-medium">{totalStats.completed}/{totalStats.total}</span> tasks completed
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
