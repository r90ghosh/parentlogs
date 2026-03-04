'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { RevealOnScroll } from '@/components/ui/animations/RevealOnScroll'
import { MagneticButton } from '@/components/ui/animations/MagneticButton'
import { useSnakeTimeline } from '@/hooks/use-snake-timeline'
import type { TimelineDomain, TimelineMilestone, TimelineDot } from '@/types/timeline'

/* ── Domain color map (amber/orange family) ── */
const DOMAIN_COLORS: Record<TimelineDomain, string> = {
  health: '#c4703f',
  budget: '#d4a853',
  childcare: '#b85c30',
  relationship: '#d4a060',
  logistics: '#a07050',
}

const DOMAIN_LABELS: Record<TimelineDomain, string> = {
  health: 'Health',
  budget: 'Budget',
  childcare: 'Childcare',
  relationship: 'Relationship',
  logistics: 'Logistics',
}

const ALL_DOMAINS: TimelineDomain[] = ['health', 'budget', 'childcare', 'relationship', 'logistics']

/* ── Skeleton ── */
function SnakeTimelineSkeleton() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Header skeleton */}
        <div className="text-center mb-16">
          <div className="h-3 w-32 mx-auto mb-5 rounded bg-[--surface] animate-pulse" />
          <div className="h-10 w-80 mx-auto mb-4 rounded bg-[--surface] animate-pulse" />
          <div className="h-5 w-64 mx-auto rounded bg-[--surface] animate-pulse" />
        </div>
        {/* Filter chips skeleton */}
        <div className="flex justify-center gap-3 mb-14">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-24 rounded-full bg-[--surface] animate-pulse" />
          ))}
        </div>
        {/* Rows skeleton */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="mb-10">
            <div className="h-6 w-40 mb-4 rounded bg-[--surface] animate-pulse" />
            <div className="flex gap-6">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="w-10 h-10 rounded-full bg-[--surface] animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── Info Card ── */
function DotInfoCard({
  dot,
  position,
  onClose,
}: {
  dot: TimelineDot
  position: 'above' | 'below'
  onClose: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  const color = DOMAIN_COLORS[dot.domain]

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.85, y: position === 'below' ? -8 : 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: position === 'below' ? -8 : 8 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`absolute z-50 w-64 sm:w-72 rounded-lg border border-[--border] bg-[--card] shadow-lift p-4 ${
        position === 'below' ? 'top-full mt-3' : 'bottom-full mb-3'
      }`}
      style={{
        left: '50%',
        transform: 'translateX(-50%)',
      }}
    >
      {/* Domain badge */}
      <div className="flex items-center gap-2 mb-2">
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        <span className="font-ui text-[10px] uppercase tracking-[0.08em]" style={{ color }}>
          {DOMAIN_LABELS[dot.domain]}
        </span>
      </div>
      {/* Title */}
      <p className="font-display font-bold text-sm text-[--cream] mb-1.5 leading-snug">
        {dot.title}
      </p>
      {/* Description */}
      <p className="font-body text-xs text-[--muted] leading-relaxed">
        {dot.description}
      </p>
    </motion.div>
  )
}

/* ── Single Dot Button ── */
function TimelineDotButton({
  dot,
  isActive,
  isDimmed,
  isInUpperHalf,
  onToggle,
}: {
  dot: TimelineDot
  isActive: boolean
  isDimmed: boolean
  isInUpperHalf: boolean
  onToggle: (dotId: string) => void
}) {
  const color = DOMAIN_COLORS[dot.domain]

  return (
    <div className="relative flex flex-col items-center">
      <button
        onClick={() => onToggle(dot.id)}
        aria-label={`${dot.title} — ${DOMAIN_LABELS[dot.domain]}`}
        className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 cursor-pointer"
        style={{
          borderColor: color,
          backgroundColor: isActive ? color : 'transparent',
          opacity: isDimmed ? 0.12 : 1,
          boxShadow: isActive ? `0 0 12px ${color}50, 0 0 24px ${color}25` : 'none',
          transform: isActive ? 'scale(1.3)' : 'scale(1)',
        }}
      >
        <span
          className="w-2.5 h-2.5 rounded-full transition-colors duration-300"
          style={{
            backgroundColor: isActive ? '#12100e' : color,
          }}
        />
      </button>
      {/* Dot title label on hover/active — desktop only */}
      <span
        className="hidden sm:block absolute top-full mt-1.5 font-ui text-[9px] text-[--muted] whitespace-nowrap transition-opacity duration-200"
        style={{ opacity: isActive ? 1 : 0 }}
      >
        {dot.title}
      </span>

      <AnimatePresence>
        {isActive && (
          <DotInfoCard
            dot={dot}
            position={isInUpperHalf ? 'below' : 'above'}
            onClose={() => onToggle(dot.id)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Milestone Row ── */
function MilestoneRow({
  milestone,
  index,
  activeDotId,
  domainFilter,
  onDotToggle,
  totalMilestones,
}: {
  milestone: TimelineMilestone
  index: number
  activeDotId: string | null
  domainFilter: TimelineDomain | null
  onDotToggle: (dotId: string) => void
  totalMilestones: number
}) {
  const isRtl = milestone.direction === 'rtl'
  const isInUpperHalf = index < totalMilestones / 2
  const hasActiveCard = milestone.dots.some((d) => d.id === activeDotId)

  return (
    <RevealOnScroll delay={index * 100}>
      <div className="relative" style={{ zIndex: hasActiveCard ? 40 : 1 }}>
        {/* Row content */}
        <div
          className={`flex items-center gap-4 sm:gap-6 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}
        >
          {/* Milestone label card */}
          <div
            className="flex-shrink-0 w-28 sm:w-36 rounded-lg border border-copper/20 bg-[--card] px-3 py-2.5 text-center"
          >
            <p className="font-display font-bold text-xs sm:text-sm text-[--cream] leading-tight">
              {milestone.label}
            </p>
            <p className="font-ui text-[9px] sm:text-[10px] text-[--muted] mt-0.5">
              {milestone.sub_label}
            </p>
          </div>

          {/* Track line + dots */}
          <div className="flex-1 relative flex items-center">
            {/* Horizontal track */}
            <div
              className="absolute inset-x-0 h-[1.5px] rounded-full"
              style={{
                background: isRtl
                  ? 'linear-gradient(90deg, var(--copper) 0%, transparent 100%)'
                  : 'linear-gradient(90deg, transparent 0%, var(--copper) 100%)',
                opacity: 0.25,
              }}
            />

            {/* Dots */}
            <div
              className={`relative flex w-full justify-evenly py-6 ${
                isRtl ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {milestone.dots.map((dot) => (
                <TimelineDotButton
                  key={dot.id}
                  dot={dot}
                  isActive={activeDotId === dot.id}
                  isDimmed={domainFilter !== null && domainFilter !== dot.domain}
                  isInUpperHalf={isInUpperHalf}
                  onToggle={onDotToggle}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Snake turn connector */}
        {index < totalMilestones - 1 && (
          <div
            className={`flex ${isRtl ? 'justify-start pl-14 sm:pl-18' : 'justify-end pr-14 sm:pr-18'}`}
          >
            <svg
              width="24"
              height="32"
              viewBox="0 0 24 32"
              fill="none"
              className="text-copper/20"
            >
              <path
                d="M12 0 C12 16, 12 16, 12 32"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}
      </div>
    </RevealOnScroll>
  )
}

/* ── Main Component ── */
export function SnakeTimeline() {
  const { milestones, loading, error } = useSnakeTimeline()
  const [activeDotId, setActiveDotId] = useState<string | null>(null)
  const [domainFilter, setDomainFilter] = useState<TimelineDomain | null>(null)

  const handleDotToggle = useCallback((dotId: string) => {
    setActiveDotId((prev) => (prev === dotId ? null : dotId))
  }, [])

  const handleFilterClick = useCallback((domain: TimelineDomain) => {
    setDomainFilter((prev) => (prev === domain ? null : domain))
    setActiveDotId(null)
  }, [])

  // Fail silently on error
  if (error) return null
  if (loading) return <SnakeTimelineSkeleton />
  if (milestones.length === 0) return null

  const totalDots = milestones.reduce((sum, m) => sum + m.dots.length, 0)

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-6">
        {/* ── Section Header ── */}
        <div className="text-center mb-14">
          <RevealOnScroll>
            <span className="section-pre mb-5 justify-center">The Full Picture</span>
          </RevealOnScroll>

          <RevealOnScroll delay={80}>
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[--cream] leading-[1.15] mb-4">
              Everything that&apos;s coming,{' '}
              <em className="italic text-copper">mapped</em>
            </h2>
          </RevealOnScroll>

          <RevealOnScroll delay={140}>
            <p className="font-body text-base sm:text-lg text-[--muted] max-w-[520px] mx-auto leading-relaxed">
              From the first appointment to toddlerhood — every milestone, task, and
              decision point, laid out so nothing catches you off guard.
            </p>
          </RevealOnScroll>
        </div>

        {/* ── Domain Filter Chips ── */}
        <RevealOnScroll delay={200}>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-14">
            {ALL_DOMAINS.map((domain) => {
              const isSelected = domainFilter === domain
              const color = DOMAIN_COLORS[domain]
              return (
                <button
                  key={domain}
                  onClick={() => handleFilterClick(domain)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border font-ui text-[11px] uppercase tracking-[0.06em] transition-all duration-200 cursor-pointer"
                  style={{
                    borderColor: isSelected ? color : 'var(--border)',
                    backgroundColor: isSelected ? `${color}18` : 'transparent',
                    color: isSelected ? color : 'var(--muted)',
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  {DOMAIN_LABELS[domain]}
                </button>
              )
            })}
          </div>
        </RevealOnScroll>

        {/* ── Snake Body ── */}
        <div className="space-y-2">
          {milestones.map((milestone, index) => (
            <MilestoneRow
              key={milestone.id}
              milestone={milestone}
              index={index}
              activeDotId={activeDotId}
              domainFilter={domainFilter}
              onDotToggle={handleDotToggle}
              totalMilestones={milestones.length}
            />
          ))}
        </div>

        {/* ── Domain Legend (mobile) ── */}
        <div className="flex flex-wrap justify-center gap-4 mt-10 sm:hidden">
          {ALL_DOMAINS.map((domain) => (
            <div key={domain} className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: DOMAIN_COLORS[domain] }}
              />
              <span className="font-ui text-[10px] text-[--muted]">
                {DOMAIN_LABELS[domain]}
              </span>
            </div>
          ))}
        </div>

        {/* ── CTA Block ── */}
        <RevealOnScroll delay={300}>
          <div className="text-center mt-16 sm:mt-20">
            <p className="font-ui text-[11px] uppercase tracking-[0.08em] text-[--muted] mb-6">
              {totalDots} task previews &middot; {milestones.length} milestones &middot; {ALL_DOMAINS.length} domains
            </p>
            <MagneticButton maxOffset={6}>
              <Button
                asChild
                size="lg"
                className="bg-copper hover:bg-copper-hover text-[--bg] font-ui font-semibold text-[13px] uppercase tracking-[0.08em] px-7 py-3.5 h-auto shadow-copper"
              >
                <Link href="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </MagneticButton>
            <p className="font-body text-xs text-[--dim] mt-4">
              No credit card required. 30-day money-back guarantee.
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
