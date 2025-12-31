'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { useCompleteOnboarding } from '@/hooks/use-profile'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Rocket, Calendar, Users, ListTodo, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

const setupItems = [
  { icon: Users, label: 'Family profile created', delay: 0 },
  { icon: Calendar, label: 'Timeline configured', delay: 0.1 },
  { icon: ListTodo, label: '200+ tasks loaded', delay: 0.2 },
]

/**
 * Onboarding Complete Page
 *
 * Final step - marks onboarding as complete and redirects to dashboard.
 * Protected by onboarding layout (server-side auth check).
 */
export default function OnboardingComplete() {
  console.log('[OnboardingComplete] ========== RENDER ==========')

  const router = useRouter()
  const { user } = useAuth()
  const completeOnboarding = useCompleteOnboarding()
  const [error, setError] = useState<string | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)

  console.log('[OnboardingComplete] Current state:', {
    userId: user?.id || 'null',
    isCompleted,
    isPending: completeOnboarding.isPending,
    error
  })

  // Complete onboarding when user is available
  useEffect(() => {
    const complete = async () => {
      console.log('[OnboardingComplete] complete() called:', { userId: user?.id, isCompleted })
      if (!user || isCompleted) {
        console.log('[OnboardingComplete] Skipping - no user or already completed')
        return
      }

      try {
        console.log('[OnboardingComplete] Calling completeOnboarding.mutateAsync...')
        await completeOnboarding.mutateAsync(user.id)
        console.log('[OnboardingComplete] Onboarding completed successfully!')
        setIsCompleted(true)
      } catch (err) {
        console.error('[OnboardingComplete] Error:', err)
        setError(err instanceof Error ? err.message : 'Failed to complete onboarding')
      }
    }

    complete()
  }, [user, isCompleted, completeOnboarding])

  return (
    <Card className="w-full max-w-md bg-surface-900 border-surface-800">
      <CardHeader className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="mx-auto mb-4 h-16 w-16 rounded-full bg-accent-500/20 flex items-center justify-center"
        >
          <Rocket className="h-8 w-8 text-accent-500" />
        </motion.div>
        <CardTitle className="text-2xl text-white">You&apos;re all set!</CardTitle>
        <CardDescription>Your parenting command center is ready</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <div className="space-y-3">
          {setupItems.map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: item.delay + 0.3 }}
              className="flex items-center gap-3 p-3 bg-surface-800 rounded-lg"
            >
              <div className="h-8 w-8 rounded-full bg-accent-500/20 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-accent-500" />
              </div>
              <span className="text-surface-200">{item.label}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            className="w-full"
            size="lg"
            onClick={() => router.push('/dashboard')}
            disabled={completeOnboarding.isPending}
          >
            {completeOnboarding.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Completing setup...
              </>
            ) : (
              'Go to Dashboard'
            )}
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  )
}
