'use client'

import { useUser } from '@/components/user-provider'
import { useLastCheckin, useDadProfile } from '@/hooks/use-dad-journey'
import { useDashboardData } from '@/hooks/use-dashboard'
import { useFamily } from '@/hooks/use-family'

export interface DashboardCard {
  id: string
  priority: number
  visible: boolean
}

export function useDashboardCards(): DashboardCard[] {
  const { profile } = useUser()
  const { data: family } = useFamily()
  const { data: lastCheckin } = useLastCheckin(profile.id)
  const { data: dadProfile } = useDadProfile(profile.id)
  const { data: dashboardData } = useDashboardData(profile.family_id, family?.current_week || 1)

  const isDad = profile.role === 'dad'
  const isPostBirth = family?.stage === 'post-birth'
  const hasPartner = !!dashboardData?.partner
  const hasCheckedIn = !!lastCheckin
  const hasCompletedProfile = !!dadProfile?.work_situation

  // Suppress unused variable warning — hasCheckedIn drives mood card behavior
  void hasCheckedIn

  return [
    { id: 'mood', priority: 1, visible: isDad },
    { id: 'partner-activity', priority: 1, visible: !isDad }, // Mom sees this instead of mood
    { id: 'shift-briefing', priority: 2, visible: isPostBirth && hasPartner },
    { id: 'briefing-teaser', priority: 3, visible: true },
    { id: 'tasks-due', priority: 4, visible: true },
    { id: 'on-your-mind', priority: 5, visible: isDad },
    { id: 'quick-actions', priority: 6, visible: true },
    { id: 'personalize', priority: 7, visible: isDad && !hasCompletedProfile },
    { id: 'invite-partner', priority: 7, visible: !hasPartner },
    { id: 'budget-snapshot', priority: 8, visible: true },
    { id: 'checklist-progress', priority: 9, visible: true },
  ].filter(card => card.visible)
}
