'use client'

import { FamilyTask } from '@/types'
import { cn } from '@/lib/utils'

interface FocusCardProps {
  task: FamilyTask | null
  onDone: () => void
  onSnooze: () => void
}

export function FocusCard({ task, onDone, onSnooze }: FocusCardProps) {
  if (!task) {
    return (
      <div
        className={cn(
          'rounded-2xl p-6',
          'bg-gradient-to-br from-copper-dim to-gold-dim',
          'border border-copper/20'
        )}
      >
        <div className="text-center py-4">
          <div className="text-4xl mb-3">🎉</div>
          <h3 className="text-lg font-display font-bold text-[--cream] mb-2">All caught up!</h3>
          <p className="text-sm text-[--muted] font-body">No urgent tasks for today</p>
        </div>
      </div>
    )
  }

  // Format time estimate
  const getTimeEstimate = () => {
    const mins = task.time_estimate_minutes
    if (!mins) return '~15 min'
    if (mins < 60) return `~${mins} min`
    const hours = Math.floor(mins / 60)
    return `~${hours}h`
  }

  return (
    <div
      className={cn(
        'rounded-2xl p-6',
        'bg-gradient-to-br from-copper-dim to-gold-dim',
        'border border-copper/20'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 text-xs font-ui font-semibold text-copper uppercase tracking-wide">
          <span>🎯</span>
          Today&apos;s Focus
        </div>
        <div className="text-xs text-[--muted] font-body">
          ⏱️ {getTimeEstimate()}
        </div>
      </div>

      {/* Task title */}
      <h3 className="text-lg font-display font-bold text-[--cream] mb-2">
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-[--muted] font-body leading-relaxed mb-4 line-clamp-3">
          {task.description}
        </p>
      )}

      {/* Why now box */}
      {task.why_it_matters && (
        <div className="bg-[--bg]/40 rounded-[10px] px-4 py-3 mb-5">
          <div className="text-[11px] font-ui font-semibold text-copper uppercase tracking-wide mb-1.5">
            💡 Why now?
          </div>
          <p className="text-[13px] text-[--muted] font-body leading-relaxed">
            {task.why_it_matters}
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2.5">
        <button
          onClick={onDone}
          className={cn(
            'flex-1 py-3 rounded-[10px] text-sm font-ui font-semibold text-[--bg]',
            'bg-sage hover:bg-sage/90',
            'hover:shadow-gold',
            'flex items-center justify-center gap-1.5 transition-all'
          )}
        >
          ✓ Done
        </button>
        <button
          onClick={onSnooze}
          className={cn(
            'flex-1 py-3 rounded-[10px] text-sm font-ui font-semibold',
            'bg-[--card] text-[--muted] border border-[--border]',
            'hover:bg-[--card-hover] hover:text-[--cream]',
            'flex items-center justify-center gap-1.5 transition-all'
          )}
        >
          → Tomorrow
        </button>
      </div>
    </div>
  )
}
