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
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'rounded-[20px] px-5 py-4',
          'bg-gradient-to-br from-zinc-800 to-zinc-900',
          'border border-white/[0.06]',
          'flex items-center justify-between'
        )}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{moodCfg?.emoji}</span>
          <div>
            <div className="text-sm font-semibold text-white">
              Today: feeling <span className={moodCfg?.color}>{moodCfg?.label.toLowerCase()}</span>
            </div>
            <div className="text-xs text-zinc-500">Mood checked in</div>
          </div>
        </div>
        {streak > 1 && (
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
            <span>🔥</span>
            <span>{streak}-day streak</span>
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
        'rounded-[20px] p-5',
        'bg-gradient-to-br from-zinc-800 to-zinc-900',
        'border border-white/[0.06]'
      )}
    >
      <div className="text-sm font-semibold text-zinc-300 mb-4">
        How are you feeling today?
      </div>

      {/* Mood emoji buttons */}
      <div className="flex items-center justify-between mb-4">
        {MOOD_CONFIG.map(({ level, emoji, label }) => (
          <button
            key={level}
            onClick={() => handleMoodSelect(level)}
            className={cn(
              'flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl transition-all',
              'hover:bg-white/[0.06]',
              selectedMood === level
                ? 'bg-white/[0.08] ring-1 ring-white/20 scale-110'
                : 'opacity-70 hover:opacity-100'
            )}
          >
            <span className="text-2xl">{emoji}</span>
            <span className="text-[10px] text-zinc-400">{label}</span>
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
            className="overflow-hidden"
          >
            <div className="text-xs text-zinc-500 mb-2">Anything going on? (optional)</div>
            <div className="flex flex-wrap gap-2 mb-4">
              {SITUATION_FLAGS.map(({ key, emoji, label }) => (
                <button
                  key={key}
                  onClick={() => toggleFlag(key)}
                  className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all',
                    'border',
                    selectedFlags.includes(key)
                      ? 'bg-white/[0.08] border-white/20 text-white'
                      : 'bg-transparent border-white/[0.06] text-zinc-400 hover:border-white/10'
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
                'w-full py-2.5 rounded-xl text-sm font-semibold transition-all',
                'bg-amber-500 text-black hover:bg-amber-400',
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
