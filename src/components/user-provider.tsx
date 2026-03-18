'use client'

import { createContext, useContext, ReactNode } from 'react'
import { User as AppUser, Family } from '@/types'

/**
 * User context for server-fetched data
 *
 * This context holds user, profile, and family data that was fetched
 * server-side in a layout or page. This avoids:
 * - Client-side loading spinners
 * - Race conditions between auth state checks
 * - Multiple Supabase queries for the same data
 *
 * Usage:
 * 1. Fetch data in a Server Component using getServerAuth()
 * 2. Wrap children with UserProvider, passing the data
 * 3. Use useUser() hook in client components to access data
 */

interface UserContextValue {
  // Basic auth user info (from Supabase auth)
  user: {
    id: string
    email: string
  }
  // Full profile from profiles table
  profile: AppUser
  // Family data (null if not set up yet)
  family: Family | null
}

const UserContext = createContext<UserContextValue | null>(null)

interface UserProviderProps {
  user: {
    id: string
    email: string
  }
  profile: AppUser
  family: Family | null
  children: ReactNode
}

/**
 * Provider for server-fetched user data
 *
 * @example
 * // In a Server Component layout
 * export default async function MainLayout({ children }) {
 *   const { user, profile, family } = await getServerAuth()
 *   if (!user || !profile) redirect('/login')
 *
 *   return (
 *     <UserProvider user={user} profile={profile} family={family}>
 *       {children}
 *     </UserProvider>
 *   )
 * }
 */
export function UserProvider({ user, profile, family, children }: UserProviderProps) {
  return (
    <UserContext.Provider value={{ user, profile, family }}>
      {children}
    </UserContext.Provider>
  )
}

/**
 * Hook to access server-fetched user data
 *
 * Must be used within a UserProvider. If you're in a protected route
 * (main layout), the data is guaranteed to exist.
 *
 * @throws Error if used outside of UserProvider
 *
 * @example
 * function DashboardHeader() {
 *   const { profile, family } = useUser()
 *   return <h1>Welcome, {profile.full_name}!</h1>
 * }
 */
export function useUser(): UserContextValue {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error(
      'useUser must be used within a UserProvider. ' +
      'Make sure this component is wrapped in the (main) layout.'
    )
  }

  return context
}

/**
 * Hook to optionally access user data
 *
 * Returns null if not within UserProvider (useful for shared components
 * that might be used in both authenticated and unauthenticated contexts)
 *
 * @example
 * function SharedHeader() {
 *   const userData = useOptionalUser()
 *   if (userData) {
 *     return <span>Hi, {userData.profile.full_name}</span>
 *   }
 *   return <LoginButton />
 * }
 */
export function useOptionalUser(): UserContextValue | null {
  return useContext(UserContext)
}
