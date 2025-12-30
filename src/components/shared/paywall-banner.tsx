'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Crown, Lock } from 'lucide-react'
import Link from 'next/link'

export interface PaywallBannerProps {
  feature: string
  message?: string
  description?: string
}

export function PaywallBanner({ feature, message, description }: PaywallBannerProps) {
  const displayMessage = message || description

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
                Premium Feature
              </p>
              {displayMessage && (
                <p className="text-xs text-surface-400">{displayMessage}</p>
              )}
            </div>
          </div>
          <Button asChild size="sm" className="bg-amber-500 hover:bg-amber-600 text-black">
            <Link href="/settings/subscription">
              Upgrade
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function PaywallLock({ feature }: { feature: string }) {
  return (
    <div className="flex items-center gap-2 text-surface-400">
      <Lock className="h-4 w-4" />
      <span className="text-sm">{feature} - Premium only</span>
    </div>
  )
}
