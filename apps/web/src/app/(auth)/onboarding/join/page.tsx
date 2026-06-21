'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Users, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Panel } from '@/components/digest'

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
      <Panel className="mx-auto flex w-full max-w-md items-center justify-center p-6 py-12 sm:p-8">
        <Loader2 className="h-6 w-6 animate-spin text-clay-ink" />
      </Panel>
    )
  }

  return (
    <Panel className="mx-auto w-full max-w-md p-6 sm:p-8">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-clay-soft">
          <Users className="h-6 w-6 text-clay-ink" />
        </div>
        <h1 className="text-[24px] font-extrabold tracking-[-0.3px] text-ink">Join your partner</h1>
        <p className="mt-2 text-[15px] leading-[1.6] text-mute">
          Enter the invite code shared by your partner
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {error && (
          <div className="rounded-xl border border-danger/40 bg-danger/10 px-3.5 py-2.5 text-[13px] font-semibold text-danger">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="inviteCode" className="mb-1.5 block text-[13px] font-bold text-ink2">
            Invite Code
          </label>
          <input
            id="inviteCode"
            type="text"
            placeholder="Enter code"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            maxLength={12}
            className="w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-center font-mono text-xl uppercase tracking-wider text-ink outline-none placeholder:text-faint focus:border-clay"
          />
        </div>

        {familyInfo && (
          <div className="flex items-center gap-2 rounded-xl border border-clay/40 bg-clay-soft px-3.5 py-2.5 text-[13px] font-semibold text-clay-ink">
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
            <span>
              Found family! Stage: {familyInfo.stage === 'pregnancy' ? 'Expecting' : 'Baby born'}
              {familyInfo.name && ` - ${familyInfo.name}`}
            </span>
          </div>
        )}

        <button
          type="button"
          className="flex w-full items-center justify-center rounded-xl bg-clay px-5 py-3 text-[15px] font-bold text-white hover:opacity-90 disabled:opacity-50"
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
        </button>
      </div>

      <div className="mt-6 flex justify-center">
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-1.5 text-[13px] font-bold text-clay-ink hover:opacity-80"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to options
        </Link>
      </div>
    </Panel>
  )
}

export default function OnboardingJoin() {
  return (
    <Suspense
      fallback={
        <Panel className="mx-auto flex w-full max-w-md items-center justify-center p-6 py-12 sm:p-8">
          <Loader2 className="h-6 w-6 animate-spin text-clay-ink" />
        </Panel>
      }
    >
      <OnboardingJoinContent />
    </Suspense>
  )
}
