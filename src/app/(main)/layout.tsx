import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getServerAuth } from '@/lib/supabase/server-auth'
import { UserProvider } from '@/components/user-provider'
import { MainLayoutClient } from '@/components/layouts/main-layout-client'

/**
 * Main Layout - Server Component
 *
 * This layout:
 * 1. Fetches user, profile, and family data server-side (fast, cacheable)
 * 2. Protects routes by redirecting unauthenticated users
 * 3. Redirects users who haven't completed onboarding
 * 4. Provides data to client components via UserProvider
 *
 * Benefits:
 * - No loading spinners for auth state
 * - Data is pre-fetched before page renders
 * - Can be cached at edge for returning users
 */
export default async function MainLayout({ children }: { children: ReactNode }) {
  const { user, profile, family, activeBaby } = await getServerAuth()

  // Not authenticated - redirect to login
  if (!user) {
    redirect('/login')
  }

  // No profile (edge case - new user, trigger may have failed)
  if (!profile) {
    redirect('/onboarding')
  }

  // Onboarding not completed - redirect to onboarding
  if (!profile.onboarding_completed) {
    redirect('/onboarding')
  }

  // No family set up (edge case)
  if (!family) {
    redirect('/onboarding/family')
  }

  return (
    <UserProvider user={user} profile={profile} family={family} activeBaby={activeBaby}>
      <MainLayoutClient>{children}</MainLayoutClient>
    </UserProvider>
  )
}
