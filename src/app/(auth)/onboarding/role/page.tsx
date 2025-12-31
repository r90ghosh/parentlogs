'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { useUpdateRole } from '@/hooks/use-profile'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { UserRole } from '@/types'

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
 * This page is protected by the onboarding layout which:
 * - Validates user is authenticated (server-side)
 * - Redirects if onboarding is already complete
 *
 * No loading spinners needed for auth - if we're here, user is authenticated.
 */
export default function OnboardingRole() {
  console.log('[OnboardingRole] ========== RENDER ==========')

  const router = useRouter()
  const { user } = useAuth()
  const updateRole = useUpdateRole()

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [error, setError] = useState<string | null>(null)

  console.log('[OnboardingRole] Current state:', {
    userId: user?.id || 'null',
    selectedRole,
    isPending: updateRole.isPending
  })

  // Wait for client-side auth state to sync
  const [isReady, setIsReady] = useState(false)
  useEffect(() => {
    console.log('[OnboardingRole] useEffect - user changed:', user?.id || 'null')
    if (user) {
      console.log('[OnboardingRole] User available, setting isReady=true')
      setIsReady(true)
    }
  }, [user])

  const handleContinue = async () => {
    console.log('[OnboardingRole] handleContinue called:', { selectedRole, userId: user?.id })
    if (!selectedRole || !user) {
      console.log('[OnboardingRole] Cannot continue - missing role or user')
      return
    }

    setError(null)

    try {
      console.log('[OnboardingRole] Calling updateRole.mutateAsync...')
      await updateRole.mutateAsync({ userId: user.id, role: selectedRole })
      console.log('[OnboardingRole] Role updated, navigating to /onboarding/family')
      router.push('/onboarding/family')
    } catch (err) {
      console.error('[OnboardingRole] Error updating role:', err)
      setError(err instanceof Error ? err.message : 'Failed to save role')
    }
  }

  // Brief wait for client-side auth sync (usually instant)
  if (!isReady) {
    console.log('[OnboardingRole] Not ready yet, showing loader')
    return (
      <Card className="w-full max-w-md bg-surface-900 border-surface-800">
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-accent-500" />
          </div>
        </CardContent>
      </Card>
    )
  }

  console.log('[OnboardingRole] Rendering role selection form')

  return (
    <Card className="w-full max-w-md bg-surface-900 border-surface-800">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-white">What&apos;s your role?</CardTitle>
        <CardDescription>This helps us personalize your experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={cn(
                'w-full p-4 rounded-lg border-2 text-left transition-all',
                selectedRole === role.id
                  ? 'border-accent-500 bg-accent-500/10'
                  : 'border-surface-700 bg-surface-800 hover:border-surface-600'
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{role.emoji}</span>
                <div>
                  <p className="font-medium text-white">{role.label}</p>
                  <p className="text-sm text-surface-400">{role.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <Button
          className="w-full"
          onClick={handleContinue}
          disabled={!selectedRole || updateRole.isPending}
        >
          {updateRole.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Continue'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
