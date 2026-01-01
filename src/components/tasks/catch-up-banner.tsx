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
        'rounded-2xl p-6 mb-6',
        'bg-gradient-to-r from-indigo-500/15 to-purple-500/10',
        'border border-indigo-500/30',
        'flex items-center gap-5'
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'w-14 h-14 rounded-2xl flex-shrink-0',
          'bg-gradient-to-br from-indigo-500 to-purple-500',
          'flex items-center justify-center text-[28px]'
        )}
      >
        🚀
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-lg font-bold text-white mb-1.5">
          Let&apos;s get you caught up!
        </h3>
        <p className="text-sm text-zinc-400 leading-relaxed">
          You joined at Week {signupWeek} — we&apos;ve identified {tasksToReview} tasks from earlier weeks that may still be relevant.
          Take 5 minutes to quickly triage them so we can focus on what matters now.
        </p>
      </div>

      {/* Progress section */}
      <div className="flex items-center gap-4">
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
          'px-6 py-3 rounded-[10px] text-sm font-semibold text-white',
          'bg-gradient-to-r from-indigo-500 to-purple-500',
          'hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5',
          'transition-all flex-shrink-0'
        )}
      >
        Continue Triage →
      </Link>
    </div>
  )
}
