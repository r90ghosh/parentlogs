'use client'

import { useQuery } from '@tanstack/react-query'
import { briefingService } from '@/services/briefing-service'
import { useUser } from '@/components/user-provider'

export function useCurrentBriefing() {
  const { user, profile, family, activeBaby } = useUser()

  const stage = activeBaby?.stage || family?.stage
  const currentWeek = activeBaby?.current_week ?? family?.current_week

  const ctx = user && profile?.family_id && stage && currentWeek != null ? {
    userId: user.id,
    familyId: profile.family_id,
    subscriptionTier: profile.subscription_tier ?? undefined,
    stage: stage,
    currentWeek: currentWeek,
    babyId: activeBaby?.id,
  } : undefined

  return useQuery({
    queryKey: ['current-briefing', activeBaby?.id],
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
    staleTime: 1000 * 60 * 10, // 10 minutes - briefing content is static
  })
}

export function useBriefings() {
  return useQuery({
    queryKey: ['briefings'],
    queryFn: () => briefingService.getAllBriefings(),
    staleTime: 1000 * 60 * 10, // 10 minutes - briefing content is static
  })
}
