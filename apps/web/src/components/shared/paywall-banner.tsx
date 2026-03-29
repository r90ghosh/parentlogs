import { Button } from '@/components/ui/button'
import { Crown, Lock, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { PAYWALL_COPY } from '@tdc/shared/constants'

export interface PaywallBannerProps {
  feature: string
  message?: string
  description?: string
}

export function PaywallBanner({ feature, message, description }: PaywallBannerProps) {
  const copy = PAYWALL_COPY[feature]
  const headline = message || copy?.headline || 'Premium Feature'
  const body = description || copy?.body

  return (
    <div className="bg-[--card] border border-copper/25 rounded-2xl shadow-card overflow-hidden">
      {/* Left copper accent */}
      <div className="flex items-center gap-4 p-4 pl-0">
        <div className="w-1 self-stretch bg-gradient-to-b from-copper to-gold rounded-full ml-0 flex-shrink-0" />
        <div className="flex items-center justify-between gap-4 flex-1 pr-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-copper/15 flex-shrink-0">
              <Crown className="h-5 w-5 text-copper" />
            </div>
            <div className="min-w-0">
              <p className="font-ui font-semibold text-[--cream] text-sm truncate">
                {headline}
              </p>
              {body && (
                <p className="text-xs font-body text-[--muted] line-clamp-1">{body}</p>
              )}
            </div>
          </div>
          <Button
            asChild
            size="sm"
            className="bg-copper hover:bg-copper-hover text-[--bg] font-ui font-semibold flex-shrink-0 shadow-copper"
          >
            <Link href={`/upgrade?source=${feature}`}>
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Upgrade
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export function PaywallLock({ feature }: { feature: string }) {
  const copy = PAYWALL_COPY[feature]
  const label = copy?.headline || feature

  return (
    <div className="flex items-center gap-2 text-[--muted]">
      <Lock className="h-4 w-4 text-[--dim]" />
      <span className="text-sm font-body">{label} — Premium only</span>
    </div>
  )
}
