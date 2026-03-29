'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from 'date-fns'
import { FamilyTask } from '@tdc/shared/types'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, CheckSquare } from 'lucide-react'
import Link from 'next/link'

interface TasksCalendarViewProps {
  tasks: FamilyTask[]
}

export function TasksCalendarView({ tasks }: TasksCalendarViewProps) {
  const [calendarDate, setCalendarDate] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(calendarDate)
    const monthEnd = endOfMonth(calendarDate)
    const calStart = startOfWeek(monthStart)
    const calEnd = endOfWeek(monthEnd)
    return eachDayOfInterval({ start: calStart, end: calEnd })
  }, [calendarDate])

  const getTasksForDate = useCallback((date: Date) => {
    return tasks.filter(t =>
      t.due_date && t.status === 'pending' && !t.is_backlog && isSameDay(new Date(t.due_date), date)
    )
  }, [tasks])

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : []

  return (
    <div className="space-y-4 mb-6">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCalendarDate(subMonths(calendarDate, 1))}
          className="p-2 rounded-lg hover:bg-[--card] text-[--muted] transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-display font-semibold text-[--cream]">
          {format(calendarDate, 'MMMM yyyy')}
        </h2>
        <button
          onClick={() => setCalendarDate(addMonths(calendarDate, 1))}
          className="p-2 rounded-lg hover:bg-[--card] text-[--muted] transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="bg-[--surface] rounded-xl border border-[--border] overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-[--border]">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-xs text-[--muted] font-ui font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, i) => {
            const dayTasks = getTasksForDate(day)
            const isCurrentMonth = isSameMonth(day, calendarDate)

            return (
              <button
                key={i}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  'min-h-[80px] p-2 border-b border-r border-[--border] text-left transition-colors hover:bg-[--card]',
                  !isCurrentMonth && 'bg-[--bg]/50',
                  selectedDate && isSameDay(day, selectedDate) && 'bg-copper-dim'
                )}
              >
                <span className={cn(
                  'text-sm font-body',
                  isToday(day) && 'bg-copper text-[--bg] rounded-full w-6 h-6 flex items-center justify-center',
                  !isCurrentMonth && 'text-[--dim]'
                )}>
                  {format(day, 'd')}
                </span>

                {/* Task indicators */}
                <div className="mt-1 space-y-0.5">
                  {dayTasks.slice(0, 3).map((task, j) => (
                    <div
                      key={j}
                      className="text-xs truncate px-1 rounded bg-copper-dim text-copper"
                    >
                      {task.title}
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-[--muted] font-body">+{dayTasks.length - 3} more</div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Day detail sheet */}
      <Sheet open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
        <SheetContent className="bg-[--surface] border-[--border]">
          <SheetHeader>
            <SheetTitle className="text-[--cream] font-display">
              {selectedDate && format(selectedDate, 'EEEE, MMMM d')}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-3">
            {selectedDateTasks.length > 0 ? (
              selectedDateTasks.map(task => (
                <Link
                  key={task.id}
                  href={`/tasks/${task.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[--card] hover:bg-[--card-hover] transition-colors"
                >
                  <CheckSquare className="h-4 w-4 text-copper flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm text-[--cream] font-ui truncate">{task.title}</div>
                    <div className="text-xs text-[--muted] font-body capitalize">{task.category}</div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-[--muted] font-body text-center py-8">No tasks on this day</p>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
