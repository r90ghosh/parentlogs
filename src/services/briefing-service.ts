import { createClient } from '@/lib/supabase/client'
import { BriefingTemplate } from '@/types'

const supabase = createClient()

export const briefingService = {
  async getCurrentBriefing(): Promise<BriefingTemplate | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('family_id')
      .eq('id', user.id)
      .single()

    if (!profile?.family_id) return null

    const { data: family } = await supabase
      .from('families')
      .select('current_week, stage')
      .eq('id', profile.family_id)
      .single()

    if (!family) return null

    // Build briefing_id based on stage and week
    let briefingId: string
    if (family.stage === 'pregnancy') {
      briefingId = `PREG-W${String(family.current_week).padStart(2, '0')}`
    } else {
      // Post-birth: weeks 1-12 use W format, after that use month format
      if (family.current_week <= 12) {
        briefingId = `POST-W${String(family.current_week).padStart(2, '0')}`
      } else {
        const month = Math.ceil(family.current_week / 4)
        briefingId = `POST-M${String(month).padStart(2, '0')}`
      }
    }

    const { data: briefing } = await supabase
      .from('briefing_templates')
      .select('*')
      .eq('briefing_id', briefingId)
      .single()

    return briefing as BriefingTemplate | null
  },

  async getBriefingByWeek(stage: string, week: number): Promise<BriefingTemplate | null> {
    let briefingId: string
    if (stage === 'pregnancy') {
      briefingId = `PREG-W${String(week).padStart(2, '0')}`
    } else {
      if (week <= 12) {
        briefingId = `POST-W${String(week).padStart(2, '0')}`
      } else {
        const month = Math.ceil(week / 4)
        briefingId = `POST-M${String(month).padStart(2, '0')}`
      }
    }

    const { data: briefing } = await supabase
      .from('briefing_templates')
      .select('*')
      .eq('briefing_id', briefingId)
      .single()

    return briefing as BriefingTemplate | null
  },

  async getAllBriefings(): Promise<BriefingTemplate[]> {
    const { data } = await supabase
      .from('briefing_templates')
      .select('*')
      .order('stage', { ascending: true })
      .order('week', { ascending: true })

    return (data || []) as BriefingTemplate[]
  },
}
