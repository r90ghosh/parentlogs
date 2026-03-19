'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useCurrentBriefing, useBriefingByWeek } from '@/hooks/use-briefings'
import { useRequirePremium } from '@/hooks/use-subscription'
import { useUser } from '@/components/user-provider'
import { Skeleton } from '@/components/ui/skeleton'
import { PaywallOverlay } from '@/components/shared/paywall-overlay'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { isPregnancyStage } from '@/lib/pregnancy-utils'
import { getBabySize } from '@/lib/baby-sizes'
import { RevealOnScroll, Card3DTilt, CardEntrance, ScrollProgressBar } from '@/components/ui/animations'
import { MedicalDisclaimer } from '@/components/shared/medical-disclaimer'

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

export default function BriefingPage() {
  const searchParams = useSearchParams()
  const { data: currentBriefing, isLoading } = useCurrentBriefing()
  const { isPremium } = useRequirePremium()
  const { profile, family } = useUser()

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

  // Premium check: Free users get 4 weeks from their signup week
  // If signup_week is available, use that; otherwise fall back to current week proximity
  const freeWindowAnchor = profile.signup_week ?? currentWeek
  const isPremiumLocked = !isPremium && Math.abs(weekToView - freeWindowAnchor) > 4

  // Family ID for linked tasks
  const familyId = family?.id ?? profile.family_id

  const handleNavigate = (week: number) => {
    if (week >= 1 && week <= maxWeek) {
      setViewingWeek(week === currentWeek ? null : week)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[--bg]">
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
      <div className="min-h-screen bg-[--bg] flex items-center justify-center p-6">
        <PaywallOverlay feature="briefings_beyond_4_weeks" />
      </div>
    )
  }

  // No briefing available
  if (!displayBriefing) {
    return (
      <div className="min-h-screen bg-[--bg]">
        {/* Hero with navigation only */}
        <div className="bg-[--surface] border-b border-[--border] px-6 md:px-12 py-10">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => handleNavigate(weekToView - 1)}
              disabled={weekToView <= 1}
              className="p-2 rounded-lg hover:bg-[--card] text-[--muted] disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-display font-bold text-[--cream]">Week {weekToView}</h1>
            <button
              onClick={() => handleNavigate(weekToView + 1)}
              disabled={weekToView >= maxWeek}
              className="p-2 rounded-lg hover:bg-[--card] text-[--muted] disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 md:p-12 text-center">
          <div className="bg-[--card] border border-[--border] rounded-2xl p-12">
            <p className="text-[--muted] font-body text-lg">No briefing available for this week.</p>
            <Link
              href="/briefing/archive"
              className="inline-block mt-4 font-ui text-copper hover:text-gold transition-colors"
            >
              Browse all briefings →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[--bg] pb-24 md:pb-8">
      <ScrollProgressBar />

      {/* Hero Section */}
      <CardEntrance delay={0}>
        <BriefingHero
          briefing={displayBriefing}
          currentWeek={currentWeek}
          viewingWeek={weekToView}
          maxWeek={maxWeek}
          onNavigate={handleNavigate}
          isPregnancy={isPregnancy}
        />
      </CardEntrance>

      {/* Content Area */}
      <div className="px-4 md:px-12 py-6 max-w-7xl mx-auto">
        {/* Back to current week button */}
        {viewingWeek !== null && viewingWeek !== currentWeek && (
          <button
            onClick={() => setViewingWeek(null)}
            className="mb-4 text-sm font-ui text-copper hover:text-gold flex items-center gap-1 transition-colors"
          >
            ← Back to current week (Week {currentWeek})
          </button>
        )}

        {/* Medical Disclaimer */}
        <MedicalDisclaimer className="mb-4" />

        {/* Progress Bar - only for pregnancy */}
        {isPregnancy && (
          <RevealOnScroll delay={0}>
            <BriefingProgressBar currentWeek={weekToView} />
          </RevealOnScroll>
        )}

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 mt-6">
          {/* Main Sections */}
          <div className="space-y-6">
            {/* Baby Update */}
            <RevealOnScroll delay={0}>
              <Card3DTilt maxTilt={3} gloss>
                <BriefingSection type="baby" title="Baby Update" icon="👶">
                  <p className="whitespace-pre-line">{displayBriefing.baby_update}</p>
                  {weekToView === 12 && (
                    <HighlightBox icon="💡" color="teal">
                      Miscarriage risk drops to about 2% after seeing a heartbeat at 12 weeks.
                      This is why many couples choose to announce after this milestone.
                    </HighlightBox>
                  )}
                </BriefingSection>
              </Card3DTilt>
            </RevealOnScroll>

            {/* Mom Update */}
            <RevealOnScroll delay={80}>
              <Card3DTilt maxTilt={3} gloss>
                <BriefingSection type="mom" title="What Mom's Experiencing" icon="💝">
                  <p className="whitespace-pre-line">{displayBriefing.mom_update}</p>
                </BriefingSection>
              </Card3DTilt>
            </RevealOnScroll>

            {/* Dad Focus */}
            <RevealOnScroll delay={160}>
              <Card3DTilt maxTilt={3} gloss>
                <BriefingSection type="dad" title="Your Focus This Week" icon="🎯">
                  <p className="mb-4">Here&apos;s what to focus on this week:</p>
                  <DadFocusList items={displayBriefing.dad_focus} />
                </BriefingSection>
              </Card3DTilt>
            </RevealOnScroll>

            {/* Inline task completion for this briefing week */}
            {familyId && (
              <RevealOnScroll delay={240}>
                <Card3DTilt maxTilt={3} gloss>
                  <BriefingLinkedTasks
                    weekNumber={weekToView}
                    familyId={familyId}
                  />
                </Card3DTilt>
              </RevealOnScroll>
            )}

            {/* Relationship Tip */}
            <RevealOnScroll delay={320}>
              <Card3DTilt maxTilt={3} gloss>
                <BriefingSection type="relationship" title="Relationship Check-In" icon="💜">
                  <p className="whitespace-pre-line">{displayBriefing.relationship_tip}</p>
                </BriefingSection>
              </Card3DTilt>
            </RevealOnScroll>

            {/* Coming Up */}
            {displayBriefing.coming_up && (
              <RevealOnScroll delay={400}>
                <Card3DTilt maxTilt={3} gloss>
                  <BriefingSection type="coming" title="Coming Up" icon="📆">
                    <p className="whitespace-pre-line">{displayBriefing.coming_up}</p>
                  </BriefingSection>
                </Card3DTilt>
              </RevealOnScroll>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Baby Size Card */}
            {isPregnancy && babySize && (
              <RevealOnScroll delay={80}>
                <Card3DTilt maxTilt={3} gloss>
                  <BabySizeCard size={babySize} week={weekToView} />
                </Card3DTilt>
              </RevealOnScroll>
            )}
            {/* Quick Stats */}
            {isPregnancy && (
              <RevealOnScroll delay={160}>
                <Card3DTilt maxTilt={3} gloss>
                  <QuickStats
                    week={weekToView}
                    babySize={babySize}
                    dueDate={family?.due_date}
                  />
                </Card3DTilt>
              </RevealOnScroll>
            )}
          </div>
        </div>

        {/* Footer */}
        <RevealOnScroll delay={0}>
          <footer className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-10 pt-6 border-t border-[--border]">
            <div className="flex flex-wrap items-center gap-3 text-sm font-body text-[--muted]">
              <span className="inline-flex items-center gap-1.5 bg-[--sage-dim] text-[--sage] px-3 py-1 rounded-full text-xs font-medium font-ui">
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
                  'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium font-ui',
                  'bg-[--card] border border-[--border] text-[--muted] hover:bg-[--card-hover] hover:text-[--cream] transition-all',
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
                  'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium font-ui',
                  'bg-copper text-[--white] hover:shadow-copper transition-all',
                  weekToView >= maxWeek && 'opacity-50 pointer-events-none'
                )}
              >
                Next Week
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </footer>
        </RevealOnScroll>

        {/* Archive Link */}
        <RevealOnScroll delay={80}>
          <div className="text-center mt-8">
            <Link
              href="/briefing/archive"
              className="text-sm font-ui text-copper hover:text-gold transition-colors"
            >
              View All Briefings →
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  )
}
