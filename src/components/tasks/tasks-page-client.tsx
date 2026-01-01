'use client'

import { useState, useMemo, useCallback } from 'react'
import { FamilyTask, TriageAction } from '@/types'
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
} from '@/hooks/use-tasks'

interface TasksPageClientProps {
  currentWeek: number
  signupWeek: number
  daysToGo: number
}

export function TasksPageClient({
  currentWeek,
  signupWeek,
  daysToGo,
}: TasksPageClientProps) {
  // State
  const [activeTab, setActiveTab] = useState('active')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeStatCard, setActiveStatCard] = useState<string | null>('dueToday')

  // Fetch tasks
  const { data: tasks = [], isLoading: isLoadingTasks } = useTasks()
  const { data: backlogTasks = [] } = useBacklogTasks()
  const triageTask = useTriageTask()
  const bulkTriageTasks = useBulkTriageTasks()

  // Handle triage actions
  const handleTriage = useCallback((taskId: string, action: TriageAction) => {
    triageTask.mutate({ id: taskId, action })
  }, [triageTask])

  const handleBulkTriage = useCallback((taskIds: string[], action: TriageAction) => {
    bulkTriageTasks.mutate({ ids: taskIds, action })
  }, [bulkTriageTasks])

  // Handle task completion
  const handleComplete = useCallback((taskId: string) => {
    // TODO: Implement complete task mutation
    console.log('Complete task:', taskId)
  }, [])

  // Handle snooze
  const handleSnooze = useCallback((taskId: string) => {
    // TODO: Implement snooze mutation
    console.log('Snooze task:', taskId)
  }, [])

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

    const thisWeek = activeTasks.filter(t => t.week_due === currentWeek).length
    const completed = tasks.filter(t => t.status === 'completed').length
    const partnerTasks = activeTasks.filter(t => t.assigned_to === 'mom').length

    return {
      dueToday,
      thisWeek,
      completed,
      partnerTasks,
      catchUpQueue: backlogTasks.length,
    }
  }, [tasks, backlogTasks, currentWeek])

  // Filter and sort tasks
  const { thisWeekTasks, comingUpTasks, focusTask, filteredTasks } = useMemo(() => {
    let filtered = tasks.filter(t => t.status === 'pending' && !t.is_backlog)

    // Apply tab filter
    if (activeTab === 'my-tasks') {
      filtered = filtered.filter(t => t.assigned_to === 'dad' || t.assigned_to === 'both' || t.assigned_to === 'either')
    } else if (activeTab === 'partner') {
      filtered = filtered.filter(t => t.assigned_to === 'mom' || t.assigned_to === 'both' || t.assigned_to === 'either')
    } else if (activeTab === 'completed') {
      filtered = tasks.filter(t => t.status === 'completed')
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

    // Separate by week
    const thisWeek = filtered.filter(t => t.week_due === currentWeek)
    const comingUp = filtered.filter(t => t.week_due && t.week_due > currentWeek && t.week_due <= currentWeek + 4)

    // Get focus task (highest priority due today or this week)
    const focus = thisWeek.find(t => t.priority === 'must-do') || thisWeek[0] || null

    return {
      thisWeekTasks: thisWeek,
      comingUpTasks: comingUp,
      focusTask: focus,
      filteredTasks: filtered,
    }
  }, [tasks, activeTab, activeCategory, searchQuery, currentWeek])

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

  // Calculate overall progress
  const progressPercent = useMemo(() => {
    const total = tasks.filter(t => !t.is_backlog).length
    if (total === 0) return 0
    return Math.round((stats.completed / total) * 100)
  }, [tasks, stats.completed])

  // Loading state
  if (isLoadingTasks) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-zinc-500">Loading tasks...</div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <TasksHeader currentWeek={currentWeek} daysToGo={daysToGo} />

      {/* Catch-up banner */}
      {backlogTasks.length > 0 && (
        <CatchUpBanner
          tasksToReview={backlogTasks.length}
          percentDone={triageProgress}
          signupWeek={signupWeek}
        />
      )}

      {/* Stats bar */}
      <StatsBar
        stats={stats}
        activeCard={activeStatCard}
        onCardClick={setActiveStatCard}
      />

      {/* Filter bar */}
      <FilterBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        hasCatchUp={backlogTasks.length > 0}
      />

      {/* Main content layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Left: Task sections */}
        <div className="space-y-6">
          {/* Catch-up section */}
          {activeTab === 'active' && backlogTasks.length > 0 && (
            <CatchUpSection
              tasks={backlogTasks}
              currentWeek={currentWeek}
              onTriage={handleTriage}
              onBulkTriage={handleBulkTriage}
              isPending={triageTask.isPending || bulkTriageTasks.isPending}
            />
          )}

          {/* This week section */}
          {thisWeekTasks.length > 0 && (
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
                />
              ))}
            </TaskSection>
          )}

          {/* Coming up section */}
          {comingUpTasks.length > 0 && (
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
                />
              ))}
            </TaskSection>
          )}

          {/* Empty state */}
          {thisWeekTasks.length === 0 && comingUpTasks.length === 0 && activeTab !== 'catchup' && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-lg font-semibold text-white mb-2">All caught up!</h3>
              <p className="text-sm text-zinc-500">No pending tasks for now. Great job!</p>
            </div>
          )}
        </div>

        {/* Right: Panel */}
        <div className="space-y-5">
          {/* Focus card */}
          <FocusCard
            task={focusTask}
            onDone={() => focusTask && handleComplete(focusTask.id)}
            onSnooze={() => focusTask && handleSnooze(focusTask.id)}
          />

          {/* Week calendar */}
          <WeekCalendarCard days={weekDays} />

          {/* Progress */}
          <ProgressCard
            percentComplete={progressPercent}
            done={stats.completed}
            active={stats.thisWeek}
            toTriage={stats.catchUpQueue}
          />

          {/* Streak banner */}
          <StreakBanner days={3} />
        </div>
      </div>
    </div>
  )
}
