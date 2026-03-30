import type { Metadata } from 'next'
import { UpgradeClient } from './upgrade-client'

export const metadata: Metadata = {
  title: 'Upgrade to Premium | The Dad Center',
  description:
    'Unlock all premium features — unlimited tasks, full briefings, budget tracking, partner sync, and more. Plans from $4.99/mo.',
  alternates: { canonical: '/upgrade' },
  openGraph: {
    title: 'Upgrade to Premium | The Dad Center',
    description: 'Unlock all premium features — unlimited tasks, full briefings, budget tracking, and partner sync. Plans from $4.99/mo.',
    url: '/upgrade',
  },
}

export default function UpgradePage() {
  return <UpgradeClient />
}
