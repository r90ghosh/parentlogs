'use client'

import { ReactNode } from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  const { profile, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && profile?.onboarding_completed) {
      router.push('/dashboard')
    }
  }, [profile, isLoading, router])

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
