'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { useUpdateRole } from '@/hooks/use-profile'
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
 * Auto-advances on tap — no separate Continue button needed.
 * Protected by the onboarding layout (server-side auth check).
 */
export default function OnboardingRole() {
  const router = useRouter()
  const { user } = useAuth()
  const updateRole = useUpdateRole()

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
      router.push('/onboarding/family')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save role')
    }
  }

  if (!isReady) {
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
              onClick={() => handleRoleSelect(role.id)}
              disabled={updateRole.isPending}
              className={cn(
                'w-full p-4 rounded-lg border-2 text-left transition-all',
                updateRole.isPending
                  ? 'border-surface-700 bg-surface-800 opacity-60 cursor-not-allowed'
                  : 'border-surface-700 bg-surface-800 hover:border-accent-500 hover:bg-accent-500/10 cursor-pointer'
              )}
            >
              <div className="flex items-center gap-3">
                {updateRole.isPending ? (
                  <Loader2 className="h-6 w-6 animate-spin text-accent-500" />
                ) : (
                  <span className="text-2xl">{role.emoji}</span>
                )}
                <div>
                  <p className="font-medium text-white">{role.label}</p>
                  <p className="text-sm text-surface-400">{role.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
