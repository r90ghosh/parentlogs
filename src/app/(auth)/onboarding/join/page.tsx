'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Users, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

/**
 * Onboarding Join Page
 *
 * Allows user to join an existing family using invite code.
 * Protected by onboarding layout (server-side auth check).
 */
function OnboardingJoinContent() {
  console.log('[OnboardingJoin] ========== RENDER ==========')

  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const supabase = createClient()

  const [inviteCode, setInviteCode] = useState(searchParams.get('code') || '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [familyInfo, setFamilyInfo] = useState<{ name: string | null; stage: string | null } | null>(null)

  console.log('[OnboardingJoin] Current state:', {
    userId: user?.id || 'null',
    inviteCode,
    isLoading,
    familyInfo
  })

  // Wait for client-side auth state to sync
  const [isReady, setIsReady] = useState(false)
  useEffect(() => {
    console.log('[OnboardingJoin] useEffect - user changed:', user?.id || 'null')
    if (user) {
      console.log('[OnboardingJoin] User available, setting isReady=true')
      setIsReady(true)
    }
  }, [user])

  // Validate code as user types
  useEffect(() => {
    const validateCode = async () => {
      if (inviteCode.length !== 8) {
        setFamilyInfo(null)
        return
      }

      console.log('[OnboardingJoin] Validating invite code:', inviteCode)
      const { data, error } = await supabase
        .from('families')
        .select('name, stage')
        .eq('invite_code', inviteCode.toUpperCase())
        .single()

      if (!error && data) {
        console.log('[OnboardingJoin] Valid code, family found:', data)
        setFamilyInfo(data)
        setError(null)
      } else {
        console.log('[OnboardingJoin] Invalid code or error:', error)
        setFamilyInfo(null)
      }
    }

    const debounce = setTimeout(validateCode, 300)
    return () => clearTimeout(debounce)
  }, [inviteCode, supabase])

  const handleJoin = async () => {
    console.log('[OnboardingJoin] handleJoin called')
    if (!user || !familyInfo) {
      console.log('[OnboardingJoin] Cannot join - no user or familyInfo')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Get family ID
      console.log('[OnboardingJoin] Fetching family by invite code...')
      const { data: family, error: familyError } = await supabase
        .from('families')
        .select('id')
        .eq('invite_code', inviteCode.toUpperCase())
        .single()

      if (familyError) {
        console.error('[OnboardingJoin] Family fetch error:', familyError)
        throw new Error('Invalid invite code')
      }
      console.log('[OnboardingJoin] Family found:', family.id)

      // Update profile with family_id
      console.log('[OnboardingJoin] Updating profile with family_id...')
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ family_id: family.id })
        .eq('id', user.id)

      if (profileError) {
        console.error('[OnboardingJoin] Profile update error:', profileError)
        throw profileError
      }
      console.log('[OnboardingJoin] Profile updated, navigating to /onboarding/complete')

      router.push('/onboarding/complete')
    } catch (err) {
      console.error('[OnboardingJoin] Error:', err)
      setError(err instanceof Error ? err.message : 'Failed to join family')
      setIsLoading(false)
    }
  }

  // Brief wait for client-side auth sync
  if (!isReady) {
    console.log('[OnboardingJoin] Not ready yet, showing loader')
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

  console.log('[OnboardingJoin] Rendering join form')

  return (
    <Card className="w-full max-w-md bg-surface-900 border-surface-800">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary-500/20 flex items-center justify-center">
          <Users className="h-6 w-6 text-primary-500" />
        </div>
        <CardTitle className="text-2xl text-white">Join your partner</CardTitle>
        <CardDescription>
          Enter the invite code shared by your partner
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="inviteCode">Invite Code</Label>
          <Input
            id="inviteCode"
            type="text"
            placeholder="ABCD1234"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            maxLength={8}
            className="bg-surface-800 border-surface-700 text-center text-xl font-mono tracking-wider uppercase"
          />
        </div>

        {familyInfo && (
          <Alert className="bg-accent-900/20 border-accent-700">
            <CheckCircle className="h-4 w-4 text-accent-500" />
            <AlertDescription className="text-accent-300">
              Found family! Stage: {familyInfo.stage === 'pregnancy' ? 'Expecting' : 'Baby born'}
              {familyInfo.name && ` - ${familyInfo.name}`}
            </AlertDescription>
          </Alert>
        )}

        <Button
          className="w-full"
          onClick={handleJoin}
          disabled={!familyInfo || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Joining...
            </>
          ) : (
            'Join Family'
          )}
        </Button>
      </CardContent>
      <CardFooter className="justify-center">
        <Link
          href="/onboarding"
          className="text-sm text-surface-400 hover:text-surface-300 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to options
        </Link>
      </CardFooter>
    </Card>
  )
}

export default function OnboardingJoin() {
  return (
    <Suspense fallback={
      <Card className="w-full max-w-md bg-surface-900 border-surface-800">
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-accent-500" />
          </div>
        </CardContent>
      </Card>
    }>
      <OnboardingJoinContent />
    </Suspense>
  )
}
