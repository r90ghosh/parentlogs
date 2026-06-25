'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useCheckout, useIsPremium } from '@/hooks/use-subscription'
import { subscriptionService } from '@/lib/services'
import { PRICING, type PricingPlan } from '@/lib/stripe/checkout'
import { Check, Crown, Loader2, ArrowLeft, X } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Panel, Badge } from '@/components/digest'

function UpgradeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const canceled = searchParams.get('canceled')

  const { isPremium, tier, isLoading: tierLoading } = useIsPremium()
  const { checkout, isCheckingOut, checkoutError } = useCheckout()
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan>('yearly')

  const features = subscriptionService.getFeatureList()

  if (tierLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-clay-ink" />
      </div>
    )
  }

  if (isPremium) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-[--gold]/15">
          <Crown className="h-8 w-8 text-[--gold]" />
        </span>
        <h2 className="text-[26px] font-extrabold text-ink">You&apos;re already Premium</h2>
        <p className="mt-2 text-[15px] text-ink2">
          {tier === 'lifetime'
            ? 'You have lifetime access to all premium features.'
            : 'You have full access to all premium features.'}
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-clay px-5 py-3 text-[15px] font-bold text-white hover:opacity-90"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    )
  }

  const handleCheckout = () => {
    checkout(selectedPlan)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Top bar */}
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[14px] font-bold text-mute transition-colors hover:text-clay-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <span className="text-[12.5px] font-bold uppercase tracking-[0.8px] text-clay-ink">
          The Dad Center Premium
        </span>
        <span className="w-12" />
      </div>

      {/* Alerts */}
      {canceled && (
        <Panel className="mb-6 flex items-center gap-3 p-4">
          <X className="h-4 w-4 flex-none text-[--gold]" />
          <p className="text-[14px] text-ink2">
            Checkout was canceled. You can try again when you&apos;re ready.
          </p>
        </Panel>
      )}

      {checkoutError && (
        <Panel className="mb-6 flex items-center gap-3 border-danger/40 p-4">
          <X className="h-4 w-4 flex-none text-danger" />
          <p className="text-[14px] text-ink2">{checkoutError}</p>
        </Panel>
      )}

      {/* Hero */}
      <div className="mb-10 text-center">
        <h1 className="text-[30px] font-extrabold leading-tight text-ink">
          Unlock your full parenting potential
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-[15px] text-ink2">
          Get complete access to all features, unlimited history, and premium content to support your parenting journey.
        </p>
        <p className="mt-2 text-[13px] text-mute">
          One subscription per family — both partners share access.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="mb-10 grid gap-5 md:grid-cols-3" role="radiogroup" aria-label="Select a pricing plan">
        {/* Monthly */}
        <div
          role="radio"
          aria-checked={selectedPlan === 'monthly'}
          tabIndex={0}
          className={cn(
            'cursor-pointer rounded-[20px] border bg-card p-6 shadow-[var(--shadow)] transition-colors',
            selectedPlan === 'monthly' ? 'border-clay' : 'border-line hover:border-faint'
          )}
          onClick={() => setSelectedPlan('monthly')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedPlan('monthly') } }}
        >
          <h3 className="text-[18px] font-extrabold text-ink">Monthly</h3>
          <p className="mt-0.5 text-[13px] text-mute">Flexible month-to-month</p>
          <div className="mt-4">
            <span className="text-[32px] font-extrabold text-ink">$4.99</span>
            <span className="text-[14px] text-mute">/mo</span>
          </div>
          <p className="mt-2 text-[13px] font-bold text-[--sage]">1 month free trial</p>
          <ul className="mt-5 space-y-2.5">
            <li className="flex items-center gap-2 text-[15px] text-ink2">
              <Check className="h-4 w-4 flex-none text-[--sage]" />
              All premium features
            </li>
            <li className="flex items-center gap-2 text-[15px] text-ink2">
              <Check className="h-4 w-4 flex-none text-[--sage]" />
              Cancel anytime
            </li>
          </ul>
        </div>

        {/* Yearly - Most popular */}
        <div
          role="radio"
          aria-checked={selectedPlan === 'yearly'}
          tabIndex={0}
          className={cn(
            'cursor-pointer rounded-[20px] border border-l-[3px] bg-card p-6 shadow-[var(--shadow)] transition-colors',
            selectedPlan === 'yearly' ? 'border-clay border-l-clay' : 'border-line border-l-clay hover:border-faint'
          )}
          onClick={() => setSelectedPlan('yearly')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedPlan('yearly') } }}
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[18px] font-extrabold text-ink">Yearly</h3>
            <Badge tone="clay">Most popular</Badge>
          </div>
          <p className="-mt-2 mb-1 text-[13px] text-mute">Best for new parents</p>
          <div className="mt-3">
            <span className="text-[32px] font-extrabold text-ink">$39.99</span>
            <span className="text-[14px] text-mute">/yr</span>
          </div>
          <p className="mt-2 text-[13px] font-bold text-[--sage]">1 month free trial</p>
          <p className="mt-1 text-[13px] font-bold text-clay-ink">Just $3.33/mo — Save 33%</p>
          <ul className="mt-5 space-y-2.5">
            <li className="flex items-center gap-2 text-[15px] text-ink2">
              <Check className="h-4 w-4 flex-none text-[--sage]" />
              All premium features
            </li>
            <li className="flex items-center gap-2 text-[15px] text-ink2">
              <Check className="h-4 w-4 flex-none text-[--sage]" />
              Priority support
            </li>
          </ul>
        </div>

        {/* Lifetime - Best value */}
        <div
          role="radio"
          aria-checked={selectedPlan === 'lifetime'}
          tabIndex={0}
          className={cn(
            'cursor-pointer rounded-[20px] border border-l-[3px] bg-card p-6 shadow-[var(--shadow)] transition-colors',
            selectedPlan === 'lifetime' ? 'border-clay border-l-clay' : 'border-line border-l-clay hover:border-faint'
          )}
          onClick={() => setSelectedPlan('lifetime')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedPlan('lifetime') } }}
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-[18px] font-extrabold text-ink">
              <Crown className="h-5 w-5 text-[--gold]" />
              Lifetime
            </h3>
            <Badge tone="gold">Best value</Badge>
          </div>
          <p className="-mt-2 mb-1 text-[13px] text-mute">One-time payment</p>
          <div className="mt-3">
            <span className="text-[32px] font-extrabold text-ink">$99.99</span>
            <span className="text-[14px] text-mute"> once</span>
          </div>
          <p className="mt-2 text-[13px] font-bold text-clay-ink">Never pay again</p>
          <ul className="mt-5 space-y-2.5">
            <li className="flex items-center gap-2 text-[15px] text-ink2">
              <Check className="h-4 w-4 flex-none text-[--sage]" />
              All premium features forever
            </li>
            <li className="flex items-center gap-2 text-[15px] text-ink2">
              <Check className="h-4 w-4 flex-none text-[--sage]" />
              All future updates included
            </li>
          </ul>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mb-12 text-center">
        <button
          onClick={handleCheckout}
          disabled={isCheckingOut}
          className="inline-flex items-center gap-2 rounded-xl bg-clay px-8 py-3.5 text-[15px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isCheckingOut ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>{selectedPlan === 'lifetime' ? 'Get Lifetime access' : 'Start 1-month free trial'}</>
          )}
        </button>
        {selectedPlan !== 'lifetime' && (
          <p className="mt-3 text-[13px] font-bold text-clay-ink">
            1 month free, then {selectedPlan === 'yearly' ? '$39.99/yr' : '$4.99/mo'}. Cancel anytime.
          </p>
        )}
        <p className="mt-1 text-[13px] text-mute">Secure payment powered by Stripe</p>
      </div>

      {/* Feature Comparison */}
      <Panel className="overflow-hidden">
        <div className="border-b border-line2 px-6 py-5">
          <h2 className="text-center text-[18px] font-extrabold text-ink">Compare plans</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line2">
                <th className="px-6 py-3 text-left text-[12px] font-bold uppercase tracking-[0.8px] text-mute">Feature</th>
                <th className="px-4 py-3 text-center text-[12px] font-bold uppercase tracking-[0.8px] text-mute">Free</th>
                <th className="px-4 py-3 text-center text-[12px] font-bold uppercase tracking-[0.8px] text-clay-ink">Premium</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={index} className="border-b border-line2 transition-colors last:border-b-0 hover:bg-card-hover">
                  <td className="px-6 py-3 text-[15px] text-ink2">{feature.name}</td>
                  <td className="px-4 py-3 text-center">
                    {feature.free ? (
                      <Check className="mx-auto h-4 w-4 text-[--sage]" />
                    ) : (
                      <X className="mx-auto h-4 w-4 text-faint" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Check className="mx-auto h-4 w-4 text-[--sage]" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Trust signals */}
      <div className="mt-10 space-y-1.5 text-center text-[13px] text-mute">
        <p>Questions? Contact us at info@thedadcenter.com</p>
        <p>Cancel anytime before your 1-month trial ends and you won&apos;t be charged</p>
      </div>
    </div>
  )
}

export function UpgradeClient() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-clay-ink" />
      </div>
    }>
      <UpgradeContent />
    </Suspense>
  )
}
