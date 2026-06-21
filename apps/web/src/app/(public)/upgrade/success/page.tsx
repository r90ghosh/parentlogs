'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Users, CheckCircle } from 'lucide-react'
import { BrandLogo } from '@/components/digest'

const UNLOCKED_FEATURES = [
  { label: 'Full task timeline', detail: 'Pregnancy through 24 months' },
  { label: 'All weekly briefings', detail: '40+ weeks of guidance' },
  { label: 'Push notifications', detail: 'Never miss a task or briefing' },
  { label: 'Partner sync', detail: 'Real-time coordination' },
  { label: 'Advanced tracker', detail: 'All log types + history' },
  { label: 'Complete budget planner', detail: 'Full access' },
  { label: 'Mood trends & insights', detail: 'Pattern analysis' },
]

export default function UpgradeSuccessPage() {
  const router = useRouter()

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <BrandLogo showWordmark={false} size={56} className="justify-center" />

      <h1 className="mt-6 text-[26px] font-extrabold text-ink">You&apos;re in</h1>
      <p className="mt-2 text-[15px] text-ink2">
        You&apos;ve unlocked the full Dad Center experience.
      </p>

      {/* What's unlocked */}
      <div className="mt-8 rounded-[20px] border border-line bg-card p-6 text-left shadow-[var(--shadow)]">
        <div className="mb-4 text-[11px] font-bold uppercase tracking-[1.5px] text-faint">
          What&apos;s now unlocked
        </div>
        <div className="space-y-3">
          {UNLOCKED_FEATURES.map((feature) => (
            <div key={feature.label} className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 flex-none text-[--sage]" />
              <div className="min-w-0 flex-1">
                <span className="text-[15px] text-ink">{feature.label}</span>
                <span className="ml-2 text-[12.5px] text-mute">{feature.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="mt-6 space-y-3">
        <button
          onClick={() => router.push('/dashboard')}
          className="w-full rounded-xl bg-clay px-5 py-3 text-[15px] font-bold text-white transition-opacity hover:opacity-90"
        >
          Continue
        </button>
        <Link
          href="/settings/family"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-card px-5 py-3 text-[15px] font-bold text-ink2 transition-colors hover:bg-card-hover"
        >
          <Users className="h-4 w-4" />
          Invite your partner
        </Link>
      </div>

      <p className="mt-6 text-[12.5px] text-mute">Free for 30 days — no credit card needed</p>
    </div>
  )
}
