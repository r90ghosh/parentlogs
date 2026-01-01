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
    <div className="relative bg-gradient-to-br from-teal-500/[0.15] via-cyan-500/[0.08] to-transparent border-b border-white/[0.06] px-6 md:px-12 py-5 md:ml-64 overflow-hidden">
      {/* Radial gradient overlay */}
      <div className="absolute top-[-50%] right-[-10%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(20,184,166,0.1)_0%,transparent_70%)] pointer-events-none" />

      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <button
          onClick={() => onNavigate(viewingWeek - 1)}
          disabled={!canGoPrev}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-zinc-500 transition-colors',
            canGoPrev ? 'hover:bg-white/5 hover:text-zinc-300' : 'opacity-30 cursor-not-allowed'
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Week {viewingWeek - 1}</span>
        </button>

        {/* Week Numbers Navigation */}
        <div className="flex items-center gap-1">
          {visibleWeeks[0] > 1 && (
            <span className="text-zinc-600 text-xs px-1">...</span>
          )}
          {visibleWeeks.map(week => (
            <button
              key={week}
              onClick={() => onNavigate(week)}
              className={cn(
                'w-8 h-8 rounded-lg text-sm font-medium transition-all',
                week === viewingWeek
                  ? 'bg-teal-500 text-white'
                  : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'
              )}
            >
              {week}
            </button>
          ))}
          {visibleWeeks[visibleWeeks.length - 1] < maxWeek && (
            <span className="text-zinc-600 text-xs px-1">...</span>
          )}
        </div>

        <button
          onClick={() => onNavigate(viewingWeek + 1)}
          disabled={!canGoNext}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-zinc-500 transition-colors',
            canGoNext ? 'hover:bg-white/5 hover:text-zinc-300' : 'opacity-30 cursor-not-allowed'
          )}
        >
          <span className="hidden sm:inline">Week {viewingWeek + 1}</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Hero Content */}
      <div className="relative z-10">
        {/* Stage Badge */}
        <div className="inline-flex items-center gap-2 bg-teal-500/15 text-teal-500 px-3 py-1 rounded-full text-xs font-semibold mb-2">
          <span>{isPregnancy ? '🤰' : '👶'}</span>
          {getStageLabel()} &bull; Week {viewingWeek}
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
          {briefing.title}
        </h1>

        {/* Subtitle - derive from content if needed */}
        {viewingWeek === 12 && (
          <p className="text-base font-semibold text-teal-400 mt-1">
            A major milestone this week
          </p>
        )}
        {viewingWeek === 13 && (
          <p className="text-base font-semibold text-teal-400 mt-1">
            Welcome to the second trimester!
          </p>
        )}
        {viewingWeek === 20 && (
          <p className="text-base font-semibold text-teal-400 mt-1">
            Halfway there!
          </p>
        )}
      </div>
    </div>
  )
}
