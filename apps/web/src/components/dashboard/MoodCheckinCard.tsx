'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useUser } from '@/components/user-provider'
import { useLastCheckin, useSubmitMoodCheckin, useMoodHistory } from '@/hooks/use-dad-journey'
import { MOOD_CONFIG, SITUATION_FLAGS } from '@/lib/dad-pillar-config'
import { MoodLevel } from '@/types/dad-journey'
import { Skeleton } from '@/components/ui/skeleton'

export function MoodCheckinCard() {
  const { profile, family } = useUser()
  const { data: lastCheckin, isLoading } = useLastCheckin(profile.id)
  const { data: history } = useMoodHistory(profile.id, 30)
  const submitMood = useSubmitMoodCheckin()

  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(null)
  const [selectedFlags, setSelectedFlags] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculate streak from history
  const streak = (() => {
    if (!history || history.length === 0) return 0
    let count = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < history.length; i++) {
      const checkinDate = new Date(history[i].checked_in_at)
      checkinDate.setHours(0, 0, 0, 0)
      const expectedDate = new Date(today)
      expectedDate.setDate(today.getDate() - i)

      if (checkinDate.getTime() === expectedDate.getTime()) {
        count++
      } else {
        break
      }
    }
    return count
  })()

  const handleMoodSelect = (mood: MoodLevel) => {
    setSelectedMood(mood)
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
        userId: profile.id,
        familyId: family.id,
        mood: selectedMood,
        situationFlags: selectedFlags,
      })
    } finally {
      setIsSubmitting(false)
      setSelectedMood(null)
      setSelectedFlags([])
    }
  }

  if (isLoading) {
    return <Skeleton className="h-24 w-full rounded-[20px]" />
  }

  // Already checked in today — show compact state
  if (lastCheckin) {
    const moodCfg = MOOD_CONFIG.find(m => m.level === lastCheckin.mood)
    const showCrisisResources = lastCheckin.mood === 'struggling' || lastCheckin.mood === 'rough'
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'rounded-[20px] px-5 py-4 card-copper-top',
          'bg-[--card]',
          'border border-[--border]',
          'shadow-card'
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{moodCfg?.emoji}</span>
            <div>
              <div className="text-sm font-semibold font-ui text-[--cream]">
                Today: feeling <span className={moodCfg?.color}>{moodCfg?.label.toLowerCase()}</span>
              </div>
              <div className="text-xs text-[--muted] font-body">Mood checked in</div>
            </div>
          </div>
          {streak > 1 && (
            <div className="flex items-center gap-1.5 text-xs text-gold font-medium font-ui">
              <span>🔥</span>
              <span>{streak}-day streak</span>
            </div>
          )}
        </div>
        {showCrisisResources && (
          <div className="mt-3 pt-3 border-t border-[--border]">
            <p className="font-body text-[11px] text-[--muted] leading-relaxed">
              If you&apos;re experiencing persistent feelings of hopelessness, help is available 24/7:{' '}
              <span className="text-[--cream]">988 Suicide &amp; Crisis Lifeline</span> (call or text 988)
              {' | '}
              <span className="text-[--cream]">Postpartum Support International:</span> 1-800-944-4773
            </p>
          </div>
        )}
      </motion.div>
    )
  }

  // Not yet checked in — show full selector
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-[20px] px-4 py-3 card-copper-top',
        'bg-[--card]',
        'border border-[--border]',
        'shadow-card'
      )}
    >
      <div className="text-sm font-semibold font-ui text-[--cream] mb-2.5">
        How are you feeling today?
      </div>

      {/* Mood emoji buttons */}
      <div className="flex items-center justify-between">
        {MOOD_CONFIG.map(({ level, emoji, label }) => (
          <button
            key={level}
            onClick={() => handleMoodSelect(level)}
            className={cn(
              'flex flex-col items-center gap-1 px-2 sm:px-3 py-1.5 rounded-xl transition-all',
              'hover:bg-[--card-hover]',
              selectedMood === level
                ? 'bg-[--card-hover] ring-1 ring-copper/30 scale-110'
                : 'opacity-70 hover:opacity-100'
            )}
          >
            <span className="text-xl">{emoji}</span>
            <span className="text-[10px] text-[--muted] font-ui">{label}</span>
          </button>
        ))}
      </div>

      {/* Situation flags — appear after mood selection */}
      <AnimatePresence>
        {selectedMood && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mt-2.5"
          >
            <div className="text-xs text-[--muted] font-body mb-1.5">Anything going on? (optional)</div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {SITUATION_FLAGS.map(({ key, emoji, label }) => (
                <button
                  key={key}
                  onClick={() => toggleFlag(key)}
                  className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all font-ui',
                    'border',
                    selectedFlags.includes(key)
                      ? 'bg-copper-dim border-copper/30 text-[--cream]'
                      : 'bg-transparent border-[--border] text-[--muted] hover:border-[--border-hover]'
                  )}
                >
                  <span>{emoji}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={cn(
                'w-full py-2 rounded-xl text-sm font-semibold transition-all font-ui',
                'bg-copper text-[--white] hover:bg-copper-hover',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {isSubmitting ? 'Checking in...' : 'Check in'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
