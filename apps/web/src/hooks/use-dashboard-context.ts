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
  const { profile, activeBaby } = useUser()
  const { data: family } = useFamily()
  const { data: lastCheckin } = useLastCheckin(profile.id)
  const { data: dadProfile } = useDadProfile(profile.id)
  const currentWeek = activeBaby?.current_week ?? family?.current_week ?? 1
  const { data: dashboardData } = useDashboardData(profile.family_id, currentWeek, activeBaby?.id)

  const isDad = profile.role === 'dad'
  const isPostBirth = (activeBaby?.stage || family?.stage) === 'post-birth'
  const hasPartner = !!dashboardData?.partner
  const hasCheckedIn = !!lastCheckin
  const hasCompletedProfile = !!dadProfile?.work_situation

  // Suppress unused variable warning — hasCheckedIn drives mood card behavior
  void hasCheckedIn

  const isFree = profile.subscription_tier === 'free' || !profile.subscription_tier

  return [
    { id: 'mood', priority: 1, visible: isDad },
    { id: 'partner-activity', priority: 1, visible: !isDad }, // Mom sees this instead of mood
    { id: 'shift-briefing', priority: 2, visible: isPostBirth && hasPartner },
    { id: 'briefing-teaser', priority: 3, visible: true },
    { id: 'tasks-due', priority: 4, visible: true },
    { id: 'on-your-mind', priority: 5, visible: isDad },
    { id: 'quick-actions', priority: 6, visible: true },
    { id: 'upgrade-prompt', priority: 6.5, visible: isFree },
    { id: 'personalize', priority: 7, visible: isDad && !hasCompletedProfile },
    { id: 'invite-partner', priority: 7, visible: !hasPartner },
    { id: 'budget-snapshot', priority: 8, visible: true },
    { id: 'checklist-progress', priority: 9, visible: true },
  ].filter(card => card.visible)
}
