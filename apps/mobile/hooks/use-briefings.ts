import { useMemo } from 'react'
import { createBriefingHooks } from '@tdc/shared/hooks'
import { briefingService } from '@/lib/services'
import { useAuth } from '@/components/providers/AuthProvider'
import type { BriefingContext } from '@tdc/shared/types'

function useBriefingContext(): { ctx: Partial<BriefingContext> | undefined; babyId?: string | null } {
  const { user, profile, family } = useAuth()
  const stage = family?.stage
  const currentWeek = family?.current_week ?? undefined

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

  return { ctx, babyId: profile?.active_baby_id }
}

const {
  useCurrentBriefing,
  useBriefingByWeek,
  useBriefings,
} = createBriefingHooks({
  useBriefingContext,
  briefingService,
})

// Mobile previously named this useBriefingsList — keep the alias for compatibility
const useBriefingsList = useBriefings

export {
  useCurrentBriefing,
  useBriefingByWeek,
  useBriefings,
  useBriefingsList,
}
