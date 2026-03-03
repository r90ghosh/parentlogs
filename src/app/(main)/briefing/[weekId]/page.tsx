'use client'

import { useParams, useRouter } from 'next/navigation'
import { useBriefingByWeek } from '@/hooks/use-briefings'
import { useFamily } from '@/hooks/use-family'
import { useRequirePremium } from '@/hooks/use-require-auth'
import { Skeleton } from '@/components/ui/skeleton'
import { PaywallOverlay } from '@/components/shared/paywall-overlay'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { isPregnancyStage } from '@/lib/pregnancy-utils'
import { getBabySize } from '@/lib/baby-sizes'

import {
  BriefingHero,
  BabySizeCard,
  BriefingProgressBar,
  BriefingSection,
  QuickStats,
  DadFocusList,
} from '@/components/briefings'

export default function BriefingWeekPage() {
  const params = useParams()
  const router = useRouter()
  const { data: family } = useFamily()
  const { isPremium } = useRequirePremium()

  const weekId = parseInt(params.weekId as string, 10)
  const stage = family?.stage || 'first-trimester'
  const currentWeek = family?.current_week || 1
  const isPregnancy = isPregnancyStage(stage)
  const maxWeek = isPregnancy ? 40 : 104

  const { data: briefing, isLoading } = useBriefingByWeek(stage, weekId)

  const babySize = isPregnancy ? getBabySize(weekId) : undefined
  const isPremiumLocked = !isPremium && Math.abs(weekId - currentWeek) > 4

  const handleNavigate = (week: number) => {
    if (week >= 1 && week <= maxWeek) {
      router.push(`/briefing/${week}`)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="p-6 md:p-12 space-y-6">
          <Skeleton className="h-[300px] w-full rounded-2xl" />
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
            <div className="space-y-6">
              <Skeleton className="h-48 w-full rounded-2xl" />
              <Skeleton className="h-48 w-full rounded-2xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isPremiumLocked) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <PaywallOverlay feature="briefings_beyond_4_weeks" />
      </div>
    )
  }

  if (!briefing) {
    return (
      <div className="min-h-screen">
        <div className="bg-gradient-to-br from-teal-500/[0.15] via-cyan-500/[0.08] to-transparent border-b border-white/[0.06] px-6 md:px-12 py-10">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => handleNavigate(weekId - 1)}
              disabled={weekId <= 1}
              className="p-2 rounded-lg hover:bg-white/5 text-zinc-500 disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-white">Week {weekId}</h1>
            <button
              onClick={() => handleNavigate(weekId + 1)}
              disabled={weekId >= maxWeek}
              className="p-2 rounded-lg hover:bg-white/5 text-zinc-500 disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-6 md:p-12 text-center">
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-12">
            <p className="text-zinc-400 text-lg">No briefing available for Week {weekId}.</p>
            <Button
              variant="ghost"
              className="mt-4 text-teal-500 hover:text-teal-400"
              onClick={() => router.push('/briefing')}
            >
              Back to current briefing
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <BriefingHero
        briefing={briefing}
        currentWeek={currentWeek}
        viewingWeek={weekId}
        maxWeek={maxWeek}
        onNavigate={handleNavigate}
        isPregnancy={isPregnancy}
      />

      <div className="px-4 md:px-12 py-6 max-w-7xl mx-auto">
        {weekId !== currentWeek && (
          <button
            onClick={() => router.push('/briefing')}
            className="mb-4 text-sm text-teal-500 hover:text-teal-400 flex items-center gap-1"
          >
            &larr; Back to current week (Week {currentWeek})
          </button>
        )}

        {isPregnancy && <BriefingProgressBar currentWeek={weekId} />}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 mt-6">
          <div className="space-y-6">
            <BriefingSection type="baby" title="Baby Update" icon="👶">
              <p className="whitespace-pre-line">{briefing.baby_update}</p>
            </BriefingSection>

            <BriefingSection type="mom" title="What Mom's Experiencing" icon="💝">
              <p className="whitespace-pre-line">{briefing.mom_update}</p>
            </BriefingSection>

            <BriefingSection type="dad" title="Your Focus This Week" icon="🎯">
              <p className="mb-4">Here&apos;s what to focus on this week:</p>
              <DadFocusList items={briefing.dad_focus} />
            </BriefingSection>

            <BriefingSection type="relationship" title="Relationship Check-In" icon="💜">
              <p className="whitespace-pre-line">{briefing.relationship_tip}</p>
            </BriefingSection>

            {briefing.coming_up && (
              <BriefingSection type="coming" title="Coming Up" icon="📆">
                <p className="whitespace-pre-line">{briefing.coming_up}</p>
              </BriefingSection>
            )}
          </div>

          <div className="space-y-4">
            {isPregnancy && babySize && (
              <BabySizeCard size={babySize} week={weekId} />
            )}
            {isPregnancy && (
              <QuickStats
                week={weekId}
                babySize={babySize}
                dueDate={family?.due_date}
              />
            )}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="flex justify-between mt-10 pt-6 border-t border-white/[0.06]">
          <Button
            variant="outline"
            onClick={() => handleNavigate(weekId - 1)}
            disabled={weekId <= 1}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous Week
          </Button>
          <Button
            onClick={() => handleNavigate(weekId + 1)}
            disabled={weekId >= maxWeek}
            className="gap-2"
          >
            Next Week
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
