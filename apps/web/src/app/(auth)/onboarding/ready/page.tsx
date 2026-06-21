'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { useCompleteOnboarding } from '@/hooks/use-profile'
import { createClient } from '@/lib/supabase/client'
import { analytics } from '@/lib/analytics'
import { CheckCircle, Rocket, ListTodo, BookOpen, Lightbulb, Loader2 } from 'lucide-react'
import { Panel } from '@/components/digest'

interface ValueItem {
  icon: React.ElementType
  label: string
  delay: number
}

/**
 * Onboarding Ready Page
 *
 * Replaces the old invite + complete screens.
 * Shows dynamic value preview after task generation completes.
 * Calls useCompleteOnboarding to mark onboarding as done.
 */
export default function OnboardingReady() {
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClient()
  const completeOnboarding = useCompleteOnboarding()

  const [taskCount, setTaskCount] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)

  // Wait for client-side auth state to sync
  const [isReady, setIsReady] = useState(false)
  useEffect(() => {
    if (user) {
      setIsReady(true)
    }
  }, [user])

  // Fetch task count and complete onboarding when user is available
  useEffect(() => {
    const initialize = async () => {
      if (!user || isCompleted) return

      try {
        // Fetch family_id and role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('family_id, role')
          .eq('id', user.id)
          .single()

        if (profileError || !profile?.family_id) {
          // If no family yet, still proceed with completion
          await completeOnboarding.mutateAsync(user.id)
          setIsCompleted(true)
          analytics.onboardingCompleted(profile?.role || 'unknown')
          return
        }

        // Fetch task count for this family
        const { count, error: countError } = await supabase
          .from('family_tasks')
          .select('id', { count: 'exact', head: true })
          .eq('family_id', profile.family_id)

        if (!countError && count !== null) {
          setTaskCount(count)
        }

        // Mark onboarding complete
        await completeOnboarding.mutateAsync(user.id)
        setIsCompleted(true)
        analytics.onboardingCompleted(profile?.role || 'unknown')
      } catch (err) {
        console.error('[OnboardingReady] Error:', err)
        setError(err instanceof Error ? err.message : 'Failed to complete setup')
      }
    }

    if (isReady) {
      initialize()
    }
  }, [isReady, user, isCompleted, supabase, completeOnboarding])

  const valueItems: ValueItem[] = [
    {
      icon: ListTodo,
      label: taskCount !== null ? `${taskCount} tasks loaded` : 'Tasks loaded for your stage',
      delay: 0,
    },
    {
      icon: BookOpen,
      label: 'This week\'s briefing ready',
      delay: 0.15,
    },
    {
      icon: Lightbulb,
      label: '7 challenge guides tailored to your stage',
      delay: 0.3,
    },
  ]

  if (!isReady) {
    return (
      <Panel className="mx-auto flex w-full max-w-md items-center justify-center p-6 py-12 sm:p-8">
        <Loader2 className="h-6 w-6 animate-spin text-clay-ink" />
      </Panel>
    )
  }

  return (
    <Panel className="mx-auto w-full max-w-md p-6 sm:p-8">
      {/* Step indicator */}
      <div className="mb-6 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="h-1.5 w-6 rounded-full bg-clay" />
          <div className="h-1.5 w-6 rounded-full bg-clay" />
          <div className="h-1.5 w-6 rounded-full bg-clay" />
        </div>
        <span className="ml-1 text-[13px] text-mute">All done!</span>
      </div>

      <div className="space-y-6">
        {/* Icon + header */}
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-clay-soft">
            <Rocket className="h-8 w-8 text-clay-ink" />
          </div>
          <h1 className="text-[24px] font-extrabold tracking-[-0.3px] text-ink">
            You&apos;re all set!
          </h1>
          <p className="mt-2 text-[15px] leading-[1.6] text-mute">
            Your parenting command center is ready
          </p>
        </div>

        {error && (
          <div className="text-center text-[13px] font-semibold text-danger">{error}</div>
        )}

        {/* Value items */}
        <div className="space-y-3">
          {valueItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-xl border border-line bg-card p-3"
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-clay-soft">
                <CheckCircle className="h-4 w-4 text-clay-ink" />
              </div>
              <span className="text-[15px] leading-[1.5] text-ink2">{item.label}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="flex w-full items-center justify-center rounded-xl bg-clay px-5 py-3 text-[15px] font-bold text-white hover:opacity-90 disabled:opacity-50"
          onClick={() => router.push('/dashboard')}
          disabled={completeOnboarding.isPending || !isCompleted}
        >
          {completeOnboarding.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Completing setup...
            </>
          ) : (
            'Go to Dashboard'
          )}
        </button>
      </div>
    </Panel>
  )
}
