import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getServerAuth } from '@/lib/supabase/server-auth'
import { Logo } from '@/components/ui/logo'

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
  const { user, profile } = await getServerAuth()

  // Not authenticated - redirect to login
  if (!user) {
    redirect('/login')
  }

  // Already completed onboarding - redirect to dashboard
  if (profile?.onboarding_completed && profile?.family_id) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[--bg] flex flex-col">
      <header className="p-6 flex justify-center">
        <Logo size="md" variant="dark" />
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>
    </div>
  )
}
