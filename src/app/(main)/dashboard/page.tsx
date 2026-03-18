'use client'

import { useUser } from '@/components/user-provider'
import { DashboardClient } from '@/components/dashboard/DashboardClient'

export default function DashboardPage() {
  const { profile, user, family } = useUser()

  const firstName = profile?.full_name?.split(' ')[0] || 'there'

  // Partner name will be loaded from family members in DashboardClient
  const partnerName = 'Partner'

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <DashboardClient
        userId={user.id}
        familyId={profile.family_id!}
        userName={firstName}
        partnerName={partnerName}
        currentWeek={family?.current_week ?? 1}
        dueDate={family?.due_date || new Date().toISOString()}
      />
    </div>
  )
}
