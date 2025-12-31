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
  console.log('[MainLayout] ========== RENDER START ==========')

  const { user, profile, family } = await getServerAuth()

  console.log('[MainLayout] Auth result:', {
    hasUser: !!user,
    hasProfile: !!profile,
    hasFamily: !!family,
    onboardingCompleted: profile?.onboarding_completed
  })

  // Not authenticated - redirect to login
  if (!user) {
    console.log('[MainLayout] No user -> redirecting to /login')
    redirect('/login')
  }

  // No profile (edge case - new user, trigger may have failed)
  if (!profile) {
    console.log('[MainLayout] No profile -> redirecting to /onboarding')
    redirect('/onboarding')
  }

  // Onboarding not completed - redirect to onboarding
  if (!profile.onboarding_completed) {
    console.log('[MainLayout] Onboarding not completed -> redirecting to /onboarding')
    redirect('/onboarding')
  }

  // No family set up (edge case)
  if (!family) {
    console.log('[MainLayout] No family -> redirecting to /onboarding/family')
    redirect('/onboarding/family')
  }

  console.log('[MainLayout] All checks passed, rendering main layout')
  console.log('[MainLayout] ========== RENDER END ==========')

  return (
    <UserProvider user={user} profile={profile} family={family}>
      <MainLayoutClient>{children}</MainLayoutClient>
    </UserProvider>
  )
}
