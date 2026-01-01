'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { isPast, isToday, differenceInDays, differenceInWeeks, format } from 'date-fns'
import { PriorityTask, TaskStats, UpcomingEvent, PartnerActivity, WeeklyBriefing, Achievement } from '@/types/dashboard'
import { getAchievement } from '@/lib/baby-development-data'

const supabase = createClient()

interface DashboardQueryResult {
  priorityTasks: PriorityTask[]
  taskStats: TaskStats
  upcomingEvents: UpcomingEvent[]
  partner: PartnerActivity | null
  briefing: WeeklyBriefing
  achievement: Achievement | null
}

/**
 * Format time estimate for display
 */
function formatTimeEstimate(minutes: number | null): string {
  if (!minutes) return '~10 min'
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (mins === 0) return `${hours} hour${hours > 1 ? 's' : ''}`
  return `${hours}h ${mins}m`
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

export function useDashboardData(familyId: string | undefined, currentWeek: number) {
  return useQuery<DashboardQueryResult>({
    queryKey: ['dashboard', familyId, currentWeek],
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

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // Fetch priority tasks (pending tasks, ordered by priority and due date)
      const { data: tasks } = await supabase
        .from('family_tasks')
        .select('id, title, category, due_date, priority')
        .eq('family_id', familyId)
        .eq('status', 'pending')
        .order('priority', { ascending: false })
        .order('due_date', { ascending: true })
        .limit(5)

      // Fetch all tasks for stats
      const { data: allTasks } = await supabase
        .from('family_tasks')
        .select('id, status, due_date')
        .eq('family_id', familyId)

      // Calculate stats
      const completed = allTasks?.filter(t => t.status === 'completed').length || 0
      const pending = allTasks?.filter(t => t.status === 'pending').length || 0
      const overdue = allTasks?.filter(t => {
        if (t.status !== 'pending') return false
        const dueDate = new Date(t.due_date)
        dueDate.setHours(0, 0, 0, 0)
        return isPast(dueDate) && !isToday(dueDate)
      }).length || 0

      // Upcoming events - placeholder for future implementation
      // TODO: Add calendar_events table and fetch events here
      const upcomingEvents: UpcomingEvent[] = []

      // Fetch partner info
      let partner: PartnerActivity | null = null
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          // Get partner profile (other member of the family)
          const { data: partnerProfile } = await supabase
            .from('profiles')
            .select('id, full_name, updated_at')
            .eq('family_id', familyId)
            .neq('id', user.id)
            .single()

          if (partnerProfile) {
            // Get partner's recent completed tasks
            const { data: partnerTasks } = await supabase
              .from('family_tasks')
              .select('title, status, completed_at')
              .eq('family_id', familyId)
              .eq('completed_by', partnerProfile.id)
              .order('completed_at', { ascending: false })
              .limit(2)

            const lastActive = partnerProfile.updated_at
              ? formatLastActive(new Date(partnerProfile.updated_at))
              : 'Not yet active'

            const partnerName = partnerProfile.full_name?.split(' ')[0] || 'Partner'

            partner = {
              name: partnerName,
              initial: partnerName[0].toUpperCase(),
              lastActive,
              isSynced: true,
              recentTasks: partnerTasks?.map(t => ({
                title: t.title,
                status: t.status === 'completed' ? 'completed' : 'in-progress',
                time: t.completed_at ? formatTaskTime(new Date(t.completed_at)) : 'In progress',
              })) || [],
            }
          }
        }
      } catch {
        // Partner fetch failed, continue without partner data
      }

      // Fetch current week briefing
      let briefing: WeeklyBriefing = {
        week: currentWeek,
        title: `Week ${currentWeek}`,
        excerpt: '',
        isNew: true,
      }

      try {
        const { data: briefingData } = await supabase
          .from('briefing_templates')
          .select('title, baby_update')
          .eq('stage', 'pregnancy')
          .eq('week_number', currentWeek)
          .single()

        if (briefingData) {
          briefing = {
            week: currentWeek,
            title: briefingData.title || `Week ${currentWeek}`,
            excerpt: briefingData.baby_update?.substring(0, 150) + '...' || '',
            isNew: true,
          }
        }
      } catch {
        // Briefing fetch failed, use defaults
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
  const isToday = date.toDateString() === now.toDateString()

  if (isToday) return 'Today'

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
    mutationFn: async (taskId: string) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('family_tasks')
        .update({
          status: 'completed',
          completed_by: user.id,
          completed_at: new Date().toISOString(),
        })
        .eq('id', taskId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

/**
 * Snooze a priority task from dashboard
 */
export function useSnoozeDashboardTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (taskId: string) => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const untilDate = tomorrow.toISOString().split('T')[0]

      const { error } = await supabase
        .from('family_tasks')
        .update({
          due_date: untilDate,
          status: 'pending',
        })
        .eq('id', taskId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
