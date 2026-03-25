'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { Bell, Settings, Loader2 } from 'lucide-react'
import { isToday, isYesterday } from 'date-fns'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ListSkeleton, EmptyState } from '@/components/error/loading-states'
import {
  useNotificationFeed,
  useMarkAllNotificationsRead,
  useDeleteReadNotifications,
} from '@/hooks/use-notifications'
import { NotificationItem } from './NotificationItem'
import { Notification } from '@tdc/shared/types'

const FILTER_OPTIONS = [
  { label: 'All', types: undefined },
  { label: 'Tasks', types: ['daily_digest', 'task_reminder', 'overdue_alert'] },
  { label: 'Briefings', types: ['weekly_briefing'] },
  { label: 'Partner', types: ['partner_activity'] },
  { label: 'Milestones', types: ['milestone', 'celebration'] },
  { label: 'System', types: ['system', 'onboarding', 'mood_reminder', 're_engagement'] },
] as const

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
  const [activeFilter, setActiveFilter] = useState(0)
  const activeTypes = FILTER_OPTIONS[activeFilter].types as string[] | undefined

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useNotificationFeed(activeTypes)
  const markAllAsRead = useMarkAllNotificationsRead()
  const deleteRead = useDeleteReadNotifications()

  // Flatten all pages into a single array
  const notifications = useMemo(
    () => data?.pages.flat() ?? [],
    [data]
  )

  const hasUnread = notifications.some((n) => !n.is_read)
  const hasRead = notifications.some((n) => n.is_read)

  // Infinite scroll sentinel
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0 }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  // Header (always visible)
  const header = (
    <div className="flex items-center justify-between mb-4">
      <h1 className="font-display text-2xl font-bold text-white">Notifications</h1>
      <div className="flex items-center gap-3">
        {hasUnread && (
          <button
            onClick={() => markAllAsRead.mutate()}
            disabled={markAllAsRead.isPending}
            className="font-ui text-xs font-medium text-copper hover:text-copper/80 transition-colors disabled:opacity-50"
          >
            Mark all read
          </button>
        )}
        {hasRead && (
          <button
            onClick={() => {
              if (!window.confirm('Delete all read notifications? This cannot be undone.')) return
              deleteRead.mutate()
            }}
            disabled={deleteRead.isPending}
            className="font-ui text-xs font-medium text-[--dim] hover:text-coral transition-colors disabled:opacity-50"
          >
            Clear read
          </button>
        )}
        <Link
          href="/settings/notifications"
          className="text-[--muted] hover:text-[--cream] transition-colors"
        >
          <Settings className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )

  // Filter pills
  const filterPills = (
    <div
      className="flex items-center gap-1.5 overflow-x-auto -mx-4 px-4 mb-4"
      style={{ scrollbarWidth: 'none' }}
    >
      {FILTER_OPTIONS.map((option, i) => (
        <button
          key={option.label}
          onClick={() => setActiveFilter(i)}
          className={cn(
            'flex-shrink-0 px-2.5 py-1.5 rounded-lg font-ui text-xs font-medium transition-all whitespace-nowrap',
            activeFilter === i
              ? 'bg-copper text-white'
              : 'bg-[--surface] text-[--muted] hover:bg-[--card]'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )

  if (isLoading) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        {header}
        {filterPills}
        <ListSkeleton count={5} />
      </div>
    )
  }

  if (!notifications.length) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        {header}
        {filterPills}
        <EmptyState
          icon={Bell}
          title={activeFilter === 0 ? 'No notifications yet' : 'Nothing here'}
          description={
            activeFilter === 0
              ? "You'll see task reminders, briefing alerts, and other updates here."
              : `No ${FILTER_OPTIONS[activeFilter].label.toLowerCase()} notifications.`
          }
        />
      </div>
    )
  }

  const { today, yesterday, earlier } = groupNotifications(notifications)
  let runningIndex = 0

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {header}
      {filterPills}

      {/* Grouped notifications */}
      <div className="space-y-1">
        {today.length > 0 && (
          <>
            <SectionLabel label="Today" />
            {today.map((n) => (
              <NotificationItem key={n.id} notification={n} index={Math.min(runningIndex++, 10)} />
            ))}
          </>
        )}

        {yesterday.length > 0 && (
          <>
            <SectionLabel label="Yesterday" />
            {yesterday.map((n) => (
              <NotificationItem key={n.id} notification={n} index={Math.min(runningIndex++, 10)} />
            ))}
          </>
        )}

        {earlier.length > 0 && (
          <>
            <SectionLabel label="Earlier" />
            {earlier.map((n) => (
              <NotificationItem key={n.id} notification={n} index={Math.min(runningIndex++, 10)} />
            ))}
          </>
        )}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-px" />

      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-copper" />
        </div>
      )}
    </div>
  )
}
