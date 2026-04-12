'use client'

import { createBriefingHooks } from '@tdc/shared/hooks'
import { briefingService } from '@/lib/services'
import { useUser } from '@/components/user-provider'
import type { BriefingContext } from '@tdc/shared/types'

function useBriefingContext(): { ctx: Partial<BriefingContext> | undefined; babyId?: string | null } {
  const { user, profile, family, activeBaby } = useUser()

  const stage = activeBaby?.stage || family?.stage
  const currentWeek = activeBaby?.current_week ?? family?.current_week

  if (!user || !profile?.family_id || !stage || currentWeek == null) {
    return { ctx: undefined, babyId: activeBaby?.id }
  }

  return {
    ctx: {
      userId: user.id,
      familyId: profile.family_id,
      subscriptionTier: profile.subscription_tier ?? undefined,
      stage,
      currentWeek,
      babyId: activeBaby?.id,
    },
    babyId: activeBaby?.id,
  }
}

const {
  useCurrentBriefing,
  useBriefingByWeek,
  useBriefings,
} = createBriefingHooks({
  useBriefingContext,
  briefingService,
})

export {
  useCurrentBriefing,
  useBriefingByWeek,
  useBriefings,
}
