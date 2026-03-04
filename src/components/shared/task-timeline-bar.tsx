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
      <div className="flex items-center justify-between text-xs text-[--muted]">
        <span className="font-ui font-medium">Tasks by Phase</span>
        <span className="italic text-[--dim] font-body">Click to filter</span>
      </div>

      {/* Timeline Bar - warm glassmorphism container */}
      <div className="relative overflow-x-auto overflow-y-hidden -mx-4 px-4 md:mx-0 md:px-0 md:overflow-visible">
        <div className="flex h-14 rounded-xl overflow-hidden md:backdrop-blur-md bg-[--surface] border border-[--border] shadow-card min-w-[500px] md:min-w-0">
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
                  "border-r border-[--border] last:border-r-0",
                  hasNoTasks ? "cursor-default opacity-60" : "hover:bg-[--border-hover]/30 cursor-pointer",
                  isSelected && "ring-1 ring-[--cream]/40 ring-inset z-10 bg-[--cream]/10",
                  isCurrent && !isSelected && "ring-1 ring-copper/50 ring-inset",
                  isFirst && "rounded-l-xl",
                  isLast && "rounded-r-xl"
                )}
                style={{
                  backgroundColor: hasNoTasks ? undefined : category.color,
                }}
                title={`${category.label}: ${stat.completed}/${stat.total} tasks completed`}
              >
                <span className={cn(
                  "text-sm font-ui font-semibold",
                  hasNoTasks ? "text-[--cream]/40" : "text-white drop-shadow-sm"
                )}>
                  {stat.total}
                </span>
                <span className={cn(
                  "text-[10px] font-body",
                  hasNoTasks ? "text-[--cream]/30" : "text-white/70"
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
          <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-l-transparent border-r-transparent border-b-copper" />
          <span className="text-[9px] text-copper font-ui font-semibold mt-0.5 tracking-wide">NOW</span>
        </div>
      </div>

      {/* Legend with labels */}
      <div className="flex justify-between text-[10px] text-[--dim] font-body px-0.5 mt-4 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0.5 md:overflow-visible min-w-0">
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
                stat.total > 0 && "hover:bg-[--card] cursor-pointer",
                stat.total === 0 && "opacity-40 cursor-default",
                isSelected && "bg-[--card] ring-1 ring-[--border-hover] text-[--cream]",
                isCurrent && !isSelected && "text-copper"
              )}
            >
              <div className="truncate px-0.5">{category.label}</div>
            </button>
          )
        })}
      </div>

      {/* Selected filter indicator */}
      {selectedCategory && (
        <div className="flex items-center justify-center gap-2 text-sm text-[--muted] pt-1">
          <span className="font-body">Showing:</span>
          <span
            className="px-3 py-1 rounded-full text-white text-xs font-ui font-medium border border-[--border-hover]"
            style={{
              backgroundColor: TIMELINE_CATEGORIES.find(c => c.id === selectedCategory)?.color
            }}
          >
            {TIMELINE_CATEGORIES.find(c => c.id === selectedCategory)?.label} ({stats[selectedCategory].completed}/{stats[selectedCategory].total} done)
          </span>
          <button
            onClick={() => onCategoryClick(null)}
            className="text-copper hover:text-copper-hover text-xs font-ui font-medium hover:underline transition-colors"
          >
            Show all
          </button>
        </div>
      )}

      {/* Total tasks summary */}
      {!selectedCategory && (
        <div className="text-center text-xs text-[--dim] font-body">
          Total: <span className="text-[--cream] font-ui font-medium">{totalStats.completed}/{totalStats.total}</span> tasks completed
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
