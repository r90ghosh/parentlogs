'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react'
import type { BriefingTemplate } from '@tdc/shared/types'
import { getBabySize } from '@tdc/shared/utils'
import { Panel, SectionLabel, Hero } from '@/components/digest'
import { MedicalDisclaimer } from '@/components/shared/medical-disclaimer'
import { firstSentence } from '@/lib/digest'
import { cn } from '@/lib/utils'

interface ReaderSection {
  id: string
  label: string
  body?: string
  list?: string[]
  trench?: boolean
}

function RailWeekStepper({
  week,
  onPrev,
  onNext,
  prevDisabled,
  nextDisabled,
}: {
  week: number
  onPrev: () => void
  onNext: () => void
  prevDisabled: boolean
  nextDisabled: boolean
}) {
  return (
    <div className="flex items-center justify-between rounded-[13px] border border-line bg-card2 px-3.5 py-2.5">
      <button
        type="button"
        onClick={onPrev}
        disabled={prevDisabled}
        className="grid h-8 w-8 place-items-center rounded-full border border-line bg-card text-ink2 transition-opacity disabled:opacity-35 enabled:hover:opacity-70"
      >
        <ChevronLeft className="h-[15px] w-[15px]" />
      </button>
      <span className="text-[14px] font-extrabold tracking-[-0.2px] text-ink">Week {week}</span>
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className="grid h-8 w-8 place-items-center rounded-full border border-line bg-card text-ink2 transition-opacity disabled:opacity-35 enabled:hover:opacity-70"
      >
        <ChevronRight className="h-[15px] w-[15px]" />
      </button>
    </div>
  )
}

interface BriefingReaderProps {
  briefing: BriefingTemplate
  weekToView: number
  currentWeek: number
  maxWeek: number
  isPregnancy: boolean
  role?: string | null
  isArchiveWeek: boolean
  onNavigate: (week: number) => void
  onBackToCurrent?: () => void
}

/** The shared digest briefing reading view (used by /briefing and /briefing/[weekId]). */
export function BriefingReader({
  briefing: b,
  weekToView,
  currentWeek,
  maxWeek,
  isPregnancy,
  role,
  isArchiveWeek,
  onNavigate,
  onBackToCurrent,
}: BriefingReaderProps) {
  const babySize = isPregnancy ? getBabySize(weekToView) : undefined
  const herLabel = role === 'mom' ? 'Your body' : "What she's experiencing"

  const sections: ReaderSection[] = [
    { id: 'baby', label: 'Baby update', body: b.baby_update },
    { id: 'her', label: herLabel, body: b.mom_update },
    { id: 'focus', label: 'Your focus this week', list: b.dad_focus },
    ...(b.field_notes ? [{ id: 'trenches', label: 'From the trenches', body: b.field_notes, trench: true }] : []),
    { id: 'relationship', label: 'Relationship check-in', body: b.relationship_tip },
    ...(b.coming_up ? [{ id: 'coming', label: 'Coming up', body: b.coming_up }] : []),
  ]

  return (
    <>
      <MedicalDisclaimer className="mb-5" />

      {isArchiveWeek && onBackToCurrent && (
        <button
          onClick={onBackToCurrent}
          className="mb-4 flex items-center gap-1 text-sm font-bold text-clay-ink hover:opacity-80"
        >
          <ChevronLeft className="h-4 w-4" /> Back to current week (Week {currentWeek})
        </button>
      )}

      <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[minmax(0,1fr)_336px]">
        {/* Reading column */}
        <div className="min-w-0">
          <Hero
            kicker={isArchiveWeek ? `Week ${weekToView} · Briefing` : 'This week · Briefing'}
            title={b.title || `Week ${weekToView}`}
            meta={`Week ${weekToView}${babySize ? ` · ${babySize.fruit}` : ''}`}
          >
            {firstSentence(b.baby_update)}
          </Hero>

          <SectionLabel>In this briefing</SectionLabel>

          {sections.map((s) => (
            <Panel
              key={s.id}
              id={s.id}
              className={cn('mb-[18px] scroll-mt-[90px] p-[26px]', s.trench && 'border-clay/30 bg-clay-soft')}
            >
              <div
                className={cn(
                  'text-[11px] font-bold uppercase tracking-[1.6px]',
                  s.trench ? 'text-clay-ink' : 'text-faint'
                )}
              >
                {s.label}
              </div>
              {s.list ? (
                <ul className="mt-3.5 flex flex-col gap-3.5">
                  {s.list.map((item, i) => (
                    <li key={i} className="relative pl-6 text-[16px] leading-[1.55] text-ink2">
                      <span className="absolute left-0.5 top-[9px] h-[7px] w-[7px] rounded-full bg-clay" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p
                  className={cn(
                    'mt-3 max-w-[64ch] whitespace-pre-line text-[16px] leading-[1.65]',
                    s.trench ? 'font-medium italic text-ink2' : 'text-ink2'
                  )}
                >
                  {s.body}
                </p>
              )}
            </Panel>
          ))}
        </div>

        {/* Right rail */}
        <div className="min-w-0">
          <Panel className="mb-[18px] p-[18px]">
            <div className="mb-3.5 text-[11px] font-bold uppercase tracking-[1.2px] text-faint">Jump to week</div>
            <RailWeekStepper
              week={weekToView}
              onPrev={() => onNavigate(weekToView - 1)}
              onNext={() => onNavigate(weekToView + 1)}
              prevDisabled={weekToView <= 1}
              nextDisabled={weekToView >= maxWeek}
            />
            <Link
              href="/briefing/archive"
              className="mt-3.5 inline-block text-[12.5px] font-bold text-mute hover:text-clay-ink"
            >
              View all briefings →
            </Link>
          </Panel>

          {isPregnancy && babySize && (
            <Panel className="mb-[18px] p-[18px]">
              <div className="mb-3.5 text-[11px] font-bold uppercase tracking-[1.2px] text-faint">Baby size</div>
              <div className="flex items-center gap-3">
                <span className="text-[34px] leading-none">{babySize.emoji}</span>
                <div>
                  <div className="text-[16px] font-extrabold text-ink">{babySize.fruit}</div>
                  <div className="mt-0.5 text-[12.5px] font-semibold text-mute">
                    {babySize.lengthInches}&quot; · {babySize.weightOz} oz
                  </div>
                </div>
              </div>
            </Panel>
          )}

          <Panel className="mb-[18px] p-[18px]">
            <div className="mb-3.5 text-[11px] font-bold uppercase tracking-[1.2px] text-faint">In this briefing</div>
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block border-b border-line2 py-[9px] text-[13.5px] font-semibold text-ink last:border-b-0 hover:text-clay-ink"
              >
                {s.label}
              </a>
            ))}
          </Panel>

          <Panel className="p-[18px]">
            <div className="mb-3.5 text-[11px] font-bold uppercase tracking-[1.2px] text-faint">Sources</div>
            <div className="flex items-start gap-2.5 text-[12.5px] font-semibold leading-[1.5] text-ink2">
              <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-[--sage]" />
              <span>Source-referenced{b.medical_source ? ` · ${b.medical_source}` : ''}</span>
            </div>
            <p className="mt-2.5 text-[11.5px] font-medium leading-[1.5] text-mute">
              Educational only — not medical advice.
            </p>
          </Panel>
        </div>
      </div>
    </>
  )
}
