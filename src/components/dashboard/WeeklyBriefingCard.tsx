'use client'

import { cn } from '@/lib/utils'
import { WeeklyBriefing } from '@/types/dashboard'
import Link from 'next/link'

interface WeeklyBriefingCardProps {
  briefing: WeeklyBriefing
}

export function WeeklyBriefingCard({ briefing }: WeeklyBriefingCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl p-5',
        'bg-gradient-to-br from-indigo-500/10 to-violet-500/5',
        'border border-indigo-500/20'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-white flex items-center gap-2">
          📖 Week {briefing.week} Briefing
        </span>
        {briefing.isNew && (
          <span className="text-xs text-indigo-400 font-medium">New!</span>
        )}
      </div>

      {/* Briefing preview */}
      <div className="mb-4">
        <div className="text-base font-semibold text-white mb-2">
          {briefing.title}
        </div>
        <div className="text-[13px] text-zinc-400 leading-relaxed line-clamp-2">
          {briefing.excerpt}
        </div>
      </div>

      {/* Read more link */}
      <Link
        href={`/briefing?week=${briefing.week}`}
        className="flex items-center gap-2 text-[13px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
      >
        Read full briefing →
      </Link>
    </div>
  )
}
