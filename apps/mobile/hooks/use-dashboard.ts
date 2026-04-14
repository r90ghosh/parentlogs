import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/components/providers/AuthProvider'
import { useServiceContext } from './use-service-context'
import { taskService, briefingService } from '@/lib/services'

export function useDashboardData() {
  const { user, profile, family } = useAuth()
  const ctx = useServiceContext()

  // BriefingContext needs stage + currentWeek in addition to ServiceContext fields
  const briefingCtx = useMemo(() => {
    if (!user || !profile?.family_id || !family?.stage || family?.current_week == null) return undefined
    return {
      userId: user.id,
      familyId: profile.family_id,
      subscriptionTier: profile.subscription_tier ?? undefined,
      babyId: profile.active_baby_id ?? undefined,
      stage: family.stage,
      currentWeek: family.current_week,
    }
  }, [user?.id, profile?.family_id, profile?.subscription_tier, profile?.active_baby_id, family?.stage, family?.current_week])

  const tasksQuery = useQuery({
    queryKey: ['tasks-due', family?.id],
    queryFn: () => taskService.getTasks({ status: 'pending', limit: 5 }, ctx),
    enabled: !!family?.id,
    staleTime: 1000 * 60 * 2,
  })

  const briefingQuery = useQuery({
    queryKey: ['current-briefing', family?.id],
    queryFn: () => briefingService.getCurrentBriefing(briefingCtx),
    enabled: !!briefingCtx,
    staleTime: 1000 * 60 * 10,
  })

  return { tasksQuery, briefingQuery, user, profile, family }
}
