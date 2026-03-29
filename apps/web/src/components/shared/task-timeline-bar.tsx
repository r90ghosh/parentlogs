'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface TaskTimelineBarProps {
  currentWeek: number
  selectedWeek: number | null
  onWeekClick: (week: number | null) => void
  taskCountByWeek: Record<number, number>
  maxWeek?: number
}

export function TaskTimelineBar({
  currentWeek,
  selectedWeek,
  onWeekClick,
  taskCountByWeek,
  maxWeek = 104,
}: TaskTimelineBarProps) {
  // Center the visible range on the current week initially
  const [viewingCenter, setViewingCenter] = useState(currentWeek)

  const range = 3
  const minWeek = 1

  // Generate ~7 week pills centered on viewingCenter
  const getVisibleWeeks = () => {
    const start = Math.max(minWeek, viewingCenter - range)
    const end = Math.min(maxWeek, viewingCenter + range)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  const visibleWeeks = getVisibleWeeks()

  const canGoPrev = visibleWeeks[0] > minWeek
  const canGoNext = visibleWeeks[visibleWeeks.length - 1] < maxWeek

  const handleShift = (direction: -1 | 1) => {
    setViewingCenter(prev => {
      const next = prev + direction * 3
      return Math.max(minWeek + range, Math.min(maxWeek - range, next))
    })
  }

  // Total pending tasks across all weeks
  const totalTasks = Object.values(taskCountByWeek).reduce((sum, n) => sum + n, 0)

  return (
    <div className="space-y-3">
      {/* Label */}
      <div className="flex items-center justify-between text-xs text-[--muted]">
        <span className="font-ui font-medium">Tasks by Week</span>
        {selectedWeek !== null && (
          <button
            onClick={() => onWeekClick(null)}
            className="text-copper hover:text-copper/80 text-xs font-ui font-medium hover:underline transition-colors"
          >
            Show all
          </button>
        )}
      </div>

      {/* Pill Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => handleShift(-1)}
          disabled={!canGoPrev}
          className={cn(
            'flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm font-ui text-[--muted] transition-colors',
            canGoPrev ? 'hover:bg-[--card] hover:text-[--cream]' : 'opacity-30 cursor-not-allowed'
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-0.5 sm:gap-1">
          {visibleWeeks[0] > minWeek && (
            <span className="text-[--dim] text-xs px-1">...</span>
          )}
          {visibleWeeks.map(week => {
            const count = taskCountByWeek[week] || 0
            const isSelected = selectedWeek === week
            const isCurrent = currentWeek === week

            return (
              <button
                key={week}
                onClick={() => onWeekClick(isSelected ? null : week)}
                className={cn(
                  'relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs sm:text-sm font-medium font-ui transition-all',
                  isSelected
                    ? 'bg-copper text-[--white]'
                    : isCurrent
                      ? 'bg-copper/20 text-copper'
                      : count > 0
                        ? 'text-[--muted] hover:bg-[--card] hover:text-[--cream]'
                        : 'text-[--dim] hover:bg-[--card] hover:text-[--muted]'
                )}
              >
                {week}
                {/* Task count badge */}
                {count > 0 && !isSelected && (
                  <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-0.5 flex items-center justify-center rounded-full bg-copper/80 text-[--white] text-[9px] font-semibold leading-none">
                    {count}
                  </span>
                )}
              </button>
            )
          })}
          {visibleWeeks[visibleWeeks.length - 1] < maxWeek && (
            <span className="text-[--dim] text-xs px-1">...</span>
          )}
        </div>

        <button
          onClick={() => handleShift(1)}
          disabled={!canGoNext}
          className={cn(
            'flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm font-ui text-[--muted] transition-colors',
            canGoNext ? 'hover:bg-[--card] hover:text-[--cream]' : 'opacity-30 cursor-not-allowed'
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Summary bar */}
      <div className="flex items-center justify-center gap-3 text-xs text-[--muted] font-ui">
        {selectedWeek !== null ? (
          <>
            <span className="inline-flex items-center gap-1.5 bg-copper-dim text-copper px-2.5 py-1 rounded-full text-xs font-semibold">
              Week {selectedWeek}
            </span>
            <span>
              <span className="text-[--cream] font-medium">{taskCountByWeek[selectedWeek] || 0}</span> pending tasks
            </span>
          </>
        ) : (
          <span>
            <span className="text-[--cream] font-medium">{totalTasks}</span> pending tasks across all weeks
          </span>
        )}
      </div>
    </div>
  )
}
