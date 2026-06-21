'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, Loader2 } from 'lucide-react'
import { Panel } from '@/components/digest'

const features = [
  '200+ expert-curated tasks auto-loaded to your timeline',
  'Weekly briefings tailored to your stage',
  'Partner sync for seamless coordination',
  'Baby tracker with shift handoff',
]

function OnboardingWelcomeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check for invite code from URL param (cross-browser) or localStorage (same browser)
    const fromUrl = searchParams.get('invite')
    const fromStorage = localStorage.getItem('tdc_invite_code')
    const inviteCode = fromUrl || fromStorage

    if (inviteCode) {
      // Persist to localStorage so join page can read it
      localStorage.setItem('tdc_invite_code', inviteCode.toUpperCase())
      router.push('/onboarding/role?next=join')
    }
  }, [searchParams, router])

  return (
    <Panel className="mx-auto w-full max-w-md p-6 sm:p-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-[24px] font-extrabold leading-tight tracking-[-0.3px] text-ink">
          Welcome to The Dad Center
        </h1>
        <p className="mt-2 text-[15px] leading-[1.6] text-mute">
          Your parenting command center
        </p>
      </div>

      {/* Feature list */}
      <ul className="mb-8 space-y-3">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-clay-ink" />
            <span className="text-[15px] leading-[1.6] text-ink2">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTAs */}
      <div className="space-y-3">
        <button
          type="button"
          className="w-full rounded-xl bg-clay px-5 py-3 text-[15px] font-bold text-white hover:opacity-90 disabled:opacity-50"
          onClick={() => router.push('/onboarding/role')}
        >
          Get Started
        </button>
        <button
          type="button"
          className="w-full rounded-xl border border-line bg-card px-5 py-3 text-[15px] font-bold text-ink2 hover:border-faint"
          onClick={() => router.push('/onboarding/role?next=join')}
        >
          Join Partner&apos;s Family
        </button>
      </div>
    </Panel>
  )
}

export default function OnboardingWelcome() {
  return (
    <Suspense
      fallback={
        <Panel className="mx-auto flex w-full max-w-md items-center justify-center p-6 py-12 sm:p-8">
          <Loader2 className="h-6 w-6 animate-spin text-clay-ink" />
        </Panel>
      }
    >
      <OnboardingWelcomeContent />
    </Suspense>
  )
}
