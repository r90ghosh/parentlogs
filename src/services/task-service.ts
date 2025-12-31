import { createClient } from '@/lib/supabase/client'
import { FamilyTask, TaskStatus, TaskAssignee } from '@/types'

const supabase = createClient()

export interface TaskFilters {
  status?: TaskStatus | 'all'
  assignee?: TaskAssignee
  category?: string
  search?: string
  limit?: number
  offset?: number
}

export const taskService = {
  async getTasks(filters: TaskFilters = {}): Promise<FamilyTask[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data: profile } = await supabase
      .from('profiles')
      .select('family_id, subscription_tier')
      .eq('id', user.id)
      .single()

    if (!profile?.family_id) return []

    let query = supabase
      .from('family_tasks')
      .select('*')
      .eq('family_id', profile.family_id)
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
      query = query.ilike('title', `%${filters.search}%`)
    }

    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    // Premium gating: free users only see 14-day window
    const isPremium = profile.subscription_tier === 'premium' || profile.subscription_tier === 'lifetime'
    if (!isPremium) {
      const today = new Date()
      const twoWeeksFromNow = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000)
      query = query.lte('due_date', twoWeeksFromNow.toISOString().split('T')[0])
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

  async completeTask(id: string): Promise<{ error: Error | null }> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: new Error('Not authenticated') }

    const { error } = await supabase
      .from('family_tasks')
      .update({
        status: 'completed',
        completed_by: user.id,
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
  }): Promise<{ task: FamilyTask | null; error: Error | null }> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { task: null, error: new Error('Not authenticated') }

    const { data: profile } = await supabase
      .from('profiles')
      .select('family_id')
      .eq('id', user.id)
      .single()

    if (!profile?.family_id) return { task: null, error: new Error('No family found') }

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
        family_id: profile.family_id,
        is_custom: true,
      })
      .select()
      .single()

    return { task: data as FamilyTask | null, error: error as Error | null }
  },

  async updateTask(id: string, updates: Partial<FamilyTask>): Promise<{ error: Error | null }> {
    const { error } = await supabase
      .from('family_tasks')
      .update(updates)
      .eq('id', id)

    return { error: error as Error | null }
  },

  async deleteTask(id: string): Promise<{ error: Error | null }> {
    const { error } = await supabase
      .from('family_tasks')
      .delete()
      .eq('id', id)

    return { error: error as Error | null }
  },

  /**
   * Get all tasks for timeline display (ignores premium gating)
   * Used to show the complete journey timeline bar
   */
  async getAllTasksForTimeline(): Promise<FamilyTask[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data: profile } = await supabase
      .from('profiles')
      .select('family_id')
      .eq('id', user.id)
      .maybeSingle()

    if (!profile?.family_id) return []

    const { data, error } = await supabase
      .from('family_tasks')
      .select('*')
      .eq('family_id', profile.family_id)
      .order('due_date', { ascending: true })

    if (error) return []
    return data as FamilyTask[]
  },
}
