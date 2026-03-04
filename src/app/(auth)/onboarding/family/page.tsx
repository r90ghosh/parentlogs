'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { DateSelect } from '@/components/ui/date-select'
import { cn } from '@/lib/utils'
import { Loader2, Baby, Calendar } from 'lucide-react'
import { Card3DTilt } from '@/components/ui/animations/Card3DTilt'
import { RevealOnScroll } from '@/components/ui/animations/RevealOnScroll'
import { MagneticButton } from '@/components/ui/animations/MagneticButton'
import { CardEntrance } from '@/components/ui/animations/CardEntrance'

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
      <div className="w-full max-w-md bg-[--card] border border-[--border] rounded-2xl shadow-lift overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-copper via-gold to-copper opacity-90" />
        <div className="py-12 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-copper" />
        </div>
      </div>
    )
  }

  if (isGenerating) {
    return (
      <div className="w-full max-w-md bg-[--card] border border-[--border] rounded-2xl shadow-lift overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-copper via-gold to-copper opacity-90" />
        <div className="px-8 py-10 text-center space-y-6">
          <div className="mx-auto w-14 h-14 rounded-full bg-[--dim] flex items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-copper" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-[--cream] mb-1">
              Setting up your timeline
            </h2>
            <p className="font-body text-sm text-[--muted]">Generating personalized tasks...</p>
          </div>
          <div className="space-y-2">
            {/* Custom progress bar with copper fill */}
            <div className="h-2 w-full bg-[--dim] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-copper to-gold rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-center text-[--muted] font-ui">
              {progress < 50 ? 'Creating your family...' :
               progress < 90 ? 'Generating tasks...' :
               'Almost done...'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <CardEntrance delay={100}>
      <Card3DTilt maxTilt={4} gloss>
        <div className="w-full max-w-md bg-[--card] border border-[--border] rounded-2xl shadow-lift overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-copper via-gold to-copper opacity-90" />

          {/* Step indicator */}
          <div className="px-8 pt-6 pb-0">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-1.5">
                <div className="h-1.5 w-6 rounded-full bg-copper" />
                <div className="h-1.5 w-6 rounded-full bg-copper" />
                <div className="h-1.5 w-6 rounded-full bg-[--dim]" />
              </div>
              <span className="text-xs text-[--muted] font-ui ml-1">Step 2 of 3</span>
            </div>
          </div>

          <div className="px-8 pb-8 space-y-6">
            {/* Header */}
            <RevealOnScroll delay={0}>
              <div className="text-center">
                <h1 className="font-display text-2xl font-bold text-[--cream] mb-2">
                  Tell us about your journey
                </h1>
                <p className="font-body text-sm text-[--muted]">
                  We&apos;ll customize your timeline accordingly
                </p>
              </div>
            </RevealOnScroll>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Stage toggle */}
            <RevealOnScroll delay={100}>
              <div className="grid grid-cols-2 gap-1 rounded-xl bg-[--bg] border border-[--border] p-1">
                <button
                  type="button"
                  onClick={() => setStage('pregnancy')}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-ui font-medium transition-all duration-200',
                    stage === 'pregnancy'
                      ? 'bg-copper text-[--bg] shadow-copper'
                      : 'text-[--muted] hover:text-[--cream]'
                  )}
                >
                  <Calendar className="h-4 w-4" />
                  Expecting
                </button>
                <button
                  type="button"
                  onClick={() => setStage('post-birth')}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-ui font-medium transition-all duration-200',
                    stage === 'post-birth'
                      ? 'bg-copper text-[--bg] shadow-copper'
                      : 'text-[--muted] hover:text-[--cream]'
                  )}
                >
                  <Baby className="h-4 w-4" />
                  Baby Born
                </button>
              </div>
            </RevealOnScroll>

            {/* Date input -- only render the active one */}
            <RevealOnScroll delay={200}>
              {stage === 'pregnancy' ? (
                <div className="space-y-2">
                  <Label className="font-ui text-[--cream]">Due Date</Label>
                  <DateSelect
                    value={dueDate}
                    onChange={setDueDate}
                    mode="future"
                  />
                  <p className="text-xs text-[--muted] font-body">
                    We&apos;ll calculate your current week and schedule tasks accordingly
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label className="font-ui text-[--cream]">Birth Date</Label>
                  <DateSelect
                    value={birthDate}
                    onChange={setBirthDate}
                    mode="past"
                  />
                  <p className="text-xs text-[--muted] font-body">
                    Tasks will be scheduled based on your baby&apos;s age
                  </p>
                </div>
              )}
            </RevealOnScroll>

            <RevealOnScroll delay={300}>
              <div className="space-y-2">
                <Label htmlFor="babyName" className="font-ui text-[--cream]">
                  Baby&apos;s Name <span className="text-[--muted] font-normal">(optional)</span>
                </Label>
                <Input
                  id="babyName"
                  type="text"
                  placeholder="Leave blank if not decided yet"
                  value={babyName}
                  onChange={(e) => setBabyName(e.target.value)}
                  className="bg-[--bg] border-[--border] text-[--cream] placeholder:text-[--dim] focus:border-copper focus:ring-copper/20 font-body"
                />
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={400}>
              <MagneticButton className="w-full">
                <Button
                  className="w-full bg-copper hover:bg-copper-hover text-[--bg] font-ui font-semibold shadow-copper"
                  onClick={handleCreateFamily}
                  disabled={isLoading || !(stage === 'pregnancy' ? /^\d{4}-\d{2}-\d{2}$/.test(dueDate) : /^\d{4}-\d{2}-\d{2}$/.test(birthDate))}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Continue'
                  )}
                </Button>
              </MagneticButton>
            </RevealOnScroll>
          </div>
        </div>
      </Card3DTilt>
    </CardEntrance>
  )
}
