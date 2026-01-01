'use client'

import { useUser } from '@/components/user-provider'
import { useFamily } from '@/hooks/use-family'
import { DashboardClient } from '@/components/dashboard/DashboardClient'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardPage() {
  const { profile, user } = useUser()
  const { data: family, isLoading: familyLoading } = useFamily()

  const firstName = profile?.full_name?.split(' ')[0] || 'there'

  // Show loading state
  if (familyLoading || !family || !user || !profile || !profile.family_id) {
    return (
      <div className="min-h-screen pb-24 md:pb-8">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-8 space-y-8">
          {/* Header skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-5 w-48" />
          </div>
          {/* Hero section skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-48 rounded-[20px]" />
            <Skeleton className="h-48 rounded-[20px]" />
          </div>
          {/* Main grid skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
            <div className="space-y-6">
              <Skeleton className="h-80 rounded-[20px]" />
              <Skeleton className="h-32 rounded-[20px]" />
            </div>
            <div className="space-y-5">
              <Skeleton className="h-36 rounded-2xl" />
              <Skeleton className="h-40 rounded-2xl" />
              <Skeleton className="h-36 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Partner name will be loaded from family members in DashboardClient
  const partnerName = 'Partner'

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:ml-64">
      <DashboardClient
        userId={user.id}
        familyId={profile.family_id}
        userName={firstName}
        partnerName={partnerName}
        currentWeek={family.current_week}
        dueDate={family.due_date || new Date().toISOString()}
      />
    </div>
  )
}
