'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { isPast, isToday, differenceInDays, format } from 'date-fns'
import { PriorityTask, DashboardTaskStats, UpcomingEvent, PartnerActivity, WeeklyBriefing, Achievement } from '@tdc/shared/types/dashboard'
import { getAchievement } from '@tdc/shared/utils'
import { taskService, briefingService, familyService } from '@/lib/services'

interface DashboardQueryResult {
  priorityTasks: PriorityTask[]
  taskStats: DashboardTaskStats
  upcomingEvents: UpcomingEvent[]
  partner: PartnerActivity | null
  briefing: WeeklyBriefing
  achievement: Achievement | null
}

/**
 * Get due label for a task
 */
function getDueLabel(dueDate: string, currentWeek: number): string {
  const date = new Date(dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  date.setHours(0, 0, 0, 0)

  const daysDiff = differenceInDays(date, today)

  if (daysDiff < 0) return 'Overdue'
  if (daysDiff === 0) return 'Due today'
  if (daysDiff === 1) return 'Tomorrow'
  if (daysDiff <= 7) return 'This week'
  return `Due ${format(date, 'MMM d')}`
}

/**
 * Map task category to PriorityTask category
 */
function mapCategory(category: string): PriorityTask['category'] {
  const categoryMap: Record<string, PriorityTask['category']> = {
    'medical': 'medical',
    'healthcare': 'medical',
    'health': 'medical',
    'planning': 'planning',
    'preparation': 'planning',
    'shopping': 'shopping',
    'gear': 'shopping',
    'nursery': 'shopping',
    'financial': 'financial',
    'legal': 'financial',
    'insurance': 'financial',
    'partner': 'partner',
    'relationship': 'partner',
    'self-care': 'self_care',
    'self_care': 'self_care',
    'wellness': 'self_care',
  }
  return categoryMap[category?.toLowerCase()] || 'planning'
}

export function useDashboardData(familyId: string | undefined, currentWeek: number, babyId?: string) {
  return useQuery<DashboardQueryResult>({
    queryKey: ['dashboard', familyId, currentWeek, babyId],
    queryFn: async () => {
      if (!familyId) {
        return {
          priorityTasks: [],
          taskStats: { completed: 0, remaining: 0, overdue: 0 },
          upcomingEvents: [],
          partner: null,
          briefing: { week: currentWeek, title: 'This Week', excerpt: '', isNew: true },
          achievement: null,
        }
      }

      // Run independent queries in parallel
      const [
        tasks,
        allTasks,
        briefingData,
        partnerData,
      ] = await Promise.all([
        taskService.getDashboardPriorityTasks(familyId, babyId, 5),
        taskService.getDashboardTaskStats(familyId, babyId),
        briefingService.getBriefingTeaser('pregnancy', currentWeek),
        familyService.getPartnerActivity(familyId),
      ])

      // Calculate stats
      const completed = allTasks.filter(t => t.status === 'completed').length
      const pending = allTasks.filter(t => t.status === 'pending').length
      const overdue = allTasks.filter(t => {
        if (t.status !== 'pending') return false
        const dueDate = new Date(t.due_date)
        dueDate.setHours(0, 0, 0, 0)
        return isPast(dueDate) && !isToday(dueDate)
      }).length

      const upcomingEvents: UpcomingEvent[] = []

      // Map partner data to PartnerActivity
      let partner: PartnerActivity | null = null
      if (partnerData) {
        const lastActive = partnerData.updatedAt
          ? formatLastActive(new Date(partnerData.updatedAt))
          : 'Not yet active'

        partner = {
          name: partnerData.name,
          initial: partnerData.initial,
          lastActive,
          isSynced: true,
          recentTasks: partnerData.recentTasks.map(t => ({
            title: t.title,
            status: t.status === 'completed' ? 'completed' : 'in-progress',
            time: t.completedAt ? formatTaskTime(new Date(t.completedAt)) : 'In progress',
          })),
        }
      }

      let briefing: WeeklyBriefing = {
        week: currentWeek,
        title: `Week ${currentWeek}`,
        excerpt: '',
        isNew: true,
      }

      if (briefingData) {
        briefing = {
          week: currentWeek,
          title: briefingData.title || `Week ${currentWeek}`,
          excerpt: briefingData.baby_update?.substring(0, 150) + '...' || '',
          isNew: true,
        }
      }

      // Get achievement for current week
      const achievement = getAchievement(currentWeek)

      // Map tasks to PriorityTask format
      const priorityTasks: PriorityTask[] = (tasks || []).map(task => {
        const dueDate = new Date(task.due_date)
        dueDate.setHours(0, 0, 0, 0)
        const isOverdue = isPast(dueDate) && !isToday(dueDate)
        const isDueToday = isToday(dueDate)

        return {
          id: task.id,
          title: task.title,
          category: mapCategory(task.category || 'planning'),
          timeEstimate: '~15 min', // Default estimate
          dueLabel: getDueLabel(task.due_date, currentWeek),
          isUrgent: isDueToday || isOverdue,
          isOverdue,
        }
      })

      return {
        priorityTasks,
        taskStats: { completed, remaining: pending, overdue },
        upcomingEvents,
        partner,
        briefing,
        achievement,
      }
    },
    enabled: !!familyId,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
  })
}

/**
 * Format last active time
 */
function formatLastActive(date: Date): string {
  const now = new Date()
  const diffMins = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffMins < 1) return 'Active now'
  if (diffMins < 60) return `Active ${diffMins} min ago`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `Active ${diffHours}h ago`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return 'Active yesterday'
  return `Active ${diffDays} days ago`
}

/**
 * Format task completion time
 */
function formatTaskTime(date: Date): string {
  const now = new Date()
  const isSameDay = date.toDateString() === now.toDateString()

  if (isSameDay) return 'Today'

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'

  return format(date, 'MMM d')
}

/**
 * Complete a priority task from dashboard
 */
export function useCompleteDashboardTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (taskId: string) => taskService.completeTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['tasks-timeline'] })
    },
  })
}

/**
 * Snooze a priority task from dashboard
 */
export function useSnoozeDashboardTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (taskId: string) => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const untilDate = tomorrow.toISOString().split('T')[0]
      return taskService.snoozeTask(taskId, untilDate)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['tasks-timeline'] })
    },
  })
}
