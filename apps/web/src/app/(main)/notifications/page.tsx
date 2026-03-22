import type { Metadata } from 'next'
import { NotificationInbox } from '@/components/notifications/NotificationInbox'

export const metadata: Metadata = {
  title: 'Notifications | Rooftop Crest',
}

export default function NotificationsPage() {
  return <NotificationInbox />
}
