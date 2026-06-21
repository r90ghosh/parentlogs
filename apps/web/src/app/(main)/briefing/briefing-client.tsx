'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCurrentBriefing, useBriefingByWeek } from '@/hooks/use-briefings'
import { useRequirePremium } from '@/hooks/use-subscription'
import { useUser } from '@/components/user-provider'
import { PaywallOverlay } from '@/components/shared/paywall-overlay'
import { isPregnancyStage } from '@tdc/shared/utils'
import { Panel } from '@/components/digest'
import { BriefingReader } from '@/components/briefings/briefing-reader'
import { usePageHeader } from '@/components/layouts/topbar-context'
import { trackActivity } from '@/lib/track-activity'

export default function BriefingClient() {
  const searchParams = useSearchParams()
  const { data: currentBriefing, isLoading } = useCurrentBriefing()
  const { isPremium } = useRequirePremium()
  const { profile, family, activeBaby } = useUser()

  const [viewingWeek, setViewingWeek] = useState<number | null>(null)
  const stage = activeBaby?.stage || family?.stage || 'first-trimester'
  const currentWeek = activeBaby?.current_week ?? family?.current_week ?? 1
  const isPregnancy = isPregnancyStage(stage)
  const maxWeek = isPregnancy ? 40 : 104

  useEffect(() => {
    if (profile?.id) trackActivity(profile.id, 'briefing_viewed')
  }, [profile?.id])

  useEffect(() => {
    const weekParam = searchParams.get('week')
    if (weekParam) {
      const week = parseInt(weekParam, 10)
      if (!isNaN(week) && week !== currentWeek) setViewingWeek(week)
    }
  }, [searchParams, currentWeek])

  const weekToView = viewingWeek ?? currentWeek
  const { data: weekBriefing } = useBriefingByWeek(stage, weekToView)
  const displayBriefing = viewingWeek !== null ? weekBriefing : currentBriefing

  const freeWindowAnchor = profile.signup_week ?? currentWeek
  const isPremiumLocked = !isPremium && Math.abs(weekToView - freeWindowAnchor) > 4

  const handleNavigate = (week: number) => {
    if (week >= 1 && week <= maxWeek) setViewingWeek(week === currentWeek ? null : week)
  }

  usePageHeader(
    { title: 'Briefing', subtitle: `Week ${weekToView}${displayBriefing?.title ? ` · ${displayBriefing.title}` : ''}` },
    [weekToView, displayBriefing?.title]
  )

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[minmax(0,1fr)_336px]">
        <div className="space-y-[18px]">
          <div className="h-44 animate-pulse rounded-[20px] bg-card2" />
          <div className="h-40 animate-pulse rounded-[18px] bg-card2" />
          <div className="h-40 animate-pulse rounded-[18px] bg-card2" />
        </div>
        <div className="space-y-[18px]">
          <div className="h-24 animate-pulse rounded-[18px] bg-card2" />
          <div className="h-48 animate-pulse rounded-[18px] bg-card2" />
        </div>
      </div>
    )
  }

  if (isPremiumLocked) {
    return (
      <div className="flex items-center justify-center py-10">
        <PaywallOverlay feature="briefings_beyond_4_weeks" />
      </div>
    )
  }

  if (!displayBriefing) {
    return (
      <div className="mx-auto max-w-md py-12 text-center">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => handleNavigate(weekToView - 1)}
            disabled={weekToView <= 1}
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-card text-ink2 disabled:opacity-35"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-lg font-extrabold text-ink">Week {weekToView}</span>
          <button
            onClick={() => handleNavigate(weekToView + 1)}
            disabled={weekToView >= maxWeek}
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-card text-ink2 disabled:opacity-35"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <Panel className="mt-6 p-12">
          <p className="text-[15px] text-mute">No briefing available for this week.</p>
          <Link href="/briefing/archive" className="mt-4 inline-block text-sm font-bold text-clay-ink hover:opacity-80">
            Browse all briefings →
          </Link>
        </Panel>
      </div>
    )
  }

  return (
    <BriefingReader
      briefing={displayBriefing}
      weekToView={weekToView}
      currentWeek={currentWeek}
      maxWeek={maxWeek}
      isPregnancy={isPregnancy}
      role={profile.role}
      isArchiveWeek={viewingWeek !== null && viewingWeek !== currentWeek}
      onNavigate={handleNavigate}
      onBackToCurrent={() => setViewingWeek(null)}
    />
  )
}
