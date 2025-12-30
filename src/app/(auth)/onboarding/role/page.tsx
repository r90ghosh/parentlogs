'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const roles = [
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

export default function OnboardingRole() {
  const router = useRouter()
  const { user, refreshProfile } = useAuth()
  const supabase = createClient()
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleContinue = async () => {
    if (!selectedRole || !user) return

    setIsLoading(true)
    setError(null)

    const { error } = await supabase
      .from('profiles')
      .update({ role: selectedRole })
      .eq('id', user.id)

    if (error) {
      setError(error.message)
      setIsLoading(false)
    } else {
      await refreshProfile()
      router.push('/onboarding/family')
    }
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
          disabled={!selectedRole || isLoading}
        >
          {isLoading ? (
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
