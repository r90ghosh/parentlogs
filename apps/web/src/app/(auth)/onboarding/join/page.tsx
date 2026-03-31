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
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const supabase = createClient()

  const [inviteCode, setInviteCode] = useState(() => {
    const fromUrl = searchParams.get('code')
    if (fromUrl) return fromUrl
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tdc_invite_code') || ''
    }
    return ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [familyInfo, setFamilyInfo] = useState<{ name: string | null; stage: string | null } | null>(null)

  // Wait for client-side auth state to sync
  const [isReady, setIsReady] = useState(false)
  useEffect(() => {
    if (user) {
      setIsReady(true)
    }
  }, [user])

  // Validate code as user types
  useEffect(() => {
    const validateCode = async () => {
      if (inviteCode.length !== 8 && inviteCode.length !== 12) {
        setFamilyInfo(null)
        return
      }

      const { data, error } = await supabase.rpc('lookup_family_by_invite', {
        p_code: inviteCode,
      })

      if (!error && data && data.length > 0) {
        setFamilyInfo({ name: data[0].family_name, stage: data[0].family_stage })
        setError(null)
      } else {
        setFamilyInfo(null)
      }
    }

    const debounce = setTimeout(validateCode, 300)
    return () => clearTimeout(debounce)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inviteCode])

  const handleJoin = async () => {
    if (!user || !familyInfo) return

    setIsLoading(true)
    setError(null)

    try {
      const { data, error: joinError } = await supabase.rpc('join_family', {
        p_invite_code: inviteCode,
      })

      if (joinError) {
        throw new Error(joinError.message)
      }

      // Clear stored invite code from deep link
      localStorage.removeItem('tdc_invite_code')

      // Notify family owner that partner joined (fire-and-forget)
      fetch('/api/partner-joined', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => {})

      router.push('/onboarding/complete')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join family')
      setIsLoading(false)
    }
  }

  // Brief wait for client-side auth sync
  if (!isReady) {
    return (
      <Card className="w-full max-w-md bg-[--surface] border-[--border]">
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-copper" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md bg-[--surface] border-[--border]">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary-500/20 flex items-center justify-center">
          <Users className="h-6 w-6 text-primary-500" />
        </div>
        <CardTitle className="text-2xl font-display text-[--cream]">Join your partner</CardTitle>
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
            placeholder="Enter code"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            maxLength={12}
            className="bg-[--card] border-[--border-hover] text-center text-xl font-mono tracking-wider uppercase"
          />
        </div>

        {familyInfo && (
          <Alert className="bg-copper-dim border-copper/50">
            <CheckCircle className="h-4 w-4 text-copper" />
            <AlertDescription className="text-copper">
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
          className="text-sm text-[--muted] hover:text-[--cream] flex items-center gap-2"
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
      <Card className="w-full max-w-md bg-[--surface] border-[--border]">
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-copper" />
          </div>
        </CardContent>
      </Card>
    }>
      <OnboardingJoinContent />
    </Suspense>
  )
}
