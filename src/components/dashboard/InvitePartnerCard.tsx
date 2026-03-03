'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-[20px] p-5',
        'bg-gradient-to-br from-pink-900/30 to-zinc-900',
        'border border-pink-500/20'
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <Users className="h-4 w-4 text-pink-400" />
        <span className="text-sm font-semibold text-white">Invite Your Partner</span>
      </div>

      <p className="text-xs text-zinc-400 mb-4">
        Share access so you stay in sync. Your partner can see tasks, read briefings, and track together.
      </p>

      {inviteCode && (
        <button
          onClick={handleCopy}
          className={cn(
            'w-full flex items-center justify-between px-4 py-3 rounded-xl mb-3',
            'bg-white/[0.04] border border-white/[0.08]',
            'hover:bg-white/[0.07] transition-colors'
          )}
        >
          <div className="text-left">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wide mb-0.5">Invite Link</div>
            <div className="text-xs text-zinc-300 font-mono truncate max-w-[200px]">
              thedadcenter.com/join/{inviteCode}
            </div>
          </div>
          {copied ? (
            <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
          ) : (
            <Copy className="h-4 w-4 text-zinc-500 flex-shrink-0" />
          )}
        </button>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => setDismissed(true)}
          className="flex-1 py-2 rounded-xl text-xs text-zinc-500 hover:text-zinc-300 transition-colors border border-white/[0.06] hover:border-white/10"
        >
          Not now
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="flex-1 py-2 rounded-xl text-xs text-zinc-500 hover:text-zinc-300 transition-colors border border-white/[0.06] hover:border-white/10"
        >
          Doing this solo
        </button>
      </div>
    </motion.div>
  )
}
