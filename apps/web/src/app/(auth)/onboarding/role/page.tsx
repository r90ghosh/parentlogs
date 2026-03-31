'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { useUpdateRole } from '@/hooks/use-profile'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { UserRole } from '@tdc/shared/types'
import { Card3DTilt } from '@/components/ui/animations/Card3DTilt'
import { Reveal } from '@/components/ui/animations/Reveal'

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
      router.push(nextParam === 'join' ? '/onboarding/join' : '/onboarding/family')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save role')
    }
  }

  if (!isReady) {
    return (
      <div className="w-full max-w-md bg-[--card] border border-[--border] rounded-2xl shadow-lift overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-copper via-gold to-copper opacity-90" />
        <div className="py-12 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-copper" />
        </div>
      </div>
    )
  }

  return (
    <Reveal variant="card" delay={100}>
      <Card3DTilt maxTilt={4} gloss>
        <div className="w-full max-w-md bg-[--card] border border-[--border] rounded-2xl shadow-lift overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-copper via-gold to-copper opacity-90" />

          {/* Step indicator */}
          <div className="px-8 pt-6 pb-0">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-1.5">
                <div className="h-1.5 w-6 rounded-full bg-copper" />
                <div className="h-1.5 w-6 rounded-full bg-[--dim]" />
                <div className="h-1.5 w-6 rounded-full bg-[--dim]" />
              </div>
              <span className="text-xs text-[--muted] font-ui ml-1">Step 1 of 3</span>
            </div>
          </div>

          <div className="px-8 pb-8">
            {/* Header */}
            <Reveal delay={0}>
              <div className="text-center mb-6">
                <h1 className="font-display text-2xl font-bold text-[--cream] mb-2">
                  What&apos;s your role?
                </h1>
                <p className="font-body text-sm text-[--muted]">
                  This helps us personalize your experience
                </p>
              </div>
            </Reveal>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Reveal delay={150}>
              <div className="space-y-3">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    disabled={updateRole.isPending}
                    className={cn(
                      'w-full p-4 rounded-xl border text-left transition-all duration-200',
                      updateRole.isPending
                        ? 'border-[--border] bg-[--card-hover] opacity-60 cursor-not-allowed'
                        : 'border-[--border] bg-[--card-hover] hover:border-copper hover:bg-[--card-hover] cursor-pointer shadow-card hover:shadow-hover'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      {updateRole.isPending ? (
                        <div className="h-10 w-10 rounded-full bg-[--dim] flex items-center justify-center flex-shrink-0">
                          <Loader2 className="h-5 w-5 animate-spin text-copper" />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-[--dim] flex items-center justify-center flex-shrink-0 text-xl">
                          {role.emoji}
                        </div>
                      )}
                      <div>
                        <p className="font-ui font-semibold text-[--cream]">{role.label}</p>
                        <p className="text-sm font-body text-[--muted]">{role.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </Card3DTilt>
    </Reveal>
  )
}

export default function OnboardingRole() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-md bg-[--card] border border-[--border] rounded-2xl shadow-lift overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-copper via-gold to-copper opacity-90" />
        <div className="py-12 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-copper" />
        </div>
      </div>
    }>
      <OnboardingRoleContent />
    </Suspense>
  )
}
