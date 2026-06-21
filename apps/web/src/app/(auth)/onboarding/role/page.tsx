'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { useUpdateRole } from '@/hooks/use-profile'
import { trackEvent } from '@/lib/analytics'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { UserRole } from '@tdc/shared/types'
import { Panel } from '@/components/digest'

const roles: Array<{ id: UserRole; label: string; description: string; emoji: string }> = [
  {
    id: 'dad',
    label: 'Dad',
    description: 'Get dad-focused tasks, briefings, and tips',
    emoji: '👨',
  },
  {
    id: 'mom',
    label: 'Mom',
    description: 'Get mom-focused tasks and health tracking',
    emoji: '👩',
  },
  {
    id: 'other',
    label: 'Other',
    description: 'Partner, grandparent, or caregiver',
    emoji: '🧑',
  },
]

/**
 * Onboarding Role Selection Page
 *
 * Auto-advances on tap — no separate Continue button needed.
 * Protected by the onboarding layout (server-side auth check).
 */
function OnboardingRoleContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const updateRole = useUpdateRole()

  const nextParam = searchParams.get('next')
  const [error, setError] = useState<string | null>(null)

  // Wait for client-side auth state to sync
  const [isReady, setIsReady] = useState(false)
  useEffect(() => {
    if (user) {
      setIsReady(true)
    }
  }, [user])

  const handleRoleSelect = async (role: UserRole) => {
    if (!user || updateRole.isPending) return

    setError(null)

    try {
      await updateRole.mutateAsync({ userId: user.id, role })
      trackEvent('onboarding_role_selected', { role })
      router.push(nextParam === 'join' ? '/onboarding/join' : '/onboarding/family')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save role')
    }
  }

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
          <div className="h-1.5 w-6 rounded-full bg-line" />
          <div className="h-1.5 w-6 rounded-full bg-line" />
        </div>
        <span className="ml-1 text-[13px] text-mute">Step 1 of 3</span>
      </div>

      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-[24px] font-extrabold tracking-[-0.3px] text-ink">
          What&apos;s your role?
        </h1>
        <p className="mt-2 text-[15px] leading-[1.6] text-mute">
          This helps us personalize your experience
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-danger/40 bg-danger/10 px-3.5 py-2.5 text-[13px] font-semibold text-danger">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => handleRoleSelect(role.id)}
            disabled={updateRole.isPending}
            className={cn(
              'w-full rounded-[18px] border-2 border-line bg-card p-4 text-left transition-colors',
              updateRole.isPending
                ? 'cursor-not-allowed opacity-60'
                : 'cursor-pointer hover:border-faint'
            )}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-clay-soft text-xl">
                {updateRole.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin text-clay-ink" />
                ) : (
                  role.emoji
                )}
              </div>
              <div>
                <p className="text-[15px] font-bold text-ink">{role.label}</p>
                <p className="text-[13px] leading-[1.5] text-mute">{role.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </Panel>
  )
}

export default function OnboardingRole() {
  return (
    <Suspense
      fallback={
        <Panel className="mx-auto flex w-full max-w-md items-center justify-center p-6 py-12 sm:p-8">
          <Loader2 className="h-6 w-6 animate-spin text-clay-ink" />
        </Panel>
      }
    >
      <OnboardingRoleContent />
    </Suspense>
  )
}
