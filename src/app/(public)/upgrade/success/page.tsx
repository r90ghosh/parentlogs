'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Crown, Users, ArrowRight, CheckCircle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const UNLOCKED_FEATURES = [
  { label: 'Full task timeline', detail: 'Pregnancy through 24 months' },
  { label: 'All weekly briefings', detail: '40+ weeks of guidance' },
  { label: 'Push notifications', detail: 'Never miss a task or briefing' },
  { label: 'Partner sync', detail: 'Real-time coordination' },
  { label: 'Advanced tracker', detail: 'All log types + history' },
  { label: 'Complete budget planner', detail: 'Full access' },
  { label: 'Mood trends & insights', detail: 'Pattern analysis' },
]

export default function UpgradeSuccessPage() {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    setShowConfetti(true)
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="max-w-lg w-full"
      >
        {/* Celebration header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-6"
          >
            <Crown className="h-10 w-10 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-white mb-2"
          >
            Welcome to Premium!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-zinc-400"
          >
            You&apos;ve unlocked the full Dad Center experience.
          </motion.p>
        </div>

        {/* What's unlocked */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={cn(
            'rounded-2xl p-6 mb-6',
            'bg-gradient-to-br from-zinc-800 to-zinc-900',
            'border border-white/[0.06]'
          )}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-semibold text-white">What&apos;s now unlocked</span>
          </div>

          <div className="space-y-3">
            {UNLOCKED_FEATURES.map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                className="flex items-center gap-3"
              >
                <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-white">{feature.label}</span>
                  <span className="text-xs text-zinc-500 ml-2">{feature.detail}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="space-y-3"
        >
          {/* Primary CTA: Invite partner */}
          <Button asChild className="w-full py-6 text-base bg-accent-500 hover:bg-accent-600">
            <Link href="/settings/family">
              <Users className="h-5 w-5 mr-2" />
              Invite your partner now
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>

          {/* Secondary CTA: Go to dashboard */}
          <Button asChild variant="outline" className="w-full py-5 border-surface-700 text-zinc-300 hover:bg-surface-800">
            <Link href="/dashboard">
              Go to Dashboard
            </Link>
          </Button>
        </motion.div>

        {/* Trust signal */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center text-xs text-zinc-600 mt-6"
        >
          30-day money-back guarantee on all plans
        </motion.p>
      </motion.div>
    </div>
  )
}
