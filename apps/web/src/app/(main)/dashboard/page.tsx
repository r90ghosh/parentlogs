import type { Metadata } from 'next'
import { DashboardClient } from '@/components/dashboard/DashboardClient'

export const metadata: Metadata = {
  title: 'Dashboard | The Dad Center',
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <DashboardClient />
    </div>
  )
}
