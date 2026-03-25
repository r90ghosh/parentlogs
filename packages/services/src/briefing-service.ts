import type { BriefingTemplate, FamilyStage } from '@tdc/shared/types'
import { isPregnancyStage } from '@tdc/shared/utils/pregnancy-utils'
import type { AppSupabaseClient, ServiceContext } from './types'

interface BriefingContext extends ServiceContext {
  stage: string
  currentWeek: number
}

export function createBriefingService(supabase: AppSupabaseClient) {
  async function resolveBriefingContext(ctx?: Partial<BriefingContext>): Promise<BriefingContext | null> {
    if (ctx?.userId && ctx?.familyId && ctx?.stage && ctx?.currentWeek) {
      return ctx as BriefingContext
    }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    const { data: profile } = await supabase
      .from('profiles')
      .select('family_id, subscription_tier, active_baby_id')
      .eq('id', user.id)
      .single()
    if (!profile?.family_id) return null

    const babyId = ctx?.babyId || profile.active_baby_id

    if (babyId) {
      const { data: baby, error: babyError } = await supabase
        .from('babies')
        .select('current_week, stage')
        .eq('id', babyId)
        .single()
      if (babyError && babyError.code !== 'PGRST116') throw babyError
      if (baby && baby.current_week !== null && baby.stage) {
        return {
          userId: user.id,
          familyId: profile.family_id,
          babyId,
          subscriptionTier: profile.subscription_tier ?? undefined,
          stage: baby.stage,
          currentWeek: baby.current_week,
        }
      }
    }

    const { data: family, error: familyError } = await supabase
      .from('families')
      .select('current_week, stage')
      .eq('id', profile.family_id)
      .single()
    if (familyError && familyError.code !== 'PGRST116') throw familyError
    if (!family || family.current_week === null || !family.stage) return null
    return {
      userId: user.id,
      familyId: profile.family_id,
      subscriptionTier: profile.subscription_tier ?? undefined,
      stage: family.stage,
      currentWeek: family.current_week,
    }
  }

  return {
    async getCurrentBriefing(ctx?: Partial<BriefingContext>): Promise<BriefingTemplate | null> {
      const resolved = await resolveBriefingContext(ctx)
      if (!resolved) return null

      // Build briefing_id based on stage and week
      let briefingId: string
      if (isPregnancyStage(resolved.stage as FamilyStage)) {
        briefingId = `PREG-W${String(resolved.currentWeek).padStart(2, '0')}`
      } else {
        // Post-birth: weeks 1-12 use W format, after that use month format
        if (resolved.currentWeek <= 12) {
          briefingId = `POST-W${String(resolved.currentWeek).padStart(2, '0')}`
        } else {
          const month = Math.ceil(resolved.currentWeek / 4)
          briefingId = `POST-M${String(month).padStart(2, '0')}`
        }
      }

      const { data: briefing, error: briefingError } = await supabase
        .from('briefing_templates')
        .select('*')
        .eq('briefing_id', briefingId)
        .maybeSingle()

      if (briefingError) throw briefingError
      return briefing as BriefingTemplate | null
    },

    async getBriefingByWeek(stage: string, week: number): Promise<BriefingTemplate | null> {
      let briefingId: string
      // Check if stage is any pregnancy stage (first/second/third-trimester or legacy 'pregnancy')
      if (isPregnancyStage(stage as FamilyStage)) {
        briefingId = `PREG-W${String(week).padStart(2, '0')}`
      } else {
        if (week <= 12) {
          briefingId = `POST-W${String(week).padStart(2, '0')}`
        } else {
          const month = Math.ceil(week / 4)
          briefingId = `POST-M${String(month).padStart(2, '0')}`
        }
      }

      const { data: briefing, error } = await supabase
        .from('briefing_templates')
        .select('*')
        .eq('briefing_id', briefingId)
        .maybeSingle()

      if (error) throw error
      return briefing as BriefingTemplate | null
    },

    async getBriefingTeaser(stage: FamilyStage, week: number): Promise<{ title: string; baby_update: string | null } | null> {
      const { data, error } = await supabase
        .from('briefing_templates')
        .select('title, baby_update')
        .eq('stage', stage)
        .eq('week', week)
        .maybeSingle()

      if (error) throw error
      return data
    },

    async getAllBriefings(): Promise<BriefingTemplate[]> {
      const { data, error } = await supabase
        .from('briefing_templates')
        .select('*')
        .order('stage', { ascending: true })
        .order('week', { ascending: true })

      if (error) throw error
      return (data || []) as BriefingTemplate[]
    },
  }
}

export type BriefingService = ReturnType<typeof createBriefingService>
