'use client'

import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProgressHeaderProps {
  currentWeek: number
  totalWeeks: number
  overdueCount: number
  className?: string
}

export function ProgressHeader({
  currentWeek,
  totalWeeks,
  overdueCount,
  className,
}: ProgressHeaderProps) {
  const progressPercent = Math.min((currentWeek / totalWeeks) * 100, 100)
  const isOnTrack = overdueCount === 0

  return (
    <div className={cn('space-y-3', className)}>
      {/* Week and status row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-white">
            Week {currentWeek}
          </span>
          <span className="text-surface-400">of {totalWeeks}</span>
        </div>

        {/* Status badge */}
        <div
          className={cn(
            'flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium',
            isOnTrack
              ? 'bg-green-500/10 text-green-400'
              : 'bg-amber-500/10 text-amber-400'
          )}
        >
          {isOnTrack ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              <span>On Track</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4" />
              <span>{overdueCount} overdue</span>
            </>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-2 bg-surface-800 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        />

        {/* Current position indicator */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md border-2 border-amber-500"
          initial={{ left: 0 }}
          animate={{ left: `calc(${progressPercent}% - 6px)` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        />
      </div>

      {/* Timeline labels */}
      <div className="flex justify-between text-xs text-surface-500">
        <span>Start</span>
        <span>Halfway</span>
        <span>{totalWeeks === 40 ? 'Due Date' : 'Month 24'}</span>
      </div>
    </div>
  )
}
