import type { Metadata } from 'next'
import SubscriptionClient from './subscription-client'

export const metadata: Metadata = {
  title: 'Subscription | Rooftop Crest',
}

export default function SubscriptionSettingsPage() {
  return <SubscriptionClient />
}
