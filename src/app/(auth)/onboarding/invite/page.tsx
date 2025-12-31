'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Copy, Share2, Check, ArrowRight, Loader2 } from 'lucide-react'

/**
 * Onboarding Invite Page
 *
 * Shows the family invite code for sharing with partner.
 * Protected by onboarding layout (server-side auth check).
 */
export default function OnboardingInvite() {
  console.log('[OnboardingInvite] ========== RENDER ==========')

  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClient()

  const [inviteCode, setInviteCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  console.log('[OnboardingInvite] Current state:', {
    userId: user?.id || 'null',
    inviteCode,
    isLoading,
    error
  })

  useEffect(() => {
    const fetchInviteCode = async () => {
      console.log('[OnboardingInvite] fetchInviteCode called, userId:', user?.id || 'null')
      if (!user) {
        console.log('[OnboardingInvite] No user yet, waiting...')
        return
      }

      try {
        // First get the profile to get family_id
        console.log('[OnboardingInvite] Fetching profile...')
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('family_id')
          .eq('id', user.id)
          .single()

        if (profileError) {
          console.error('[OnboardingInvite] Profile fetch error:', profileError)
        }

        if (profileError || !profile?.family_id) {
          console.log('[OnboardingInvite] No family_id found')
          setError('Family not found')
          setIsLoading(false)
          return
        }

        console.log('[OnboardingInvite] Found family_id:', profile.family_id)

        // Then get the family invite code
        console.log('[OnboardingInvite] Fetching family invite code...')
        const { data: family, error: familyError } = await supabase
          .from('families')
          .select('invite_code')
          .eq('id', profile.family_id)
          .single()

        if (familyError) {
          console.error('[OnboardingInvite] Family fetch error:', familyError)
          setError(familyError.message)
        } else {
          console.log('[OnboardingInvite] Got invite code:', family.invite_code)
          setInviteCode(family.invite_code)
        }
      } catch (err) {
        console.error('[OnboardingInvite] Error:', err)
        setError(err instanceof Error ? err.message : 'Failed to load invite code')
      } finally {
        setIsLoading(false)
      }
    }

    fetchInviteCode()
  }, [user, supabase])

  const handleCopy = async () => {
    console.log('[OnboardingInvite] handleCopy called')
    if (!inviteCode) return

    try {
      await navigator.clipboard.writeText(inviteCode)
      console.log('[OnboardingInvite] Code copied to clipboard')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('[OnboardingInvite] Copy failed:', err)
      setError('Failed to copy to clipboard')
    }
  }

  const handleShare = async () => {
    console.log('[OnboardingInvite] handleShare called')
    if (!inviteCode) return

    const shareData = {
      title: 'Join me on ParentLogs',
      text: `Join my family on ParentLogs! Use invite code: ${inviteCode}`,
      url: `${window.location.origin}/onboarding/join?code=${inviteCode}`,
    }

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        console.log('[OnboardingInvite] Using native share')
        await navigator.share(shareData)
      } else {
        console.log('[OnboardingInvite] Native share not available, copying instead')
        handleCopy()
      }
    } catch (err) {
      console.log('[OnboardingInvite] Share cancelled or failed:', err)
      // User cancelled share
    }
  }

  if (isLoading) {
    console.log('[OnboardingInvite] Showing loading state')
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

  return (
    <Card className="w-full max-w-md bg-surface-900 border-surface-800">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-white">Invite your partner</CardTitle>
        <CardDescription>
          Share this code so they can join your family
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-surface-800 rounded-lg p-6 text-center">
          <p className="text-sm text-surface-400 mb-2">Invite Code</p>
          <p className="text-3xl font-mono font-bold text-white tracking-wider">
            {inviteCode || '--------'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={handleCopy}
            disabled={!inviteCode}
            className="flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Code
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleShare}
            disabled={!inviteCode}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>

        <div className="text-center text-sm text-surface-400">
          <p>Your partner can enter this code after signing up</p>
        </div>

        <div className="space-y-2">
          <Button
            className="w-full"
            onClick={() => router.push('/onboarding/complete')}
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className="w-full text-surface-400"
            onClick={() => router.push('/onboarding/complete')}
          >
            Skip for now
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
