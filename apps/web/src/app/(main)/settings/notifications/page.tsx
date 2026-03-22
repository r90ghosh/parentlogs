import type { Metadata } from 'next'
import NotificationsClient from './notifications-client'

export const metadata: Metadata = {
  title: 'Notification Settings | The Dad Center',
}

export default function NotificationSettingsPage() {
  return <NotificationsClient />
}
