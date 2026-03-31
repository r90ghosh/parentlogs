'use client'

import { Users, CheckCircle2, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PartnerActivity } from '@tdc/shared/types/dashboard'

interface PartnerActivityCardProps {
  partner: PartnerActivity | null
}

export function PartnerActivityCard({ partner }: PartnerActivityCardProps) {
  if (!partner) {
    return (
      <div
        className={cn(
          'rounded-2xl p-5',
          'bg-[--card]',
          'border border-[--border]'
        )}
      >
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-4 w-4 text-[--muted]" />
          <span className="text-sm font-semibold font-ui text-[--cream]">Partner Activity</span>
        </div>
        <div className="text-center py-4">
          <p className="text-xs font-body text-[--muted]">
            Invite your partner to see their activity here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'rounded-2xl p-5',
        'bg-[--card]',
        'border border-[--border]'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-copper" />
          <span className="text-sm font-semibold font-ui text-[--cream]">Partner Activity</span>
        </div>
        {partner.isSynced && (
          <span className="text-[10px] font-ui text-sage uppercase tracking-wider">Synced</span>
        )}
      </div>

      {/* Partner info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-9 w-9 rounded-full bg-copper/20 flex items-center justify-center shrink-0">
          <span className="font-display text-sm font-bold text-copper">{partner.initial}</span>
        </div>
        <div className="min-w-0">
          <p className="font-body text-sm font-medium text-[--cream] truncate">{partner.name}</p>
          <p className="font-body text-xs text-[--muted]">{partner.lastActive}</p>
        </div>
      </div>

      {/* Recent tasks */}
      {partner.recentTasks.length > 0 && (
        <div className="space-y-2">
          {partner.recentTasks.map((task, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[--card-hover]/50"
            >
              {task.status === 'completed' ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-sage shrink-0" />
              ) : (
                <Clock className="h-3.5 w-3.5 text-sky shrink-0" />
              )}
              <span className="font-body text-xs text-[--cream] truncate flex-1">{task.title}</span>
              <span className="font-ui text-[10px] text-[--dim] shrink-0">{task.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
