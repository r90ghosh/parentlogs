/**
 * ServiceContext — the minimal context both platforms provide to service calls.
 *
 * Re-exported from the canonical definition in @tdc/services so that
 * packages/shared (which must NOT depend on @tdc/services) can reference
 * the same shape without introducing a circular dependency.
 */
export interface ServiceContext {
  userId: string
  familyId: string
  babyId?: string
  subscriptionTier?: string
}

/**
 * Extended context used by briefing hooks — adds stage/week info.
 */
export interface BriefingContext extends ServiceContext {
  stage: string
  currentWeek: number
}
