'use client'

import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { Bell, CheckSquare, AlertTriangle, BookOpen, Users, Info, Star, Rocket, PartyPopper, Heart, MailOpen, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Notification, NotificationType } from '@tdc/shared/types'
import { useMarkNotificationRead, useDeleteNotification } from '@/hooks/use-notifications'

const typeIcons: Record<NotificationType, React.ElementType> = {
  daily_digest: Bell,
  task_reminder: CheckSquare,
  overdue_alert: AlertTriangle,
  weekly_briefing: BookOpen,
  partner_activity: Users,
  milestone: Star,
  onboarding: Rocket,
  celebration: PartyPopper,
  mood_reminder: Heart,
  re_engagement: MailOpen,
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
  const deleteNotification = useDeleteNotification()

  const Icon = typeIcons[notification.type] || Bell

  const handleClick = () => {
    if (!notification.is_read) {
      markAsRead.mutate(notification.id)
    }
    // Only allow relative URLs (internal navigation)
    if (notification.url?.startsWith('/')) {
      router.push(notification.url)
    }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteNotification.mutate(notification.id)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
      className={cn(
        'group flex w-full cursor-pointer items-start gap-3 border-b border-line2 px-[18px] py-[15px] text-left transition-colors last:border-b-0 hover:bg-card-hover',
        !notification.is_read && 'bg-clay-soft/40'
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full',
          notification.is_read ? 'bg-card2' : 'bg-clay-soft'
        )}
      >
        <Icon className={cn('h-4 w-4', notification.is_read ? 'text-mute' : 'text-clay-ink')} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className={cn('text-[14px] leading-snug', notification.is_read ? 'font-semibold text-ink2' : 'font-bold text-ink')}>
          {notification.title}
        </p>
        <p className="mt-0.5 line-clamp-2 text-[12.5px] text-mute">{notification.body}</p>
        <p className="mt-1 text-[10px] font-semibold text-faint">
          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
        </p>
      </div>

      {/* Delete button (hover) / Unread dot */}
      <div className="mt-2 flex flex-shrink-0 items-center">
        <button
          type="button"
          aria-label="Delete notification"
          onClick={handleDelete}
          className="-m-1 p-1 text-faint transition-opacity hover:text-danger focus:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
        {!notification.is_read && <div className="ml-1 h-2 w-2 rounded-full bg-clay group-hover:hidden" />}
      </div>
    </div>
  )
}
