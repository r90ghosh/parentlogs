'use client'

import { BriefingTemplate } from '@/types'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface BriefingHeroProps {
  briefing: BriefingTemplate
  currentWeek: number
  viewingWeek: number
  maxWeek: number
  onNavigate: (week: number) => void
  isPregnancy: boolean
}

export function BriefingHero({
  briefing,
  currentWeek,
  viewingWeek,
  maxWeek,
  onNavigate,
  isPregnancy,
}: BriefingHeroProps) {
  const canGoPrev = viewingWeek > 1
  const canGoNext = viewingWeek < maxWeek

  // Generate week dots (show ~7 centered around current)
  const getVisibleWeeks = () => {
    const range = 3
    const start = Math.max(1, viewingWeek - range)
    const end = Math.min(maxWeek, viewingWeek + range)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  const visibleWeeks = getVisibleWeeks()

  // Get stage label
  const getStageLabel = () => {
    if (!isPregnancy) return 'Post-Birth'
    if (viewingWeek <= 13) return 'First Trimester'
    if (viewingWeek <= 27) return 'Second Trimester'
    return 'Third Trimester'
  }

  return (
    <div className="relative bg-[--surface] border-b border-[--border] px-4 sm:px-6 md:px-12 py-5 overflow-hidden">
      {/* Radial gradient overlay */}
      <div className="absolute top-[-50%] right-[-10%] w-[400px] h-[400px] bg-[radial-gradient(circle,var(--copper-glow)_0%,transparent_70%)] pointer-events-none" />

      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <button
          onClick={() => onNavigate(viewingWeek - 1)}
          disabled={!canGoPrev}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-ui text-[--muted] transition-colors',
            canGoPrev ? 'hover:bg-[--card] hover:text-[--cream]' : 'opacity-30 cursor-not-allowed'
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Week {viewingWeek - 1}</span>
        </button>

        {/* Week Numbers Navigation */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          {visibleWeeks[0] > 1 && (
            <span className="text-[--dim] text-xs px-1">...</span>
          )}
          {visibleWeeks.map(week => (
            <button
              key={week}
              onClick={() => onNavigate(week)}
              className={cn(
                'w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs sm:text-sm font-medium font-ui transition-all',
                week === viewingWeek
                  ? 'bg-copper text-[--white]'
                  : 'text-[--muted] hover:bg-[--card] hover:text-[--cream]'
              )}
            >
              {week}
            </button>
          ))}
          {visibleWeeks[visibleWeeks.length - 1] < maxWeek && (
            <span className="text-[--dim] text-xs px-1">...</span>
          )}
        </div>

        <button
          onClick={() => onNavigate(viewingWeek + 1)}
          disabled={!canGoNext}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-ui text-[--muted] transition-colors',
            canGoNext ? 'hover:bg-[--card] hover:text-[--cream]' : 'opacity-30 cursor-not-allowed'
          )}
        >
          <span className="hidden sm:inline">Week {viewingWeek + 1}</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Hero Content */}
      <div className="relative z-10">
        {/* Stage Badge */}
        <div className="inline-flex items-center gap-2 bg-copper-dim text-copper px-3 py-1 rounded-full text-xs font-semibold font-ui mb-2">
          <span>{isPregnancy ? '🤰' : '👶'}</span>
          {getStageLabel()} &bull; Week {viewingWeek}
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-display font-bold text-[--cream] leading-tight">
          {briefing.title}
        </h1>

        {/* Subtitle - derive from content if needed */}
        {viewingWeek === 12 && (
          <p className="text-base font-semibold font-body text-copper mt-1">
            A major milestone this week
          </p>
        )}
        {viewingWeek === 13 && (
          <p className="text-base font-semibold font-body text-copper mt-1">
            Welcome to the second trimester!
          </p>
        )}
        {viewingWeek === 20 && (
          <p className="text-base font-semibold font-body text-copper mt-1">
            Halfway there!
          </p>
        )}
      </div>
    </div>
  )
}
