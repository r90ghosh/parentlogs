'use client'

import { cn } from '@/lib/utils'
import { PartnerActivity } from '@/types/dashboard'

interface PartnerActivityCardProps {
  partner: PartnerActivity | null
}

export function PartnerActivityCard({ partner }: PartnerActivityCardProps) {
  if (!partner) {
    return (
      <div
        className={cn(
          'rounded-2xl p-5',
          'bg-gradient-to-br from-zinc-800 to-zinc-900',
          'border border-white/[0.06]'
        )}
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-semibold text-white">👥 Partner Activity</span>
        </div>
        <div className="text-center py-6">
          <div className="text-2xl mb-2">💑</div>
          <div className="text-xs text-zinc-500">Invite your partner to connect</div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'rounded-2xl p-5',
        'bg-gradient-to-br from-zinc-800 to-zinc-900',
        'border border-white/[0.06]'
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-semibold text-white">👥 Partner Activity</span>
      </div>

      {/* Partner status */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/[0.04]">
        {/* Avatar */}
        <div
          className={cn(
            'w-11 h-11 rounded-xl flex items-center justify-center',
            'bg-gradient-to-br from-pink-500 to-rose-500',
            'text-lg font-bold text-white'
          )}
        >
          {partner.initial}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="text-[15px] font-semibold text-white">{partner.name}</div>
          <div className="text-xs text-zinc-500">{partner.lastActive}</div>
        </div>

        {/* Sync indicator */}
        {partner.isSynced && (
          <div className="flex items-center gap-1.5 text-xs text-green-500">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Synced
          </div>
        )}
      </div>

      {/* Partner tasks */}
      <div className="flex flex-col gap-2.5">
        {partner.recentTasks.map((task, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-[10px]"
          >
            {/* Status icon */}
            <div
              className={cn(
                'w-5 h-5 rounded-full flex items-center justify-center text-[10px]',
                'bg-pink-500/15'
              )}
            >
              {task.status === 'completed' ? '✓' : '→'}
            </div>

            {/* Title */}
            <div className="flex-1 text-[13px] text-zinc-400 truncate">
              {task.title}
            </div>

            {/* Time */}
            <div className="text-[11px] text-zinc-600">{task.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
