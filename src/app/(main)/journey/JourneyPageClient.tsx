'use client'

import { motion } from 'framer-motion'
import { Flame, TrendingUp } from 'lucide-react'
import { useUser } from '@/components/user-provider'
import { useMoodHistory } from '@/hooks/use-dad-journey'
import { DadChallengeTiles, MoodCheckinWidget } from '@/components/dashboard/dad-journey'
import { MOOD_CONFIG } from '@/lib/dad-pillar-config'
import { UserRole } from '@/types'
import { cn } from '@/lib/utils'

interface JourneyPageClientProps {
  userId: string
  userRole: UserRole
}

/**
 * Calculate consecutive-day streak (same logic as MoodCheckinWidget)
 */
function calculateStreak(checkins: { checked_in_at: string }[]): number {
  if (!checkins.length) return 0
  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const seenDays = new Set(
    checkins.map(c => {
      const d = new Date(c.checked_in_at)
      d.setHours(0, 0, 0, 0)
      return d.getTime()
    })
  )
  for (let i = 0; i < 365; i++) {
    const day = new Date(today)
    day.setDate(today.getDate() - i)
    if (seenDays.has(day.getTime())) {
      streak++
    } else {
      break
    }
  }
  return streak
}

export function JourneyPageClient({ userId, userRole }: JourneyPageClientProps) {
  const { profile } = useUser()
  const { data: moodHistory } = useMoodHistory(userId, 7)

  const streak = calculateStreak(moodHistory ?? [])
  const isDad = userRole === 'dad'

  return (
    <main className="flex-1 py-8 px-4 md:px-8 max-w-2xl mx-auto w-full">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-white">Your Dad Journey</h1>
        <p className="text-surface-400 mt-1 text-sm">
          7 real challenges, real talk, and things you can actually do.
        </p>
      </motion.div>

      {/* Mood history summary (if available) */}
      {moodHistory && moodHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          className="mb-5 rounded-xl bg-surface-900 border border-surface-800 p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-surface-400" />
              <p className="text-sm font-semibold text-white">Recent mood</p>
            </div>
            {streak > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/20">
                <Flame className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-xs font-semibold text-amber-400">
                  {streak}-day streak
                </span>
              </div>
            )}
          </div>

          {/* Last 7 check-ins as emoji dots */}
          <div className="flex gap-2 items-center">
            {moodHistory.slice(0, 7).reverse().map((checkin, i) => {
              const cfg = MOOD_CONFIG.find(m => m.level === checkin.mood) ?? MOOD_CONFIG[2]
              const date = new Date(checkin.checked_in_at)
              const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2)
              return (
                <div key={checkin.id ?? i} className="flex flex-col items-center gap-1">
                  <span className="text-xl leading-none" title={cfg.label}>
                    {cfg.emoji}
                  </span>
                  <span className="text-[10px] text-surface-500">{dayLabel}</span>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Mood check-in widget (always shown for dads) */}
      {isDad && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.35 }}
          className="mb-5"
        >
          <MoodCheckinWidget />
        </motion.div>
      )}

      {/* All 7 challenge tiles */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.35 }}
      >
        <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">
          Your challenges
        </p>
        <DadChallengeTiles maxTiles={7} />
      </motion.div>
    </main>
  )
}
