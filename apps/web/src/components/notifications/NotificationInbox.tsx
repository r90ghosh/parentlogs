'use client'

import { Bell } from 'lucide-react'
import { isToday, isYesterday } from 'date-fns'
import { ListSkeleton, EmptyState } from '@/components/error/loading-states'
import { useNotificationFeed, useMarkAllNotificationsRead } from '@/hooks/use-notifications'
import { NotificationItem } from './NotificationItem'
import { Notification } from '@tdc/shared/types'

function groupNotifications(notifications: Notification[]) {
  const today: Notification[] = []
  const yesterday: Notification[] = []
  const earlier: Notification[] = []

  for (const n of notifications) {
    const date = new Date(n.created_at)
    if (isToday(date)) today.push(n)
    else if (isYesterday(date)) yesterday.push(n)
    else earlier.push(n)
  }

  return { today, yesterday, earlier }
}

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="font-ui font-semibold text-[10px] uppercase tracking-[0.12em] text-[--muted] px-1 pt-4 pb-2">
      {label}
    </p>
  )
}

export function NotificationInbox() {
  const { data: notifications, isLoading } = useNotificationFeed()
  const markAllAsRead = useMarkAllNotificationsRead()

  const hasUnread = notifications?.some((n) => !n.is_read)

  if (isLoading) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <h1 className="font-display text-2xl font-bold text-white mb-6">Notifications</h1>
        <ListSkeleton count={5} />
      </div>
    )
  }

  if (!notifications?.length) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <h1 className="font-display text-2xl font-bold text-white mb-6">Notifications</h1>
        <EmptyState
          icon={Bell}
          title="No notifications yet"
          description="You'll see task reminders, briefing alerts, and other updates here."
        />
      </div>
    )
  }

  const { today, yesterday, earlier } = groupNotifications(notifications)
  let runningIndex = 0

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-white">Notifications</h1>
        {hasUnread && (
          <button
            onClick={() => markAllAsRead.mutate()}
            disabled={markAllAsRead.isPending}
            className="font-ui text-xs font-medium text-copper hover:text-copper/80 transition-colors disabled:opacity-50"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Grouped notifications */}
      <div className="space-y-1">
        {today.length > 0 && (
          <>
            <SectionLabel label="Today" />
            {today.map((n) => (
              <NotificationItem key={n.id} notification={n} index={runningIndex++} />
            ))}
          </>
        )}

        {yesterday.length > 0 && (
          <>
            <SectionLabel label="Yesterday" />
            {yesterday.map((n) => (
              <NotificationItem key={n.id} notification={n} index={runningIndex++} />
            ))}
          </>
        )}

        {earlier.length > 0 && (
          <>
            <SectionLabel label="Earlier" />
            {earlier.map((n) => (
              <NotificationItem key={n.id} notification={n} index={runningIndex++} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
