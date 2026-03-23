'use client'

import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { Bell, CheckSquare, AlertTriangle, BookOpen, Users, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CardEntrance } from '@/components/ui/animations/CardEntrance'
import { Notification, NotificationType } from '@tdc/shared/types'
import { useMarkNotificationRead } from '@/hooks/use-notifications'

const typeIcons: Record<NotificationType, React.ElementType> = {
  daily_digest: Bell,
  task_reminder: CheckSquare,
  overdue_alert: AlertTriangle,
  weekly_briefing: BookOpen,
  partner_activity: Users,
  system: Info,
}

export function NotificationItem({
  notification,
  index,
}: {
  notification: Notification
  index: number
}) {
  const router = useRouter()
  const markAsRead = useMarkNotificationRead()

  const Icon = typeIcons[notification.type] || Bell

  const handleClick = () => {
    if (!notification.is_read) {
      markAsRead.mutate(notification.id)
    }
    router.push(notification.url)
  }

  return (
    <CardEntrance delay={index * 80}>
      <button
        onClick={handleClick}
        className={cn(
          'w-full flex items-start gap-3 px-4 py-3 rounded-lg text-left transition-colors',
          notification.is_read
            ? 'bg-[--surface] hover:bg-[--card]'
            : 'bg-[--card] border-l-2 border-l-copper hover:bg-[--card-hover]'
        )}
      >
        {/* Icon */}
        <div className={cn(
          'mt-0.5 flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center',
          notification.is_read ? 'bg-[--card]' : 'bg-copper-dim'
        )}>
          <Icon className={cn(
            'h-4 w-4',
            notification.is_read ? 'text-[--muted]' : 'text-copper'
          )} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={cn(
            'font-body text-sm leading-snug',
            notification.is_read ? 'text-[--cream]' : 'font-medium text-white'
          )}>
            {notification.title}
          </p>
          <p className="font-body text-xs text-[--muted] mt-0.5 line-clamp-2">
            {notification.body}
          </p>
          <p className="font-ui text-[10px] text-[--dim] mt-1">
            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
          </p>
        </div>

        {/* Unread dot */}
        {!notification.is_read && (
          <div className="mt-2 flex-shrink-0 h-2 w-2 rounded-full bg-copper" />
        )}
      </button>
    </CardEntrance>
  )
}
