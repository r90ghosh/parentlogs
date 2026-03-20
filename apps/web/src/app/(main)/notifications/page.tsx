import type { Metadata } from 'next'
import { NotificationInbox } from '@/components/notifications/NotificationInbox'

export const metadata: Metadata = {
  title: 'Notifications | The Dad Center',
}

export default function NotificationsPage() {
  return <NotificationInbox />
}
