'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useBriefingByWeek } from '@/hooks/use-briefings'
import { useFamily } from '@/hooks/use-family'
import { useRequirePremium } from '@/hooks/use-require-auth'
import { useUser } from '@/components/user-provider'
import { Skeleton } from '@/components/ui/skeleton'
import { PaywallOverlay } from '@/components/shared/paywall-overlay'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { isPregnancyStage } from '@/lib/pregnancy-utils'
import { getBabySize } from '@/lib/baby-sizes'

import {
  BriefingHero,
  BabySizeCard,
  BriefingProgressBar,
  BriefingSection,
  HighlightBox,
  QuickStats,
  DadFocusList,
  BriefingLinkedTasks,
} from '@/components/briefings'

export default function BriefingWeekPage() {
  const params = useParams()
  const rawWeekId = params.weekId as string
  const parsedWeek = parseInt(rawWeekId, 10)

  const { data: family } = useFamily()
  const { isPremium } = useRequirePremium()
  const { profile, family: userFamily } = useUser()

  const stage = family?.stage || 'first-trimester'
  const currentWeek = family?.current_week || 1
  const isPregnancy = isPregnancyStage(stage)
  const maxWeek = isPregnancy ? 40 : 104

  // Clamp the week to valid range
  const weekToView = !isNaN(parsedWeek)
    ? Math.max(1, Math.min(parsedWeek, maxWeek))
    : currentWeek

  const [localWeek, setLocalWeek] = useState<number>(weekToView)

  const { data: briefing, isLoading } = useBriefingByWeek(stage, localWeek)

  // Get baby size for pregnancy weeks
  const babySize = isPregnancy ? getBabySize(localWeek) : undefined

  // Premium check: Free users get 4 weeks from their signup week
  const freeWindowAnchor = profile.signup_week ?? currentWeek
  const isPremiumLocked = !isPremium && Math.abs(localWeek - freeWindowAnchor) > 4

  // Family ID for linked tasks
  const familyId = userFamily?.id ?? profile.family_id

  const handleNavigate = (week: number) => {
    if (week >= 1 && week <= maxWeek) {
      setLocalWeek(week)
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
              <Skeleton className="h-48 w-full rounded-2xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 w-full rounded-2xl" />
              <Skeleton className="h-48 w-full rounded-2xl" />
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
        {/* Navigation */}
        <div className="bg-gradient-to-br from-teal-500/[0.15] via-cyan-500/[0.08] to-transparent border-b border-white/[0.06] px-6 md:px-12 py-10">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => handleNavigate(localWeek - 1)}
              disabled={localWeek <= 1}
              className="p-2 rounded-lg hover:bg-white/5 text-zinc-500 disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-white">Week {localWeek}</h1>
            <button
              onClick={() => handleNavigate(localWeek + 1)}
              disabled={localWeek >= maxWeek}
              className="p-2 rounded-lg hover:bg-white/5 text-zinc-500 disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 md:p-12 text-center">
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-12">
            <p className="text-zinc-400 text-lg">No briefing available for Week {localWeek}.</p>
            <Link
              href="/briefing"
              className="inline-block mt-4 text-teal-500 hover:text-teal-400"
            >
              ← Back to current week
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      {/* Hero Section */}
      <BriefingHero
        briefing={briefing}
        currentWeek={currentWeek}
        viewingWeek={localWeek}
        maxWeek={maxWeek}
        onNavigate={handleNavigate}
        isPregnancy={isPregnancy}
      />

      {/* Content Area */}
      <div className="px-4 md:px-12 py-6 max-w-7xl mx-auto">
        {/* Back to current week link */}
        {localWeek !== currentWeek && (
          <Link
            href="/briefing"
            className="mb-4 inline-flex text-sm text-teal-500 hover:text-teal-400 items-center gap-1"
          >
            ← Back to current week (Week {currentWeek})
          </Link>
        )}

        {/* Progress Bar - only for pregnancy */}
        {isPregnancy && <BriefingProgressBar currentWeek={localWeek} />}

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 mt-6">
          {/* Main Sections */}
          <div className="space-y-6">
            {/* Baby Update */}
            <BriefingSection type="baby" title="Baby Update" icon="👶">
              <p className="whitespace-pre-line">{briefing.baby_update}</p>
              {localWeek === 12 && (
                <HighlightBox icon="💡" color="teal">
                  Miscarriage risk drops to about 2% after seeing a heartbeat at 12 weeks.
                  This is why many couples choose to announce after this milestone.
                </HighlightBox>
              )}
            </BriefingSection>

            {/* Mom Update */}
            <BriefingSection type="mom" title="What Mom's Experiencing" icon="💝">
              <p className="whitespace-pre-line">{briefing.mom_update}</p>
            </BriefingSection>

            {/* Dad Focus */}
            <BriefingSection type="dad" title="Your Focus This Week" icon="🎯">
              <p className="mb-4">Here's what to focus on this week:</p>
              <DadFocusList items={briefing.dad_focus} />
            </BriefingSection>

            {/* Inline task completion for this briefing week */}
            {familyId && (
              <BriefingLinkedTasks
                weekNumber={localWeek}
                familyId={familyId}
              />
            )}

            {/* Relationship Tip */}
            <BriefingSection type="relationship" title="Relationship Check-In" icon="💜">
              <p className="whitespace-pre-line">{briefing.relationship_tip}</p>
            </BriefingSection>

            {/* Coming Up */}
            {briefing.coming_up && (
              <BriefingSection type="coming" title="Coming Up" icon="📆">
                <p className="whitespace-pre-line">{briefing.coming_up}</p>
              </BriefingSection>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Baby Size Card */}
            {isPregnancy && babySize && (
              <BabySizeCard size={babySize} week={localWeek} />
            )}
            {/* Quick Stats */}
            {isPregnancy && (
              <QuickStats
                week={localWeek}
                babySize={babySize}
                dueDate={family?.due_date}
              />
            )}
          </div>
        </div>

        {/* Footer navigation */}
        <footer className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-10 pt-6 border-t border-white/[0.06]">
          <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
            <span className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-medium">
              ✓ Medically Reviewed
            </span>
            {briefing.medical_source && (
              <span>Sources: {briefing.medical_source}</span>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleNavigate(localWeek - 1)}
              disabled={localWeek <= 1}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium',
                'bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:bg-white/[0.08] hover:text-zinc-200 transition-all',
                localWeek <= 1 && 'opacity-50 pointer-events-none'
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous Week
            </button>
            <button
              onClick={() => handleNavigate(localWeek + 1)}
              disabled={localWeek >= maxWeek}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium',
                'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-teal-500/25 transition-all',
                localWeek >= maxWeek && 'opacity-50 pointer-events-none'
              )}
            >
              Next Week
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </footer>

        {/* Archive Link */}
        <div className="text-center mt-8">
          <Link
            href="/briefing/archive"
            className="text-sm text-teal-500 hover:text-teal-400 transition-colors"
          >
            View All Briefings →
          </Link>
        </div>
      </div>
    </div>
  )
}
