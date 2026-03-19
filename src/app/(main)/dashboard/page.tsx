'use client'

import { useUser } from '@/components/user-provider'
import { DashboardClient } from '@/components/dashboard/DashboardClient'

export default function DashboardPage() {
  const { profile } = useUser()

  const firstName = profile?.full_name?.split(' ')[0] || 'there'

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <DashboardClient
        familyId={profile.family_id!}
        userName={firstName}
      />
    </div>
  )
}
