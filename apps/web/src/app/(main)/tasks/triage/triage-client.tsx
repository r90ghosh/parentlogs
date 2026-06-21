'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { FamilyTask, TriageAction } from '@tdc/shared/types'
import { useBacklogTasks, useTriageTask } from '@/hooks/use-tasks'
import { useUser } from '@/components/user-provider'
import { useFamily } from '@/hooks/use-family'
import { categorizeBacklogTask, sortBacklogTasks } from '@tdc/shared/utils'
import { categoryConfig } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'
import { ArrowLeft, CheckCircle2, SkipForward, Plus, Loader2, Clock } from 'lucide-react'
import { Panel, Badge, ProgressBar } from '@/components/digest'
import { usePageHeader } from '@/components/layouts/topbar-context'
import Link from 'next/link'

export default function TriageClient() {
  const router = useRouter()
  const { data: backlogTasks = [], isLoading } = useBacklogTasks()
  const { activeBaby } = useUser()
  const { data: family } = useFamily()
  const triageTask = useTriageTask()

  const currentWeek = activeBaby?.current_week ?? family?.current_week ?? 1

  // Track triaged task IDs locally for instant UI feedback
  const [triagedIds, setTriagedIds] = useState<Set<string>>(new Set())
  const [currentIndex, setCurrentIndex] = useState(0)

  // Filter and sort remaining tasks
  const catchUpTasks = useMemo(() => {
    const filtered = backlogTasks.filter(task => {
      if (triagedIds.has(task.id)) return false
      const category = categorizeBacklogTask(task, currentWeek)
      return category === 'still_relevant'
    })
    return sortBacklogTasks(filtered, currentWeek)
  }, [backlogTasks, currentWeek, triagedIds])

  const totalToTriage = useMemo(() => {
    return backlogTasks.filter(task => {
      const category = categorizeBacklogTask(task, currentWeek)
      return category === 'still_relevant'
    }).length
  }, [backlogTasks, currentWeek])

  const triagedCount = triagedIds.size
  const currentTask = catchUpTasks[0] || null
  const progressPercent = totalToTriage > 0 ? Math.round((triagedCount / totalToTriage) * 100) : 100

  const handleTriage = useCallback((taskId: string, action: TriageAction) => {
    triageTask.mutate({ id: taskId, action })
    setTriagedIds(prev => new Set(prev).add(taskId))
  }, [triageTask])

  usePageHeader(
    {
      title: 'Catch up',
      subtitle: catchUpTasks.length > 0 ? `${triagedCount} of ${totalToTriage} reviewed` : 'All caught up',
    },
    [triagedCount, totalToTriage, catchUpTasks.length]
  )

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-2xl justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-mute" />
      </div>
    )
  }

  const category = currentTask ? (categoryConfig[currentTask.category] || categoryConfig.planning) : null

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/tasks"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-bold text-clay-ink hover:opacity-80"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      {/* Progress */}
      <div className="mb-7">
        <ProgressBar value={progressPercent} />
        <div className="mt-2 flex justify-between">
          <span className="text-[11.5px] font-semibold text-faint">{triagedCount} done</span>
          <span className="text-[11.5px] font-semibold text-faint">{catchUpTasks.length} remaining</span>
        </div>
      </div>

      {/* Current task */}
      {currentTask && category ? (
        <Panel className="overflow-hidden">
          <div className="space-y-4 p-[22px]">
            {/* Category + week */}
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold',
                  category.bgClass,
                  category.textClass
                )}
              >
                <span>{category.icon}</span>
                {category.label}
              </span>
              <span className="text-[11px] font-medium text-faint">Week {currentTask.week_due}</span>
              <Badge tone="gold" className="ml-auto">
                Catch up
              </Badge>
            </div>

            {/* Title */}
            <h2 className="text-[18px] font-extrabold leading-snug text-ink">{currentTask.title}</h2>

            {/* Description */}
            {currentTask.description && (
              <p className="text-[14px] leading-relaxed text-ink2">{currentTask.description}</p>
            )}

            {/* Time estimate */}
            {currentTask.time_estimate_minutes && (
              <div className="flex items-center gap-1.5 text-[12.5px] font-medium text-mute">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  {currentTask.time_estimate_minutes < 60
                    ? `${currentTask.time_estimate_minutes} min`
                    : `${Math.floor(currentTask.time_estimate_minutes / 60)} hour${Math.floor(currentTask.time_estimate_minutes / 60) > 1 ? 's' : ''}`}
                </span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 border-t border-line2 p-4">
            <button
              onClick={() => handleTriage(currentTask.id, 'completed')}
              disabled={triageTask.isPending}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-xl bg-clay py-3 text-[14px] font-bold text-white transition-opacity hover:opacity-90',
                triageTask.isPending && 'cursor-not-allowed opacity-50'
              )}
            >
              <CheckCircle2 className="h-4 w-4" />
              Already did
            </button>

            <button
              onClick={() => handleTriage(currentTask.id, 'added')}
              disabled={triageTask.isPending}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-xl border border-line bg-card py-3 text-[14px] font-bold text-ink2 transition-colors hover:bg-card-hover',
                triageTask.isPending && 'cursor-not-allowed opacity-50'
              )}
            >
              <Plus className="h-4 w-4" />
              Add to list
            </button>

            <button
              onClick={() => handleTriage(currentTask.id, 'skipped')}
              disabled={triageTask.isPending}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-xl border border-line bg-card py-3 text-[14px] font-bold text-mute transition-colors hover:bg-card-hover hover:text-ink2',
                triageTask.isPending && 'cursor-not-allowed opacity-50'
              )}
            >
              <SkipForward className="h-4 w-4" />
              Skip
            </button>
          </div>
        </Panel>
      ) : (
        <Panel className="p-12 text-center">
          <p className="text-[18px] font-extrabold text-ink">All caught up</p>
          <p className="mt-2 text-[14px] text-mute">
            You reviewed {triagedCount} task{triagedCount !== 1 ? 's' : ''}. Nice work.
          </p>
          <Link
            href="/tasks"
            className="mt-6 inline-flex items-center rounded-xl bg-clay px-4 py-2.5 text-[14px] font-bold text-white transition-opacity hover:opacity-90"
          >
            Back to Tasks
          </Link>
        </Panel>
      )}

      {/* Remaining count */}
      {catchUpTasks.length > 1 && (
        <p className="mt-4 text-center text-[12px] font-medium text-faint">
          {catchUpTasks.length - 1} more after this
        </p>
      )}
    </div>
  )
}
