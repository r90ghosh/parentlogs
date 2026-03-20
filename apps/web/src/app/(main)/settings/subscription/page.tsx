import type { Metadata } from 'next'
import SubscriptionClient from './subscription-client'

export const metadata: Metadata = {
  title: 'Subscription | The Dad Center',
}

export default function SubscriptionSettingsPage() {
  return <SubscriptionClient />
}
