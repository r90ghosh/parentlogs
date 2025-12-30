'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Copy, Share2, Check, ArrowRight } from 'lucide-react'

export default function OnboardingInvite() {
  const router = useRouter()
  const { profile } = useAuth()
  const supabase = createClient()

  const [inviteCode, setInviteCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInviteCode = async () => {
      if (!profile?.family_id) return

      const { data, error } = await supabase
        .from('families')
        .select('invite_code')
        .eq('id', profile.family_id)
        .single()

      if (error) {
        setError(error.message)
      } else {
        setInviteCode(data.invite_code)
      }
    }

    fetchInviteCode()
  }, [profile?.family_id, supabase])

  const handleCopy = async () => {
    if (!inviteCode) return

    try {
      await navigator.clipboard.writeText(inviteCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('Failed to copy to clipboard')
    }
  }

  const handleShare = async () => {
    if (!inviteCode) return

    const shareData = {
      title: 'Join me on ParentLogs',
      text: `Join my family on ParentLogs! Use invite code: ${inviteCode}`,
      url: `${window.location.origin}/onboarding/join?code=${inviteCode}`,
    }

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        handleCopy()
      }
    } catch {
      // User cancelled share
    }
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
