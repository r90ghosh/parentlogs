'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, ArrowRight, TrendingUp, BookOpen } from 'lucide-react'
import { useUser } from '@/components/user-provider'
import { useFamily } from '@/hooks/use-family'
import { useDashboardData } from '@/hooks/use-dashboard'
import { cn } from '@/lib/utils'

type PromptPhase = 'invisible' | 'visible' | 'urgent'

function getUpgradePhase(daysSinceSignup: number): PromptPhase {
  if (daysSinceSignup <= 7) return 'invisible'
  if (daysSinceSignup <= 21) return 'visible'
  return 'urgent'
}

const DISMISS_KEY_USAGE = 'upgrade_prompt_usage_dismissed'
const DISMISS_KEY_BRIEFING = 'upgrade_prompt_briefing_dismissed'

export function UpgradePromptCard() {
  const { profile, activeBaby } = useUser()
  const { data: family } = useFamily()
  const currentWeek = activeBaby?.current_week ?? family?.current_week ?? 1
  const { data: dashboardData } = useDashboardData(
    profile.family_id,
    currentWeek
  )

  const [usageDismissed, setUsageDismissed] = useState(true)
  const [briefingDismissed, setBriefingDismissed] = useState(true)

  const isPremium = profile.subscription_tier === 'premium' || profile.subscription_tier === 'lifetime'

  // Use family creation date (when user completed onboarding), not profile.created_at
  // (which is when the auth account was created — could be weeks before onboarding)
  const daysSinceSignup = useMemo(() => {
    const startDate = family?.created_at || profile.created_at
    if (!startDate) return 0
    const date = new Date(startDate)
    const now = new Date()
    return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  }, [family?.created_at, profile.created_at])

  const phase = getUpgradePhase(daysSinceSignup)

  // Load dismiss state from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    setUsageDismissed(localStorage.getItem(DISMISS_KEY_USAGE) === 'true')
    setBriefingDismissed(localStorage.getItem(DISMISS_KEY_BRIEFING) === 'true')
  }, [])

  const handleDismissUsage = () => {
    localStorage.setItem(DISMISS_KEY_USAGE, 'true')
    setUsageDismissed(true)
  }

  const handleDismissBriefing = () => {
    localStorage.setItem(DISMISS_KEY_BRIEFING, 'true')
    setBriefingDismissed(true)
  }

  // Don't show anything for premium users or during invisible phase
  if (isPremium || phase === 'invisible') return null

  const tasksCompleted = dashboardData?.taskStats?.completed || 0

  // Day ~14+: Usage stats card (visible phase)
  const showUsageCard = phase === 'visible' && daysSinceSignup >= 14 && !usageDismissed && tasksCompleted > 0

  // Day ~28+: Briefing cutoff card (urgent phase)
  const showBriefingCard = phase === 'urgent' && !briefingDismissed

  return (
    <AnimatePresence>
      {showUsageCard && (
        <motion.div
          key="usage-prompt"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className={cn(
            'rounded-[20px] p-5 relative card-copper-top',
            'bg-[--card]',
            'border border-copper/20',
            'shadow-copper'
          )}
        >
          <button
            onClick={handleDismissUsage}
            className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-[--card-hover] text-[--muted] hover:text-[--cream] transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-3 mb-3">
            <div className="p-2 rounded-xl bg-copper-dim">
              <TrendingUp className="h-5 w-5 text-copper" />
            </div>
            <div>
              <h3 className="text-sm font-semibold font-display text-[--cream]">
                You&apos;re off to a great start
              </h3>
              <p className="text-xs font-body text-[--muted] mt-1">
                You&apos;ve completed {tasksCompleted} task{tasksCompleted !== 1 ? 's' : ''} so far.
                Unlock everything: partner sync, full timeline, push notifications, and more.
              </p>
            </div>
          </div>

          <Link
            href="/upgrade?source=dashboard_usage"
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold font-ui',
              'bg-copper text-[--white] hover:bg-copper-hover transition-colors'
            )}
          >
            <Sparkles className="h-4 w-4" />
            See Premium Plans
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      )}

      {showBriefingCard && (
        <motion.div
          key="briefing-prompt"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className={cn(
            'rounded-[20px] p-5 relative card-gold-top',
            'bg-[--card]',
            'border border-gold/20',
            'shadow-gold'
          )}
        >
          <button
            onClick={handleDismissBriefing}
            className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-[--card-hover] text-[--muted] hover:text-[--cream] transition-colors"
            aria-label="Maybe later"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-3 mb-3">
            <div className="p-2 rounded-xl bg-gold-dim">
              <BookOpen className="h-5 w-5 text-gold" />
            </div>
            <div>
              <h3 className="text-sm font-semibold font-display text-[--cream]">
                Your free briefings have ended
              </h3>
              <p className="text-xs font-body text-[--muted] mt-1">
                Week {currentWeek + 1} briefing is ready — upgrade to keep getting weekly guidance tailored to your exact week, all the way through age 2.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/upgrade?source=dashboard_briefing"
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold font-ui',
                'bg-gold text-[--bg] hover:bg-gold-hover transition-colors'
              )}
            >
              <Sparkles className="h-4 w-4" />
              Upgrade — $3.33/mo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              onClick={handleDismissBriefing}
              className="text-xs font-ui text-[--muted] hover:text-[--cream] transition-colors"
            >
              Maybe later
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
