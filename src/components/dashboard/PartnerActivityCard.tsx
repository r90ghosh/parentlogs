'use client'

import { cn } from '@/lib/utils'
import { PartnerActivity } from '@/types/dashboard'
import { useIsPremium } from '@/hooks/use-subscription'
import { PaywallBanner } from '@/components/shared/paywall-banner'

interface PartnerActivityCardProps {
  partner: PartnerActivity | null
}

export function PartnerActivityCard({ partner }: PartnerActivityCardProps) {
  const { isPremium, isLoading } = useIsPremium()

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
          <span className="text-sm font-semibold text-[--cream]">Partner Activity</span>
        </div>
        <div className="text-center py-6">
          <div className="text-2xl mb-2">&#x1F491;</div>
          <div className="text-xs text-[--dim]">Invite your partner to connect</div>
        </div>
      </div>
    )
  }

  // Free users see a teaser with blurred tasks
  if (!isLoading && !isPremium) {
    return (
      <div
        className={cn(
          'rounded-2xl p-5',
          'bg-[--card]',
          'border border-[--border]'
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-semibold text-[--cream]">Partner Activity</span>
        </div>

        {/* Partner status — visible */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[--border]">
          <div
            className={cn(
              'w-11 h-11 rounded-xl flex items-center justify-center',
              'bg-gradient-to-br from-[--rose] to-[--copper]',
              'text-lg font-bold text-[--white]'
            )}
          >
            {partner.initial}
          </div>
          <div className="flex-1">
            <div className="text-[15px] font-semibold text-[--cream]">{partner.name}</div>
            <div className="text-xs text-[--dim]">Activity hidden</div>
          </div>
        </div>

        {/* Blurred task placeholders */}
        <div className="flex flex-col gap-2.5 select-none blur-[6px] pointer-events-none" aria-hidden="true">
          {partner.recentTasks.slice(0, 2).map((task, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-[--card-hover] rounded-[10px]"
            >
              <div className="w-5 h-5 rounded-full bg-[--rose-dim]" />
              <div className="flex-1 text-[13px] text-[--muted] truncate">{task.title}</div>
              <div className="text-[11px] text-[--dim]">{task.time}</div>
            </div>
          ))}
        </div>

        {/* Upgrade prompt */}
        <div className="mt-4">
          <PaywallBanner feature="realtime_sync" />
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
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-semibold text-[--cream]">Partner Activity</span>
      </div>

      {/* Partner status */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[--border]">
        {/* Avatar */}
        <div
          className={cn(
            'w-11 h-11 rounded-xl flex items-center justify-center',
            'bg-gradient-to-br from-[--rose] to-[--copper]',
            'text-lg font-bold text-[--white]'
          )}
        >
          {partner.initial}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="text-[15px] font-semibold text-[--cream]">{partner.name}</div>
          <div className="text-xs text-[--dim]">{partner.lastActive}</div>
        </div>

        {/* Sync indicator */}
        {partner.isSynced && (
          <div className="flex items-center gap-1.5 text-xs text-[--sage]">
            <div className="w-2 h-2 rounded-full bg-[--sage] animate-pulse" />
            Synced
          </div>
        )}
      </div>

      {/* Partner tasks */}
      <div className="flex flex-col gap-2.5">
        {partner.recentTasks.map((task, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 bg-[--card-hover] rounded-[10px]"
          >
            {/* Status icon */}
            <div
              className={cn(
                'w-5 h-5 rounded-full flex items-center justify-center text-[10px]',
                'bg-[--rose-dim]'
              )}
            >
              {task.status === 'completed' ? '✓' : '→'}
            </div>

            {/* Title */}
            <div className="flex-1 text-[13px] text-[--muted] truncate">
              {task.title}
            </div>

            {/* Time */}
            <div className="text-[11px] text-[--dim]">{task.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
