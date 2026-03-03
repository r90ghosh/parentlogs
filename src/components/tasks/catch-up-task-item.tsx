'use client'

import { FamilyTask, BacklogCategory, TriageAction } from '@/types'
import { categorizeBacklogTask } from '@/lib/task-utils'
import { categoryConfig } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'

// Yellow-themed badge config for catch-up items
const catchUpBadgeConfig: Record<BacklogCategory, { label: string; bgClass: string; textClass: string }> = {
  window_passed: {
    label: 'Expired',
    bgClass: 'bg-zinc-500/15',
    textClass: 'text-zinc-400',
  },
  still_relevant: {
    label: 'Catch up',
    bgClass: 'bg-amber-500/15',
    textClass: 'text-amber-400',
  },
  probably_done: {
    label: 'Likely done',
    bgClass: 'bg-zinc-500/15',
    textClass: 'text-zinc-400',
  },
}

interface CatchUpTaskItemProps {
  task: FamilyTask
  currentWeek: number
  onTriage: (taskId: string, action: TriageAction) => void
  isPending?: boolean
}

export function CatchUpTaskItem({
  task,
  currentWeek,
  onTriage,
  isPending = false,
}: CatchUpTaskItemProps) {
  const backlogCategory = categorizeBacklogTask(task, currentWeek)
  const category = categoryConfig[task.category] || categoryConfig.planning
  const badgeConfig = catchUpBadgeConfig[backlogCategory]

  const isExpired = backlogCategory === 'window_passed'
  const isProbablyDone = backlogCategory === 'probably_done'

  // Format time estimate
  const getTimeEstimate = () => {
    const mins = task.time_estimate_minutes
    if (!mins) return null
    if (mins < 60) return `${mins} min`
    const hours = Math.floor(mins / 60)
    return `${hours} hour${hours > 1 ? 's' : ''}`
  }

  const timeEstimate = getTimeEstimate()

  return (
    <div
      className={cn(
        'p-3 md:p-4 rounded-xl cursor-pointer transition-all',
        'hover:bg-white/[0.03]',
        isExpired && 'opacity-60'
      )}
    >
      {/* Content */}
      <div className="min-w-0">
        {/* Header with title and badge */}
        <div className="flex items-start gap-2 mb-1.5">
          <span className={cn(
            'text-sm md:text-[15px] font-semibold flex-1',
            isExpired ? 'text-zinc-500' : 'text-zinc-200'
          )}>
            {task.title}
          </span>
          <span className={cn(
            'text-[9px] md:text-[10px] font-semibold px-1.5 md:px-2 py-0.5 rounded-full uppercase tracking-wide flex-shrink-0',
            badgeConfig.bgClass,
            badgeConfig.textClass
          )}>
            {badgeConfig.label}
          </span>
        </div>

        {/* Description - hidden on mobile for cleaner look */}
        {task.description && (
          <p className="hidden md:block text-[13px] text-zinc-500 mb-2.5 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-2 md:gap-4 flex-wrap mb-3">
          {/* Category tag */}
          <span className={cn(
            'inline-flex items-center gap-1 text-[10px] md:text-[11px] font-medium px-1.5 md:px-2 py-0.5 rounded-md',
            category.bgClass,
            category.textClass
          )}>
            <span>{category.icon}</span>
            {category.label}
          </span>

          {/* Original week */}
          <div className="flex items-center gap-1 text-[10px] md:text-xs text-zinc-600">
            <span>📅</span>
            <span>Week {task.week_due}</span>
          </div>

          {/* Time estimate - hidden on mobile */}
          {timeEstimate && (
            <div className="hidden md:flex items-center gap-1.5 text-xs text-zinc-600">
              <span>⏱️</span>
              <span>{timeEstimate}</span>
            </div>
          )}
        </div>

        {/* Quick action buttons - full width on mobile */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onTriage(task.id, 'completed')
            }}
            disabled={isPending}
            className={cn(
              'px-3 py-1.5 md:px-3.5 md:py-2 rounded-lg text-[11px] md:text-xs font-semibold transition-all',
              'flex items-center gap-1',
              'bg-green-500/15 text-green-400 hover:bg-green-500/25',
              isPending && 'opacity-50 cursor-not-allowed'
            )}
          >
            ✓ {isProbablyDone ? 'Yes, done' : 'Already did'}
          </button>

          {!isExpired && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onTriage(task.id, 'added')
              }}
              disabled={isPending}
              className={cn(
                'px-3 py-1.5 md:px-3.5 md:py-2 rounded-lg text-[11px] md:text-xs font-semibold transition-all',
                'flex items-center gap-1',
                'bg-amber-500/15 text-amber-400 hover:bg-amber-500/25',
                isPending && 'opacity-50 cursor-not-allowed'
              )}
            >
              + Add to list
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation()
              onTriage(task.id, 'skipped')
            }}
            disabled={isPending}
            className={cn(
              'px-3 py-1.5 md:px-3.5 md:py-2 rounded-lg text-[11px] md:text-xs font-semibold transition-all',
              'flex items-center gap-1',
              'bg-white/[0.06] text-zinc-500 hover:bg-white/10 hover:text-zinc-400',
              isPending && 'opacity-50 cursor-not-allowed'
            )}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  )
}
