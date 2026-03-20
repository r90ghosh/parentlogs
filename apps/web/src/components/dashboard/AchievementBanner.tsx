'use client'

import { cn } from '@/lib/utils'
import { Achievement } from '@/types/dashboard'

interface AchievementBannerProps {
  achievement: Achievement
}

export function AchievementBanner({ achievement }: AchievementBannerProps) {
  return (
    <div
      className={cn(
        'rounded-[14px] p-4',
        'bg-gradient-to-br from-green-500/15 to-emerald-500/10',
        'border border-green-500/20',
        'flex items-center gap-3.5'
      )}
    >
      {/* Icon */}
      <div className="text-[32px]">{achievement.icon}</div>

      {/* Content */}
      <div className="flex-1">
        <div className="text-sm font-semibold text-green-400">
          {achievement.title}
        </div>
        <div className="text-xs text-green-300/80">
          {achievement.description}
        </div>
      </div>
    </div>
  )
}
