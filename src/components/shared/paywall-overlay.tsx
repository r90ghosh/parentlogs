'use client'

import { Button } from '@/components/ui/button'
import { Crown, Lock, X, Check, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { PAYWALL_COPY } from '@/lib/paywall-copy'

export interface PaywallOverlayProps {
  feature: string
  message?: string
  description?: string
  className?: string
  /** Optional dynamic values to interpolate into copy */
  interpolations?: Record<string, string | number>
}

const PREMIUM_FEATURES = [
  'Full task timeline (pregnancy → 24 months)',
  'All weekly briefings',
  'Push notifications & reminders',
  'Partner sync & coordination',
  'Advanced tracker & mood trends',
  'Complete budget planner',
]

function interpolateCopy(text: string, values?: Record<string, string | number>): string {
  if (!values) return text
  return text.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? `{${key}}`))
}

export function PaywallOverlay({ feature, message, description, className, interpolations }: PaywallOverlayProps) {
  const copy = PAYWALL_COPY[feature]
  const headline = message || copy?.headline || 'Premium Feature'
  const body = description || (copy ? interpolateCopy(copy.body, interpolations) : `Upgrade to Premium to access this feature.`)

  return (
    <div className={cn(
      "absolute inset-0 bg-surface-950/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg",
      className
    )}>
      <div className="text-center p-6 max-w-sm">
        <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center mb-4">
          <Crown className="h-6 w-6 text-amber-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">
          {headline}
        </h3>
        <p className="text-sm text-surface-400 mb-5">
          {body}
        </p>

        {/* Feature list */}
        <div className="text-left mb-5 space-y-2">
          {PREMIUM_FEATURES.map(f => (
            <div key={f} className="flex items-center gap-2 text-xs text-zinc-300">
              <Check className="h-3.5 w-3.5 text-accent-500 flex-shrink-0" />
              {f}
            </div>
          ))}
        </div>

        {/* Primary CTA: Annual */}
        <Button asChild className="w-full bg-accent-500 hover:bg-accent-600 text-white mb-2">
          <Link href={`/upgrade?source=${feature}`}>
            <Sparkles className="h-4 w-4 mr-2" />
            Upgrade — $39.99/yr ($3.33/mo)
          </Link>
        </Button>

        {/* Secondary CTA: Monthly */}
        <Button asChild variant="outline" className="w-full border-surface-700 text-zinc-400 hover:bg-surface-800 mb-3" size="sm">
          <Link href={`/upgrade?source=${feature}`}>
            Or $4.99/month
          </Link>
        </Button>

        {/* Dismiss - not always available for overlays, but available for modals */}
        <p className="text-xs text-zinc-600">30-day money-back guarantee</p>
      </div>
    </div>
  )
}

export function PaywallCard({ feature, description, interpolations }: PaywallOverlayProps) {
  const copy = PAYWALL_COPY[feature]
  const headline = copy?.headline || feature
  const body = description || (copy ? interpolateCopy(copy.body, interpolations) : undefined)

  return (
    <div className="relative p-6 bg-surface-900 border border-surface-800 rounded-lg">
      <div className="absolute top-3 right-3">
        <Lock className="h-4 w-4 text-surface-500" />
      </div>
      <div className="text-center">
        <div className="mx-auto w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center mb-3">
          <Crown className="h-5 w-5 text-amber-400" />
        </div>
        <h3 className="font-medium text-white mb-1">{headline}</h3>
        {body && (
          <p className="text-xs text-surface-400 mb-3">{body}</p>
        )}
        <Button asChild size="sm" className="bg-accent-500 hover:bg-accent-600 text-white">
          <Link href={`/upgrade?source=${feature}`}>
            Upgrade — $3.33/mo
          </Link>
        </Button>
      </div>
    </div>
  )
}

export function PaywallModal({
  feature,
  onClose,
  interpolations,
}: {
  feature: string
  onClose: () => void
  interpolations?: Record<string, string | number>
}) {
  const copy = PAYWALL_COPY[feature]
  const headline = copy?.headline || 'Premium Feature'
  const body = copy ? interpolateCopy(copy.body, interpolations) : 'Upgrade to unlock this feature.'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative bg-surface-900 border border-surface-800 rounded-2xl max-w-md w-full p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="text-center mb-5">
          <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4">
            <Crown className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">{headline}</h2>
          <p className="text-sm text-zinc-400">{body}</p>
        </div>

        {/* Feature list */}
        <div className="mb-6 space-y-2.5">
          {PREMIUM_FEATURES.map(f => (
            <div key={f} className="flex items-center gap-2.5 text-sm text-zinc-300">
              <Check className="h-4 w-4 text-accent-500 flex-shrink-0" />
              {f}
            </div>
          ))}
        </div>

        {/* Primary CTA: Annual */}
        <Button asChild className="w-full py-5 bg-accent-500 hover:bg-accent-600 text-white text-base mb-2">
          <Link href={`/upgrade?source=${feature}`}>
            <Sparkles className="h-5 w-5 mr-2" />
            Upgrade — $39.99/yr
          </Link>
        </Button>

        {/* Secondary CTA: Monthly */}
        <Button asChild variant="outline" className="w-full border-surface-700 text-zinc-400 hover:bg-surface-800" size="sm">
          <Link href={`/upgrade?source=${feature}`}>
            Or $4.99/month
          </Link>
        </Button>

        {/* Maybe later */}
        <button
          onClick={onClose}
          className="w-full mt-3 text-center text-sm text-zinc-600 hover:text-zinc-400 transition-colors py-2"
        >
          Maybe later
        </button>
      </div>
    </div>
  )
}
