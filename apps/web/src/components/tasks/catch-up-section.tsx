'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { FamilyTask, TriageAction } from '@/types'
import { CatchUpTaskItem } from './catch-up-task-item'
import { SectionAction } from './task-section'
import { categorizeBacklogTask, sortBacklogTasks } from '@/lib/task-utils'
import { cn } from '@/lib/utils'
import { ChevronDown, CheckCircle2 } from 'lucide-react'

interface CatchUpSectionProps {
  tasks: FamilyTask[]
  currentWeek: number
  onTriage: (taskId: string, action: TriageAction) => void
  onBulkTriage: (taskIds: string[], action: TriageAction) => void
  isPending?: boolean
  maxVisible?: number
  onTaskClick?: (taskId: string) => void
}

export function CatchUpSection({
  tasks,
  currentWeek,
  onTriage,
  onBulkTriage,
  isPending = false,
  maxVisible = 5,
  onTaskClick,
}: CatchUpSectionProps) {
  const [isCatchUpExpanded, setIsCatchUpExpanded] = useState(true)
  const [isAutoHandledExpanded, setIsAutoHandledExpanded] = useState(false)
  const [autoHandledDismissed, setAutoHandledDismissed] = useState(false)
  const [showAllCatchUp, setShowAllCatchUp] = useState(false)

  // Split into 2 buckets based on backlog category
  const { autoHandledTasks, catchUpTasks } = useMemo(() => {
    const auto: FamilyTask[] = []
    const catchUp: FamilyTask[] = []

    tasks.forEach(task => {
      const category = categorizeBacklogTask(task, currentWeek)
      if (category === 'window_passed' || category === 'probably_done') {
        auto.push(task)
      } else {
        catchUp.push(task)
      }
    })

    return {
      autoHandledTasks: auto,
      catchUpTasks: sortBacklogTasks(catchUp, currentWeek),
    }
  }, [tasks, currentWeek])

  if (tasks.length === 0) return null

  const visibleCatchUp = showAllCatchUp ? catchUpTasks : catchUpTasks.slice(0, maxVisible)
  const hasMoreCatchUp = catchUpTasks.length > maxVisible

  const handleMarkAllDone = () => {
    onBulkTriage(catchUpTasks.map(t => t.id), 'completed')
  }

  const handleDismissAutoHandled = () => {
    // Mark all auto-handled as skipped and dismiss the section
    onBulkTriage(autoHandledTasks.map(t => t.id), 'skipped')
    setAutoHandledDismissed(true)
  }

  return (
    <div className="space-y-4">
      {/* Auto-Handled Bucket */}
      {autoHandledTasks.length > 0 && !autoHandledDismissed && (
        <div
          className={cn(
            'rounded-2xl overflow-hidden',
            'bg-[--surface]',
            'border border-[--border]'
          )}
        >
          {/* Auto-handled header */}
          <div
            className="px-4 md:px-5 py-3 md:py-4 cursor-pointer border-b border-[--border]"
            onClick={() => setIsAutoHandledExpanded(!isAutoHandledExpanded)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[--muted]" />
                <h3 className="text-sm font-ui font-semibold text-[--muted]">
                  {autoHandledTasks.length} tasks auto-sorted
                </h3>
                <ChevronDown
                  className={cn(
                    'w-4 h-4 text-[--dim] transition-transform',
                    !isAutoHandledExpanded && '-rotate-90'
                  )}
                />
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDismissAutoHandled()
                }}
                disabled={isPending}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-ui font-semibold transition-all',
                  'bg-[--card] text-[--muted] hover:bg-[--card-hover] hover:text-[--cream]',
                  isPending && 'opacity-50 cursor-not-allowed'
                )}
              >
                Looks right
              </button>
            </div>

            <p className="text-[10px] text-[--dim] font-body mt-1 ml-6">
              Expired or likely completed tasks — expand to review individually
            </p>
          </div>

          {/* Auto-handled task list (collapsed by default) */}
          {isAutoHandledExpanded && (
            <div className="p-2">
              {autoHandledTasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-xl opacity-50"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm text-[--muted] font-body line-through truncate">{task.title}</span>
                    <span className="text-[9px] font-ui font-semibold px-1.5 py-0.5 rounded-full bg-[--card] text-[--muted] uppercase tracking-wide flex-shrink-0">
                      {categorizeBacklogTask(task, currentWeek) === 'window_passed' ? 'Expired' : 'Likely done'}
                    </span>
                  </div>
                  <button
                    onClick={() => onTriage(task.id, 'added')}
                    disabled={isPending}
                    className="text-xs text-[--muted] hover:text-[--cream] font-ui transition-colors flex-shrink-0 ml-2"
                  >
                    Un-skip
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Catch-Up Bucket */}
      {catchUpTasks.length > 0 && (
        <div
          className={cn(
            'rounded-2xl overflow-hidden',
            'bg-[--surface]',
            'border border-gold/25'
          )}
        >
          {/* Catch-up header */}
          <div
            className={cn(
              'px-4 md:px-5 py-3 md:py-4 cursor-pointer',
              'border-b border-[--border]',
              'bg-gradient-to-r from-gold-dim to-copper-dim'
            )}
            onClick={() => setIsCatchUpExpanded(!isCatchUpExpanded)}
          >
            {/* Title row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base md:text-lg">📋</span>
                <h3 className="text-sm md:text-[15px] font-ui font-semibold text-[--cream]">Catch Up</h3>
                <span className="text-[10px] md:text-xs font-ui font-semibold px-1.5 md:px-2 py-0.5 rounded-full bg-gold-dim text-gold uppercase tracking-wide">
                  {catchUpTasks.length} tasks
                </span>
                <ChevronDown
                  className={cn(
                    'w-4 h-4 text-[--muted] transition-transform',
                    !isCatchUpExpanded && '-rotate-90'
                  )}
                />
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-[10px] md:text-xs text-[--muted] font-body mt-1 ml-7">
              These tasks are still actionable — complete them when you&apos;re ready
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
              <SectionAction onClick={handleMarkAllDone} variant="success">
                ✓ Mark All Done
              </SectionAction>
              <Link href="/tasks/triage">
                <SectionAction variant="primary">
                  Quick Triage Mode
                </SectionAction>
              </Link>
            </div>
          </div>

          {/* Catch-up task list */}
          {isCatchUpExpanded && (
            <div className="p-2">
              {visibleCatchUp.map(task => (
                <CatchUpTaskItem
                  key={task.id}
                  task={task}
                  currentWeek={currentWeek}
                  onTriage={onTriage}
                  isPending={isPending}
                  onClick={onTaskClick ? () => onTaskClick(task.id) : undefined}
                />
              ))}

              {/* Show more/less button */}
              {hasMoreCatchUp && (
                <button
                  onClick={() => setShowAllCatchUp(!showAllCatchUp)}
                  className="w-full py-3 text-sm text-gold hover:text-gold-hover font-ui transition-colors"
                >
                  {showAllCatchUp
                    ? 'Show less'
                    : `Show ${catchUpTasks.length - maxVisible} more tasks`}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
