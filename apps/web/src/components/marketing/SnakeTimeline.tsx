'use client'

import { useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { RevealOnScroll } from '@/components/ui/animations/RevealOnScroll'
import { MagneticButton } from '@/components/ui/animations/MagneticButton'
import { useSnakeTimeline } from '@/hooks/use-snake-timeline'
import type { TimelineDomain, TimelineMilestone, TimelineDot } from '@tdc/shared/types/timeline'

/* ── Domain color map ── */
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

const MAX_VISIBLE_TASKS = 6

/* ── Skeleton ── */
function TimelineSkeleton() {
  return (
    <section className="py-16 sm:py-24 md:py-32">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
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
        {/* Phase card skeletons */}
        <div className="space-y-4 pl-10 sm:pl-14">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-[--surface] animate-pulse h-20" />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Task Card ── */
function TaskCard({ dot, isDimmed }: { dot: TimelineDot; isDimmed: boolean }) {
  const color = DOMAIN_COLORS[dot.domain]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: isDimmed ? 0.15 : 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="rounded-lg border border-[--border] bg-[--card] p-3.5 transition-colors duration-200 hover:bg-[--card-hover]"
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        <span
          className="font-ui text-[10px] uppercase tracking-[0.08em]"
          style={{ color }}
        >
          {DOMAIN_LABELS[dot.domain]}
        </span>
      </div>
      <p className="font-display font-bold text-sm text-[--cream] leading-snug mb-1">
        {dot.title}
      </p>
      <p className="font-body text-xs text-[--muted] leading-relaxed line-clamp-2">
        {dot.description}
      </p>
    </motion.div>
  )
}

/* ── Expanded Phase Content ── */
function PhaseContent({
  dots,
  domainFilter,
}: {
  dots: TimelineDot[]
  domainFilter: TimelineDomain | null
}) {
  const filteredDots = useMemo(
    () => (domainFilter ? dots.filter((d) => d.domain === domainFilter) : dots),
    [dots, domainFilter]
  )

  const visibleDots = filteredDots.slice(0, MAX_VISIBLE_TASKS)
  const remainingCount = filteredDots.length - visibleDots.length

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden"
    >
      <div className="pt-4 pb-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence mode="popLayout">
            {visibleDots.map((dot) => (
              <TaskCard
                key={dot.id}
                dot={dot}
                isDimmed={false}
              />
            ))}
          </AnimatePresence>
        </div>
        {remainingCount > 0 && (
          <p className="font-ui text-xs text-[--muted] mt-3 pl-1">
            +{remainingCount} more task{remainingCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </motion.div>
  )
}

/* ── Domain Dots Preview (collapsed state) ── */
function DomainDotsPreview({ dots }: { dots: TimelineDot[] }) {
  const domains = useMemo(() => {
    const seen = new Set<TimelineDomain>()
    for (const dot of dots) {
      seen.add(dot.domain)
    }
    return ALL_DOMAINS.filter((d) => seen.has(d))
  }, [dots])

  return (
    <div className="flex items-center gap-1.5">
      {domains.map((domain) => (
        <span
          key={domain}
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: DOMAIN_COLORS[domain] }}
        />
      ))}
    </div>
  )
}

/* ── Phase Card ── */
function PhaseCard({
  milestone,
  index,
  isExpanded,
  domainFilter,
  onToggle,
}: {
  milestone: TimelineMilestone
  index: number
  isExpanded: boolean
  domainFilter: TimelineDomain | null
  onToggle: (id: string) => void
}) {
  const taskCount = domainFilter
    ? milestone.dots.filter((d) => d.domain === domainFilter).length
    : milestone.dots.length

  return (
    <RevealOnScroll delay={index * 80}>
      <div className="flex items-stretch gap-0">
        {/* Timeline line + numbered circle */}
        <div className="relative flex flex-col items-center w-8 sm:w-12 flex-shrink-0">
          {/* Vertical line segment above */}
          {index > 0 && (
            <div
              className="w-[1.5px] flex-1"
              style={{
                background: 'linear-gradient(180deg, var(--copper), var(--copper))',
                opacity: 0.25,
              }}
            />
          )}
          {index === 0 && <div className="flex-1" />}

          {/* Numbered circle */}
          <div
            className={`relative z-10 flex items-center justify-center rounded-full border-2 transition-all duration-300 flex-shrink-0 ${
              isExpanded
                ? 'w-8 h-8 sm:w-10 sm:h-10'
                : 'w-7 h-7 sm:w-9 sm:h-9'
            }`}
            style={{
              borderColor: isExpanded ? 'var(--copper)' : 'rgba(196, 112, 63, 0.3)',
              backgroundColor: isExpanded ? 'var(--copper)' : 'transparent',
              boxShadow: isExpanded ? '0 0 16px rgba(196, 112, 63, 0.3)' : 'none',
            }}
          >
            <span
              className={`font-ui font-bold text-xs transition-colors duration-300 ${
                isExpanded ? 'text-[--bg]' : 'text-[--muted]'
              }`}
            >
              {index + 1}
            </span>
          </div>

          {/* Vertical line segment below */}
          <div
            className="w-[1.5px] flex-1"
            style={{
              background: 'linear-gradient(180deg, var(--copper), var(--copper))',
              opacity: 0.25,
            }}
          />
        </div>

        {/* Phase card */}
        <div className="flex-1 py-2 pl-3 sm:pl-5">
          <button
            onClick={() => onToggle(milestone.id)}
            className="w-full text-left rounded-xl border border-[--border] bg-[--surface] p-4 sm:p-5 transition-all duration-200 hover:border-[--border-hover] hover:bg-[--card] cursor-pointer"
            aria-expanded={isExpanded}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-base sm:text-lg text-[--cream] leading-tight">
                  {milestone.label}
                </h3>
                <p className="font-ui text-[11px] sm:text-xs text-[--muted] mt-1">
                  {milestone.sub_label}
                  {taskCount > 0 && (
                    <span className="text-[--dim]">
                      {' '}· {taskCount} key task{taskCount !== 1 ? 's' : ''}
                    </span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                {!isExpanded && <DomainDotsPreview dots={milestone.dots} />}
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <ChevronDown className="h-4 w-4 text-[--muted]" />
                </motion.div>
              </div>
            </div>

            {/* Expanded content — rendered inside button for full-card click area, but using div via onClick stop */}
          </button>

          <AnimatePresence initial={false}>
            {isExpanded && (
              <PhaseContent
                dots={milestone.dots}
                domainFilter={domainFilter}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </RevealOnScroll>
  )
}

/* ── Main Component ── */
export function SnakeTimeline() {
  const { milestones, loading, error } = useSnakeTimeline()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [domainFilter, setDomainFilter] = useState<TimelineDomain | null>(null)

  // Expand first milestone by default once data loads
  const effectiveExpandedId = expandedId === null && milestones.length > 0
    ? milestones[0].id
    : expandedId

  const handleToggle = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? '' : id))
  }, [])

  const handleFilterClick = useCallback((domain: TimelineDomain) => {
    setDomainFilter((prev) => (prev === domain ? null : domain))
  }, [])

  if (error) return null
  if (loading) return <TimelineSkeleton />
  if (milestones.length === 0) return null

  return (
    <section className="py-16 sm:py-24 md:py-32 relative overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
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

        {/* ── Vertical Accordion Timeline ── */}
        <div>
          {milestones.map((milestone, index) => (
            <PhaseCard
              key={milestone.id}
              milestone={milestone}
              index={index}
              isExpanded={effectiveExpandedId === milestone.id}
              domainFilter={domainFilter}
              onToggle={handleToggle}
            />
          ))}
        </div>

        {/* ── CTA Block ── */}
        <RevealOnScroll delay={300}>
          <div className="text-center mt-16 sm:mt-20">
            <p className="font-ui text-[11px] uppercase tracking-[0.08em] text-[--muted] mb-6">
              200+ tasks &middot; 60+ briefings &middot; 200+ budget items
            </p>
            <MagneticButton maxOffset={6}>
              <Button
                asChild
                size="lg"
                className="btn-glow-hover bg-copper hover:bg-copper-hover text-[--bg] font-ui font-semibold text-[13px] uppercase tracking-[0.08em] px-7 py-3.5 h-auto shadow-copper"
              >
                <Link href="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </MagneticButton>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
