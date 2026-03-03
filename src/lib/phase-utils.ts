import { FamilyStage } from '@/types'
import { ContentPhase } from '@/types/dad-journey'
import { isPregnancyStage } from '@/lib/pregnancy-utils'

export function getContentPhase(stage: FamilyStage, currentWeek: number): ContentPhase {
  if (isPregnancyStage(stage)) {
    if (currentWeek <= 13) return 'trimester-1'
    if (currentWeek <= 27) return 'trimester-2'
    return 'trimester-3'
  }

  // Post-birth (currentWeek = weeks since birth)
  if (currentWeek <= 13) return '0-3-months'
  if (currentWeek <= 26) return '3-6-months'
  if (currentWeek <= 52) return '6-12-months'
  if (currentWeek <= 78) return '12-18-months'
  return '18-plus'
}
