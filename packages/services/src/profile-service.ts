import type { User as AppUser, UserRole } from '@tdc/shared/types'
import type { AppSupabaseClient } from './types'

export function createProfileService(supabase: AppSupabaseClient) {
  return {
    async getProfile(userId: string): Promise<AppUser | null> {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data as AppUser | null
    },

    async updateRole(userId: string, role: UserRole): Promise<AppUser> {
      const { data, error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return data as AppUser
    },

    async updateProfile(userId: string, updates: Partial<AppUser>): Promise<AppUser> {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return data as AppUser
    },

    async completeOnboarding(userId: string): Promise<AppUser> {
      const { data, error } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return data as AppUser
    },

    async markWelcomeSeen(userId: string): Promise<AppUser> {
      const { data, error } = await supabase
        .from('profiles')
        .update({ has_seen_welcome: true })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return data as AppUser
    },

    async getCurrentProfile(): Promise<AppUser | null> {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) return null
      return data as AppUser
    },
  }
}

export type ProfileService = ReturnType<typeof createProfileService>
