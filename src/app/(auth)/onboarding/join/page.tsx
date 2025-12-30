'use client'

import { useState, useEffect } from 'react'
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

export default function OnboardingJoin() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, refreshProfile } = useAuth()
  const supabase = createClient()

  const [inviteCode, setInviteCode] = useState(searchParams.get('code') || '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [familyInfo, setFamilyInfo] = useState<{ name?: string; stage: string } | null>(null)

  // Validate code as user types
  useEffect(() => {
    const validateCode = async () => {
      if (inviteCode.length !== 8) {
        setFamilyInfo(null)
        return
      }

      const { data, error } = await supabase
        .from('families')
        .select('name, stage')
        .eq('invite_code', inviteCode.toUpperCase())
        .single()

      if (!error && data) {
        setFamilyInfo(data)
        setError(null)
      } else {
        setFamilyInfo(null)
      }
    }

    const debounce = setTimeout(validateCode, 300)
    return () => clearTimeout(debounce)
  }, [inviteCode, supabase])

  const handleJoin = async () => {
    if (!user || !familyInfo) return

    setIsLoading(true)
    setError(null)

    try {
      // Get family ID
      const { data: family, error: familyError } = await supabase
        .from('families')
        .select('id')
        .eq('invite_code', inviteCode.toUpperCase())
        .single()

      if (familyError) throw new Error('Invalid invite code')

      // Update profile with family_id
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ family_id: family.id })
        .eq('id', user.id)

      if (profileError) throw profileError

      await refreshProfile()
      router.push('/onboarding/complete')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join family')
      setIsLoading(false)
    }
  }

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
