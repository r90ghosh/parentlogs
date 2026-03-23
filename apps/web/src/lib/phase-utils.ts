import { FamilyStage } from '@tdc/shared/types'
import { ContentPhase } from '@tdc/shared/types/dad-journey'
import { familyStageToContentPhase } from '@/lib/stage-mapping'

/**
 * Get the ContentPhase for a given FamilyStage + week.
 * Delegates to the canonical stage-mapping module.
 */
export function getContentPhase(stage: FamilyStage, currentWeek: number): ContentPhase {
  return familyStageToContentPhase(stage, currentWeek)
}
