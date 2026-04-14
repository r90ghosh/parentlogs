import type { BabyLog, LogType } from '@tdc/shared/types'
import { isPremiumTier } from '@tdc/shared/utils/subscription-utils'
import type { AppSupabaseClient, ServiceContext } from './types'

export type { LogType }

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

export function createTrackerService(supabase: AppSupabaseClient) {
  async function resolveContext(ctx?: Partial<ServiceContext>): Promise<ServiceContext | null> {
    if (ctx?.userId && ctx?.familyId) {
      return ctx as ServiceContext
    }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    const { data: profile } = await supabase
      .from('profiles')
      .select('family_id, subscription_tier, active_baby_id')
      .eq('id', user.id)
      .single()
    if (!profile?.family_id) return null
    return {
      userId: user.id,
      familyId: profile.family_id,
      babyId: profile.active_baby_id ?? undefined,
      subscriptionTier: profile.subscription_tier ?? undefined,
    }
  }

  return {
    async getLogs(filters: LogFilters = {}, ctx?: Partial<ServiceContext>): Promise<BabyLog[]> {
      const resolved = await resolveContext(ctx)
      if (!resolved) return []

      let query = supabase
        .from('baby_logs')
        .select('*')
        .eq('family_id', resolved.familyId)
        .order('logged_at', { ascending: false })

      if (resolved.babyId) {
        query = query.eq('baby_id', resolved.babyId)
      }

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
      if (!isPremiumTier(resolved.subscriptionTier) && !filters.date_from) {
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

      if (error && error.code !== 'PGRST116') throw error
      if (error) return null
      return data as BabyLog
    },

    async createLog(log: {
      log_type: LogType
      log_data: Record<string, any>
      logged_at?: string
      notes?: string
    }, ctx?: Partial<ServiceContext>): Promise<{ log: BabyLog | null; error: Error | null }> {
      const resolved = await resolveContext(ctx)
      if (!resolved) return { log: null, error: new Error('Not authenticated') }

      const { data, error } = await supabase
        .from('baby_logs')
        .insert({
          log_type: log.log_type,
          log_data: log.log_data,
          notes: log.notes,
          family_id: resolved.familyId,
          baby_id: resolved.babyId,
          logged_by: resolved.userId,
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

    async deleteLog(id: string, ctx?: Partial<ServiceContext>): Promise<{ error: Error | null }> {
      const resolved = await resolveContext(ctx)
      if (!resolved) return { error: new Error('Not authenticated') }

      const { error } = await supabase
        .from('baby_logs')
        .delete()
        .eq('id', id)
        .eq('family_id', resolved.familyId)

      return { error: error as Error | null }
    },

    async getShiftBriefing(ctx?: Partial<ServiceContext>): Promise<ShiftBriefing | null> {
      const resolved = await resolveContext(ctx)
      if (!resolved) return null

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayStr = today.toISOString()
      const familyId = resolved.familyId
      const babyId = resolved.babyId

      // Build base queries for each of the 6 parallel queries
      let q1 = supabase.from('baby_logs').select('*').eq('family_id', familyId).eq('log_type', 'feeding')
      let q2 = supabase.from('baby_logs').select('*').eq('family_id', familyId).eq('log_type', 'diaper')
      let q3 = supabase.from('baby_logs').select('*').eq('family_id', familyId).eq('log_type', 'sleep')
      let q4 = supabase.from('baby_logs').select('*', { count: 'exact', head: true }).eq('family_id', familyId).eq('log_type', 'feeding')
      let q5 = supabase.from('baby_logs').select('*', { count: 'exact', head: true }).eq('family_id', familyId).eq('log_type', 'diaper')
      let q6 = supabase.from('baby_logs').select('log_data').eq('family_id', familyId).eq('log_type', 'sleep')

      if (babyId) {
        q1 = q1.eq('baby_id', babyId)
        q2 = q2.eq('baby_id', babyId)
        q3 = q3.eq('baby_id', babyId)
        q4 = q4.eq('baby_id', babyId)
        q5 = q5.eq('baby_id', babyId)
        q6 = q6.eq('baby_id', babyId)
      }

      // Parallelize all 6 independent queries
      const [
        lastFeedingResult,
        lastDiaperResult,
        lastSleepResult,
        feedingCountResult,
        diaperCountResult,
        sleepLogsResult,
      ] = await Promise.all([
        q1.order('logged_at', { ascending: false }).limit(1).maybeSingle(),
        q2.order('logged_at', { ascending: false }).limit(1).maybeSingle(),
        q3.order('logged_at', { ascending: false }).limit(1).maybeSingle(),
        q4.gte('logged_at', todayStr),
        q5.gte('logged_at', todayStr),
        q6.gte('logged_at', todayStr),
      ])

      const nowMs = Date.now()
      const totalSleepMinutes = (sleepLogsResult.data || []).reduce((total, log) => {
        const data = (log.log_data as Record<string, any>) || {}
        // Ongoing sleeps haven't had duration_minutes committed yet — derive from start_time.
        if (data.is_ongoing && data.start_time) {
          const startMs = new Date(data.start_time).getTime()
          if (Number.isFinite(startMs) && startMs <= nowMs) {
            return total + Math.max(0, (nowMs - startMs) / 60000)
          }
          return total
        }
        return total + (data.duration_minutes || 0)
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

    async getDailySummary(date: string, ctx?: Partial<ServiceContext>): Promise<any> {
      const resolved = await resolveContext(ctx)
      if (!resolved) return null

      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      let query = supabase
        .from('baby_logs')
        .select('*')
        .eq('family_id', resolved.familyId)

      if (resolved.babyId) {
        query = query.eq('baby_id', resolved.babyId)
      }

      const { data: logs } = await query
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

    async getWeeklySummary(ctx?: Partial<ServiceContext>): Promise<any> {
      const resolved = await resolveContext(ctx)
      if (!resolved) return null

      // Premium feature
      if (!isPremiumTier(resolved.subscriptionTier)) return { error: 'Premium feature' }

      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      let query = supabase
        .from('baby_logs')
        .select('*')
        .eq('family_id', resolved.familyId)

      if (resolved.babyId) {
        query = query.eq('baby_id', resolved.babyId)
      }

      const { data: logs } = await query
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
}

export type TrackerService = ReturnType<typeof createTrackerService>
