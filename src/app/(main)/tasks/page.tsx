'use client'

import { useFamily } from '@/hooks/use-family'
import { useCurrentProfile } from '@/hooks/use-profile'
import { TasksPageClient } from '@/components/tasks'

export default function TasksPage() {
  const { data: family, isLoading: isFamilyLoading } = useFamily()
  const { data: profile, isLoading: isProfileLoading } = useCurrentProfile()

  const isLoading = isFamilyLoading || isProfileLoading

  // Calculate values from family data
  const currentWeek = family?.current_week || 1
  // Get signup_week from profile, default to 1 if not set
  const signupWeek = profile?.signup_week || 1

  // Calculate days to go
  const daysToGo = family?.due_date
    ? Math.max(0, Math.ceil((new Date(family.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-zinc-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 overflow-x-hidden">
        <TasksPageClient
          currentWeek={currentWeek}
          signupWeek={signupWeek}
          daysToGo={daysToGo}
        />
      </div>
    </div>
  )
}
