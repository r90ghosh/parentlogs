import { createClient } from '@/lib/supabase/client'
import { FamilyTask, TaskStatus, TaskAssignee, TriageAction } from '@/types'
import { isPremiumTier } from '@/lib/subscription-utils'

const supabase = createClient()

export interface TaskFilters {
  status?: TaskStatus | 'all'
  assignee?: TaskAssignee
  category?: string
  search?: string
  limit?: number
  offset?: number
  includeBacklog?: boolean
}

export interface ServiceContext {
  userId: string
  familyId: string
  subscriptionTier?: string
}

async function resolveContext(ctx?: Partial<ServiceContext>): Promise<ServiceContext | null> {
  if (ctx?.userId && ctx?.familyId) {
    return ctx as ServiceContext
  }
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase
    .from('profiles')
    .select('family_id, subscription_tier')
    .eq('id', user.id)
    .single()
  if (!profile?.family_id) return null
  return {
    userId: user.id,
    familyId: profile.family_id,
    subscriptionTier: profile.subscription_tier ?? undefined,
  }
}

export const taskService = {
  async getTasks(filters: TaskFilters = {}, ctx?: Partial<ServiceContext>): Promise<FamilyTask[]> {
    const resolved = await resolveContext(ctx)
    if (!resolved) return []

    const { familyId, subscriptionTier } = resolved

    let query = supabase
      .from('family_tasks')
      .select('*')
      .eq('family_id', familyId)
      .order('due_date', { ascending: true })

    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status)
    }

    if (filters.assignee) {
      query = query.eq('assigned_to', filters.assignee)
    }

    if (filters.category) {
      query = query.eq('category', filters.category)
    }

    if (filters.search) {
      const escaped = filters.search.replace(/[%_\\]/g, '\\$&')
      query = query.ilike('title', `%${escaped}%`)
    }

    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    // Premium gating: free users only see 30-day rolling window
    const isPremium = isPremiumTier(subscriptionTier ?? null)
    if (!isPremium) {
      const today = new Date()
      const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
      query = query.lte('due_date', thirtyDaysFromNow.toISOString().split('T')[0])
    }

    const { data, error } = await query

    if (error) throw error
    return data as FamilyTask[]
  },

  async getTaskById(id: string): Promise<FamilyTask | null> {
    const { data, error } = await supabase
      .from('family_tasks')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return null
    return data as FamilyTask
  },

  async completeTask(id: string, ctx?: Partial<ServiceContext>): Promise<{ error: Error | null }> {
    const resolved = await resolveContext(ctx)
    if (!resolved) return { error: new Error('Not authenticated') }

    const { error } = await supabase
      .from('family_tasks')
      .update({
        status: 'completed',
        completed_by: resolved.userId,
        completed_at: new Date().toISOString(),
      })
      .eq('id', id)

    return { error: error as Error | null }
  },

  async snoozeTask(id: string, until: string): Promise<{ error: Error | null }> {
    const { error } = await supabase
      .from('family_tasks')
      .update({
        status: 'snoozed',
        snoozed_until: until,
      })
      .eq('id', id)

    return { error: error as Error | null }
  },

  async skipTask(id: string): Promise<{ error: Error | null }> {
    const { error } = await supabase
      .from('family_tasks')
      .update({ status: 'skipped' })
      .eq('id', id)

    return { error: error as Error | null }
  },

  async createTask(task: {
    title: string
    description: string
    due_date: string
    assigned_to: TaskAssignee
    priority: 'must-do' | 'good-to-do'
    category: string
    status: TaskStatus
  }, ctx?: Partial<ServiceContext>): Promise<{ task: FamilyTask | null; error: Error | null }> {
    const resolved = await resolveContext(ctx)
    if (!resolved) return { task: null, error: new Error('Not authenticated') }

    const { data, error } = await supabase
      .from('family_tasks')
      .insert({
        title: task.title,
        description: task.description,
        due_date: task.due_date,
        assigned_to: task.assigned_to,
        priority: task.priority,
        category: task.category,
        status: task.status,
        family_id: resolved.familyId,
        is_custom: true,
      })
      .select()
      .single()

    return { task: data as FamilyTask | null, error: error as Error | null }
  },

  async updateTask(
    id: string,
    updates: Partial<Pick<FamilyTask, 'title' | 'description' | 'due_date' | 'assigned_to' | 'priority' | 'category' | 'status' | 'notes'>>
  ): Promise<{ error: Error | null }> {
    const safeUpdates: Record<string, unknown> = {}
    if (updates.title !== undefined) safeUpdates.title = updates.title
    if (updates.description !== undefined) safeUpdates.description = updates.description
    if (updates.due_date !== undefined) safeUpdates.due_date = updates.due_date
    if (updates.assigned_to !== undefined) safeUpdates.assigned_to = updates.assigned_to
    if (updates.priority !== undefined) safeUpdates.priority = updates.priority
    if (updates.category !== undefined) safeUpdates.category = updates.category
    if (updates.status !== undefined) safeUpdates.status = updates.status
    if (updates.notes !== undefined) safeUpdates.notes = updates.notes

    const { error } = await supabase
      .from('family_tasks')
      .update(safeUpdates)
      .eq('id', id)

    return { error: error as Error | null }
  },

  async deleteTask(id: string, ctx?: Partial<ServiceContext>): Promise<{ error: Error | null }> {
    const resolved = await resolveContext(ctx)
    if (!resolved) return { error: new Error('Not authenticated') }

    const { error } = await supabase
      .from('family_tasks')
      .delete()
      .eq('id', id)
      .eq('family_id', resolved.familyId)

    return { error: error as Error | null }
  },

  /**
   * Get all tasks for timeline display (ignores premium gating)
   * Used to show the complete journey timeline bar
   */
  async getAllTasksForTimeline(ctx?: Partial<ServiceContext>): Promise<FamilyTask[]> {
    const resolved = await resolveContext(ctx)
    if (!resolved) return []

    const { data, error } = await supabase
      .from('family_tasks')
      .select('*')
      .eq('family_id', resolved.familyId)
      .order('due_date', { ascending: true })

    if (error) return []
    return data as FamilyTask[]
  },

  /**
   * Get backlog tasks (tasks from before signup week that need triage)
   * Note: Requires the catch-up migration to be applied for full functionality
   */
  async getBacklogTasks(ctx?: Partial<ServiceContext>): Promise<FamilyTask[]> {
    const resolved = await resolveContext(ctx)
    if (!resolved) return []

    const { data, error } = await supabase
      .from('family_tasks')
      .select('*')
      .eq('family_id', resolved.familyId)
      .eq('is_backlog', true)
      .eq('backlog_status', 'pending')
      .order('due_date', { ascending: true })

    if (error) return []
    return (data || []) as FamilyTask[]
  },

  /**
   * Triage a single backlog task
   */
  async triageTask(id: string, action: TriageAction, ctx?: Partial<ServiceContext>): Promise<{ error: Error | null }> {
    const resolved = await resolveContext(ctx)
    if (!resolved) return { error: new Error('Not authenticated') }

    const updates: Record<string, unknown> = {
      backlog_status: 'triaged',
      triage_action: action,
      triage_date: new Date().toISOString()
    }

    if (action === 'completed') {
      updates.status = 'completed'
      updates.completed_at = new Date().toISOString()
      updates.completed_by = resolved.userId
    } else if (action === 'added') {
      updates.is_backlog = false
    }
    // 'skipped' just marks as triaged, stays hidden

    const { error } = await supabase
      .from('family_tasks')
      .update(updates)
      .eq('id', id)

    return { error: error as Error | null }
  },

  /**
   * Bulk triage multiple tasks with the same action
   */
  async bulkTriageTasks(ids: string[], action: TriageAction, ctx?: Partial<ServiceContext>): Promise<{ error: Error | null }> {
    const resolved = await resolveContext(ctx)
    if (!resolved) return { error: new Error('Not authenticated') }

    const updates: Record<string, unknown> = {
      backlog_status: 'triaged',
      triage_action: action,
      triage_date: new Date().toISOString()
    }

    if (action === 'completed') {
      updates.status = 'completed'
      updates.completed_at = new Date().toISOString()
      updates.completed_by = resolved.userId
    } else if (action === 'added') {
      updates.is_backlog = false
    }

    const { error } = await supabase
      .from('family_tasks')
      .update(updates)
      .in('id', ids)

    return { error: error as Error | null }
  },

  /**
   * Get count of pending backlog tasks
   * Note: Requires the catch-up migration to be applied for full functionality
   */
  async getBacklogCount(ctx?: Partial<ServiceContext>): Promise<number> {
    const resolved = await resolveContext(ctx)
    if (!resolved) return 0

    const { count, error } = await supabase
      .from('family_tasks')
      .select('*', { count: 'exact', head: true })
      .eq('family_id', resolved.familyId)
      .eq('is_backlog', true)
      .eq('backlog_status', 'pending')

    if (error) return 0
    return count || 0
  },
}
