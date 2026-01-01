'use client'

import { cn } from '@/lib/utils'

interface StreakBannerProps {
  days: number
  message?: string
}

export function StreakBanner({ days, message }: StreakBannerProps) {
  if (days === 0) return null

  return (
    <div
      className={cn(
        'rounded-xl p-3.5',
        'bg-gradient-to-r from-amber-500/15 to-orange-600/10',
        'border border-amber-500/20',
        'flex items-center gap-3'
      )}
    >
      <div className="text-[28px]">🔥</div>
      <div className="flex-1">
        <div className="text-base font-bold text-amber-500">
          {days} Day Streak!
        </div>
        <div className="text-xs text-zinc-400">
          {message || 'Complete 1 task daily to keep it going'}
        </div>
      </div>
    </div>
  )
}
