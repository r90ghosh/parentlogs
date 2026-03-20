'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useBriefingByWeek } from '@/hooks/use-briefings'
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

export default function BriefingWeekClient() {
  const params = useParams()
  const rawWeekId = params.weekId as string
  const parsedWeek = parseInt(rawWeekId, 10)

  const { isPremium } = useRequirePremium()
  const { profile, family, activeBaby } = useUser()

  const stage = activeBaby?.stage || family?.stage || 'first-trimester'
  const currentWeek = activeBaby?.current_week ?? family?.current_week ?? 1
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
  const familyId = family?.id ?? profile.family_id

  const handleNavigate = (week: number) => {
    if (week >= 1 && week <= maxWeek) {
      setLocalWeek(week)
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

  if (isPremiumLocked) {
    return (
      <div className="min-h-screen bg-[--bg] flex items-center justify-center p-6">
        <PaywallOverlay feature="briefings_beyond_4_weeks" />
      </div>
    )
  }

  if (!briefing) {
    return (
      <div className="min-h-screen bg-[--bg]">
        {/* Navigation */}
        <div className="bg-[--surface] border-b border-[--border] px-6 md:px-12 py-10">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => handleNavigate(localWeek - 1)}
              disabled={localWeek <= 1}
              className="p-2 rounded-lg hover:bg-[--card] text-[--muted] disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-display font-bold text-[--cream]">Week {localWeek}</h1>
            <button
              onClick={() => handleNavigate(localWeek + 1)}
              disabled={localWeek >= maxWeek}
              className="p-2 rounded-lg hover:bg-[--card] text-[--muted] disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 md:p-12 text-center">
          <div className="bg-[--card] border border-[--border] rounded-2xl p-12">
            <p className="text-[--muted] font-body text-lg">No briefing available for Week {localWeek}.</p>
            <Link
              href="/briefing"
              className="inline-block mt-4 font-ui text-copper hover:text-gold transition-colors"
            >
              ← Back to current week
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
          briefing={briefing}
          currentWeek={currentWeek}
          viewingWeek={localWeek}
          maxWeek={maxWeek}
          onNavigate={handleNavigate}
          isPregnancy={isPregnancy}
        />
      </CardEntrance>

      {/* Content Area */}
      <div className="px-4 md:px-12 py-6 max-w-7xl mx-auto">
        {/* Back to current week link */}
        {localWeek !== currentWeek && (
          <Link
            href="/briefing"
            className="mb-4 inline-flex text-sm font-ui text-copper hover:text-gold items-center gap-1 transition-colors"
          >
            ← Back to current week (Week {currentWeek})
          </Link>
        )}

        {/* Medical Disclaimer */}
        <MedicalDisclaimer className="mb-4" />

        {/* Progress Bar - only for pregnancy */}
        {isPregnancy && (
          <RevealOnScroll delay={0}>
            <BriefingProgressBar currentWeek={localWeek} />
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
                  <p className="whitespace-pre-line">{briefing.baby_update}</p>
                  {localWeek === 12 && (
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
                  <p className="whitespace-pre-line">{briefing.mom_update}</p>
                </BriefingSection>
              </Card3DTilt>
            </RevealOnScroll>

            {/* Dad Focus */}
            <RevealOnScroll delay={160}>
              <Card3DTilt maxTilt={3} gloss>
                <BriefingSection type="dad" title="Your Focus This Week" icon="🎯">
                  <p className="mb-4">Here&apos;s what to focus on this week:</p>
                  <DadFocusList items={briefing.dad_focus} />
                </BriefingSection>
              </Card3DTilt>
            </RevealOnScroll>

            {/* Inline task completion for this briefing week */}
            {familyId && (
              <RevealOnScroll delay={240}>
                <Card3DTilt maxTilt={3} gloss>
                  <BriefingLinkedTasks
                    weekNumber={localWeek}
                    familyId={familyId}
                  />
                </Card3DTilt>
              </RevealOnScroll>
            )}

            {/* Field Notes — real dad perspective interstitial */}
            {briefing.field_notes && (
              <RevealOnScroll delay={320}>
                <div className="rounded-xl border-l-4 border-copper bg-copper/[0.04] p-5 md:p-6">
                  <div className="flex items-start gap-3">
                    <span className="text-lg mt-0.5 shrink-0">📝</span>
                    <div>
                      <h3 className="font-ui text-xs font-semibold uppercase tracking-wider text-copper mb-2">From the Trenches</h3>
                      <p className="font-body text-[15px] text-[--cream] leading-relaxed italic whitespace-pre-line">{briefing.field_notes}</p>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            )}

            {/* Relationship Tip */}
            <RevealOnScroll delay={360}>
              <Card3DTilt maxTilt={3} gloss>
                <BriefingSection type="relationship" title="Relationship Check-In" icon="💜">
                  <p className="whitespace-pre-line">{briefing.relationship_tip}</p>
                </BriefingSection>
              </Card3DTilt>
            </RevealOnScroll>

            {/* Coming Up */}
            {briefing.coming_up && (
              <RevealOnScroll delay={440}>
                <Card3DTilt maxTilt={3} gloss>
                  <BriefingSection type="coming" title="Coming Up" icon="📆">
                    <p className="whitespace-pre-line">{briefing.coming_up}</p>
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
                  <BabySizeCard size={babySize} week={localWeek} />
                </Card3DTilt>
              </RevealOnScroll>
            )}
            {/* Quick Stats */}
            {isPregnancy && (
              <RevealOnScroll delay={160}>
                <Card3DTilt maxTilt={3} gloss>
                  <QuickStats
                    week={localWeek}
                    babySize={babySize}
                    dueDate={activeBaby?.due_date || family?.due_date}
                  />
                </Card3DTilt>
              </RevealOnScroll>
            )}
          </div>
        </div>

        {/* Footer navigation */}
        <RevealOnScroll delay={0}>
          <footer className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-10 pt-6 border-t border-[--border]">
            <div className="flex flex-wrap items-center gap-3 text-sm font-body text-[--muted]">
              <span className="inline-flex items-center gap-1.5 bg-[--sage-dim] text-[--sage] px-3 py-1 rounded-full text-xs font-medium font-ui">
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
                  'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium font-ui',
                  'bg-[--card] border border-[--border] text-[--muted] hover:bg-[--card-hover] hover:text-[--cream] transition-all',
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
                  'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium font-ui',
                  'bg-copper text-[--white] hover:shadow-copper transition-all',
                  localWeek >= maxWeek && 'opacity-50 pointer-events-none'
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
