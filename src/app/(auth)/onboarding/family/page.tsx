'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Baby, Calendar } from 'lucide-react'

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
    if (!referenceDate) {
      setError('Please select a date')
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
      const familyData = family as { id: string; [key: string]: unknown } | null
      if (!familyData || !familyData.id) {
        throw new Error('Family creation failed - no ID returned')
      }

      // Generate tasks
      setIsGenerating(true)
      setProgress(10)

      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 15, 90))
      }, 500)

      const { error: taskError } = await supabase
        .rpc('generate_family_tasks', {
          p_family_id: familyData.id,
          p_due_date: stage === 'pregnancy' ? dueDate : undefined,
          p_birth_date: stage === 'post-birth' ? birthDate : undefined,
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
      <Card className="w-full max-w-md bg-surface-900 border-surface-800">
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-accent-500" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isGenerating) {
    return (
      <Card className="w-full max-w-md bg-surface-900 border-surface-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white">Setting up your timeline</CardTitle>
          <CardDescription>Generating personalized tasks...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-center text-surface-400">
              {progress < 50 ? 'Creating your family...' :
               progress < 90 ? 'Generating tasks...' :
               'Almost done...'}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md bg-surface-900 border-surface-800">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-white">Tell us about your journey</CardTitle>
        <CardDescription>We&apos;ll customize your timeline accordingly</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={stage} onValueChange={(v) => setStage(v as 'pregnancy' | 'post-birth')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pregnancy" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Expecting
            </TabsTrigger>
            <TabsTrigger value="post-birth" className="flex items-center gap-2">
              <Baby className="h-4 w-4" />
              Baby Born
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pregnancy" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-surface-800 border-surface-700"
              />
              <p className="text-xs text-surface-400">
                We&apos;ll calculate your current week and schedule tasks accordingly
              </p>
            </div>
          </TabsContent>

          <TabsContent value="post-birth" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="birthDate">Birth Date</Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="bg-surface-800 border-surface-700"
              />
              <p className="text-xs text-surface-400">
                Tasks will be scheduled based on your baby&apos;s age
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-2">
          <Label htmlFor="babyName">Baby&apos;s Name (optional)</Label>
          <Input
            id="babyName"
            type="text"
            placeholder="Leave blank if not decided yet"
            value={babyName}
            onChange={(e) => setBabyName(e.target.value)}
            className="bg-surface-800 border-surface-700"
          />
        </div>

        <Button
          className="w-full"
          onClick={handleCreateFamily}
          disabled={isLoading || (!dueDate && !birthDate)}
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
      </CardContent>
    </Card>
  )
}
