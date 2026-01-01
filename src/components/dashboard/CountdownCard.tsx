'use client'

import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface CountdownCardProps {
  daysToGo: number
  weeksToGo: number
  dueDate: Date
}

export function CountdownCard({ daysToGo, weeksToGo, dueDate }: CountdownCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl p-5',
        'bg-gradient-to-br from-amber-500/10 to-orange-600/5',
        'border border-amber-500/20'
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-semibold text-white">
          ⏳ Countdown to Due Date
        </span>
      </div>

      {/* Countdown display */}
      <div className="flex items-center justify-center gap-5 mb-4">
        <div className="text-center">
          <div className="text-4xl font-extrabold text-white">
            {daysToGo}
          </div>
          <div className="text-[11px] text-zinc-500 uppercase">Days</div>
        </div>
        <div className="text-[28px] text-zinc-600">:</div>
        <div className="text-center">
          <div className="text-4xl font-extrabold text-white">
            {weeksToGo}
          </div>
          <div className="text-[11px] text-zinc-500 uppercase">Weeks</div>
        </div>
      </div>

      {/* Due date */}
      <div className="text-center text-[13px] text-zinc-400">
        Due <strong className="text-amber-500">{format(dueDate, 'MMMM d, yyyy')}</strong>
      </div>
    </div>
  )
}
