'use client'

import { useEffect } from 'react'
import { useRealtimeSync, usePartnerPresence } from '@/hooks/use-realtime-sync'
import { useFamilyMembers } from '@/hooks/use-family'
import { useAuth } from '@/lib/auth/auth-context'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function PartnerActivityProvider({ children }: { children: React.ReactNode }) {
  // Initialize realtime subscriptions
  useRealtimeSync()
  usePartnerPresence()

  return <>{children}</>
}

export function PartnerStatus() {
  const { user } = useAuth()
  const { data: members } = useFamilyMembers()

  const partner = members?.find(m => m.id !== user?.id)

  if (!partner) return null

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Avatar className="h-8 w-8">
          <AvatarImage src={partner.avatar_url} alt={partner.full_name || ''} />
          <AvatarFallback className="font-display">
            {partner.full_name?.charAt(0).toUpperCase() || 'P'}
          </AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-sage border-2 border-[--surface]" />
      </div>
      <div className="hidden sm:block">
        <p className="font-body text-sm font-medium text-white">
          {partner.full_name?.split(' ')[0]}
        </p>
        <p className="font-body text-xs text-[--muted]">Online</p>
      </div>
    </div>
  )
}

export function RecentPartnerActivity() {
  const { user } = useAuth()
  const { data: members } = useFamilyMembers()

  const partner = members?.find(m => m.id !== user?.id)

  if (!partner) {
    return (
      <div className="text-center py-4">
        <p className="font-body text-sm text-[--muted]">
          Invite your partner to see their activity
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={partner.avatar_url} alt={partner.full_name || ''} />
          <AvatarFallback className="font-display">
            {partner.full_name?.charAt(0).toUpperCase() || 'P'}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-body text-sm font-medium text-white">{partner.full_name}</p>
          <p className="font-body text-xs text-[--muted] capitalize">{partner.role}</p>
        </div>
        <Badge variant="outline" className="ml-auto text-sage border-sage/30 font-ui">
          Online
        </Badge>
      </div>
    </div>
  )
}

interface ActivityItemProps {
  type: 'task' | 'log' | 'checklist'
  action: string
  description: string
  timestamp: string
  userName: string
  userAvatar?: string
}

export function ActivityItem({
  type,
  action,
  description,
  timestamp,
  userName,
  userAvatar,
}: ActivityItemProps) {
  const getTypeColor = () => {
    switch (type) {
      case 'task':
        return 'bg-copper/20 text-copper'
      case 'log':
        return 'bg-blue-500/20 text-blue-400'
      case 'checklist':
        return 'bg-purple-500/20 text-purple-400'
      default:
        return 'bg-[--card]/20 text-[--muted]'
    }
  }

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-[--card]/50">
      <Avatar className="h-8 w-8">
        <AvatarImage src={userAvatar} alt={userName} />
        <AvatarFallback className="font-display">{userName.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm text-white">
          <span className="font-medium">{userName}</span>{' '}
          <span className="text-[--muted]">{action}</span>
        </p>
        <p className="font-body text-xs text-[--muted] truncate">{description}</p>
      </div>
      <Badge className={cn('font-ui text-xs', getTypeColor())}>{type}</Badge>
    </div>
  )
}
