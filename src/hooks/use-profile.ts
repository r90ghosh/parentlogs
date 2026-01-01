'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { User as AppUser, UserRole } from '@/types'

/**
 * React Query hook for profile data
 *
 * For initial profile data:
 * - Use server-side fetching via getServerAuth() in layouts
 * - Access via useUser() hook from UserProvider
 *
 * For profile updates and mutations:
 * - Use this hook's mutation functions
 * - Query will be invalidated after mutations
 */

/**
 * Fetch profile for a specific user
 * Use this when you need to refetch or get updated profile data client-side
 */
export function useProfile(userId: string | undefined) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      console.log('[useProfile] Fetching profile for userId:', userId)
      if (!userId) return null

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('[useProfile] Error fetching profile:', error.message)
        throw error
      }
      console.log('[useProfile] Profile fetched successfully:', data?.id)
      return data as AppUser
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes
  })
}

/**
 * Update profile role (used during onboarding)
 */
export function useUpdateRole() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: UserRole }) => {
      console.log('[useUpdateRole] Updating role:', { userId, role })
      const { data, error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        console.error('[useUpdateRole] Error:', error.message)
        throw error
      }
      console.log('[useUpdateRole] Role updated successfully')
      return data as AppUser
    },
    onSuccess: (data) => {
      console.log('[useUpdateRole] onSuccess - invalidating queries')
      queryClient.setQueryData(['profile', data.id], data)
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onError: (error) => {
      console.error('[useUpdateRole] onError:', error)
    },
  })
}

/**
 * Update profile (general updates)
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<AppUser> }) => {
      console.log('[useUpdateProfile] Updating profile:', { userId, updates })
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        console.error('[useUpdateProfile] Error:', error.message)
        throw error
      }
      console.log('[useUpdateProfile] Profile updated successfully')
      return data as AppUser
    },
    onSuccess: (data) => {
      console.log('[useUpdateProfile] onSuccess - invalidating queries')
      queryClient.setQueryData(['profile', data.id], data)
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onError: (error) => {
      console.error('[useUpdateProfile] onError:', error)
    },
  })
}

/**
 * Complete onboarding
 */
export function useCompleteOnboarding() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (userId: string) => {
      console.log('[useCompleteOnboarding] Completing onboarding for userId:', userId)
      const { data, error } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        console.error('[useCompleteOnboarding] Error:', error.message)
        throw error
      }
      console.log('[useCompleteOnboarding] Onboarding completed successfully')
      return data as AppUser
    },
    onSuccess: (data) => {
      console.log('[useCompleteOnboarding] onSuccess - invalidating queries')
      queryClient.setQueryData(['profile', data.id], data)
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onError: (error) => {
      console.error('[useCompleteOnboarding] onError:', error)
    },
  })
}

/**
 * Get the current user's profile
 * Fetches the authenticated user and their profile data
 */
export function useCurrentProfile() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['current-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('[useCurrentProfile] Error fetching profile:', error.message)
        return null
      }
      return data as AppUser
    },
    staleTime: 5 * 60 * 1000,
  })
}
