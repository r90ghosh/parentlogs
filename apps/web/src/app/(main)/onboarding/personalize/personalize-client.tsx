'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/components/user-provider'
import { useDadProfile, useUpsertDadProfile } from '@/hooks/use-dad-journey'
import { DAD_CONCERNS } from '@tdc/shared/constants'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function PersonalizeClient() {
  const router = useRouter()
  const { user } = useUser()
  const { data: dadProfile, isLoading } = useDadProfile(user.id)
  const upsertProfile = useUpsertDadProfile()

  const [selectedConcerns, setSelectedConcerns] = useState<string[]>(
    dadProfile?.concerns || []
  )
  const [workSituation, setWorkSituation] = useState<string>(
    dadProfile?.work_situation || ''
  )
  const [error, setError] = useState<string | null>(null)

  const toggleConcern = (key: string) => {
    setSelectedConcerns(prev =>
      prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key]
    )
  }

  const handleSave = async () => {
    setError(null)
    try {
      await upsertProfile.mutateAsync({
        userId: user.id,
        profile: {
          concerns: selectedConcerns,
          work_situation: workSituation || null,
        },
      })
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pb-24 md:pb-8">
        <div className="max-w-md mx-auto px-4 py-8 space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <div className="max-w-md mx-auto px-4 py-8 space-y-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-1 font-ui text-sm text-[--muted] hover:text-[--cream] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <Card className="bg-[--surface] border-[--border]">
          <CardHeader>
            <CardTitle className="font-display text-xl text-white">Personalize Your Experience</CardTitle>
            <CardDescription className="font-body">
              Tell us what&apos;s on your mind so we can tailor content to you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription className="font-body">{error}</AlertDescription>
              </Alert>
            )}

            {/* Concerns */}
            <div>
              <p className="font-ui font-semibold text-[11px] uppercase tracking-[0.12em] text-[--muted] mb-3">
                What&apos;s on your mind? (select all that apply)
              </p>
              <div className="grid grid-cols-2 gap-2">
                {DAD_CONCERNS.map(concern => (
                  <button
                    key={concern.key}
                    onClick={() => toggleConcern(concern.key)}
                    className={cn(
                      'flex items-center gap-2 p-3 rounded-lg font-body text-sm text-left transition-all border',
                      selectedConcerns.includes(concern.key)
                        ? 'border-copper bg-copper/10 text-white'
                        : 'border-[--border] bg-[--card] text-[--cream] hover:border-[--border-hover]'
                    )}
                  >
                    <span>{concern.emoji}</span>
                    <span>{concern.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Work Situation */}
            <div>
              <p className="font-ui font-semibold text-[11px] uppercase tracking-[0.12em] text-[--muted] mb-3">
                Work situation
              </p>
              <div className="space-y-2">
                {['Full-time office', 'Full-time remote', 'Hybrid', 'Part-time', 'Self-employed', 'Not working'].map(option => (
                  <button
                    key={option}
                    onClick={() => setWorkSituation(option)}
                    className={cn(
                      'w-full p-3 rounded-lg font-body text-sm text-left transition-all border',
                      workSituation === option
                        ? 'border-copper bg-copper/10 text-white'
                        : 'border-[--border] bg-[--card] text-[--cream] hover:border-[--border-hover]'
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <Button
              className="w-full font-ui font-semibold bg-copper hover:bg-copper/80"
              size="lg"
              onClick={handleSave}
              disabled={upsertProfile.isPending}
            >
              {upsertProfile.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save & Continue'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
