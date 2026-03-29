'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
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
import { FamilyTask, TriageAction } from '@tdc/shared/types'
import {
  TasksHeader,
  StatsBar,
  FilterBar,
  TaskItem,
  TaskSection,
  SectionAction,
  CatchUpBanner,
  CatchUpSection,
  FocusCard,
  WeekCalendarCard,
  ProgressCard,
  StreakBanner,
  generateWeekDays,
} from '@/components/tasks'
import {
  useTasks,
  useBacklogTasks,
  useTriageTask,
  useBulkTriageTasks,
  useAllTasksForTimeline,
  useCompleteTask,
  useSnoozeToTomorrow,
} from '@/hooks/use-tasks'
import { useUser } from '@/components/user-provider'
import { useFamily } from '@/hooks/use-family'
import { TaskTimelineBar } from '@/components/shared/task-timeline-bar'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { RevealOnScroll } from '@/components/ui/animations/RevealOnScroll'
import { Card3DTilt } from '@/components/ui/animations/Card3DTilt'
import { CardEntrance } from '@/components/ui/animations/CardEntrance'
import { cn } from '@/lib/utils'
import { List, CalendarDays, ChevronLeft, ChevronRight, Lock, CheckSquare } from 'lucide-react'
import Link from 'next/link'

interface TasksPageClientProps {
  currentWeek: number
  signupWeek: number
  daysToGo: number
  initialView?: 'list' | 'calendar'
  isPremium?: boolean
}

export function TasksPageClient({
  currentWeek,
  signupWeek,
  daysToGo,
  initialView = 'list',
  isPremium = false,
}: TasksPageClientProps) {
  const router = useRouter()

  // View toggle state
  const [view, setView] = useState<'list' | 'calendar'>(initialView)

  // Calendar state
  const [calendarDate, setCalendarDate] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // State
  const [activeTab, setActiveTab] = useState('active')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeStatCard, setActiveStatCard] = useState<string | null>('dueToday')
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)

  // Fetch tasks and family data
  const { data: tasks = [], isLoading: isLoadingTasks } = useTasks()
  const { data: allTasks = [] } = useAllTasksForTimeline()
  const { data: backlogTasks = [] } = useBacklogTasks()
  const { activeBaby } = useUser()
  const { data: family } = useFamily()
  const triageTask = useTriageTask()
  const bulkTriageTasks = useBulkTriageTasks()
  const completeTask = useCompleteTask()
  const snoozeToTomorrow = useSnoozeToTomorrow()

  // Sync URL with view toggle
  const handleViewChange = useCallback((newView: 'list' | 'calendar') => {
    setView(newView)
    router.replace(newView === 'calendar' ? '/tasks?view=calendar' : '/tasks', { scroll: false })
  }, [router])

  // Handle triage actions
  const handleTriage = useCallback((taskId: string, action: TriageAction) => {
    triageTask.mutate({ id: taskId, action })
  }, [triageTask])

  const handleBulkTriage = useCallback((taskIds: string[], action: TriageAction) => {
    bulkTriageTasks.mutate({ ids: taskIds, action })
  }, [bulkTriageTasks])

  // Handle task completion
  const handleComplete = useCallback((taskId: string) => {
    completeTask.mutate(taskId)
  }, [completeTask])

  // Handle snooze — premium only
  const handleSnooze = useCallback((taskId: string) => {
    if (!isPremium) return
    snoozeToTomorrow.snoozeToTomorrow(taskId)
  }, [isPremium, snoozeToTomorrow])

  // 30-day free window: compute which tasks are visible for free users
  const freeWindowCutoff = useMemo(() => {
    if (isPremium) return null
    // Free users see tasks within 30 days of their current week
    return currentWeek + Math.ceil(30 / 7)
  }, [isPremium, currentWeek])

  // Compute effective week for a task (fallback to due_date calculation if week_due is null)
  const effectiveDueDate = activeBaby?.due_date || family?.due_date
  const getEffectiveWeek = useCallback((task: FamilyTask): number | null => {
    if (task.week_due != null) return task.week_due
    if (!task.due_date || !effectiveDueDate) return null
    const dueDate = new Date(effectiveDueDate)
    const taskDate = new Date(task.due_date)
    const daysDiff = Math.floor((dueDate.getTime() - taskDate.getTime()) / (1000 * 60 * 60 * 24))
    return 40 - Math.floor(daysDiff / 7)
  }, [effectiveDueDate])

  // Computed stats
  const stats = useMemo(() => {
    const activeTasks = tasks.filter(t => t.status === 'pending' && !t.is_backlog)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const dueToday = activeTasks.filter(t => {
      if (!t.due_date) return false
      const dueDate = new Date(t.due_date)
      dueDate.setHours(0, 0, 0, 0)
      return dueDate.getTime() === today.getTime()
    }).length

    const thisWeek = activeTasks.filter(t => getEffectiveWeek(t) === currentWeek).length
    const completed = tasks.filter(t => t.status === 'completed').length
    const partnerTasks = activeTasks.filter(t => t.assigned_to === 'mom').length

    // This-week scoped stats for progress card
    const thisWeekAll = tasks.filter(t => !t.is_backlog && getEffectiveWeek(t) === currentWeek)
    const thisWeekDone = thisWeekAll.filter(t => t.status === 'completed').length
    const thisWeekTotal = thisWeekAll.length

    return {
      dueToday,
      thisWeek,
      completed,
      partnerTasks,
      catchUpQueue: backlogTasks.length,
      thisWeekDone,
      thisWeekTotal,
    }
  }, [tasks, backlogTasks, currentWeek, getEffectiveWeek])

  // Task count by week for the week pills timeline bar
  // Uses allTasks (same source as week-filtered view) for consistency
  const taskCountByWeek = useMemo(() => {
    const counts: Record<number, number> = {}
    const pending = allTasks.filter(t => t.status === 'pending' && !t.is_backlog)
    pending.forEach(t => {
      const week = getEffectiveWeek(t)
      if (week != null) counts[week] = (counts[week] || 0) + 1
    })
    return counts
  }, [allTasks, getEffectiveWeek])

  // Filter and sort tasks
  const { thisWeekTasks, comingUpTasks, earlierTasks, focusTask, filteredTasks, phaseTasks } = useMemo(() => {
    // When a week is selected, use ALL tasks (including future) from allTasks
    // Otherwise use the regular tasks list
    const baseList = selectedWeek !== null ? allTasks : tasks

    // When a week is explicitly selected, show ALL tasks for that week (any status)
    // and skip tab/category/free-window filters — the user is browsing by week
    if (selectedWeek !== null) {
      let weekTasks = baseList.filter(t => getEffectiveWeek(t) === selectedWeek && !t.is_backlog)

      // Still apply search if active
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        weekTasks = weekTasks.filter(t =>
          t.title.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query)
        )
      }

      // Sort: pending first, then completed, then by due date
      const sortedWeekTasks = [...weekTasks].sort((a, b) => {
        const statusOrder = { pending: 0, snoozed: 1, skipped: 2, completed: 3 }
        const sa = statusOrder[a.status as keyof typeof statusOrder] ?? 0
        const sb = statusOrder[b.status as keyof typeof statusOrder] ?? 0
        if (sa !== sb) return sa - sb
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
      })

      return {
        thisWeekTasks: [],
        comingUpTasks: [],
        earlierTasks: [],
        focusTask: null,
        filteredTasks: sortedWeekTasks,
        phaseTasks: sortedWeekTasks,
      }
    }

    let filtered = baseList.filter(t => t.status === 'pending' && !t.is_backlog)

    // Apply 30-day free window filter for non-premium users
    if (freeWindowCutoff !== null) {
      filtered = filtered.filter(t => {
        const week = getEffectiveWeek(t)
        return !week || week <= freeWindowCutoff
      })
    }

    // Apply tab filter
    if (activeTab === 'my-tasks') {
      filtered = filtered.filter(t => t.assigned_to === 'dad' || t.assigned_to === 'both' || t.assigned_to === 'either')
    } else if (activeTab === 'partner') {
      filtered = filtered.filter(t => t.assigned_to === 'mom' || t.assigned_to === 'both' || t.assigned_to === 'either')
    } else if (activeTab === 'completed') {
      filtered = baseList.filter(t => t.status === 'completed')
    }

    // Apply category filter
    if (activeCategory) {
      filtered = filtered.filter(t => t.category === activeCategory)
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query)
      )
    }

    // Separate by week (normal view) — use effective week to handle null week_due
    const thisWeek = filtered.filter(t => getEffectiveWeek(t) === currentWeek)
    const comingUp = filtered.filter(t => {
      const week = getEffectiveWeek(t)
      return week != null && week > currentWeek && week <= currentWeek + 4
    })

    // Earlier tasks — premium only, sorted most recent past first
    const earlier = isPremium
      ? filtered
          .filter(t => {
            const week = getEffectiveWeek(t)
            return week != null && week < currentWeek
          })
          .sort((a, b) => (getEffectiveWeek(b) || 0) - (getEffectiveWeek(a) || 0))
      : []

    // Get focus task (highest priority due today or this week)
    const focus = thisWeek.find(t => t.priority === 'must-do') || thisWeek[0] || null

    return {
      thisWeekTasks: thisWeek,
      comingUpTasks: comingUp,
      earlierTasks: earlier,
      focusTask: focus,
      filteredTasks: filtered,
      phaseTasks: [],
    }
  }, [tasks, allTasks, activeTab, activeCategory, searchQuery, currentWeek, selectedWeek, freeWindowCutoff, getEffectiveWeek, isPremium])

  // Calculate triage progress
  const triageProgress = useMemo(() => {
    const total = backlogTasks.length
    if (total === 0) return 0
    const triaged = tasks.filter(t => t.is_backlog && t.backlog_status === 'triaged').length
    return Math.round((triaged / (triaged + total)) * 100)
  }, [tasks, backlogTasks])

  // Generate week calendar data
  const weekDays = useMemo(() => {
    const tasksPerDay: Record<string, number> = {}
    tasks.forEach(t => {
      if (t.due_date && t.status === 'pending' && !t.is_backlog) {
        const dateKey = t.due_date.split('T')[0]
        tasksPerDay[dateKey] = (tasksPerDay[dateKey] || 0) + 1
      }
    })
    return generateWeekDays(tasksPerDay)
  }, [tasks])

  // Calculate this-week progress
  const progressPercent = useMemo(() => {
    if (stats.thisWeekTotal === 0) return 0
    return Math.round((stats.thisWeekDone / stats.thisWeekTotal) * 100)
  }, [stats.thisWeekDone, stats.thisWeekTotal])

  // Calendar view computations
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

  // Check for tasks beyond free window (for showing upgrade prompt)
  const hasLockedTasks = useMemo(() => {
    if (isPremium) return false
    return allTasks.some(t => t.week_due && freeWindowCutoff !== null && t.week_due > freeWindowCutoff)
  }, [allTasks, isPremium, freeWindowCutoff])

  // Loading state
  if (isLoadingTasks) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[--muted] font-body">Loading tasks...</div>
      </div>
    )
  }

  return (
    <div>
      {/* Header with view toggle */}
      <RevealOnScroll delay={0}>
        <div className="flex items-center justify-between mb-4">
          <TasksHeader currentWeek={currentWeek} daysToGo={daysToGo} />
          <div className="flex items-center gap-1 bg-[--surface] border border-[--border] rounded-xl p-1">
            <button
              onClick={() => handleViewChange('list')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-ui font-medium transition-colors',
                view === 'list'
                  ? 'bg-copper-dim text-copper'
                  : 'text-[--muted] hover:text-[--cream]'
              )}
            >
              <List className="h-4 w-4" />
              List
            </button>
            <button
              onClick={() => handleViewChange('calendar')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-ui font-medium transition-colors',
                view === 'calendar'
                  ? 'bg-copper-dim text-copper'
                  : 'text-[--muted] hover:text-[--cream]'
              )}
            >
              <CalendarDays className="h-4 w-4" />
              Calendar
            </button>
          </div>
        </div>
      </RevealOnScroll>

      {/* Calendar View */}
      {view === 'calendar' && (
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
      )}

      {/* List View */}
      {view === 'list' && (
        <>
          {/* Timeline bar - Week pills filter */}
          {allTasks.length > 0 && (
            <RevealOnScroll delay={80}>
              <div className="mb-6">
                <TaskTimelineBar
                  currentWeek={currentWeek}
                  selectedWeek={selectedWeek}
                  onWeekClick={setSelectedWeek}
                  taskCountByWeek={taskCountByWeek}
                />
              </div>
            </RevealOnScroll>
          )}

          {/* Catch-up banner */}
          {backlogTasks.length > 0 && (
            <RevealOnScroll delay={120}>
              <CatchUpBanner
                tasksToReview={backlogTasks.length}
                percentDone={triageProgress}
                signupWeek={signupWeek}
              />
            </RevealOnScroll>
          )}

          {/* Stats bar */}
          <RevealOnScroll delay={160}>
            <StatsBar
              stats={stats}
              activeCard={activeStatCard}
              onCardClick={setActiveStatCard}
            />
          </RevealOnScroll>

          {/* Filter bar */}
          <RevealOnScroll delay={200}>
            <FilterBar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              hasCatchUp={backlogTasks.length > 0}
            />
          </RevealOnScroll>

          {/* 30-day free window upgrade prompt */}
          {hasLockedTasks && (
            <RevealOnScroll delay={240}>
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-gold-dim to-copper-dim border border-gold/25">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-gold flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-ui font-medium text-[--cream]">
                      You&apos;re seeing your 30-day task window
                    </p>
                    <p className="text-xs text-[--muted] font-body mt-0.5">
                      Upgrade to see your full timeline from pregnancy through 24 months.
                    </p>
                  </div>
                  <Link
                    href="/upgrade?source=tasks"
                    className="px-4 py-2 rounded-lg bg-copper text-[--bg] text-sm font-ui font-semibold hover:bg-copper-hover transition-colors flex-shrink-0"
                  >
                    Upgrade
                  </Link>
                </div>
              </div>
            </RevealOnScroll>
          )}

          {/* Main content layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
            {/* Left: Task sections */}
            <div className="space-y-6">
              {/* Catch-up section - only show when no week filter is active */}
              {activeTab === 'active' && backlogTasks.length > 0 && selectedWeek === null && (
                <CardEntrance delay={0}>
                  <CatchUpSection
                    tasks={backlogTasks}
                    currentWeek={currentWeek}
                    onTriage={handleTriage}
                    onBulkTriage={handleBulkTriage}
                    isPending={triageTask.isPending || bulkTriageTasks.isPending}
                    onTaskClick={(taskId) => router.push(`/tasks/${taskId}`)}
                  />
                </CardEntrance>
              )}

              {/* Week tasks section - show when a week filter is active */}
              {selectedWeek !== null && phaseTasks.length > 0 && (
                <CardEntrance delay={0}>
                  <Card3DTilt maxTilt={3} gloss>
                    <TaskSection
                      icon="📋"
                      title={`Week ${selectedWeek}`}
                      count={phaseTasks.length}
                      actions={
                        <SectionAction>Sort by priority</SectionAction>
                      }
                    >
                      {phaseTasks.map(task => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          isHighlighted={task.priority === 'must-do'}
                          onComplete={() => handleComplete(task.id)}
                          onClick={() => router.push(`/tasks/${task.id}`)}
                        />
                      ))}
                    </TaskSection>
                  </Card3DTilt>
                </CardEntrance>
              )}

              {/* Week tasks empty state */}
              {selectedWeek !== null && phaseTasks.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-5xl mb-4">📭</div>
                  <h3 className="text-lg font-display font-semibold text-[--cream] mb-2">No tasks this week</h3>
                  <p className="text-sm text-[--muted] font-body">
                    There are no pending tasks for Week {selectedWeek}.
                  </p>
                </div>
              )}

              {/* This week section - only show when no week filter is active */}
              {selectedWeek === null && thisWeekTasks.length > 0 && (
                <CardEntrance delay={80}>
                  <Card3DTilt maxTilt={3} gloss>
                    <TaskSection
                      icon="📅"
                      title="This Week"
                      count={thisWeekTasks.length}
                      actions={
                        <SectionAction>Sort by priority</SectionAction>
                      }
                    >
                      {thisWeekTasks.map(task => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          isHighlighted={task.priority === 'must-do'}
                          onComplete={() => handleComplete(task.id)}
                          onClick={() => router.push(`/tasks/${task.id}`)}
                        />
                      ))}
                    </TaskSection>
                  </Card3DTilt>
                </CardEntrance>
              )}

              {/* Coming up section - only show when no week filter is active */}
              {selectedWeek === null && comingUpTasks.length > 0 && (
                <CardEntrance delay={160}>
                  <Card3DTilt maxTilt={3} gloss>
                    <TaskSection
                      icon="🔮"
                      title="Coming Up"
                      count={`Week ${currentWeek + 1}-${currentWeek + 4}`}
                      actions={
                        <SectionAction>View all {comingUpTasks.length} →</SectionAction>
                      }
                    >
                      {comingUpTasks.slice(0, 3).map(task => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          isDimmed
                          onComplete={() => handleComplete(task.id)}
                          onClick={() => router.push(`/tasks/${task.id}`)}
                        />
                      ))}
                    </TaskSection>
                  </Card3DTilt>
                </CardEntrance>
              )}

              {/* Earlier tasks section - premium only, default view */}
              {isPremium && selectedWeek === null && earlierTasks.length > 0 && (
                <CardEntrance delay={240}>
                  <Card3DTilt maxTilt={3} gloss>
                    <TaskSection
                      icon="📋"
                      title="Earlier Tasks"
                      count={earlierTasks.length}
                      subtitle="From previous weeks"
                      collapsible
                      defaultExpanded={false}
                    >
                      {earlierTasks.slice(0, 10).map(task => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          isDimmed
                          onComplete={() => handleComplete(task.id)}
                          onClick={() => router.push(`/tasks/${task.id}`)}
                        />
                      ))}
                      {earlierTasks.length > 10 && (
                        <p className="text-center py-3 text-xs text-[--muted] font-body">
                          Use the week pills above to browse by week
                        </p>
                      )}
                    </TaskSection>
                  </Card3DTilt>
                </CardEntrance>
              )}

              {/* Empty state - only show when no week filter is active */}
              {selectedWeek === null && thisWeekTasks.length === 0 && comingUpTasks.length === 0 && activeTab !== 'catchup' && (
                <div className="text-center py-16">
                  <div className="text-5xl mb-4">🎉</div>
                  <h3 className="text-lg font-display font-semibold text-[--cream] mb-2">All caught up!</h3>
                  <p className="text-sm text-[--muted] font-body">No pending tasks for now. Great job!</p>
                </div>
              )}
            </div>

            {/* Right: Panel */}
            <div className="space-y-5">
              {/* Focus card */}
              <CardEntrance delay={100}>
                <Card3DTilt maxTilt={3} gloss>
                  <FocusCard
                    task={focusTask}
                    onDone={() => focusTask && handleComplete(focusTask.id)}
                    onSnooze={() => {
                      if (!isPremium) return
                      if (focusTask) handleSnooze(focusTask.id)
                    }}
                  />
                </Card3DTilt>
              </CardEntrance>

              {/* Snooze premium badge */}
              {!isPremium && (
                <RevealOnScroll delay={150}>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[--surface] border border-[--border]">
                    <Lock className="h-3.5 w-3.5 text-[--muted]" />
                    <span className="text-xs text-[--muted] font-body">Snooze & reschedule are premium features</span>
                  </div>
                </RevealOnScroll>
              )}

              {/* Week calendar */}
              <CardEntrance delay={200}>
                <Card3DTilt maxTilt={3} gloss>
                  <WeekCalendarCard days={weekDays} />
                </Card3DTilt>
              </CardEntrance>

              {/* Progress */}
              <CardEntrance delay={300}>
                <Card3DTilt maxTilt={3} gloss>
                  <ProgressCard
                    percentComplete={progressPercent}
                    done={stats.thisWeekDone}
                    active={stats.thisWeekTotal - stats.thisWeekDone}
                    toTriage={stats.catchUpQueue}
                  />
                </Card3DTilt>
              </CardEntrance>

              {/* Streak banner */}
              <CardEntrance delay={400}>
                <Card3DTilt maxTilt={3} gloss>
                  <StreakBanner days={3} />
                </Card3DTilt>
              </CardEntrance>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
