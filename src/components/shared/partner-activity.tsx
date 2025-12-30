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
          <AvatarFallback>
            {partner.full_name?.charAt(0).toUpperCase() || 'P'}
          </AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-surface-900" />
      </div>
      <div className="hidden sm:block">
        <p className="text-sm font-medium text-white">
          {partner.full_name?.split(' ')[0]}
        </p>
        <p className="text-xs text-surface-400">Online</p>
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
        <p className="text-sm text-surface-400">
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
          <AvatarFallback>
            {partner.full_name?.charAt(0).toUpperCase() || 'P'}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium text-white">{partner.full_name}</p>
          <p className="text-xs text-surface-400 capitalize">{partner.role}</p>
        </div>
        <Badge variant="outline" className="ml-auto text-green-400 border-green-400/30">
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
        return 'bg-accent-500/20 text-accent-400'
      case 'log':
        return 'bg-blue-500/20 text-blue-400'
      case 'checklist':
        return 'bg-purple-500/20 text-purple-400'
      default:
        return 'bg-surface-500/20 text-surface-400'
    }
  }

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-800/50">
      <Avatar className="h-8 w-8">
        <AvatarImage src={userAvatar} alt={userName} />
        <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white">
          <span className="font-medium">{userName}</span>{' '}
          <span className="text-surface-400">{action}</span>
        </p>
        <p className="text-xs text-surface-400 truncate">{description}</p>
      </div>
      <Badge className={cn('text-xs', getTypeColor())}>{type}</Badge>
    </div>
  )
}
