'use client'

import { useCallback, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaskTimelineBarProps {
  currentWeek: number
  selectedWeek: number | null
  onWeekClick: (week: number | null) => void
  taskCountByWeek: Record<number, number>
  maxWeek?: number
}

const PHASES = [
  { label: 'Trimester 1', start: 1, end: 13, color: '#c47a8f', gradientFrom: '#c47a8f', gradientTo: '#c4703f' },
  { label: 'Trimester 2', start: 14, end: 27, color: '#c4703f', gradientFrom: '#c4703f', gradientTo: '#d4a853' },
  { label: 'Trimester 3', start: 28, end: 40, color: '#d4a853', gradientFrom: '#d4a853', gradientTo: '#6b8f71' },
  { label: 'Post-birth', start: 41, end: Infinity, color: '#6b8f71', gradientFrom: '#6b8f71', gradientTo: '#5b9bd5' },
] as const

const VISIBLE_COUNT = 6

function getPhaseIndex(week: number): number {
  return PHASES.findIndex(p => week >= p.start && week <= p.end)
}

export function TaskTimelineBar({
  currentWeek,
  selectedWeek,
  onWeekClick,
  taskCountByWeek,
  maxWeek = 104,
}: TaskTimelineBarProps) {
  const shouldReduceMotion = useReducedMotion()
  const [viewStart, setViewStart] = useState(() => Math.max(1, currentWeek - Math.floor(VISIBLE_COUNT / 2)))

  const totalTasks = useMemo(
    () => Object.values(taskCountByWeek).reduce((sum, n) => sum + n, 0),
    [taskCountByWeek]
  )

  const visibleWeeks = useMemo(() => {
    const clamped = Math.max(1, Math.min(maxWeek - VISIBLE_COUNT + 1, viewStart))
    return Array.from({ length: VISIBLE_COUNT }, (_, i) => clamped + i).filter(w => w <= maxWeek)
  }, [viewStart, maxWeek])

  const canGoPrev = visibleWeeks[0] > 1
  const canGoNext = visibleWeeks[visibleWeeks.length - 1] < maxWeek

  const activePhaseIndex = getPhaseIndex(selectedWeek ?? currentWeek)
  const viewPhaseIndex = getPhaseIndex(visibleWeeks[Math.floor(visibleWeeks.length / 2)])

  // Click phase to jump view to start of that phase
  const handlePhaseClick = useCallback((phaseIndex: number) => {
    const phase = PHASES[phaseIndex]
    setViewStart(Math.min(phase.start, maxWeek))
  }, [maxWeek])

  const handlePillClick = useCallback(
    (week: number) => {
      onWeekClick(selectedWeek === week ? null : week)
    },
    [selectedWeek, onWeekClick]
  )

  const handleShift = useCallback((direction: -1 | 1) => {
    setViewStart(prev => {
      const next = prev + direction * VISIBLE_COUNT
      return Math.max(1, Math.min(maxWeek - VISIBLE_COUNT + 1, next))
    })
  }, [maxWeek])

  // Compute progress ratio through phases (0 to PHASES.length - 1)
  const progressRatio = useMemo(() => {
    const week = selectedWeek ?? currentWeek
    const idx = getPhaseIndex(week)
    if (idx < 0) return 0
    const phase = PHASES[idx]
    const phaseLength = Math.min(phase.end, maxWeek) - phase.start + 1
    const weekInPhase = week - phase.start
    return idx + weekInPhase / phaseLength
  }, [selectedWeek, currentWeek, maxWeek])

  return (
    <div className="space-y-3">
      {/* Header row */}
      <div className="flex items-center justify-between text-xs text-[--muted]">
        <span className="font-ui font-medium">Tasks by Week</span>
        {selectedWeek !== null && (
          <button
            onClick={() => onWeekClick(null)}
            className="text-copper hover:text-copper/80 text-xs font-ui font-medium hover:underline transition-colors"
          >
            Show all
          </button>
        )}
      </div>

      {/* Gradient phase selector — single track with dots on top */}
      <div className="px-4">
        {/* Track container: the line runs full width, dots are positioned on it */}
        <div className="relative h-4 flex items-center">
          {/* Background track line — full width */}
          <div className="absolute left-0 right-0 h-[3px] rounded-full bg-[--border]" />

          {/* Filled track segments + dots overlaid */}
          {PHASES.map((phase, i) => {
            const isPast = i < activePhaseIndex
            const isActive = i === (selectedWeek !== null ? activePhaseIndex : viewPhaseIndex)
            const dotColor = isPast || isActive ? phase.color : '#4a4239'
            // Each phase occupies 25% of the track width
            const leftPercent = (i / PHASES.length) * 100
            const segmentWidth = 100 / PHASES.length

            return (
              <div key={phase.label}>
                {/* Filled line segment */}
                {i < PHASES.length - 1 && (
                  <div
                    className="absolute h-[3px] overflow-hidden"
                    style={{ left: `${leftPercent}%`, width: `${segmentWidth}%` }}
                  >
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        background: i < activePhaseIndex || i === activePhaseIndex
                          ? `linear-gradient(to right, ${phase.gradientFrom}, ${PHASES[i + 1].gradientFrom})`
                          : 'transparent',
                      }}
                      animate={{
                        width: i < activePhaseIndex
                          ? '100%'
                          : i === activePhaseIndex
                            ? `${Math.max(0, Math.min(100, (progressRatio - i) * 100))}%`
                            : '0%',
                      }}
                      transition={{ duration: shouldReduceMotion ? 0.1 : 0.5, ease: 'easeOut' }}
                    />
                  </div>
                )}

                {/* Dot — centered on the track at phase boundary */}
                <button
                  onClick={() => handlePhaseClick(i)}
                  aria-label={`Jump to ${phase.label}`}
                  className="absolute cursor-pointer transition-all duration-200 hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-copper/60 rounded-full z-10"
                  style={{
                    left: `${leftPercent}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <motion.div
                    className={cn(
                      'rounded-full transition-colors duration-300',
                      i === 0 ? 'w-2.5 h-2.5' : i === 1 ? 'w-3 h-3' : i === 2 ? 'w-3.5 h-3.5' : 'w-3 h-3'
                    )}
                    style={{
                      backgroundColor: dotColor,
                      boxShadow: isActive
                        ? `0 0 12px ${phase.color}60, 0 0 24px ${phase.color}30`
                        : 'none',
                    }}
                    animate={isActive ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                    transition={
                      isActive && !shouldReduceMotion
                        ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                        : { duration: 0.2 }
                    }
                  />
                  {isActive && !shouldReduceMotion && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {Array.from({ length: 8 }).map((_, dotIdx) => {
                        const angle = (dotIdx / 8) * 2 * Math.PI
                        const radius = 14
                        const dx = Math.cos(angle) * radius
                        const dy = Math.sin(angle) * radius
                        return (
                          <motion.div
                            key={dotIdx}
                            className="absolute w-0.5 h-0.5 rounded-full"
                            initial={{ opacity: 0, scale: 0.3, x: dx, y: dy }}
                            animate={{ opacity: 0.7, scale: 1, x: dx, y: dy }}
                            transition={{ duration: 0.5, delay: dotIdx * 0.04 }}
                            style={{ backgroundColor: phase.color }}
                          />
                        )
                      })}
                    </div>
                  )}
                </button>
              </div>
            )
          })}
        </div>

        {/* Labels row — positioned to align under each dot */}
        <div className="relative mt-1" style={{ height: '16px' }}>
          {PHASES.map((phase, i) => {
            const isPast = i < activePhaseIndex
            const isActive = i === (selectedWeek !== null ? activePhaseIndex : viewPhaseIndex)
            const isFuture = i > activePhaseIndex
            const leftPercent = (i / PHASES.length) * 100

            return (
              <button
                key={`label-${phase.label}`}
                onClick={() => handlePhaseClick(i)}
                className={cn(
                  'absolute text-[10px] font-ui font-semibold tracking-wide transition-colors duration-200 whitespace-nowrap focus:outline-none focus-visible:underline',
                  isActive ? '' : isFuture ? 'text-[--dim]' : 'text-[--muted]'
                )}
                style={{
                  left: `${leftPercent}%`,
                  transform: 'translateX(-50%)',
                  ...(isActive || isPast ? { color: phase.color } : {}),
                }}
              >
                {phase.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Week pills — 6 visible at a time with arrows */}
      <div className="flex items-center gap-1">
        {/* Left arrow */}
        <button
          onClick={() => handleShift(-1)}
          disabled={!canGoPrev}
          aria-label="Previous weeks"
          className={cn(
            'flex-shrink-0 p-1.5 rounded-lg transition-colors',
            canGoPrev
              ? 'text-[--muted] hover:text-[--cream] hover:bg-[--card]'
              : 'text-[--dim] opacity-30 cursor-not-allowed'
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Week pills */}
        <div className="flex items-center gap-1.5 flex-1 justify-center">
          {visibleWeeks.map(week => {
            const count = taskCountByWeek[week] || 0
            const isSelected = selectedWeek === week
            const isCurrent = currentWeek === week

            return (
              <button
                key={week}
                onClick={() => handlePillClick(week)}
                className={cn(
                  'relative flex-shrink-0 w-9 h-9 rounded-lg text-sm font-medium font-ui transition-all',
                  isSelected
                    ? 'bg-copper text-[--white]'
                    : isCurrent
                      ? 'bg-copper/20 text-copper'
                      : count > 0
                        ? 'text-[--cream] hover:bg-[--card]'
                        : 'text-[--dim] hover:bg-[--card] hover:text-[--muted]'
                )}
              >
                {week}
                {count > 0 && !isSelected && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] px-0.5 flex items-center justify-center rounded-full bg-copper/80 text-[--white] text-[9px] font-semibold leading-none">
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => handleShift(1)}
          disabled={!canGoNext}
          aria-label="Next weeks"
          className={cn(
            'flex-shrink-0 p-1.5 rounded-lg transition-colors',
            canGoNext
              ? 'text-[--muted] hover:text-[--cream] hover:bg-[--card]'
              : 'text-[--dim] opacity-30 cursor-not-allowed'
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Summary bar */}
      <div className="flex items-center justify-center gap-3 text-xs text-[--muted] font-ui">
        {selectedWeek !== null ? (
          <>
            <span className="inline-flex items-center gap-1.5 bg-copper-dim text-copper px-2.5 py-1 rounded-full text-xs font-semibold">
              Week {selectedWeek}
            </span>
            <span>
              <span className="text-[--cream] font-medium">
                {taskCountByWeek[selectedWeek] || 0}
              </span>{' '}
              pending tasks
            </span>
          </>
        ) : (
          <span>
            <span className="text-[--cream] font-medium">{totalTasks}</span> pending
            tasks across all weeks
          </span>
        )}
      </div>
    </div>
  )
}
