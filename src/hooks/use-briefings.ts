'use client'

import { useQuery } from '@tanstack/react-query'
import { briefingService } from '@/services/briefing-service'
import { useUser } from '@/components/user-provider'

export function useCurrentBriefing() {
  const { user, profile, family } = useUser()

  const ctx = user && profile?.family_id && family ? {
    userId: user.id,
    familyId: profile.family_id,
    subscriptionTier: profile.subscription_tier ?? undefined,
    stage: family.stage,
    currentWeek: family.current_week,
  } : undefined

  return useQuery({
    queryKey: ['current-briefing'],
    queryFn: () => briefingService.getCurrentBriefing(ctx),
    enabled: !!ctx,
    staleTime: 1000 * 60 * 10, // 10 minutes - briefing content is static
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
