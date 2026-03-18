import { createClient } from '@/lib/supabase/client'
import { BriefingTemplate, FamilyStage } from '@/types'
import { isPregnancyStage } from '@/lib/pregnancy-utils'

const supabase = createClient()

export const briefingService = {
  async getCurrentBriefing(): Promise<BriefingTemplate | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('family_id')
      .eq('id', user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') throw profileError
    if (!profile?.family_id) return null

    const { data: family, error: familyError } = await supabase
      .from('families')
      .select('current_week, stage')
      .eq('id', profile.family_id)
      .single()

    if (familyError && familyError.code !== 'PGRST116') throw familyError
    if (!family || family.current_week === null) return null

    const currentWeek = family.current_week

    // Build briefing_id based on stage and week
    let briefingId: string
    if (isPregnancyStage(family.stage as FamilyStage)) {
      briefingId = `PREG-W${String(currentWeek).padStart(2, '0')}`
    } else {
      // Post-birth: weeks 1-12 use W format, after that use month format
      if (currentWeek <= 12) {
        briefingId = `POST-W${String(currentWeek).padStart(2, '0')}`
      } else {
        const month = Math.ceil(currentWeek / 4)
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
