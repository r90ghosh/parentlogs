'use client'

import { cn } from '@/lib/utils'
import { PartnerActivity } from '@tdc/shared/types/dashboard'

interface PartnerActivityCardProps {
  partner: PartnerActivity | null
}

// Coming Soon gate — revert this component from git when partner sharing is ready
export function PartnerActivityCard({ partner }: PartnerActivityCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl p-5',
        'bg-[--card]',
        'border border-[--border]'
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-[--cream]">Partner Activity</span>
        <span className="px-2 py-0.5 rounded-full text-[9px] font-ui font-semibold uppercase tracking-[0.1em] bg-copper/15 text-copper border border-copper/25">
          Coming Soon
        </span>
      </div>
      <div className="text-center py-6">
        <div className="text-2xl mb-2">&#x1F491;</div>
        <p className="text-xs font-body text-[--muted]">
          See what your partner has been working on — launching soon.
        </p>
      </div>
    </div>
  )
}
