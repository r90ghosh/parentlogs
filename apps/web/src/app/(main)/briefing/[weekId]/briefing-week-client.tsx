'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useBriefingByWeek } from '@/hooks/use-briefings'
import { useRequirePremium } from '@/hooks/use-subscription'
import { useUser } from '@/components/user-provider'
import { PaywallOverlay } from '@/components/shared/paywall-overlay'
import { isPregnancyStage } from '@tdc/shared/utils'
import { Panel } from '@/components/digest'
import { BriefingReader } from '@/components/briefings/briefing-reader'
import { usePageHeader } from '@/components/layouts/topbar-context'

export default function BriefingWeekClient() {
  const params = useParams()
  const router = useRouter()
  const rawWeekId = params.weekId as string
  const parsedWeek = parseInt(rawWeekId, 10)

  const { isPremium } = useRequirePremium()
  const { profile, family, activeBaby } = useUser()

  const stage = activeBaby?.stage || family?.stage || 'first-trimester'
  const currentWeek = activeBaby?.current_week ?? family?.current_week ?? 1
  const isPregnancy = isPregnancyStage(stage)
  const maxWeek = isPregnancy ? 40 : 104

  const initialWeek = !isNaN(parsedWeek) ? Math.max(1, Math.min(parsedWeek, maxWeek)) : currentWeek
  const [localWeek, setLocalWeek] = useState<number>(initialWeek)

  const { data: briefing, isLoading } = useBriefingByWeek(stage, localWeek)
  const freeWindowAnchor = profile.signup_week ?? currentWeek
  const isPremiumLocked = !isPremium && Math.abs(localWeek - freeWindowAnchor) > 4

  const handleNavigate = (week: number) => {
    if (week >= 1 && week <= maxWeek) setLocalWeek(week)
  }

  usePageHeader(
    { title: 'Briefing', subtitle: `Week ${localWeek}${briefing?.title ? ` · ${briefing.title}` : ''}` },
    [localWeek, briefing?.title]
  )

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[minmax(0,1fr)_336px]">
        <div className="space-y-[18px]">
          <div className="h-44 animate-pulse rounded-[20px] bg-card2" />
          <div className="h-40 animate-pulse rounded-[18px] bg-card2" />
        </div>
        <div className="space-y-[18px]">
          <div className="h-24 animate-pulse rounded-[18px] bg-card2" />
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

  if (!briefing) {
    return (
      <div className="mx-auto max-w-md py-12 text-center">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => handleNavigate(localWeek - 1)}
            disabled={localWeek <= 1}
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-card text-ink2 disabled:opacity-35"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-lg font-extrabold text-ink">Week {localWeek}</span>
          <button
            onClick={() => handleNavigate(localWeek + 1)}
            disabled={localWeek >= maxWeek}
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-card text-ink2 disabled:opacity-35"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <Panel className="mt-6 p-12">
          <p className="text-[15px] text-mute">No briefing available for Week {localWeek}.</p>
          <Link href="/briefing" className="mt-4 inline-block text-sm font-bold text-clay-ink hover:opacity-80">
            ← Back to current week
          </Link>
        </Panel>
      </div>
    )
  }

  return (
    <BriefingReader
      briefing={briefing}
      weekToView={localWeek}
      currentWeek={currentWeek}
      maxWeek={maxWeek}
      isPregnancy={isPregnancy}
      role={profile.role}
      isArchiveWeek={localWeek !== currentWeek}
      onNavigate={handleNavigate}
      onBackToCurrent={() => router.push('/briefing')}
    />
  )
}
