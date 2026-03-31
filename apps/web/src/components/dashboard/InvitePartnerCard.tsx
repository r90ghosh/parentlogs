'use client'

import { useState } from 'react'
import { useUser } from '@/components/user-provider'
import { useFamily } from '@/hooks/use-family'
import { useToast } from '@/hooks/use-toast'
import { trackActivity } from '@/lib/track-activity'
import { Users, Copy, Check, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function InvitePartnerCard() {
  const { profile } = useUser()
  const { data: family } = useFamily()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  // partner_invited_at exists in DB but not yet in the shared User type
  const hasInvited = !!((profile as unknown as { partner_invited_at?: string }).partner_invited_at)

  const handleCopyLink = async () => {
    if (!family?.invite_code) return
    const inviteLink = `${window.location.origin}/signup?invite=${family.invite_code}`
    try {
      await navigator.clipboard.writeText(inviteLink)
      setCopied(true)
      trackActivity(profile.id, 'partner_invited')
      toast({ title: 'Invite link copied!' })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({ title: 'Failed to copy', variant: 'destructive' })
    }
  }

  const handleCopyCode = async () => {
    if (!family?.invite_code) return
    try {
      await navigator.clipboard.writeText(family.invite_code)
      setCopied(true)
      trackActivity(profile.id, 'partner_invited')
      toast({ title: 'Invite code copied!' })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({ title: 'Failed to copy', variant: 'destructive' })
    }
  }

  if (!family) return null

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
        {hasInvited
          ? 'Waiting for your partner to join. Share the link again if needed.'
          : 'Share tasks and stay in sync. One subscription covers both of you.'}
      </p>

      {/* Invite code display */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 bg-[--card-hover] border border-[--border] rounded-lg px-3 py-2 text-center">
          <span className="font-mono text-sm tracking-[0.15em] text-copper font-semibold">
            {family.invite_code}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopyCode}
          className="h-8 w-8 shrink-0 text-[--muted] hover:text-copper"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-sage" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full border-sage/30 text-sage hover:bg-sage/10 font-ui text-xs"
        onClick={handleCopyLink}
      >
        <Share2 className="mr-1.5 h-3.5 w-3.5" />
        {hasInvited ? 'Copy Link Again' : 'Copy Invite Link'}
      </Button>
    </div>
  )
}
