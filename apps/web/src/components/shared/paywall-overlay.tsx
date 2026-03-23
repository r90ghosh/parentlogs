'use client'

import { Button } from '@/components/ui/button'
import { Crown, Lock, X, Check, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { PAYWALL_COPY } from '@tdc/shared/constants'

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
      "absolute inset-0 bg-[--bg]/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg",
      className
    )}>
      <div className="text-center p-6 max-w-sm">
        {/* Crown icon */}
        <div className="mx-auto w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center mb-4">
          <Crown className="h-6 w-6 text-gold" />
        </div>

        <h3 className="font-display text-lg font-bold text-[--cream] mb-2">
          {headline}
        </h3>
        <p className="font-body text-sm text-[--muted] mb-5">
          {body}
        </p>

        {/* Feature list */}
        <div className="text-left mb-5 space-y-2 bg-[--card] border border-[--border] rounded-xl p-4">
          {PREMIUM_FEATURES.map(f => (
            <div key={f} className="flex items-center gap-2 text-xs font-body text-[--cream]">
              <Check className="h-3.5 w-3.5 text-copper flex-shrink-0" />
              {f}
            </div>
          ))}
        </div>

        {/* Primary CTA: Annual */}
        <Button asChild className="w-full bg-copper hover:bg-copper-hover text-[--bg] font-ui font-semibold shadow-copper mb-2">
          <Link href={`/upgrade?source=${feature}`}>
            <Sparkles className="h-4 w-4 mr-2" />
            Upgrade — $39.99/yr ($3.33/mo)
          </Link>
        </Button>

        {/* Secondary CTA: Monthly */}
        <Button
          asChild
          variant="outline"
          className="w-full border-[--border-hover] text-[--muted] hover:bg-[--card-hover] hover:text-[--cream] font-ui mb-3"
          size="sm"
        >
          <Link href={`/upgrade?source=${feature}`}>
            Or $4.99/month
          </Link>
        </Button>

        <p className="text-xs text-[--dim] font-body">30-day money-back guarantee</p>
      </div>
    </div>
  )
}

export function PaywallCard({ feature, description, interpolations }: PaywallOverlayProps) {
  const copy = PAYWALL_COPY[feature]
  const headline = copy?.headline || feature
  const body = description || (copy ? interpolateCopy(copy.body, interpolations) : undefined)

  return (
    <div className="relative p-6 bg-[--card] border border-[--border] rounded-2xl shadow-card">
      <div className="absolute top-3 right-3">
        <Lock className="h-4 w-4 text-[--dim]" />
      </div>
      <div className="text-center">
        <div className="mx-auto w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center mb-3">
          <Crown className="h-5 w-5 text-gold" />
        </div>
        <h3 className="font-ui font-semibold text-[--cream] mb-1">{headline}</h3>
        {body && (
          <p className="text-xs font-body text-[--muted] mb-3">{body}</p>
        )}
        <Button asChild size="sm" className="bg-copper hover:bg-copper-hover text-[--bg] font-ui font-semibold shadow-copper">
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[--bg]/70 backdrop-blur-sm p-4">
      <div className="relative bg-[--card] border border-[--border] rounded-2xl max-w-md w-full p-6 shadow-lift overflow-hidden">
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-copper via-gold to-copper" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[--card-hover] text-[--dim] hover:text-[--cream] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="text-center mb-5 mt-2">
          <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-br from-gold/30 to-copper/30 border border-gold/30 flex items-center justify-center mb-4">
            <Crown className="h-7 w-7 text-gold" />
          </div>
          <h2 className="font-display text-xl font-bold text-[--cream] mb-2">{headline}</h2>
          <p className="font-body text-sm text-[--muted]">{body}</p>
        </div>

        {/* Feature list */}
        <div className="mb-6 space-y-2.5 bg-[--card-hover] border border-[--border] rounded-xl p-4">
          {PREMIUM_FEATURES.map(f => (
            <div key={f} className="flex items-center gap-2.5 text-sm font-body text-[--cream]">
              <Check className="h-4 w-4 text-copper flex-shrink-0" />
              {f}
            </div>
          ))}
        </div>

        {/* Primary CTA: Annual */}
        <Button asChild className="w-full py-5 bg-copper hover:bg-copper-hover text-[--bg] font-ui font-semibold text-base shadow-copper mb-2">
          <Link href={`/upgrade?source=${feature}`}>
            <Sparkles className="h-5 w-5 mr-2" />
            Upgrade — $39.99/yr
          </Link>
        </Button>

        {/* Secondary CTA: Monthly */}
        <Button
          asChild
          variant="outline"
          className="w-full border-[--border-hover] text-[--muted] hover:bg-[--card-hover] hover:text-[--cream] font-ui"
          size="sm"
        >
          <Link href={`/upgrade?source=${feature}`}>
            Or $4.99/month
          </Link>
        </Button>

        {/* Maybe later */}
        <button
          onClick={onClose}
          className="w-full mt-3 text-center text-sm font-ui text-[--dim] hover:text-[--muted] transition-colors py-2"
        >
          Maybe later
        </button>
      </div>
    </div>
  )
}
