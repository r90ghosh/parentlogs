'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FamilyTask, TriageAction } from '@/types'
import { CatchUpTaskItem } from './catch-up-task-item'
import { SectionAction } from './task-section'
import { sortBacklogTasks } from '@/lib/task-utils'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

interface CatchUpSectionProps {
  tasks: FamilyTask[]
  currentWeek: number
  onTriage: (taskId: string, action: TriageAction) => void
  onBulkTriage: (taskIds: string[], action: TriageAction) => void
  isPending?: boolean
  maxVisible?: number
}

export function CatchUpSection({
  tasks,
  currentWeek,
  onTriage,
  onBulkTriage,
  isPending = false,
  maxVisible = 5,
}: CatchUpSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [showAll, setShowAll] = useState(false)

  if (tasks.length === 0) return null

  // Sort tasks for optimal triage order
  const sortedTasks = sortBacklogTasks(tasks, currentWeek)
  const visibleTasks = showAll ? sortedTasks : sortedTasks.slice(0, maxVisible)
  const hasMore = sortedTasks.length > maxVisible

  // Get earliest week for context
  const earliestWeek = Math.min(...tasks.map(t => t.week_due || 0))

  const handleMarkAllDone = () => {
    onBulkTriage(tasks.map(t => t.id), 'completed')
  }

  const handleSkipAll = () => {
    onBulkTriage(tasks.map(t => t.id), 'skipped')
  }

  return (
    <div
      className={cn(
        'rounded-2xl overflow-hidden',
        'bg-gradient-to-br from-zinc-800 to-zinc-900',
        'border border-indigo-500/30'
      )}
    >
      {/* Section header */}
      <div
        className={cn(
          'px-4 md:px-5 py-3 md:py-4 cursor-pointer',
          'border-b border-white/[0.06]',
          'bg-gradient-to-r from-indigo-500/10 to-purple-500/5'
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Title row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base md:text-lg">📥</span>
            <h3 className="text-sm md:text-[15px] font-semibold text-white">Catch-Up Queue</h3>
            <span className="text-[10px] md:text-xs text-zinc-500 bg-white/[0.06] px-1.5 md:px-2 py-0.5 rounded-[10px]">
              {tasks.length} tasks
            </span>
            <ChevronDown
              className={cn(
                'w-4 h-4 text-zinc-500 transition-transform',
                !isExpanded && '-rotate-90'
              )}
            />
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-[10px] md:text-xs text-zinc-500 mt-1 ml-6 md:ml-7">
          Tasks from Weeks {earliestWeek}-{currentWeek - 1} • Review and triage quickly
        </p>

        {/* Action buttons - below on mobile */}
        <div className="flex flex-wrap gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
          <SectionAction onClick={handleMarkAllDone} variant="success">
            ✓ Mark All Done
          </SectionAction>
          <SectionAction onClick={handleSkipAll}>
            Skip All
          </SectionAction>
          <Link href="/tasks/triage">
            <SectionAction variant="primary">
              Quick Triage Mode
            </SectionAction>
          </Link>
        </div>
      </div>

      {/* Task list */}
      {isExpanded && (
        <div className="p-2">
          {visibleTasks.map(task => (
            <CatchUpTaskItem
              key={task.id}
              task={task}
              currentWeek={currentWeek}
              onTriage={onTriage}
              isPending={isPending}
            />
          ))}

          {/* Show more/less button */}
          {hasMore && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full py-3 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {showAll
                ? 'Show less'
                : `Show ${sortedTasks.length - maxVisible} more tasks`}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
