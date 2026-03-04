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
        'bg-gradient-to-br from-[--gold-dim] to-[--card]',
        'border border-[--gold-glow]'
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-semibold text-[--cream]">
          ⏳ Countdown to Due Date
        </span>
      </div>

      {/* Countdown display */}
      <div className="flex items-center justify-center gap-5 mb-4">
        <div className="text-center">
          <div className="text-4xl font-extrabold text-[--cream]">
            {daysToGo}
          </div>
          <div className="text-[11px] text-[--dim] uppercase">Days</div>
        </div>
        <div className="text-[28px] text-[--dim]">:</div>
        <div className="text-center">
          <div className="text-4xl font-extrabold text-[--cream]">
            {weeksToGo}
          </div>
          <div className="text-[11px] text-[--dim] uppercase">Weeks</div>
        </div>
      </div>

      {/* Due date */}
      <div className="text-center text-[13px] text-[--muted]">
        Due <strong className="text-[--gold]">{format(dueDate, 'MMMM d, yyyy')}</strong>
      </div>
    </div>
  )
}
