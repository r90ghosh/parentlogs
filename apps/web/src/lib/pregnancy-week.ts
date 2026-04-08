import { createClient } from '@supabase/supabase-js'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export interface PregnancyWeekBriefing {
  week: number
  briefingId: string
  title: string
  babyUpdate: string | null
  momUpdate: string | null
  dadFocus: string[]
  relationshipTip: string | null
  medicalSource: string | null
  createdAt: string | null
}

function transformBriefing(row: Record<string, unknown>): PregnancyWeekBriefing {
  return {
    week: row.week as number,
    briefingId: row.briefing_id as string,
    title: row.title as string,
    babyUpdate: (row.baby_update as string | null) ?? null,
    momUpdate: (row.mom_update as string | null) ?? null,
    dadFocus: (row.dad_focus as string[] | null) ?? [],
    relationshipTip: (row.relationship_tip as string | null) ?? null,
    medicalSource: (row.medical_source as string | null) ?? null,
    createdAt: (row.created_at as string | null) ?? null,
  }
}

const PREGNANCY_PREFIX = 'PREG-W'

function buildBriefingId(week: number): string {
  return `${PREGNANCY_PREFIX}${String(week).padStart(2, '0')}`
}

export async function getPregnancyWeekBriefing(
  week: number
): Promise<PregnancyWeekBriefing | null> {
  if (!Number.isInteger(week) || week < 1 || week > 40) return null

  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('briefing_templates')
    .select('*')
    .eq('briefing_id', buildBriefingId(week))
    .maybeSingle()

  if (error || !data) return null
  return transformBriefing(data as unknown as Record<string, unknown>)
}

export async function getAllPregnancyWeeks(): Promise<
  Pick<PregnancyWeekBriefing, 'week' | 'title'>[]
> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('briefing_templates')
    .select('week, title, briefing_id')
    .like('briefing_id', `${PREGNANCY_PREFIX}%`)
    .order('week', { ascending: true })

  if (error || !data) return []
  return data.map((row) => ({ week: row.week as number, title: row.title as string }))
}

// generateStaticParams runs without server context — use anon client directly,
// matching the pattern in lib/blog.ts:131.
export async function getPregnancyWeeksForStaticParams(): Promise<number[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data } = await supabase
    .from('briefing_templates')
    .select('week')
    .like('briefing_id', `${PREGNANCY_PREFIX}%`)
    .order('week', { ascending: true })

  return (data || []).map((row) => row.week as number)
}
