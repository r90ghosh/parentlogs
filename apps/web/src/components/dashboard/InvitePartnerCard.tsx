'use client'

import { useState } from 'react'
import { Users, Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUser } from '@/components/user-provider'
import { useFamily } from '@/hooks/use-family'

export function InvitePartnerCard() {
  const { profile } = useUser()
  const { data: family } = useFamily()
  const [copied, setCopied] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const inviteCode = family?.invite_code || ''
  const inviteLink = `https://thedadcenter.com/join/${inviteCode}`
  const firstName = profile.full_name?.split(' ')[0] || 'Someone'

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard not available
    }
  }

  return (
    <div
      className={cn(
        'animate-fade-in-up rounded-[20px] p-5 card-sage-top',
        'bg-[--card]',
        'border border-[--border]',
        'shadow-card'
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <Users className="h-4 w-4 text-sage" />
        <span className="text-sm font-semibold font-ui text-[--cream]">Invite Your Partner</span>
      </div>

      <p className="text-xs font-body text-[--muted] mb-4">
        Share access so you stay in sync. Your partner can see tasks, read briefings, and track together.
      </p>

      {inviteCode && (
        <button
          onClick={handleCopy}
          className={cn(
            'w-full flex items-center justify-between px-4 py-3 rounded-xl mb-3',
            'bg-[--surface] border border-[--border]',
            'hover:bg-[--card-hover] hover:border-[--border-hover] transition-colors'
          )}
        >
          <div className="text-left">
            <div className="text-[10px] font-ui text-[--muted] uppercase tracking-wide mb-0.5">Invite Link</div>
            <div className="text-xs font-mono text-[--cream] truncate max-w-[200px]">
              thedadcenter.com/join/{inviteCode}
            </div>
          </div>
          {copied ? (
            <Check className="h-4 w-4 text-sage flex-shrink-0" />
          ) : (
            <Copy className="h-4 w-4 text-[--muted] flex-shrink-0" />
          )}
        </button>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => setDismissed(true)}
          className="flex-1 py-2 rounded-xl text-xs font-ui text-[--muted] hover:text-[--cream] transition-colors border border-[--border] hover:border-[--border-hover]"
        >
          Not now
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="flex-1 py-2 rounded-xl text-xs font-ui text-[--muted] hover:text-[--cream] transition-colors border border-[--border] hover:border-[--border-hover]"
        >
          Doing this solo
        </button>
      </div>
    </div>
  )
}
