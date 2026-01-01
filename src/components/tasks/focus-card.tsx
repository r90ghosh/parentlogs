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
          'bg-gradient-to-br from-amber-500/10 to-orange-600/5',
          'border border-amber-500/20'
        )}
      >
        <div className="text-center py-4">
          <div className="text-4xl mb-3">🎉</div>
          <h3 className="text-lg font-bold text-white mb-2">All caught up!</h3>
          <p className="text-sm text-zinc-400">No urgent tasks for today</p>
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
        'bg-gradient-to-br from-amber-500/10 to-orange-600/5',
        'border border-amber-500/20'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-500 uppercase tracking-wide">
          <span>🎯</span>
          Today&apos;s Focus
        </div>
        <div className="text-xs text-zinc-500">
          ⏱️ {getTimeEstimate()}
        </div>
      </div>

      {/* Task title */}
      <h3 className="text-lg font-bold text-white mb-2">
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-zinc-400 leading-relaxed mb-4 line-clamp-3">
          {task.description}
        </p>
      )}

      {/* Why now box */}
      {task.why_it_matters && (
        <div className="bg-black/20 rounded-[10px] px-4 py-3 mb-5">
          <div className="text-[11px] font-semibold text-amber-500 uppercase tracking-wide mb-1.5">
            💡 Why now?
          </div>
          <p className="text-[13px] text-zinc-400 leading-relaxed">
            {task.why_it_matters}
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2.5">
        <button
          onClick={onDone}
          className={cn(
            'flex-1 py-3 rounded-[10px] text-sm font-semibold text-white',
            'bg-gradient-to-r from-green-500 to-green-600',
            'hover:shadow-lg hover:shadow-green-500/30',
            'flex items-center justify-center gap-1.5 transition-all'
          )}
        >
          ✓ Done
        </button>
        <button
          onClick={onSnooze}
          className={cn(
            'flex-1 py-3 rounded-[10px] text-sm font-semibold',
            'bg-white/[0.06] text-zinc-400 border border-white/10',
            'hover:bg-white/10 hover:text-zinc-300',
            'flex items-center justify-center gap-1.5 transition-all'
          )}
        >
          → Tomorrow
        </button>
      </div>
    </div>
  )
}
