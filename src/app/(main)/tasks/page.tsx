'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useTasks, useCompleteTask, useAllTasksForTimeline } from '@/hooks/use-tasks'
import { useFamily } from '@/hooks/use-family'
import { useRequirePremium } from '@/hooks/use-require-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import { TaskTimelineBar } from '@/components/shared/task-timeline-bar'
import {
  Plus,
  Search,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  Clock,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { format, isPast, isToday, isTomorrow, startOfWeek, endOfWeek, addDays } from 'date-fns'
import { cn } from '@/lib/utils'
import { FamilyTask } from '@/types'
import { PaywallBanner } from '@/components/shared/paywall-banner'
import {
  TimelineCategory,
  getTaskTimelineCategory,
  getCurrentTimelineCategory,
  getTaskCountsByCategory,
  groupTasksByTimePeriod,
  groupTasksByWeek,
  TaskTimeGroup,
} from '@/lib/task-timeline'

export default function TasksPage() {
  const [statusFilter, setStatusFilter] = useState<string>('pending')
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<TimelineCategory | null>(null)
  const { isPremium } = useRequirePremium()
  const { data: family } = useFamily()

  const { data: tasks, isLoading } = useTasks({
    status: statusFilter as any,
    search: search || undefined,
  })

  // Fetch ALL tasks for timeline bar (ignores premium gating)
  const { data: allTasks } = useAllTasksForTimeline()

  const completeTask = useCompleteTask()

  // Get category counts from ALL tasks (for timeline bar)
  const { categoryCounts, currentCategory } = useMemo(() => {
    if (!allTasks || !family) {
      return {
        categoryCounts: {} as Record<TimelineCategory, number>,
        currentCategory: 'pregnancy' as TimelineCategory,
      }
    }

    return {
      categoryCounts: getTaskCountsByCategory(allTasks, family),
      currentCategory: getCurrentTimelineCategory(family),
    }
  }, [allTasks, family])

  // Filter and group the visible tasks
  const { filteredTasks, timeGroups } = useMemo(() => {
    if (!tasks || !family) {
      return {
        filteredTasks: [],
        timeGroups: { previous: [], current: [], future: [] } as Record<TaskTimeGroup, FamilyTask[]>,
      }
    }

    // Filter by selected category if any
    let filtered = tasks
    if (selectedCategory) {
      filtered = tasks.filter(task =>
        getTaskTimelineCategory(task.due_date, family) === selectedCategory
      )
    }

    // Group by time period
    const groups = groupTasksByTimePeriod(filtered)

    return {
      filteredTasks: filtered,
      timeGroups: groups,
    }
  }, [tasks, family, selectedCategory])

  // Focus Tasks - always shows something actionable
  const focusTasks = useMemo(() => {
    if (!tasks || tasks.length === 0) {
      return { tasks: [], type: 'none' as const, label: '' }
    }

    const today = new Date()
    const weekStart = startOfWeek(today, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 })

    // 1. Overdue tasks (pending, due before today, not today)
    const overdueTasks = tasks.filter(task => {
      const dueDate = new Date(task.due_date)
      return task.status === 'pending' && isPast(dueDate) && !isToday(dueDate)
    }).sort((a, b) => new Date(b.due_date).getTime() - new Date(a.due_date).getTime())

    if (overdueTasks.length > 0) {
      return {
        tasks: overdueTasks.slice(0, 5), // Show up to 5 overdue
        type: 'overdue' as const,
        label: `${overdueTasks.length} overdue`,
        totalCount: overdueTasks.length,
      }
    }

    // 2. This week tasks
    const thisWeekTasks = tasks.filter(task => {
      const dueDate = new Date(task.due_date)
      return task.status === 'pending' && dueDate >= weekStart && dueDate <= weekEnd
    }).sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())

    if (thisWeekTasks.length > 0) {
      return {
        tasks: thisWeekTasks.slice(0, 5),
        type: 'current' as const,
        label: 'Due this week',
        totalCount: thisWeekTasks.length,
      }
    }

    // 3. Next upcoming tasks (get the next batch - tasks sharing the same earliest due date)
    const futureTasks = tasks.filter(task => {
      const dueDate = new Date(task.due_date)
      return task.status === 'pending' && dueDate > weekEnd
    }).sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())

    if (futureTasks.length > 0) {
      // Get all tasks with the same due date as the first one (next batch)
      const nextDueDate = futureTasks[0].due_date
      const nextBatch = futureTasks.filter(t => t.due_date === nextDueDate)

      return {
        tasks: nextBatch.slice(0, 5),
        type: 'upcoming' as const,
        label: `Coming ${format(new Date(nextDueDate), 'MMM d')}`,
        totalCount: nextBatch.length,
        nextDate: nextDueDate,
      }
    }

    return { tasks: [], type: 'none' as const, label: '' }
  }, [tasks])

  // Determine which sections should be expanded
  const [expandedSections, setExpandedSections] = useState<Record<TaskTimeGroup, boolean>>({
    previous: false,
    current: true,
    future: true,
  })

  // Track if user has manually toggled previous section
  const [userToggledPrevious, setUserToggledPrevious] = useState(false)

  // Auto-expand previous if no current tasks (only if user hasn't manually toggled)
  const effectiveExpandedSections = useMemo(() => {
    const hasCurrent = timeGroups.current.length > 0
    const hasPrevious = timeGroups.previous.length > 0

    return {
      previous: !userToggledPrevious && hasPrevious && !hasCurrent ? true : expandedSections.previous,
      current: expandedSections.current,
      future: expandedSections.future,
    }
  }, [timeGroups, expandedSections, userToggledPrevious])

  const toggleSection = (section: TaskTimeGroup) => {
    if (section === 'previous') {
      setUserToggledPrevious(true)
    }
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleCategoryClick = (category: TimelineCategory | null) => {
    setSelectedCategory(category)
    // Expand all sections when filtering
    if (category) {
      setExpandedSections({ previous: true, current: true, future: true })
    }
  }

  return (
    <div className="p-4 md:ml-64 space-y-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Tasks</h1>
        <Button asChild>
          <Link href="/tasks/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Link>
        </Button>
      </div>

      {/* Premium Banner */}
      {!isPremium && (
        <PaywallBanner
          message="Free users can only see tasks within 14 days. Upgrade to see your complete timeline."
          feature="tasks_beyond_14_days"
        />
      )}

      {/* Timeline Bar - Shows complete journey */}
      {family && allTasks && allTasks.length > 0 && (
        <TaskTimelineBar
          counts={categoryCounts}
          currentCategory={currentCategory}
          selectedCategory={selectedCategory}
          onCategoryClick={handleCategoryClick}
        />
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-surface-400" />
        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-surface-900 border-surface-700"
        />
      </div>

      {/* Filters */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="bg-surface-900">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Focus Tasks - Always shows something actionable */}
      {focusTasks.tasks.length > 0 && focusTasks.type !== 'none' && statusFilter === 'pending' && !selectedCategory && (
        <div className={cn(
          "rounded-lg border p-4",
          focusTasks.type === 'overdue' && "border-red-500/50 bg-red-950/20",
          focusTasks.type === 'current' && "border-accent-500/50 bg-accent-950/20",
          focusTasks.type === 'upcoming' && "border-blue-500/50 bg-blue-950/20"
        )}>
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {focusTasks.type === 'overdue' && (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              {focusTasks.type === 'current' && (
                <Sparkles className="h-5 w-5 text-accent-500" />
              )}
              {focusTasks.type === 'upcoming' && (
                <ArrowRight className="h-5 w-5 text-blue-500" />
              )}
              <h2 className={cn(
                "font-semibold",
                focusTasks.type === 'overdue' && "text-red-400",
                focusTasks.type === 'current' && "text-accent-400",
                focusTasks.type === 'upcoming' && "text-blue-400"
              )}>
                {focusTasks.type === 'overdue' && 'Needs Attention'}
                {focusTasks.type === 'current' && 'Focus This Week'}
                {focusTasks.type === 'upcoming' && 'Coming Up Next'}
              </h2>
            </div>
            <Badge variant="secondary" className="text-xs">
              {focusTasks.label}
            </Badge>
          </div>

          {/* Focus Task Items */}
          <div className="space-y-2">
            {focusTasks.tasks.map((task) => (
              <FocusTaskItem
                key={task.id}
                task={task}
                onComplete={() => completeTask.mutate(task.id)}
                type={focusTasks.type}
              />
            ))}
          </div>

          {/* Show more link if there are more tasks */}
          {focusTasks.totalCount && focusTasks.totalCount > 5 && (
            <p className="text-xs text-surface-500 mt-3 text-center">
              +{focusTasks.totalCount - 5} more {focusTasks.type === 'overdue' ? 'overdue' : ''} tasks
            </p>
          )}
        </div>
      )}

      {/* Task List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : filteredTasks && filteredTasks.length > 0 ? (
        <div className="space-y-6">
          {/* Previous Tasks */}
          {timeGroups.previous.length > 0 && (
            <TaskSection
              title="Previous Tasks"
              subtitle="Before this week"
              icon={<Clock className="h-4 w-4 text-surface-500" />}
              tasks={timeGroups.previous}
              expanded={effectiveExpandedSections.previous}
              onToggle={() => toggleSection('previous')}
              onComplete={(id) => completeTask.mutate(id)}
              family={family}
              variant="previous"
            />
          )}

          {/* Current Week */}
          {timeGroups.current.length > 0 && (
            <TaskSection
              title="This Week"
              subtitle={`${format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'MMM d')} - ${format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'MMM d')}`}
              icon={<Calendar className="h-4 w-4 text-accent-500" />}
              tasks={timeGroups.current}
              expanded={effectiveExpandedSections.current}
              onToggle={() => toggleSection('current')}
              onComplete={(id) => completeTask.mutate(id)}
              family={family}
              variant="current"
            />
          )}

          {/* Future Tasks */}
          {timeGroups.future.length > 0 && (
            <TaskSection
              title="Upcoming"
              subtitle="After this week"
              icon={<ChevronRight className="h-4 w-4 text-surface-500" />}
              tasks={timeGroups.future}
              expanded={effectiveExpandedSections.future}
              onToggle={() => toggleSection('future')}
              onComplete={(id) => completeTask.mutate(id)}
              family={family}
              variant="future"
            />
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-surface-400">
            {selectedCategory ? `No tasks in ${selectedCategory}` : 'No tasks found'}
          </p>
          {selectedCategory && (
            <Button
              variant="ghost"
              onClick={() => setSelectedCategory(null)}
              className="mt-2"
            >
              Clear filter
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

interface TaskSectionProps {
  title: string
  subtitle: string
  icon: React.ReactNode
  tasks: FamilyTask[]
  expanded: boolean
  onToggle: () => void
  onComplete: (id: string) => void
  family: any
  variant: 'previous' | 'current' | 'future'
}

function TaskSection({
  title,
  subtitle,
  icon,
  tasks,
  expanded,
  onToggle,
  onComplete,
  family,
  variant,
}: TaskSectionProps) {
  // Group tasks by week within the section
  const tasksByWeek = groupTasksByWeek(tasks)
  const sortedWeeks = Object.keys(tasksByWeek).sort((a, b) =>
    variant === 'previous' ? b.localeCompare(a) : a.localeCompare(b)
  )

  // Truncate text for non-current weeks to prevent gaming
  const shouldTruncate = variant !== 'current'

  return (
    <div className={cn(
      "rounded-lg border",
      variant === 'previous' && "border-surface-700 bg-surface-900/50",
      variant === 'current' && "border-accent-600/30 bg-accent-900/10",
      variant === 'future' && "border-surface-700 bg-surface-900/30"
    )}>
      {/* Section Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-surface-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <div className="text-left">
            <h3 className={cn(
              "font-medium",
              variant === 'current' ? "text-accent-400" : "text-white"
            )}>
              {title}
            </h3>
            <p className="text-xs text-surface-500">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </Badge>
          <ChevronDown className={cn(
            "h-4 w-4 text-surface-500 transition-transform",
            expanded && "rotate-180"
          )} />
        </div>
      </button>

      {/* Tasks */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          {sortedWeeks.map((weekKey) => {
            const weekTasks = tasksByWeek[weekKey]
            const weekDate = new Date(weekKey)
            const weekLabel = format(weekDate, 'MMM d') + ' - ' + format(endOfWeek(weekDate, { weekStartsOn: 1 }), 'MMM d')

            return (
              <div key={weekKey}>
                <p className="text-xs text-surface-500 mb-2 px-1">{weekLabel}</p>
                <div className="space-y-2">
                  {weekTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onComplete={() => onComplete(task.id)}
                      family={family}
                      truncate={shouldTruncate}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function TaskItem({
  task,
  onComplete,
  family,
  truncate = false,
}: {
  task: FamilyTask
  onComplete: () => void
  family: any
  truncate?: boolean
}) {
  const isOverdue = isPast(new Date(task.due_date)) && task.status === 'pending' && !isToday(new Date(task.due_date))
  const category = family ? getTaskTimelineCategory(task.due_date, family) : null

  // Truncate title to ~50% for non-current weeks
  const truncateText = (text: string, percentage: number = 0.5) => {
    if (!truncate || !text) return text
    const cutoff = Math.floor(text.length * percentage)
    return text.slice(0, cutoff)
  }

  const displayTitle = truncateText(task.title)

  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-lg bg-surface-900 border transition-colors",
      isOverdue ? "border-red-500/50" : "border-surface-800"
    )}>
      <Checkbox
        checked={task.status === 'completed'}
        onCheckedChange={() => {
          if (task.status !== 'completed') onComplete()
        }}
        disabled={task.status === 'completed'}
      />

      <Link href={`/tasks/${task.id}`} className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 min-w-0">
            <p className={cn(
              "font-medium truncate",
              task.status === 'completed' ? "text-surface-500 line-through" : truncate ? "text-surface-400" : "text-white"
            )}>
              {displayTitle}
            </p>
            {truncate && (
              <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-r from-transparent to-surface-900" />
            )}
          </div>
          {task.priority === 'must-do' && (
            <Badge variant="destructive" className="text-xs flex-shrink-0">Must-Do</Badge>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className={cn(
            "text-xs",
            isOverdue ? "text-red-400" : "text-surface-400"
          )}>
            {formatDueDate(task.due_date)}
          </span>
          <Badge variant="outline" className="text-xs">{task.category}</Badge>
        </div>
      </Link>

      {isOverdue && (
        <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
      )}

      <ChevronRight className="h-4 w-4 text-surface-500 flex-shrink-0" />
    </div>
  )
}

function formatDueDate(date: string) {
  const d = new Date(date)
  if (isToday(d)) return 'Today'
  if (isTomorrow(d)) return 'Tomorrow'
  if (isPast(d)) return `Overdue - ${format(d, 'MMM d')}`
  return format(d, 'MMM d')
}

function FocusTaskItem({
  task,
  onComplete,
  type,
}: {
  task: FamilyTask
  onComplete: () => void
  type: 'overdue' | 'current' | 'upcoming'
}) {
  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-lg border transition-colors",
      type === 'overdue' && "bg-red-950/30 border-red-500/30",
      type === 'current' && "bg-accent-950/30 border-accent-500/30",
      type === 'upcoming' && "bg-blue-950/30 border-blue-500/30"
    )}>
      <Checkbox
        checked={task.status === 'completed'}
        onCheckedChange={() => {
          if (task.status !== 'completed') onComplete()
        }}
        disabled={task.status === 'completed'}
      />

      <Link href={`/tasks/${task.id}`} className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-white truncate">
            {task.title}
          </p>
          {task.priority === 'must-do' && (
            <Badge variant="destructive" className="text-xs flex-shrink-0">Must-Do</Badge>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className={cn(
            "text-xs",
            type === 'overdue' ? "text-red-400" : "text-surface-400"
          )}>
            {formatDueDate(task.due_date)}
          </span>
          <Badge variant="outline" className="text-xs">{task.category}</Badge>
        </div>
      </Link>

      <ChevronRight className="h-4 w-4 text-surface-500 flex-shrink-0" />
    </div>
  )
}
