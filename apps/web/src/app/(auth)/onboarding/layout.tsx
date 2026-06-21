import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getServerAuth } from '@/lib/supabase/server-auth'
import { BrandLogo } from '@/components/digest'

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
    <div className="digest-app flex min-h-screen flex-col">
      <header className="flex justify-center p-6">
        <BrandLogo size={30} />
      </header>
      <main className="flex flex-1 items-center justify-center p-4">{children}</main>
    </div>
  )
}
