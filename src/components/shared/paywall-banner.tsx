'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Crown, Lock, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { PAYWALL_COPY } from '@/lib/paywall-copy'

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
    <Card className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 border-amber-500/30">
      <CardContent className="py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20">
              <Crown className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="font-medium text-white text-sm">
                {headline}
              </p>
              {body && (
                <p className="text-xs text-surface-400 line-clamp-1">{body}</p>
              )}
            </div>
          </div>
          <Button asChild size="sm" className="bg-accent-500 hover:bg-accent-600 text-white flex-shrink-0">
            <Link href={`/upgrade?source=${feature}`}>
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Upgrade
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function PaywallLock({ feature }: { feature: string }) {
  const copy = PAYWALL_COPY[feature]
  const label = copy?.headline || feature

  return (
    <div className="flex items-center gap-2 text-surface-400">
      <Lock className="h-4 w-4" />
      <span className="text-sm">{label} — Premium only</span>
    </div>
  )
}
