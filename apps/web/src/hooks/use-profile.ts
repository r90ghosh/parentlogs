'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { profileService } from '@/lib/services'
import { User as AppUser, UserRole } from '@tdc/shared/types'

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
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null
      return profileService.getProfile(userId)
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

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: UserRole }) => {
      return profileService.updateRole(userId, role)
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

  return useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<AppUser> }) => {
      return profileService.updateProfile(userId, updates)
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

  return useMutation({
    mutationFn: async (userId: string) => {
      return profileService.completeOnboarding(userId)
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
  return useQuery({
    queryKey: ['current-profile'],
    queryFn: () => profileService.getCurrentProfile(),
    staleTime: 5 * 60 * 1000,
  })
}
