import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { briefingService } from '@/lib/services'
import { useAuth } from '@/components/providers/AuthProvider'

export function useCurrentBriefing() {
  const { user, profile, family } = useAuth()
  const stage = family?.stage
  const currentWeek = family?.current_week ?? undefined

  // BriefingContext extends ServiceContext with stage + currentWeek
  const ctx = useMemo(() => {
    if (!user || !profile?.family_id || !stage || currentWeek == null) return undefined
    return {
      userId: user.id,
      familyId: profile.family_id,
      subscriptionTier: profile.subscription_tier ?? undefined,
      babyId: profile.active_baby_id ?? undefined,
      stage,
      currentWeek,
    }
  }, [user?.id, profile?.family_id, profile?.subscription_tier, profile?.active_baby_id, stage, currentWeek])

  return useQuery({
    queryKey: ['current-briefing', family?.id],
    queryFn: () => briefingService.getCurrentBriefing(ctx),
    enabled: !!ctx,
    staleTime: 1000 * 60 * 10,
  })
}

export function useBriefingByWeek(stage: string, week: number) {
  return useQuery({
    queryKey: ['briefing', stage, week],
    queryFn: () => briefingService.getBriefingByWeek(stage, week),
    enabled: !!stage && week > 0,
    staleTime: 1000 * 60 * 10,
  })
}

export function useBriefingsList() {
  return useQuery({
    queryKey: ['briefings-list'],
    queryFn: () => briefingService.getAllBriefings(),
    staleTime: 1000 * 60 * 10,
  })
}
