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
        'bg-gradient-to-r from-gold-dim to-copper-dim',
        'border border-gold/25',
        'flex items-center gap-3'
      )}
    >
      <div className="text-[28px]">🔥</div>
      <div className="flex-1">
        <div className="text-base font-ui font-bold text-gradient-copper">
          {days} Day Streak!
        </div>
        <div className="text-xs text-[--muted] font-body">
          {message || 'Complete 1 task daily to keep it going'}
        </div>
      </div>
    </div>
  )
}
