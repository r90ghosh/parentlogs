'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { FamilyTask } from '@/types'
import { categorizeBacklogTask } from '@/lib/task-utils'
import { cn } from '@/lib/utils'

interface CatchUpBannerProps {
  tasksToReview: number
  percentDone: number
  signupWeek: number
  backlogTasks?: FamilyTask[]
  currentWeek?: number
  onContinueTriage?: () => void
}

export function CatchUpBanner({
  tasksToReview,
  percentDone,
  signupWeek,
  backlogTasks,
  currentWeek,
  onContinueTriage,
}: CatchUpBannerProps) {
  if (tasksToReview === 0) return null

  // Calculate auto-handled vs catch-up counts
  const { autoHandledCount, catchUpCount } = useMemo(() => {
    if (!backlogTasks || !currentWeek) {
      return { autoHandledCount: 0, catchUpCount: tasksToReview }
    }

    let auto = 0
    let catchUp = 0

    backlogTasks.forEach(task => {
      const category = categorizeBacklogTask(task, currentWeek)
      if (category === 'window_passed' || category === 'probably_done') {
        auto++
      } else {
        catchUp++
      }
    })

    return { autoHandledCount: auto, catchUpCount: catchUp }
  }, [backlogTasks, currentWeek, tasksToReview])

  return (
    <div
      className={cn(
        'rounded-2xl p-4 md:p-6 mb-6',
        'bg-gradient-to-r from-amber-500/15 to-orange-500/10',
        'border border-amber-500/20'
      )}
    >
      {/* Mobile layout */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Top row on mobile: Icon + Progress */}
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div
            className={cn(
              'w-12 h-12 md:w-14 md:h-14 rounded-2xl flex-shrink-0',
              'bg-gradient-to-br from-amber-500 to-orange-500',
              'flex items-center justify-center text-2xl md:text-[28px]'
            )}
          >
            📋
          </div>

          {/* Progress - visible on mobile next to icon */}
          <div className="flex items-center gap-3 md:hidden">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-white">
                {catchUpCount}
              </div>
              <div className="text-[10px] text-amber-400/70">catch up</div>
            </div>
            {autoHandledCount > 0 && (
              <div className="text-center">
                <div className="text-lg font-bold text-zinc-500">
                  {autoHandledCount}
                </div>
                <div className="text-[10px] text-zinc-500">auto-sorted</div>
              </div>
            )}
            <div className="w-16">
              <div className="h-1.5 bg-white/10 rounded-full mb-1 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300"
                  style={{ width: `${percentDone}%` }}
                />
              </div>
              <div className="text-[10px] text-zinc-500 text-center">
                {percentDone}% done
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-base md:text-lg font-bold text-white mb-1">
            Let&apos;s get you caught up!
          </h3>
          <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
            You joined at Week {signupWeek} — we&apos;ve sorted {tasksToReview} earlier tasks.
            {autoHandledCount > 0 && (
              <span className="text-zinc-500"> {autoHandledCount} were auto-handled, {catchUpCount} need your review.</span>
            )}
          </p>
        </div>

        {/* Progress section - hidden on mobile */}
        <div className="hidden md:flex items-center gap-4">
          <div className="text-center">
            <div className="text-[32px] font-extrabold text-amber-400">
              {catchUpCount}
            </div>
            <div className="text-xs text-amber-400/70">catch up</div>
          </div>

          {autoHandledCount > 0 && (
            <div className="text-center">
              <div className="text-xl font-bold text-zinc-500">
                {autoHandledCount}
              </div>
              <div className="text-xs text-zinc-500">auto-sorted</div>
            </div>
          )}

          <div className="w-[120px]">
            <div className="h-2 bg-white/10 rounded-full mb-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${percentDone}%` }}
              />
            </div>
            <div className="text-[11px] text-zinc-500 text-center">
              {percentDone}% done
            </div>
          </div>
        </div>

        {/* Action button */}
        <Link
          href="/tasks/triage"
          onClick={onContinueTriage}
          className={cn(
            'px-4 py-2.5 md:px-6 md:py-3 rounded-[10px] text-sm font-semibold text-white text-center',
            'bg-gradient-to-r from-amber-500 to-orange-500',
            'hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5',
            'transition-all flex-shrink-0'
          )}
        >
          Review Tasks →
        </Link>
      </div>
    </div>
  )
}
