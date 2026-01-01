'use client'

import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { UpcomingEvent } from '@/types/dashboard'
import Link from 'next/link'

interface UpcomingEventsCardProps {
  events: UpcomingEvent[]
}

export function UpcomingEventsCard({ events }: UpcomingEventsCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl p-5',
        'bg-gradient-to-br from-zinc-800 to-zinc-900',
        'border border-white/[0.06]'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-white flex items-center gap-2">
          📅 Coming Up
        </span>
        <Link
          href="/calendar"
          className="text-xs text-zinc-500 hover:text-amber-500 transition-colors"
        >
          View calendar →
        </Link>
      </div>

      {/* Events list */}
      {events.length > 0 ? (
        <div className="flex flex-col gap-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-3.5 p-3.5 bg-white/[0.02] rounded-xl"
            >
              {/* Date */}
              <div className="text-center min-w-[48px]">
                <div className="text-xl font-bold text-white">
                  {format(event.date, 'd')}
                </div>
                <div className="text-[10px] text-zinc-500 uppercase">
                  {format(event.date, 'MMM')}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-zinc-200 truncate">
                  {event.title}
                </div>
                <div className="text-xs text-zinc-500 truncate">
                  {event.time && `${event.time} • `}
                  {event.location || 'No location'}
                </div>
              </div>

              {/* Icon */}
              <div
                className={cn(
                  'w-9 h-9 rounded-[10px] flex items-center justify-center text-base',
                  'bg-teal-500/15'
                )}
              >
                {event.icon}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <div className="text-2xl mb-2">📅</div>
          <div className="text-xs text-zinc-500">No upcoming events</div>
        </div>
      )}
    </div>
  )
}
