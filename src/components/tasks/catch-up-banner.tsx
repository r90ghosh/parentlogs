'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface CatchUpBannerProps {
  tasksToReview: number
  percentDone: number
  signupWeek: number
  onContinueTriage?: () => void
}

export function CatchUpBanner({
  tasksToReview,
  percentDone,
  signupWeek,
  onContinueTriage,
}: CatchUpBannerProps) {
  if (tasksToReview === 0) return null

  return (
    <div
      className={cn(
        'rounded-2xl p-4 md:p-6 mb-6',
        'bg-gradient-to-r from-indigo-500/15 to-purple-500/10',
        'border border-indigo-500/30'
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
              'bg-gradient-to-br from-indigo-500 to-purple-500',
              'flex items-center justify-center text-2xl md:text-[28px]'
            )}
          >
            🚀
          </div>

          {/* Progress - visible on mobile next to icon */}
          <div className="flex items-center gap-3 md:hidden">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-white">
                {tasksToReview}
              </div>
              <div className="text-[10px] text-zinc-400">to review</div>
            </div>
            <div className="w-16">
              <div className="h-1.5 bg-white/10 rounded-full mb-1 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
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
            You joined at Week {signupWeek} — we&apos;ve identified {tasksToReview} tasks from earlier weeks that may still be relevant.
          </p>
        </div>

        {/* Progress section - hidden on mobile */}
        <div className="hidden md:flex items-center gap-4">
          <div className="text-center">
            <div className="text-[32px] font-extrabold text-white">
              {tasksToReview}
            </div>
            <div className="text-xs text-zinc-400">to review</div>
          </div>

          <div className="w-[120px]">
            <div className="h-2 bg-white/10 rounded-full mb-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
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
            'bg-gradient-to-r from-indigo-500 to-purple-500',
            'hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5',
            'transition-all flex-shrink-0'
          )}
        >
          Continue Triage →
        </Link>
      </div>
    </div>
  )
}
