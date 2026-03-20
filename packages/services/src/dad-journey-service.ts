import type { DadChallengeContent, DadProfile, MoodCheckin, ContentPhase, MoodLevel } from '@tdc/shared/types/dad-journey'
import type { AppSupabaseClient } from './types'

export function createDadJourneyService(supabase: AppSupabaseClient) {
  return {
    // Fetch all 7 pillar contents for a given phase
    async getContentForPhase(phase: ContentPhase): Promise<DadChallengeContent[]> {
      const { data, error } = await supabase
        .from('dad_challenge_content')
        .select('*')
        .eq('phase', phase)
        .order('sort_order')
      if (error) throw error
      return (data || []) as unknown as DadChallengeContent[]
    },

    // Get dad profile for current user
    async getDadProfile(userId: string): Promise<DadProfile | null> {
      const { data, error } = await supabase
        .from('dad_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()
      if (error && error.code !== 'PGRST116') throw error
      return data as DadProfile | null
    },

    // Create or update dad profile
    async upsertDadProfile(userId: string, profile: Partial<DadProfile>): Promise<DadProfile> {
      const { data, error } = await supabase
        .from('dad_profiles')
        .upsert({ user_id: userId, ...profile }, { onConflict: 'user_id' })
        .select()
        .single()
      if (error) throw error
      return data as DadProfile
    },

    // Submit mood check-in
    async submitMoodCheckin(params: {
      userId: string
      familyId: string
      mood: MoodLevel
      situationFlags?: string[]
      note?: string
      phase?: ContentPhase
    }): Promise<MoodCheckin> {
      const { data, error } = await supabase
        .from('mood_checkins')
        .insert({
          user_id: params.userId,
          family_id: params.familyId,
          mood: params.mood,
          situation_flags: params.situationFlags || [],
          note: params.note || null,
          phase: params.phase || null,
        })
        .select()
        .single()
      if (error) throw error
      return data as unknown as MoodCheckin
    },

    // Get recent mood check-ins (for history/trends)
    async getRecentCheckins(userId: string, limit = 7): Promise<MoodCheckin[]> {
      const { data, error } = await supabase
        .from('mood_checkins')
        .select('*')
        .eq('user_id', userId)
        .order('checked_in_at', { ascending: false })
        .limit(limit)
      if (error) throw error
      return (data || []) as unknown as MoodCheckin[]
    },

    // Get today's check-in (if any)
    async getLastCheckin(userId: string): Promise<MoodCheckin | null> {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const { data, error } = await supabase
        .from('mood_checkins')
        .select('*')
        .eq('user_id', userId)
        .gte('checked_in_at', today.toISOString())
        .order('checked_in_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (error) throw error
      return data as unknown as MoodCheckin | null
    },
  }
}

export type DadJourneyService = ReturnType<typeof createDadJourneyService>
