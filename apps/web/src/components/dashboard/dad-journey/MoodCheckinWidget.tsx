'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useUser } from '@/components/user-provider'
import { useLastCheckin, useSubmitMoodCheckin, useMoodHistory } from '@/hooks/use-dad-journey'
import { MOOD_CONFIG, SITUATION_FLAGS } from '@tdc/shared/constants'
import { MoodLevel } from '@tdc/shared/types/dad-journey'
import { Flame } from 'lucide-react'

/**
 * Calculate consecutive-day streak from an ordered list of mood check-ins
 * (newest first). Each entry represents one check-in; streak = consecutive days.
 */
function calculateStreak(checkins: { checked_in_at: string }[]): number {
  if (!checkins.length) return 0

  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Walk backwards day by day from today
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

export function MoodCheckinWidget() {
  const { user, family } = useUser()
  const { data: lastCheckin, isLoading: checkinLoading } = useLastCheckin(user.id)
  const { data: moodHistory } = useMoodHistory(user.id, 7)
  const submitMood = useSubmitMoodCheckin()

  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(null)
  const [selectedFlags, setSelectedFlags] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const streak = calculateStreak(moodHistory ?? [])

  const handleMoodSelect = (level: MoodLevel) => {
    setSelectedMood(level)
  }

  const toggleFlag = (key: string) => {
    setSelectedFlags(prev =>
      prev.includes(key) ? prev.filter(f => f !== key) : [...prev, key]
    )
  }

  const handleSubmit = async () => {
    if (!selectedMood || !family?.id) return
    setIsSubmitting(true)
    try {
      await submitMood.mutateAsync({
        userId: user.id,
        familyId: family.id,
        mood: selectedMood,
        situationFlags: selectedFlags,
      })
    } catch {
      // Mutation error — handled silently; checkin state won't update
    } finally {
      setIsSubmitting(false)
    }
  }

  // Loading state
  if (checkinLoading) {
    return (
      <div className="rounded-xl bg-[--card] border border-[--border] p-4 animate-pulse">
        <div className="h-4 w-40 bg-[--card-hover] rounded mb-3" />
        <div className="flex gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 w-10 bg-[--card-hover] rounded-full" />
          ))}
        </div>
      </div>
    )
  }

  // State 2: Already checked in today
  if (lastCheckin) {
    const moodCfg = MOOD_CONFIG.find(m => m.level === lastCheckin.mood) ?? MOOD_CONFIG[2]
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-[--card] border border-[--border] shadow-card px-4 py-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl leading-none">{moodCfg.emoji}</span>
            <div>
              <span className="text-sm font-body text-[--muted]">Today: </span>
              <span className={cn('text-sm font-medium font-ui', moodCfg.color)}>
                {moodCfg.label.toLowerCase()}
              </span>
            </div>
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
      </motion.div>
    )
  }

  // State 1: Not checked in today
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-[--card] border border-[--border] shadow-card p-4"
    >
      <p className="text-sm font-semibold font-ui text-[--cream] mb-3">How are you feeling today?</p>

      {/* Emoji mood selector */}
      <div className="flex gap-2 mb-4">
        {MOOD_CONFIG.map(cfg => (
          <button
            key={cfg.level}
            onClick={() => handleMoodSelect(cfg.level)}
            className={cn(
              'flex-1 flex flex-col items-center gap-1 py-2 rounded-lg transition-colors border',
              selectedMood === cfg.level
                ? 'bg-[--card-hover] border-copper/30'
                : 'border-transparent hover:bg-[--card-hover]/60'
            )}
            title={cfg.label}
            aria-label={cfg.label}
          >
            <span className="text-2xl leading-none">{cfg.emoji}</span>
            <span className={cn('text-[10px] font-medium font-ui', cfg.color)}>
              {cfg.label}
            </span>
          </button>
        ))}
      </div>

      {/* Situation flags (shown after mood selected) */}
      <AnimatePresence>
        {selectedMood && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="text-xs font-body text-[--muted] mb-2">Anything going on? (optional)</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {SITUATION_FLAGS.map(flag => (
                <button
                  key={flag.key}
                  onClick={() => toggleFlag(flag.key)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium font-ui transition-colors border',
                    selectedFlags.includes(flag.key)
                      ? 'bg-copper-dim border-copper/50 text-copper'
                      : 'bg-[--card-hover] border-[--border] text-[--muted] hover:border-[--border-hover]'
                  )}
                >
                  <span>{flag.emoji}</span>
                  {flag.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={cn(
                'w-full py-2.5 rounded-lg text-sm font-semibold font-ui transition-colors',
                'bg-copper text-[--white] hover:bg-copper-hover',
                'disabled:opacity-60 disabled:cursor-not-allowed'
              )}
            >
              {isSubmitting ? 'Checking in…' : 'Check in'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
