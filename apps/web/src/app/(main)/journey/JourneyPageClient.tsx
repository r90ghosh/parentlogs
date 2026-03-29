'use client'

import { Flame, TrendingUp } from 'lucide-react'
import { useUser } from '@/components/user-provider'
import { useMoodHistory } from '@/hooks/use-dad-journey'
import { DadChallengeTiles, MoodCheckinWidget } from '@/components/dashboard/dad-journey'
import { MOOD_CONFIG } from '@tdc/shared/constants'
import { Reveal } from '@/components/ui/animations/Reveal'

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

export function JourneyPageClient() {
  const { user, profile } = useUser()
  const userId = user.id
  const userRole = profile.role
  const { data: moodHistory } = useMoodHistory(userId, 7)

  const streak = calculateStreak(moodHistory ?? [])
  const isDad = userRole === 'dad'

  return (
    <main className="flex-1 py-8 px-4 md:px-8 max-w-2xl mx-auto w-full">
      {/* Page Header */}
      <div className="mb-6 animate-fade-in-up">
        <h1 className="text-2xl font-bold font-display text-[--cream]">Your Dad Journey</h1>
        <p className="text-[--muted] mt-1 text-sm font-body">
          7 real challenges, real talk, and things you can actually do.
        </p>
      </div>

      {/* Mood history summary (if available) */}
      {moodHistory && moodHistory.length > 0 && (
        <Reveal variant="card" delay={80} className="mb-5 rounded-xl bg-[--surface] border border-[--border] p-4 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[--muted]" />
              <p className="text-sm font-semibold font-ui text-[--cream]">Recent mood</p>
            </div>
            {streak > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold-dim border border-gold/20">
                <Flame className="h-3.5 w-3.5 text-gold" />
                <span className="text-xs font-semibold font-ui text-gold">
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
                  <span className="text-[10px] text-[--dim] font-ui">{dayLabel}</span>
                </div>
              )
            })}
          </div>
        </Reveal>
      )}

      {/* Mood check-in widget (always shown for dads) */}
      {isDad && (
        <Reveal variant="card" delay={160} className="mb-5">
          <MoodCheckinWidget />
        </Reveal>
      )}

      {/* All 7 challenge tiles */}
      <Reveal delay={240}>
        <p className="text-xs font-semibold font-ui text-[--muted] uppercase tracking-wider mb-3">
          Your challenges
        </p>
        <DadChallengeTiles maxTiles={7} />
      </Reveal>
    </main>
  )
}
