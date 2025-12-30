'use client'

import { useState } from 'react'
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

export default function OnboardingFamily() {
  const router = useRouter()
  const { user, refreshProfile } = useAuth()
  const supabase = createClient()

  const [stage, setStage] = useState<'pregnancy' | 'post-birth'>('pregnancy')
  const [dueDate, setDueDate] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [babyName, setBabyName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

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
      // Create family
      const { data: family, error: familyError } = await supabase
        .from('families')
        .insert({
          owner_id: user.id,
          stage,
          due_date: stage === 'pregnancy' ? dueDate : null,
          birth_date: stage === 'post-birth' ? birthDate : null,
          baby_name: babyName || null,
        })
        .select()
        .single()

      if (familyError) throw familyError

      // Update profile with family_id
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ family_id: family.id })
        .eq('id', user.id)

      if (profileError) throw profileError

      // Generate tasks
      setIsGenerating(true)
      setProgress(10)

      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 15, 90))
      }, 500)

      const { data: taskCount, error: taskError } = await supabase
        .rpc('generate_family_tasks', {
          p_family_id: family.id,
          p_due_date: stage === 'pregnancy' ? dueDate : undefined,
          p_birth_date: stage === 'post-birth' ? birthDate : undefined,
        })

      clearInterval(progressInterval)

      if (taskError) throw taskError

      setProgress(100)
      await refreshProfile()

      // Small delay to show 100% progress
      setTimeout(() => {
        router.push('/onboarding/invite')
      }, 500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setIsLoading(false)
      setIsGenerating(false)
    }
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
