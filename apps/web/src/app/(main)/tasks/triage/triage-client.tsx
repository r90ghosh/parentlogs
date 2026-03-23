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
import { ArrowLeft, CheckCircle2, SkipForward, Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[--bg]">
        <Loader2 className="h-6 w-6 animate-spin text-[--muted]" />
      </div>
    )
  }

  const category = currentTask ? (categoryConfig[currentTask.category] || categoryConfig.planning) : null
  const backlogCategory = currentTask ? categorizeBacklogTask(currentTask, currentWeek) : null

  return (
    <div className="min-h-screen bg-[--bg]">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/tasks">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-display font-bold text-[--cream]">Quick Triage</h1>
            <p className="text-xs text-[--muted] font-body">
              {catchUpTasks.length > 0
                ? `${triagedCount} of ${totalToTriage} reviewed`
                : 'All caught up!'
              }
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-2 bg-[--card] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-gold to-copper rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[11px] text-[--dim] font-body">{triagedCount} done</span>
            <span className="text-[11px] text-[--dim] font-body">{catchUpTasks.length} remaining</span>
          </div>
        </div>

        {/* Current task card */}
        <AnimatePresence mode="wait">
          {currentTask && category ? (
            <motion.div
              key={currentTask.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'rounded-2xl overflow-hidden',
                'bg-[--surface]',
                'border border-[--border]'
              )}
            >
              {/* Card content */}
              <div className="p-5 space-y-4">
                {/* Category + week */}
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'inline-flex items-center gap-1 text-[11px] font-ui font-medium px-2 py-0.5 rounded-md',
                    category.bgClass,
                    category.textClass
                  )}>
                    <span>{category.icon}</span>
                    {category.label}
                  </span>
                  <span className="text-[11px] text-[--dim] font-body">Week {currentTask.week_due}</span>
                  <span className={cn(
                    'ml-auto text-[10px] font-ui font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide',
                    'bg-gold-dim text-gold'
                  )}>
                    Catch up
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-lg font-display font-semibold text-[--cream] leading-snug">
                  {currentTask.title}
                </h2>

                {/* Description */}
                {currentTask.description && (
                  <p className="text-sm text-[--muted] font-body leading-relaxed">
                    {currentTask.description}
                  </p>
                )}

                {/* Time estimate */}
                {currentTask.time_estimate_minutes && (
                  <div className="flex items-center gap-1.5 text-xs text-[--dim] font-body">
                    <span>⏱️</span>
                    <span>
                      {currentTask.time_estimate_minutes < 60
                        ? `${currentTask.time_estimate_minutes} min`
                        : `${Math.floor(currentTask.time_estimate_minutes / 60)} hour${Math.floor(currentTask.time_estimate_minutes / 60) > 1 ? 's' : ''}`
                      }
                    </span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="border-t border-[--border] p-4 flex gap-3">
                <button
                  onClick={() => handleTriage(currentTask.id, 'completed')}
                  disabled={triageTask.isPending}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-ui font-semibold transition-all',
                    'bg-[--sage-dim] text-sage hover:bg-sage/25',
                    triageTask.isPending && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Already did
                </button>

                <button
                  onClick={() => handleTriage(currentTask.id, 'added')}
                  disabled={triageTask.isPending}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-ui font-semibold transition-all',
                    'bg-gold-dim text-gold hover:bg-gold-glow',
                    triageTask.isPending && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <Plus className="h-4 w-4" />
                  Add to list
                </button>

                <button
                  onClick={() => handleTriage(currentTask.id, 'skipped')}
                  disabled={triageTask.isPending}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-ui font-semibold transition-all',
                    'bg-[--card] text-[--muted] hover:bg-[--card-hover] hover:text-[--cream]',
                    triageTask.isPending && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <SkipForward className="h-4 w-4" />
                  Skip
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-xl font-display font-bold text-[--cream] mb-2">All caught up!</h2>
              <p className="text-sm text-[--muted] font-body mb-6">
                You reviewed {triagedCount} task{triagedCount !== 1 ? 's' : ''}. Nice work!
              </p>
              <Button asChild className="bg-copper hover:bg-copper-hover text-[--bg] font-ui">
                <Link href="/tasks">Back to Tasks</Link>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Remaining count */}
        {catchUpTasks.length > 1 && (
          <p className="text-center text-xs text-[--dim] font-body mt-4">
            {catchUpTasks.length - 1} more after this
          </p>
        )}
      </div>
    </div>
  )
}
