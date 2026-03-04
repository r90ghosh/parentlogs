'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { useCompleteOnboarding } from '@/hooks/use-profile'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { CheckCircle, Rocket, ListTodo, BookOpen, Lightbulb, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

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
        // Fetch family_id first
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('family_id')
          .eq('id', user.id)
          .single()

        if (profileError || !profile?.family_id) {
          // If no family yet, still proceed with completion
          await completeOnboarding.mutateAsync(user.id)
          setIsCompleted(true)
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
      <div className="w-full max-w-md bg-[--card] border border-[--border] rounded-2xl shadow-lift overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-copper via-gold to-copper opacity-90" />
        <div className="py-12 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-copper" />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md bg-[--card] border border-[--border] rounded-2xl shadow-lift overflow-hidden">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-copper via-gold to-copper opacity-90" />

      {/* Step indicator */}
      <div className="px-8 pt-6 pb-0">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex gap-1.5">
            <div className="h-1.5 w-6 rounded-full bg-copper" />
            <div className="h-1.5 w-6 rounded-full bg-copper" />
            <div className="h-1.5 w-6 rounded-full bg-copper" />
          </div>
          <span className="text-xs text-[--muted] font-ui ml-1">All done!</span>
        </div>
      </div>

      <div className="px-8 pb-8 space-y-6">
        {/* Animated icon + header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="mx-auto mb-5 h-16 w-16 rounded-full bg-copper/20 flex items-center justify-center"
          >
            <Rocket className="h-8 w-8 text-copper" />
          </motion.div>
          <h1 className="font-display text-2xl font-bold text-[--cream] mb-2">
            You&apos;re all set!
          </h1>
          <p className="font-body text-sm text-[--muted]">
            Your parenting command center is ready
          </p>
        </div>

        {error && (
          <div className="text-coral text-sm text-center font-body">{error}</div>
        )}

        {/* Value items */}
        <div className="space-y-3">
          {valueItems.map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: item.delay + 0.3 }}
              className="flex items-center gap-3 p-3 bg-[--card-hover] border border-[--border] rounded-xl"
            >
              <div className="h-8 w-8 rounded-full bg-copper/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-4 w-4 text-copper" />
              </div>
              <span className="font-body text-sm text-[--cream]">{item.label}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            className="w-full bg-copper hover:bg-copper-hover text-[--bg] font-ui font-semibold shadow-copper"
            size="lg"
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
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
