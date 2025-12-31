import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getServerAuth } from '@/lib/supabase/server-auth'

/**
 * Onboarding Layout - Server Component
 *
 * This layout protects onboarding routes:
 * - Requires authentication (user must be signed in)
 * - Redirects to dashboard if onboarding is already completed
 *
 * For onboarding pages, we don't use UserProvider because
 * the profile may be incomplete. Instead, pages fetch what they need.
 */
export default async function OnboardingLayout({ children }: { children: ReactNode }) {
  console.log('[OnboardingLayout] ========== RENDER START ==========')

  const { user, profile } = await getServerAuth()

  console.log('[OnboardingLayout] Auth result:', {
    hasUser: !!user,
    hasProfile: !!profile,
    onboardingCompleted: profile?.onboarding_completed,
    familyId: profile?.family_id
  })

  // Not authenticated - redirect to login
  if (!user) {
    console.log('[OnboardingLayout] No user -> redirecting to /login')
    redirect('/login')
  }

  // Already completed onboarding - redirect to dashboard
  if (profile?.onboarding_completed && profile?.family_id) {
    console.log('[OnboardingLayout] Onboarding already completed -> redirecting to /dashboard')
    redirect('/dashboard')
  }

  console.log('[OnboardingLayout] User needs onboarding, rendering onboarding layout')
  console.log('[OnboardingLayout] ========== RENDER END ==========')

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col">
      <header className="p-4 text-center">
        <h1 className="text-xl font-bold text-white">ParentLogs</h1>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>
    </div>
  )
}
