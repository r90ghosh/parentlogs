'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { createClient } from '@/lib/supabase/client'
import { trackEvent } from '@/lib/analytics'
import { DateSelect } from '@/components/ui/date-select'
import { cn } from '@/lib/utils'
import { Loader2, Baby, Calendar } from 'lucide-react'
import { Panel } from '@/components/digest'

/**
 * Onboarding Family Setup Page
 *
 * Protected by onboarding layout (server-side auth check).
 * Creates family, updates profile, and generates tasks.
 * After task generation, navigates to /onboarding/ready.
 */
export default function OnboardingFamily() {
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClient()

  const [stage, setStage] = useState<'pregnancy' | 'post-birth'>('pregnancy')
  const [dueDate, setDueDate] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [babyName, setBabyName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  // Wait for client-side auth state to sync
  const [isReady, setIsReady] = useState(false)
  useEffect(() => {
    if (user) {
      setIsReady(true)
    }
  }, [user])

  const handleCreateFamily = async () => {
    if (!user) return

    const referenceDate = stage === 'pregnancy' ? dueDate : birthDate
    // Validate complete date (YYYY-MM-DD with no empty parts)
    if (!referenceDate || !/^\d{4}-\d{2}-\d{2}$/.test(referenceDate)) {
      setError('Please select a complete date')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Create family using SECURITY DEFINER function (bypasses RLS issues)
      const { data: family, error: familyError } = await supabase
        .rpc('create_family_for_user', {
          p_stage: stage,
          p_due_date: stage === 'pregnancy' ? dueDate : undefined,
          p_birth_date: stage === 'post-birth' ? birthDate : undefined,
          p_baby_name: babyName || undefined,
        })

      if (familyError) {
        throw familyError
      }

      // Type the family response
      const familyData = family as { id: string; current_week?: number; [key: string]: unknown } | null
      if (!familyData || !familyData.id) {
        throw new Error('Family creation failed - no ID returned')
      }

      // Set signup_week on profile so free windows are calculated correctly
      if (familyData.current_week) {
        await supabase
          .from('profiles')
          .update({ signup_week: familyData.current_week })
          .eq('id', user.id)
      }

      // Generate tasks
      setIsGenerating(true)
      setProgress(10)

      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 15, 90))
      }, 500)

      const { error: taskError } = await supabase
        .rpc('initialize_family_tasks_with_catchup', {
          p_family_id: familyData.id,
          p_due_date: stage === 'pregnancy' ? dueDate : (birthDate || dueDate),
          p_signup_week: familyData.current_week || 1,
        })

      clearInterval(progressInterval)

      if (taskError) {
        throw taskError
      }

      setProgress(100)
      trackEvent('onboarding_family_created', { stage })

      // Small delay to show 100% progress
      setTimeout(() => {
        router.push('/onboarding/ready')
      }, 500)
    } catch (err) {
      console.error('[OnboardingFamily] Error:', err)
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setIsLoading(false)
      setIsGenerating(false)
    }
  }

  // Brief wait for client-side auth sync
  if (!isReady) {
    return (
      <Panel className="mx-auto flex w-full max-w-lg items-center justify-center p-6 py-12 sm:p-8">
        <Loader2 className="h-6 w-6 animate-spin text-clay-ink" />
      </Panel>
    )
  }

  if (isGenerating) {
    return (
      <Panel className="mx-auto w-full max-w-lg p-6 sm:p-8">
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-clay-soft">
            <Loader2 className="h-7 w-7 animate-spin text-clay-ink" />
          </div>
          <div>
            <h2 className="text-[24px] font-extrabold tracking-[-0.3px] text-ink">
              Setting up your timeline
            </h2>
            <p className="mt-1 text-[15px] leading-[1.6] text-mute">Generating personalized tasks...</p>
          </div>
          <div className="space-y-2">
            {/* Progress bar with clay fill */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-clay transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center text-[13px] text-mute">
              {progress < 50 ? 'Creating your family...' :
               progress < 90 ? 'Generating tasks...' :
               'Almost done...'}
            </p>
          </div>
        </div>
      </Panel>
    )
  }

  const isDateValid = stage === 'pregnancy'
    ? /^\d{4}-\d{2}-\d{2}$/.test(dueDate)
    : /^\d{4}-\d{2}-\d{2}$/.test(birthDate)

  return (
    <Panel className="mx-auto w-full max-w-lg p-6 sm:p-8">
      {/* Step indicator */}
      <div className="mb-6 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="h-1.5 w-6 rounded-full bg-clay" />
          <div className="h-1.5 w-6 rounded-full bg-clay" />
          <div className="h-1.5 w-6 rounded-full bg-line" />
        </div>
        <span className="ml-1 text-[13px] text-mute">Step 2 of 3</span>
      </div>

      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-[24px] font-extrabold tracking-[-0.3px] text-ink">
            Tell us about your journey
          </h1>
          <p className="mt-2 text-[15px] leading-[1.6] text-mute">
            We&apos;ll customize your timeline accordingly
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-danger/40 bg-danger/10 px-3.5 py-2.5 text-[13px] font-semibold text-danger">
            {error}
          </div>
        )}

        {/* Stage toggle */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setStage('pregnancy')}
            className={cn(
              'flex items-center justify-center gap-2 rounded-xl border-2 px-3 py-2.5 text-[14px] font-bold transition-colors',
              stage === 'pregnancy'
                ? 'border-clay bg-clay-soft text-clay-ink'
                : 'border-line bg-card text-ink2 hover:border-faint'
            )}
          >
            <Calendar className="h-4 w-4" />
            Expecting
          </button>
          <button
            type="button"
            onClick={() => setStage('post-birth')}
            className={cn(
              'flex items-center justify-center gap-2 rounded-xl border-2 px-3 py-2.5 text-[14px] font-bold transition-colors',
              stage === 'post-birth'
                ? 'border-clay bg-clay-soft text-clay-ink'
                : 'border-line bg-card text-ink2 hover:border-faint'
            )}
          >
            <Baby className="h-4 w-4" />
            Baby Born
          </button>
        </div>

        {/* Date input -- only render the active one */}
        {stage === 'pregnancy' ? (
          <div>
            <label className="mb-1.5 block text-[13px] font-bold text-ink2">Due Date</label>
            <DateSelect
              value={dueDate}
              onChange={setDueDate}
              mode="future"
            />
            <p className="mt-1.5 text-[13px] leading-[1.5] text-mute">
              We&apos;ll calculate your current week and schedule tasks accordingly
            </p>
          </div>
        ) : (
          <div>
            <label className="mb-1.5 block text-[13px] font-bold text-ink2">Birth Date</label>
            <DateSelect
              value={birthDate}
              onChange={setBirthDate}
              mode="past"
            />
            <p className="mt-1.5 text-[13px] leading-[1.5] text-mute">
              Tasks will be scheduled based on your baby&apos;s age
            </p>
          </div>
        )}

        <div>
          <label htmlFor="babyName" className="mb-1.5 block text-[13px] font-bold text-ink2">
            Baby&apos;s Name <span className="font-normal text-mute">(optional)</span>
          </label>
          <input
            id="babyName"
            type="text"
            placeholder="Leave blank if not decided yet"
            value={babyName}
            onChange={(e) => setBabyName(e.target.value)}
            className="w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-[15px] text-ink outline-none placeholder:text-faint focus:border-clay"
          />
        </div>

        <button
          type="button"
          className="flex w-full items-center justify-center rounded-xl bg-clay px-5 py-3 text-[15px] font-bold text-white hover:opacity-90 disabled:opacity-50"
          onClick={handleCreateFamily}
          disabled={isLoading || !isDateValid}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Continue'
          )}
        </button>
      </div>
    </Panel>
  )
}
