'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { Bell, Settings, Loader2 } from 'lucide-react'
import { isToday, isYesterday } from 'date-fns'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ListSkeleton, EmptyState } from '@/components/error/loading-states'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  useNotificationFeed,
  useMarkAllNotificationsRead,
  useDeleteReadNotifications,
} from '@/hooks/use-notifications'
import { usePageHeader } from '@/components/layouts/topbar-context'
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
    <div className="mb-3 mt-7 text-[11px] font-bold uppercase tracking-[1.5px] text-faint first:mt-0">
      {label}
    </div>
  )
}

export function NotificationInbox() {
  const [activeFilter, setActiveFilter] = useState(0)
  const activeTypes = FILTER_OPTIONS[activeFilter].types as string[] | undefined

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeFilter])

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

  usePageHeader(
    {
      title: 'Notifications',
      actions: (
        <div className="flex items-center gap-2">
          {hasUnread && (
            <button
              onClick={() => markAllAsRead.mutate()}
              disabled={markAllAsRead.isPending}
              className="rounded-xl border border-line bg-card px-3.5 py-2 text-[13px] font-bold text-ink2 transition-colors hover:bg-card-hover disabled:opacity-50"
            >
              Mark all read
            </button>
          )}
          {hasRead && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  disabled={deleteRead.isPending}
                  className="rounded-xl border border-line bg-card px-3.5 py-2 text-[13px] font-bold text-mute transition-colors hover:text-danger disabled:opacity-50"
                >
                  Clear read
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear Read Notifications</AlertDialogTitle>
                  <AlertDialogDescription>
                    Delete all read notifications? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteRead.mutate()}
                    className="bg-clay text-white hover:opacity-90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Link
            href="/settings/notifications"
            className="grid h-9 w-9 place-items-center rounded-full text-mute transition-colors hover:bg-card-hover hover:text-ink"
            aria-label="Notification settings"
          >
            <Settings className="h-4 w-4" />
          </Link>
        </div>
      ),
    },
    [hasUnread, hasRead, markAllAsRead.isPending, deleteRead.isPending]
  )

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

  // Filter pills
  const filterPills = (
    <div
      className="mb-4 flex items-center gap-2 overflow-x-auto"
      style={{ scrollbarWidth: 'none' }}
    >
      {FILTER_OPTIONS.map((option, i) => (
        <button
          key={option.label}
          onClick={() => setActiveFilter(i)}
          className={cn(
            'flex-shrink-0 whitespace-nowrap rounded-full border px-[15px] py-2 text-[13px] font-bold transition-colors',
            activeFilter === i
              ? 'border-clay bg-clay text-white'
              : 'border-line bg-card text-ink2 hover:border-faint'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl">
        {filterPills}
        <ListSkeleton count={5} />
      </div>
    )
  }

  if (!notifications.length) {
    return (
      <div className="mx-auto max-w-2xl">
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
    <div className="mx-auto max-w-2xl">
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
          <Loader2 className="h-5 w-5 animate-spin text-clay-ink" />
        </div>
      )}
    </div>
  )
}
