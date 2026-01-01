'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useCurrentBriefing, useBriefingByWeek } from '@/hooks/use-briefings'
import { useFamily } from '@/hooks/use-family'
import { useRequirePremium } from '@/hooks/use-require-auth'
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
  RelatedTasks,
  DadFocusList,
} from '@/components/briefings'

export default function BriefingPage() {
  const searchParams = useSearchParams()
  const { data: family } = useFamily()
  const { data: currentBriefing, isLoading } = useCurrentBriefing()
  const { isPremium } = useRequirePremium()

  const [viewingWeek, setViewingWeek] = useState<number | null>(null)
  const stage = family?.stage || 'first-trimester'
  const currentWeek = family?.current_week || 1
  const isPregnancy = isPregnancyStage(stage)
  const maxWeek = isPregnancy ? 40 : 104

  // Handle URL params for week navigation from archive
  useEffect(() => {
    const weekParam = searchParams.get('week')
    if (weekParam) {
      const week = parseInt(weekParam, 10)
      if (!isNaN(week) && week !== currentWeek) {
        setViewingWeek(week)
      }
    }
  }, [searchParams, currentWeek])

  const weekToView = viewingWeek ?? currentWeek

  const { data: briefing } = useBriefingByWeek(stage, weekToView)
  const displayBriefing = viewingWeek !== null ? briefing : currentBriefing

  // Get baby size for pregnancy weeks
  const babySize = isPregnancy ? getBabySize(weekToView) : undefined

  // Premium check: Free users get 4 weeks from their current week
  const isPremiumLocked = !isPremium && Math.abs(weekToView - currentWeek) > 4

  const handleNavigate = (week: number) => {
    if (week >= 1 && week <= maxWeek) {
      setViewingWeek(week === currentWeek ? null : week)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen md:ml-64">
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

  // Locked content
  if (isPremiumLocked) {
    return (
      <div className="min-h-screen md:ml-64 flex items-center justify-center p-6">
        <PaywallOverlay feature="briefings_beyond_4_weeks" />
      </div>
    )
  }

  // No briefing available
  if (!displayBriefing) {
    return (
      <div className="min-h-screen md:ml-64">
        {/* Hero with navigation only */}
        <div className="bg-gradient-to-br from-teal-500/[0.15] via-cyan-500/[0.08] to-transparent border-b border-white/[0.06] px-6 md:px-12 py-10">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => handleNavigate(weekToView - 1)}
              disabled={weekToView <= 1}
              className="p-2 rounded-lg hover:bg-white/5 text-zinc-500 disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-white">Week {weekToView}</h1>
            <button
              onClick={() => handleNavigate(weekToView + 1)}
              disabled={weekToView >= maxWeek}
              className="p-2 rounded-lg hover:bg-white/5 text-zinc-500 disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 md:p-12 text-center">
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-12">
            <p className="text-zinc-400 text-lg">No briefing available for this week.</p>
            <Link
              href="/briefing/archive"
              className="inline-block mt-4 text-teal-500 hover:text-teal-400"
            >
              Browse all briefings →
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
        briefing={displayBriefing}
        currentWeek={currentWeek}
        viewingWeek={weekToView}
        maxWeek={maxWeek}
        onNavigate={handleNavigate}
        isPregnancy={isPregnancy}
      />

      {/* Content Area */}
      <div className="px-4 md:px-12 py-6 max-w-7xl mx-auto md:ml-64">
        {/* Back to current week button */}
        {viewingWeek !== null && viewingWeek !== currentWeek && (
          <button
            onClick={() => setViewingWeek(null)}
            className="mb-4 text-sm text-teal-500 hover:text-teal-400 flex items-center gap-1"
          >
            ← Back to current week (Week {currentWeek})
          </button>
        )}

        {/* Progress Bar - only for pregnancy */}
        {isPregnancy && <BriefingProgressBar currentWeek={weekToView} />}

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 mt-6">
          {/* Main Sections */}
          <div className="space-y-6">
            {/* Baby Update */}
            <BriefingSection type="baby" title="Baby Update" icon="👶">
              <p className="whitespace-pre-line">{displayBriefing.baby_update}</p>
              {weekToView === 12 && (
                <HighlightBox icon="💡" color="teal">
                  Miscarriage risk drops to about 2% after seeing a heartbeat at 12 weeks.
                  This is why many couples choose to announce after this milestone.
                </HighlightBox>
              )}
            </BriefingSection>

            {/* Mom Update */}
            <BriefingSection type="mom" title="What Mom's Experiencing" icon="💝">
              <p className="whitespace-pre-line">{displayBriefing.mom_update}</p>
            </BriefingSection>

            {/* Dad Focus */}
            <BriefingSection type="dad" title="Your Focus This Week" icon="🎯">
              <p className="mb-4">Here's what to focus on this week:</p>
              <DadFocusList items={displayBriefing.dad_focus} />
            </BriefingSection>

            {/* Relationship Tip */}
            <BriefingSection type="relationship" title="Relationship Check-In" icon="💜">
              <p className="whitespace-pre-line">{displayBriefing.relationship_tip}</p>
            </BriefingSection>

            {/* Coming Up */}
            {displayBriefing.coming_up && (
              <BriefingSection type="coming" title="Coming Up" icon="📆">
                <p className="whitespace-pre-line">{displayBriefing.coming_up}</p>
              </BriefingSection>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Baby Size Card */}
            {isPregnancy && babySize && (
              <BabySizeCard size={babySize} week={weekToView} />
            )}
            {/* Quick Stats */}
            {isPregnancy && (
              <QuickStats
                week={weekToView}
                babySize={babySize}
                dueDate={family?.due_date}
              />
            )}
            <RelatedTasks linkedTaskIds={displayBriefing.linked_task_ids} />
          </div>
        </div>

        {/* Footer */}
        <footer className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-10 pt-6 border-t border-white/[0.06]">
          <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
            <span className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-medium">
              ✓ Medically Reviewed
            </span>
            {displayBriefing.medical_source && (
              <span>Sources: {displayBriefing.medical_source}</span>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleNavigate(weekToView - 1)}
              disabled={weekToView <= 1}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium',
                'bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:bg-white/[0.08] hover:text-zinc-200 transition-all',
                weekToView <= 1 && 'opacity-50 pointer-events-none'
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous Week
            </button>
            <button
              onClick={() => handleNavigate(weekToView + 1)}
              disabled={weekToView >= maxWeek}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium',
                'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-teal-500/25 transition-all',
                weekToView >= maxWeek && 'opacity-50 pointer-events-none'
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
