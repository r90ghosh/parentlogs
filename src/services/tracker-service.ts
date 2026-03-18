import { createClient } from '@/lib/supabase/client'
import { BabyLog } from '@/types'
import { isPremiumTier } from '@/lib/subscription-utils'

const supabase = createClient()

export type LogType =
  | 'feeding'
  | 'diaper'
  | 'sleep'
  | 'temperature'
  | 'medicine'
  | 'vitamin_d'
  | 'mood'
  | 'weight'
  | 'height'
  | 'milestone'
  | 'custom'

export const BASIC_LOG_TYPES: LogType[] = ['feeding', 'diaper', 'sleep']
export const PREMIUM_LOG_TYPES: LogType[] = ['temperature', 'medicine', 'vitamin_d', 'mood', 'weight', 'height', 'milestone', 'custom']

export interface LogFilters {
  log_type?: LogType
  date_from?: string
  date_to?: string
  limit?: number
  offset?: number
}

export interface ShiftBriefing {
  last_feeding: BabyLog | null
  last_diaper: BabyLog | null
  last_sleep: BabyLog | null
  total_feedings_today: number
  total_diapers_today: number
  total_sleep_hours_today: number
}

export const trackerService = {
  async getLogs(filters: LogFilters = {}): Promise<BabyLog[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data: profile } = await supabase
      .from('profiles')
      .select('family_id, subscription_tier')
      .eq('id', user.id)
      .single()

    if (!profile?.family_id) return []

    let query = supabase
      .from('baby_logs')
      .select('*')
      .eq('family_id', profile.family_id)
      .order('logged_at', { ascending: false })

    if (filters.log_type) {
      query = query.eq('log_type', filters.log_type)
    }

    if (filters.date_from) {
      query = query.gte('logged_at', filters.date_from)
    }

    if (filters.date_to) {
      query = query.lte('logged_at', filters.date_to)
    }

    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    // Premium gating: free users only see last 7 days
    if (!isPremiumTier(profile.subscription_tier) && !filters.date_from) {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      query = query.gte('logged_at', sevenDaysAgo.toISOString())
    }

    const { data, error } = await query

    if (error) throw error
    return data as BabyLog[]
  },

  async getLogById(id: string): Promise<BabyLog | null> {
    const { data, error } = await supabase
      .from('baby_logs')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return null
    return data as BabyLog
  },

  async createLog(log: {
    log_type: LogType
    log_data: Record<string, any>
    logged_at?: string
    notes?: string
  }): Promise<{ log: BabyLog | null; error: Error | null }> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { log: null, error: new Error('Not authenticated') }

    const { data: profile } = await supabase
      .from('profiles')
      .select('family_id, subscription_tier')
      .eq('id', user.id)
      .single()

    if (!profile?.family_id) return { log: null, error: new Error('No family found') }

    const { data, error } = await supabase
      .from('baby_logs')
      .insert({
        log_type: log.log_type,
        log_data: log.log_data,
        notes: log.notes,
        family_id: profile.family_id,
        logged_by: user.id,
        logged_at: log.logged_at || new Date().toISOString(),
      })
      .select()
      .single()

    return { log: data as BabyLog | null, error: error as Error | null }
  },

  async updateLog(
    id: string,
    updates: Partial<Pick<BabyLog, 'log_type' | 'log_data' | 'logged_at' | 'notes'>>
  ): Promise<{ error: Error | null }> {
    const safeUpdates: Record<string, unknown> = {}
    if (updates.log_type !== undefined) safeUpdates.log_type = updates.log_type
    if (updates.log_data !== undefined) safeUpdates.log_data = updates.log_data
    if (updates.logged_at !== undefined) safeUpdates.logged_at = updates.logged_at
    if (updates.notes !== undefined) safeUpdates.notes = updates.notes

    const { error } = await supabase
      .from('baby_logs')
      .update(safeUpdates)
      .eq('id', id)

    return { error: error as Error | null }
  },

  async deleteLog(id: string): Promise<{ error: Error | null }> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: new Error('Not authenticated') }

    const { data: profile } = await supabase
      .from('profiles')
      .select('family_id')
      .eq('id', user.id)
      .single()

    if (!profile?.family_id) return { error: new Error('No family found') }

    const { error } = await supabase
      .from('baby_logs')
      .delete()
      .eq('id', id)
      .eq('family_id', profile.family_id)

    return { error: error as Error | null }
  },

  async getShiftBriefing(): Promise<ShiftBriefing | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('family_id')
      .eq('id', user.id)
      .single()

    if (!profile?.family_id) return null

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStr = today.toISOString()
    const familyId = profile.family_id

    // Parallelize all 6 independent queries
    const [
      lastFeedingResult,
      lastDiaperResult,
      lastSleepResult,
      feedingCountResult,
      diaperCountResult,
      sleepLogsResult,
    ] = await Promise.all([
      supabase
        .from('baby_logs')
        .select('*')
        .eq('family_id', familyId)
        .eq('log_type', 'feeding')
        .order('logged_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('baby_logs')
        .select('*')
        .eq('family_id', familyId)
        .eq('log_type', 'diaper')
        .order('logged_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('baby_logs')
        .select('*')
        .eq('family_id', familyId)
        .eq('log_type', 'sleep')
        .order('logged_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('baby_logs')
        .select('*', { count: 'exact', head: true })
        .eq('family_id', familyId)
        .eq('log_type', 'feeding')
        .gte('logged_at', todayStr),
      supabase
        .from('baby_logs')
        .select('*', { count: 'exact', head: true })
        .eq('family_id', familyId)
        .eq('log_type', 'diaper')
        .gte('logged_at', todayStr),
      supabase
        .from('baby_logs')
        .select('log_data')
        .eq('family_id', familyId)
        .eq('log_type', 'sleep')
        .gte('logged_at', todayStr),
    ])

    const totalSleepMinutes = (sleepLogsResult.data || []).reduce((total, log) => {
      const duration = (log.log_data as Record<string, any>)?.duration_minutes || 0
      return total + duration
    }, 0)

    return {
      last_feeding: lastFeedingResult.data as BabyLog | null,
      last_diaper: lastDiaperResult.data as BabyLog | null,
      last_sleep: lastSleepResult.data as BabyLog | null,
      total_feedings_today: feedingCountResult.count || 0,
      total_diapers_today: diaperCountResult.count || 0,
      total_sleep_hours_today: Math.round((totalSleepMinutes / 60) * 10) / 10,
    }
  },

  async getDailySummary(date: string): Promise<any> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('family_id')
      .eq('id', user.id)
      .single()

    if (!profile?.family_id) return null

    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const { data: logs } = await supabase
      .from('baby_logs')
      .select('*')
      .eq('family_id', profile.family_id)
      .gte('logged_at', startOfDay.toISOString())
      .lte('logged_at', endOfDay.toISOString())
      .order('logged_at', { ascending: true })

    if (!logs) return null

    const summary: Record<string, any[]> = {}
    logs.forEach(log => {
      if (!summary[log.log_type]) summary[log.log_type] = []
      summary[log.log_type].push(log)
    })

    return summary
  },

  async getWeeklySummary(): Promise<any> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('family_id, subscription_tier')
      .eq('id', user.id)
      .single()

    if (!profile?.family_id) return null

    // Premium feature
    if (!isPremiumTier(profile.subscription_tier)) return { error: 'Premium feature' }

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: logs } = await supabase
      .from('baby_logs')
      .select('*')
      .eq('family_id', profile.family_id)
      .gte('logged_at', sevenDaysAgo.toISOString())
      .order('logged_at', { ascending: true })

    if (!logs) return null

    // Group by day and type
    const dailyData: Record<string, Record<string, number>> = {}
    logs.forEach(log => {
      const day = new Date(log.logged_at).toISOString().split('T')[0]
      if (!dailyData[day]) dailyData[day] = {}
      if (!dailyData[day][log.log_type]) dailyData[day][log.log_type] = 0
      dailyData[day][log.log_type]++
    })

    return dailyData
  },
}
