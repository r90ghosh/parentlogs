'use client'

import { useState, useMemo } from 'react'
import { useTasks } from '@/hooks/use-tasks'
import { useBriefings } from '@/hooks/use-briefings'
import { useBudgetItems } from '@/hooks/use-budget'
import { useTrackerLogs } from '@/hooks/use-tracker'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  FileText,
  DollarSign,
  Baby,
} from 'lucide-react'
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
import { cn } from '@/lib/utils'
import Link from 'next/link'

type ViewType = 'month' | 'week' | 'agenda'
type DataFilter = 'all' | 'tasks' | 'briefings' | 'budget' | 'logs'

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<ViewType>('month')
  const [filters, setFilters] = useState<DataFilter[]>(['all'])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const { data: tasks } = useTasks({ status: 'all' })
  const { data: briefings } = useBriefings()
  const { data: budgetItems } = useBudgetItems()
  const { data: logs } = useTrackerLogs()

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const showFilter = (type: DataFilter) => filters.includes('all') || filters.includes(type)

  const getEventsForDate = (date: Date) => {
    const events: Array<{ type: DataFilter; item: any }> = []

    if (showFilter('tasks') && tasks) {
      tasks.filter(t => isSameDay(new Date(t.due_date), date))
        .forEach(t => events.push({ type: 'tasks', item: t }))
    }

    if (showFilter('logs') && logs) {
      logs.filter(l => isSameDay(new Date(l.logged_at), date))
        .forEach(l => events.push({ type: 'logs', item: l }))
    }

    return events
  }

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : []

  const toggleFilter = (filter: DataFilter) => {
    if (filter === 'all') {
      setFilters(['all'])
    } else {
      const newFilters = filters.filter(f => f !== 'all')
      if (newFilters.includes(filter)) {
        const updated = newFilters.filter(f => f !== filter)
        setFilters(updated.length ? updated : ['all'])
      } else {
        setFilters([...newFilters, filter])
      }
    }
  }

  return (
    <div className="p-4 md:ml-64 space-y-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Calendar</h1>
        <Tabs value={view} onValueChange={(v) => setView(v as ViewType)}>
          <TabsList className="bg-surface-900">
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="agenda">Agenda</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-medium text-white">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <Button variant="ghost" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <FilterChip
          active={filters.includes('all')}
          onClick={() => toggleFilter('all')}
          icon={null}
          label="All"
        />
        <FilterChip
          active={showFilter('tasks')}
          onClick={() => toggleFilter('tasks')}
          icon={CheckSquare}
          label="Tasks"
          color="text-accent-500"
        />
        <FilterChip
          active={showFilter('briefings')}
          onClick={() => toggleFilter('briefings')}
          icon={FileText}
          label="Briefings"
          color="text-primary-500"
        />
        <FilterChip
          active={showFilter('budget')}
          onClick={() => toggleFilter('budget')}
          icon={DollarSign}
          label="Budget"
          color="text-amber-500"
        />
        <FilterChip
          active={showFilter('logs')}
          onClick={() => toggleFilter('logs')}
          icon={Baby}
          label="Logs"
          color="text-blue-500"
        />
      </div>

      {/* Calendar Grid */}
      {view === 'month' && (
        <div className="bg-surface-900 rounded-lg border border-surface-800 overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-surface-800">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-xs text-surface-400 font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, i) => {
              const events = getEventsForDate(day)
              const isCurrentMonth = isSameMonth(day, currentDate)

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "min-h-[80px] p-2 border-b border-r border-surface-800 text-left transition-colors hover:bg-surface-800",
                    !isCurrentMonth && "bg-surface-950/50",
                    isSameDay(day, selectedDate || new Date(-1)) && "bg-primary-600/20"
                  )}
                >
                  <span className={cn(
                    "text-sm",
                    isToday(day) && "bg-accent-500 text-white rounded-full w-6 h-6 flex items-center justify-center",
                    !isCurrentMonth && "text-surface-600"
                  )}>
                    {format(day, 'd')}
                  </span>

                  {/* Event indicators */}
                  <div className="mt-1 space-y-1">
                    {events.slice(0, 3).map((event, j) => (
                      <div
                        key={j}
                        className={cn(
                          "text-xs truncate px-1 rounded",
                          event.type === 'tasks' && "bg-accent-500/20 text-accent-400",
                          event.type === 'logs' && "bg-blue-500/20 text-blue-400",
                        )}
                      >
                        {event.type === 'tasks' ? event.item.title : event.item.log_type}
                      </div>
                    ))}
                    {events.length > 3 && (
                      <div className="text-xs text-surface-400">+{events.length - 3} more</div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Day Detail Sheet */}
      <Sheet open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
        <SheetContent className="bg-surface-900 border-surface-800">
          <SheetHeader>
            <SheetTitle className="text-white">
              {selectedDate && format(selectedDate, 'EEEE, MMMM d')}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            {selectedDateEvents.length > 0 ? (
              selectedDateEvents.map((event, i) => (
                <div key={i} className="p-3 rounded-lg bg-surface-800">
                  {event.type === 'tasks' && (
                    <Link href={`/tasks/${event.item.id}`} className="block">
                      <div className="flex items-center gap-2">
                        <CheckSquare className="h-4 w-4 text-accent-500" />
                        <span className="text-white">{event.item.title}</span>
                      </div>
                      <p className="text-xs text-surface-400 mt-1">{event.item.category}</p>
                    </Link>
                  )}
                  {event.type === 'logs' && (
                    <div className="flex items-center gap-2">
                      <Baby className="h-4 w-4 text-blue-500" />
                      <span className="text-white capitalize">{event.item.log_type}</span>
                      <span className="text-xs text-surface-400">
                        {format(new Date(event.item.logged_at), 'h:mm a')}
                      </span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-surface-400 text-center py-8">No events on this day</p>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  icon: Icon,
  label,
  color
}: {
  active: boolean
  onClick: () => void
  icon: any
  label: string
  color?: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors",
        active
          ? "bg-primary-600 text-white"
          : "bg-surface-800 text-surface-300 hover:bg-surface-700"
      )}
    >
      {Icon && <Icon className={cn("h-4 w-4", !active && color)} />}
      {label}
    </button>
  )
}
