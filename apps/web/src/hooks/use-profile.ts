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
      if (!userId) return null

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
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
      const { data, error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return data as AppUser
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile', data.id], data)
      queryClient.invalidateQueries({ queryKey: ['profile'] })
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
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return data as AppUser
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile', data.id], data)
      queryClient.invalidateQueries({ queryKey: ['profile'] })
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
      const { data, error } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return data as AppUser
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile', data.id], data)
      queryClient.invalidateQueries({ queryKey: ['profile'] })
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

      if (error) return null
      return data as AppUser
    },
    staleTime: 5 * 60 * 1000,
  })
}
