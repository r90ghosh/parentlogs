'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useUser } from '@/components/user-provider'
import { useFamily, useFamilyMembers } from '@/hooks/use-family'
import { useTasks, useFocusTask, useThisWeekTasks, useTaskProgress, useCompleteTask, useSnoozeToTomorrow, useSkipTask } from '@/hooks/use-tasks'
import { useCurrentBriefing } from '@/hooks/use-briefings'
import { useBudgetSummary } from '@/hooks/use-budget'
import { usePartnerPresence } from '@/hooks/use-realtime-sync'
import { Skeleton } from '@/components/ui/skeleton'
import {
  CheckCircle2,
  Clock,
  Calendar,
  ArrowRight,
  Target,
  BookOpen,
  Users,
  ChevronRight,
  ListTodo,
  Phone,
  DollarSign,
} from 'lucide-react'
import { format, isToday, isTomorrow, isPast, differenceInDays } from 'date-fns'
import { cn } from '@/lib/utils'
import { FamilyTask } from '@/types'
import { isPregnancyStage, getTrimesterLabel } from '@/lib/pregnancy-utils'

export default function DashboardPage() {
  const { profile, user } = useUser()
  const { data: family, isLoading: familyLoading } = useFamily()
  const { data: members } = useFamilyMembers()
  const { focusTask, isLoading: focusLoading } = useFocusTask()
  const { weekTasks } = useThisWeekTasks(focusTask?.id)
  const progress = useTaskProgress()
  const { data: briefing, isLoading: briefingLoading } = useCurrentBriefing()
  const { data: budgetSummary } = useBudgetSummary()
  const partnerPresence = usePartnerPresence()

  const completeTask = useCompleteTask()
  const snoozeTask = useSnoozeToTomorrow()
  const skipTask = useSkipTask()

  const greeting = getGreeting()
  const firstName = profile?.full_name?.split(' ')[0] || 'there'

  // Calculate days to due date
  const daysToGo = useMemo(() => {
    if (!family?.due_date) return null
    return Math.max(0, differenceInDays(new Date(family.due_date), new Date()))
  }, [family?.due_date])

  // Get partner info
  const partner = useMemo(() => {
    if (!members) return null
    return members.find(m => m.id !== user?.id)
  }, [members, user?.id])

  // Calculate timeline progress
  const timelineProgress = useMemo(() => {
    if (!family) return 0
    if (isPregnancyStage(family.stage)) {
      return Math.min(100, (family.current_week / 40) * 100)
    }
    return Math.min(100, (family.current_week / 104) * 100) // 2 years post-birth
  }, [family])

  // Get shared tasks (both or any assignee)
  const { data: allTasks } = useTasks({ status: 'pending' })
  const sharedTasks = useMemo(() => {
    if (!allTasks) return []
    return allTasks
      .filter(t => t.assigned_to === 'both' || t.assigned_to === 'either')
      .slice(0, 3)
  }, [allTasks])

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 md:ml-64 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {greeting},{' '}
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              {firstName}
            </span>{' '}
            👋
          </h1>
          <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm md:text-base">
            <span className="text-surface-400">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </span>
            {progress.overdueCount === 0 ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs md:text-sm font-medium">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                On Track
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs md:text-sm font-medium">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                {progress.overdueCount} overdue
              </div>
            )}
          </div>
        </header>

        {/* Timeline Progress Card - Pregnancy (Trimester View) */}
        {family && isPregnancyStage(family.stage) && (
          <div className="rounded-2xl bg-gradient-to-br from-surface-800/80 via-surface-800/60 to-transparent border border-surface-700 p-5 md:p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 md:mb-5">
              <span className="text-sm md:text-base font-semibold text-white flex items-center gap-2">
                🍼 {getTrimesterLabel(family.stage)}
              </span>
              <span className="text-sm md:text-base font-semibold text-amber-400">
                Week {family.current_week} of 40
              </span>
            </div>

            {/* Segmented Progress Bar */}
            <div className="relative h-3 flex rounded-full overflow-hidden mb-2">
              {/* T1 Segment (32.5%) */}
              <div className="relative w-[32.5%] bg-rose-900/30">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-rose-500 to-rose-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, (family.current_week / 13) * 100)}%` }}
                />
                <div className="absolute right-0 top-0 bottom-0 w-px bg-surface-600" />
              </div>

              {/* T2 Segment (35%) */}
              <div className="relative w-[35%] bg-violet-900/30">
                {family.current_week > 13 && (
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-violet-500 to-violet-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, ((family.current_week - 13) / 14) * 100)}%` }}
                  />
                )}
                <div className="absolute right-0 top-0 bottom-0 w-px bg-surface-600" />
              </div>

              {/* T3 Segment (32.5%) */}
              <div className="relative w-[32.5%] bg-indigo-900/30">
                {family.current_week > 27 && (
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, ((family.current_week - 27) / 13) * 100)}%` }}
                  />
                )}
              </div>

              {/* Current position marker */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-amber-500 z-10"
                style={{ left: `calc(${(family.current_week / 40) * 100}% - 8px)` }}
              />
            </div>

            {/* Trimester Labels */}
            <div className="flex text-xs text-surface-400 mb-3">
              <div className="w-[32.5%] text-center">
                <span className={cn(family.current_week <= 13 && "text-rose-400 font-medium")}>
                  Trimester 1
                </span>
              </div>
              <div className="w-[35%] text-center">
                <span className={cn(family.current_week > 13 && family.current_week <= 27 && "text-violet-400 font-medium")}>
                  Trimester 2
                </span>
              </div>
              <div className="w-[32.5%] text-center">
                <span className={cn(family.current_week > 27 && "text-indigo-400 font-medium")}>
                  Trimester 3
                </span>
              </div>
            </div>

            {/* Footer Labels */}
            <div className="flex items-center justify-between text-xs md:text-sm text-surface-400">
              <span>Conception</span>
              <span className="text-amber-400 font-medium">← Week {family.current_week}</span>
              <span>Due: {format(new Date(family.due_date!), 'MMM d')}</span>
            </div>
          </div>
        )}

        {/* Timeline Progress Card - Post-Birth (Simple View) */}
        {family && !isPregnancyStage(family.stage) && (
          <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 p-5 md:p-6">
            <div className="flex items-center justify-between mb-4 md:mb-5">
              <span className="text-sm md:text-base font-semibold text-white flex items-center gap-2">
                🍼 {family.baby_name || 'Baby'}'s First Years
              </span>
              <span className="text-sm md:text-base font-semibold text-amber-400">
                Week {family.current_week} of 104
              </span>
            </div>

            {/* Progress bar */}
            <div className="relative h-2 bg-white/10 rounded-full mb-4">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${timelineProgress}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-[3px] border-amber-500 rounded-full shadow-lg shadow-amber-500/30"
                style={{ left: `calc(${timelineProgress}% - 8px)` }}
              />
            </div>

            {/* Labels */}
            <div className="flex items-center justify-between text-xs md:text-sm text-surface-400">
              <span>Birth</span>
              <span className="text-amber-400 font-medium">← You are here</span>
              <span>2 years</span>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Focus Task Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-4 w-4 text-surface-400" />
                <h2 className="text-xs md:text-sm font-semibold text-surface-400 uppercase tracking-wide">
                  Today's Focus
                </h2>
              </div>

              {focusLoading ? (
                <Skeleton className="h-64 w-full rounded-2xl" />
              ) : focusTask ? (
                <FocusTaskCard
                  task={focusTask}
                  onComplete={() => completeTask.mutate(focusTask.id)}
                  onSnooze={() => snoozeTask.mutate(focusTask.id)}
                  onSkip={() => skipTask.mutate(focusTask.id)}
                  isLoading={completeTask.isPending || snoozeTask.isPending || skipTask.isPending}
                />
              ) : (
                <div className="rounded-2xl bg-gradient-to-br from-surface-800 to-surface-900 border border-surface-700 p-6 md:p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">All caught up!</h3>
                  <p className="text-surface-400 text-sm">No urgent tasks for today. Great job staying on track!</p>
                </div>
              )}
            </section>

            {/* This Week Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ListTodo className="h-4 w-4 text-surface-400" />
                  <h2 className="text-xs md:text-sm font-semibold text-surface-400 uppercase tracking-wide">
                    This Week
                  </h2>
                </div>
                <span className="text-xs md:text-sm text-surface-500">
                  {weekTasks.length} tasks remaining
                </span>
              </div>

              {weekTasks.length > 0 ? (
                <div className="space-y-3">
                  {weekTasks.slice(0, 4).map((task) => (
                    <TaskListItem key={task.id} task={task} />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl bg-surface-800/50 border border-surface-700 p-6 text-center">
                  <p className="text-surface-400 text-sm">No more tasks this week</p>
                </div>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <Link
                  href="/tasks?filter=all"
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-surface-800/50 border border-surface-700 text-surface-300 hover:bg-surface-700 hover:text-white transition-all text-sm font-medium"
                >
                  <ListTodo className="h-4 w-4" />
                  View All Tasks
                </Link>
                <Link
                  href="/tasks?status=completed"
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-surface-800/50 border border-surface-700 text-surface-300 hover:bg-surface-700 hover:text-white transition-all text-sm font-medium"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Completed ({progress.overall.completed})
                </Link>
              </div>
            </section>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                value={progress.overall.completed}
                label="Tasks completed"
                variant="highlight"
              />
              <StatCard
                value={progress.overall.total - progress.overall.completed}
                label="Tasks remaining"
              />
              <StatCard
                value={daysToGo ?? '-'}
                label="Days to go"
              />
              <StatCard
                value={budgetSummary?.grandTotalMid ? `$${(budgetSummary.grandTotalMid / 1000).toFixed(1)}k` : '-'}
                label="Budget planned"
              />
            </div>

            {/* Weekly Briefing Card */}
            <div className="rounded-2xl bg-gradient-to-br from-surface-800 to-surface-900 border border-surface-700 p-5 md:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm md:text-base">
                    Week {family?.current_week || '-'} Briefing
                  </h3>
                  <p className="text-xs md:text-sm text-surface-500">
                    {briefing?.title || 'Loading...'}
                  </p>
                </div>
              </div>

              {briefingLoading ? (
                <Skeleton className="h-20 w-full rounded-lg" />
              ) : briefing ? (
                <>
                  <div className="rounded-xl bg-black/20 p-4 mb-4">
                    <h4 className="text-sm font-semibold text-surface-200 mb-2">
                      What's happening this week
                    </h4>
                    <p className="text-xs md:text-sm text-surface-400 line-clamp-3">
                      {briefing.baby_update}
                    </p>
                  </div>
                  <Link
                    href="/briefing"
                    className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 text-sm font-semibold transition-colors"
                  >
                    Read full briefing
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </>
              ) : (
                <p className="text-surface-400 text-sm">No briefing available</p>
              )}
            </div>

            {/* Partner Sync Card */}
            {partner && (
              <div className="rounded-2xl bg-gradient-to-br from-surface-800 to-surface-900 border border-surface-700 p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-surface-400" />
                    <h3 className="text-xs md:text-sm font-semibold text-surface-400 uppercase tracking-wide">
                      Partner Sync
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-green-400">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    Synced
                  </div>
                </div>

                {/* Partner Avatars */}
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 border-[3px] border-surface-800 flex items-center justify-center text-white font-semibold">
                    {firstName.charAt(0).toUpperCase()}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 border-[3px] border-surface-800 flex items-center justify-center text-white font-semibold -ml-2">
                    {partner.full_name?.charAt(0).toUpperCase() || 'P'}
                  </div>
                </div>

                {/* Shared Tasks */}
                <div className="space-y-2">
                  {sharedTasks.length > 0 ? (
                    sharedTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 p-2.5 rounded-lg bg-black/20"
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-semibold text-white">
                          {task.assigned_to === 'both' ? '👥' : '?'}
                        </div>
                        <span className="flex-1 text-sm text-surface-200 truncate">
                          {task.title}
                        </span>
                        <span className="text-xs text-surface-500">
                          {formatTaskDue(task.due_date)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-surface-400 text-sm text-center py-2">
                      No shared tasks yet
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Focus Task Hero Card
function FocusTaskCard({
  task,
  onComplete,
  onSnooze,
  onSkip,
  isLoading,
}: {
  task: FamilyTask
  onComplete: () => void
  onSnooze: () => void
  onSkip: () => void
  isLoading: boolean
}) {
  const dueDate = new Date(task.due_date)
  const isOverdue = isPast(dueDate) && !isToday(dueDate)
  const isDueToday = isToday(dueDate)

  const categoryIcons: Record<string, string> = {
    medical: '🏥',
    shopping: '🛒',
    financial: '💰',
    legal: '📋',
    home: '🏠',
    partner: '👥',
    research: '🔍',
    default: '📌',
  }

  const icon = categoryIcons[task.category?.toLowerCase()] || categoryIcons.default

  return (
    <div className="relative rounded-2xl bg-gradient-to-br from-surface-800 to-surface-900 border border-surface-700 p-6 md:p-7 overflow-hidden">
      {/* Left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 to-orange-500" />

      {/* Category badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-xs md:text-sm font-semibold mb-4">
        <span>{icon}</span>
        <span className="capitalize">{task.category || 'Task'}</span>
      </div>

      {/* Title */}
      <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
        {task.title}
      </h3>

      {/* Description */}
      <p className="text-surface-400 text-sm md:text-base leading-relaxed mb-5 line-clamp-3">
        {task.description || 'Complete this task to stay on track with your preparations.'}
      </p>

      {/* Meta info */}
      <div className="flex flex-wrap gap-4 md:gap-5 mb-6 text-xs md:text-sm text-surface-500">
        {task.time_estimate_minutes && (
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>~{task.time_estimate_minutes} minutes</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          <span className={cn(
            isOverdue && 'text-red-400',
            isDueToday && 'text-amber-400',
          )}>
            {isOverdue ? 'Overdue' : isDueToday ? 'Due today' : `Due ${format(dueDate, 'MMM d')}`}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onComplete}
          disabled={isLoading}
          className="px-5 py-2.5 md:px-6 md:py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm md:text-base hover:shadow-lg hover:shadow-amber-500/25 hover:-translate-y-0.5 transition-all disabled:opacity-50"
        >
          ✓ Mark Complete
        </button>
        <button
          onClick={onSnooze}
          disabled={isLoading}
          className="px-5 py-2.5 md:px-6 md:py-3 rounded-xl bg-surface-700/50 border border-surface-600 text-surface-200 font-semibold text-sm md:text-base hover:bg-surface-600 transition-all disabled:opacity-50"
        >
          → Tomorrow
        </button>
        <button
          onClick={onSkip}
          disabled={isLoading}
          className="px-5 py-2.5 md:px-6 md:py-3 rounded-xl bg-surface-700/50 border border-surface-600 text-surface-200 font-semibold text-sm md:text-base hover:bg-surface-600 transition-all disabled:opacity-50"
        >
          ✕ Skip
        </button>
      </div>
    </div>
  )
}

// Task List Item
function TaskListItem({ task }: { task: FamilyTask }) {
  const dueDate = new Date(task.due_date)
  const isOverdue = isPast(dueDate) && !isToday(dueDate)

  const priorityColors: Record<string, string> = {
    'must-do': 'bg-red-500',
    high: 'bg-amber-500',
    normal: 'bg-surface-500',
    low: 'bg-surface-600',
  }

  const categoryIcons: Record<string, string> = {
    medical: '🏥',
    shopping: '🛒',
    financial: '💰',
    legal: '📋',
    home: '🏠',
    partner: '👥',
    research: '🔍',
    default: '📌',
  }

  const icon = categoryIcons[task.category?.toLowerCase()] || categoryIcons.default

  return (
    <Link
      href={`/tasks/${task.id}`}
      className="flex items-center gap-4 p-4 rounded-xl bg-surface-800/30 border border-surface-700/50 hover:bg-surface-800/50 hover:border-surface-600 transition-all group"
    >
      {/* Checkbox */}
      <div className="w-5 h-5 md:w-6 md:h-6 rounded-md border-2 border-surface-500 group-hover:border-amber-500 transition-colors flex-shrink-0" />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm md:text-base text-surface-200 truncate">
          {task.title}
        </p>
        <p className="text-xs md:text-sm text-surface-500 truncate">
          {icon} {task.category || 'Task'}
          {task.description && ` • ${task.description.slice(0, 30)}...`}
        </p>
      </div>

      {/* Due date */}
      <div className="text-right flex-shrink-0">
        <p className={cn(
          "font-semibold text-xs md:text-sm",
          isOverdue ? "text-red-400" : "text-surface-300"
        )}>
          {format(dueDate, 'EEE')}
        </p>
        <p className="text-[10px] md:text-xs text-surface-500">
          {format(dueDate, 'MMM d')}
        </p>
      </div>

      {/* Priority dot */}
      <div className={cn(
        "w-2 h-2 rounded-full flex-shrink-0",
        priorityColors[task.priority] || priorityColors.normal
      )} />
    </Link>
  )
}

// Stat Card
function StatCard({
  value,
  label,
  variant = 'default',
}: {
  value: string | number
  label: string
  variant?: 'default' | 'highlight'
}) {
  return (
    <div className={cn(
      "rounded-xl border p-4",
      variant === 'highlight'
        ? "bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20"
        : "bg-surface-800/30 border-surface-700"
    )}>
      <p className={cn(
        "text-2xl md:text-3xl font-bold mb-1",
        variant === 'highlight' ? "text-green-400" : "text-white"
      )}>
        {value}
      </p>
      <p className="text-xs md:text-sm text-surface-500">{label}</p>
    </div>
  )
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatTaskDue(date: string) {
  const d = new Date(date)
  if (isToday(d)) return 'Today'
  if (isTomorrow(d)) return 'Tomorrow'
  return format(d, 'EEE')
}
