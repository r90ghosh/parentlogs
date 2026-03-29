'use client'

import { Users } from 'lucide-react'
import { cn } from '@/lib/utils'

export function InvitePartnerCard() {
  return (
    <div
      className={cn(
        'animate-fade-in-up rounded-[20px] p-5 card-sage-top',
        'bg-[--card]',
        'border border-[--border]',
        'shadow-card'
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-sage" />
          <span className="text-sm font-semibold font-ui text-[--cream]">Partner Sharing</span>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[9px] font-ui font-semibold uppercase tracking-[0.1em] bg-copper/15 text-copper border border-copper/25">
          Coming Soon
        </span>
      </div>

      <p className="text-xs font-body text-[--muted]">
        Share tasks and stay in sync with your partner. This feature is coming soon.
      </p>
    </div>
  )
}
