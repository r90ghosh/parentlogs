'use client'

import { useSearchParams } from 'next/navigation'
import { useUser } from '@/components/user-provider'
import { useFamily } from '@/hooks/use-family'
import { useCurrentProfile } from '@/hooks/use-profile'
import { TasksPageClient } from '@/components/tasks'

export default function TasksClient() {
  const searchParams = useSearchParams()
  const { activeBaby } = useUser()
  const { data: family, isLoading: isFamilyLoading } = useFamily()
  const { data: profile, isLoading: isProfileLoading } = useCurrentProfile()

  const isLoading = isFamilyLoading || isProfileLoading

  // Calculate values from family/activeBaby data
  const currentWeek = activeBaby?.current_week ?? family?.current_week ?? 1
  // Get signup_week from profile, default to 1 if not set
  const signupWeek = profile?.signup_week || 1

  // Calculate days to go
  const dueDate = activeBaby?.due_date || family?.due_date
  const daysToGo = dueDate
    ? Math.max(0, Math.ceil((new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0

  // Read view param: 'list' (default) or 'calendar'
  const view = searchParams.get('view') === 'calendar' ? 'calendar' : 'list'

  const isPremium = profile?.subscription_tier === 'premium' || profile?.subscription_tier === 'lifetime'

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[--bg]">
        <div className="text-[--muted] font-body">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[--bg]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 overflow-x-hidden">
        <TasksPageClient
          currentWeek={currentWeek}
          signupWeek={signupWeek}
          daysToGo={daysToGo}
          initialView={view}
          isPremium={isPremium}
        />
      </div>
    </div>
  )
}
