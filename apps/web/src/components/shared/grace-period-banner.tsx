'use client'

import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useGracePeriodStatus } from '@/hooks/use-subscription'

export function GracePeriodBanner() {
  const { isInGracePeriod, daysRemaining, expiresAt } = useGracePeriodStatus()

  const now = useMemo(() => Date.now(), [])

  if (!isInGracePeriod || !expiresAt) return null

  const expiry = new Date(expiresAt)
  const daysSinceExpiry = Math.floor(
    (now - expiry.getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="bg-[--card] border border-coral/25 rounded-2xl shadow-card overflow-hidden mx-4 mt-4">
      <div className="flex items-center gap-4 p-4 pl-0">
        <div className="w-1 self-stretch bg-gradient-to-b from-coral to-gold rounded-full ml-0 flex-shrink-0" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 flex-1 pr-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-coral/15 flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-coral" />
            </div>
            <div className="min-w-0">
              <p className="font-ui font-semibold text-[--cream] text-sm">
                Your subscription expired {daysSinceExpiry === 0 ? 'today' : `${daysSinceExpiry} day${daysSinceExpiry === 1 ? '' : 's'} ago`}
              </p>
              <p className="text-xs font-body text-[--muted]">
                {daysRemaining} day{daysRemaining === 1 ? '' : 's'} remaining before access is restricted
              </p>
            </div>
          </div>
          <Button
            asChild
            size="sm"
            className="bg-copper hover:bg-copper-hover text-[--bg] font-ui font-semibold flex-shrink-0 shadow-copper"
          >
            <Link href="/upgrade?source=grace_period">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Renew
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
