'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WeekDay {
  label: string  // "Mon", "Tue", etc.
  num: number    // Day of month
  tasks: number  // Task count
  isToday?: boolean
  date: Date
}

interface WeekCalendarCardProps {
  days: WeekDay[]
  onDayClick?: (date: Date) => void
  onPrev?: () => void
  onNext?: () => void
}

export function WeekCalendarCard({
  days,
  onDayClick,
  onPrev,
  onNext,
}: WeekCalendarCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl p-5',
        'bg-[--surface]',
        'border border-[--border]'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-ui font-semibold text-[--cream]">📅 This Week</h3>
        <div className="flex gap-2">
          <button
            onClick={onPrev}
            className={cn(
              'w-7 h-7 rounded-md flex items-center justify-center',
              'bg-[--card] text-[--muted]',
              'hover:bg-[--card-hover] hover:text-[--cream] transition-all'
            )}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onNext}
            className={cn(
              'w-7 h-7 rounded-md flex items-center justify-center',
              'bg-[--card] text-[--muted]',
              'hover:bg-[--card-hover] hover:text-[--cream] transition-all'
            )}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Week grid */}
      <div className="grid grid-cols-7 gap-1.5 mb-4">
        {days.map((day, i) => {
          const hasTasks = day.tasks > 0

          return (
            <button
              key={i}
              onClick={() => onDayClick?.(day.date)}
              className={cn(
                'text-center py-2 px-1 rounded-lg transition-all',
                day.isToday && 'bg-copper-dim border border-copper/30',
                !day.isToday && hasTasks && 'bg-gold-dim',
                !day.isToday && !hasTasks && 'hover:bg-[--card]'
              )}
            >
              <div className="text-[10px] text-[--dim] font-body mb-1">{day.label}</div>
              <div className={cn(
                'text-sm font-ui font-semibold',
                day.isToday ? 'text-copper' : hasTasks ? 'text-gold' : 'text-[--muted]'
              )}>
                {day.num}
              </div>
              <div className="text-[10px] text-[--dim] font-body mt-1">
                {day.tasks > 0 ? day.tasks : ''}
              </div>
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-1.5 text-[11px] text-[--dim] font-body">
          <div className="w-2 h-2 rounded-full bg-copper" />
          <span>Today</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-[--dim] font-body">
          <div className="w-2 h-2 rounded-full bg-gold" />
          <span>Has tasks</span>
        </div>
      </div>
    </div>
  )
}

// Helper function to generate week days
export function generateWeekDays(tasksPerDay?: Record<string, number>): WeekDay[] {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))

  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return dayLabels.map((label, i) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    const dateKey = date.toISOString().split('T')[0]

    return {
      label,
      num: date.getDate(),
      tasks: tasksPerDay?.[dateKey] || 0,
      isToday: date.toDateString() === today.toDateString(),
      date,
    }
  })
}
