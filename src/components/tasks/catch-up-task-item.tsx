'use client'

import { FamilyTask, BacklogCategory, TriageAction } from '@/types'
import { categorizeBacklogTask } from '@/lib/task-utils'
import { categoryConfig, backlogCategoryConfig } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'

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
  const backlogConfig = backlogCategoryConfig[backlogCategory]

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
        'flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all',
        'hover:bg-white/[0.03]',
        isExpired && 'opacity-60'
      )}
    >
      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header with title and badges */}
        <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
          <span className={cn(
            'text-[15px] font-semibold',
            isExpired ? 'text-zinc-500' : 'text-zinc-200'
          )}>
            {task.title}
          </span>
          <div className="flex gap-1.5">
            <span className={cn(
              'text-[10px] font-semibold px-2 py-0.5 rounded-[10px] uppercase tracking-wide',
              backlogConfig.bgClass,
              backlogConfig.textClass
            )}>
              {backlogConfig.label}
            </span>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-[13px] text-zinc-500 mb-2.5 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Category tag */}
          <span className={cn(
            'inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md',
            category.bgClass,
            category.textClass
          )}>
            <span>{category.icon}</span>
            {category.label}
          </span>

          {/* Original week */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-600">
            <span>📅</span>
            <span>{isExpired ? `Was due Week ${task.week_due}` : `Originally Week ${task.week_due}`}</span>
          </div>

          {/* Time estimate */}
          {timeEstimate && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-600">
              <span>⏱️</span>
              <span>{timeEstimate}</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick action buttons */}
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onTriage(task.id, 'completed')
          }}
          disabled={isPending}
          className={cn(
            'px-3.5 py-2 rounded-lg text-xs font-semibold transition-all',
            'flex items-center gap-1.5',
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
              'px-3.5 py-2 rounded-lg text-xs font-semibold transition-all',
              'flex items-center gap-1.5',
              'bg-blue-500/15 text-blue-400 hover:bg-blue-500/25',
              isPending && 'opacity-50 cursor-not-allowed'
            )}
          >
            + {isProbablyDone ? 'Need to do' : 'Add to list'}
          </button>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation()
            onTriage(task.id, 'skipped')
          }}
          disabled={isPending}
          className={cn(
            'px-3.5 py-2 rounded-lg text-xs font-semibold transition-all',
            'flex items-center gap-1.5',
            'bg-white/[0.06] text-zinc-500 hover:bg-white/10 hover:text-zinc-400',
            isPending && 'opacity-50 cursor-not-allowed'
          )}
        >
          Skip
        </button>
      </div>
    </div>
  )
}
