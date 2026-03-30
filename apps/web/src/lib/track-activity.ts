import { createClient } from '@/lib/supabase/client'

type ActivityEvent =
  | 'briefing_viewed'
  | 'task_completed'
  | 'partner_invited'
  | 'mood_checkin'
  | 'page_active'

const COLUMN_MAP: Record<ActivityEvent, string> = {
  briefing_viewed: 'first_briefing_viewed_at',
  task_completed: 'first_task_completed_at',
  partner_invited: 'partner_invited_at',
  mood_checkin: 'first_mood_checkin_at',
  page_active: 'last_active_at',
}

export function trackActivity(userId: string, event: ActivityEvent) {
  const supabase = createClient()
  const column = COLUMN_MAP[event]
  const now = new Date().toISOString()

  if (event === 'page_active') {
    supabase.from('profiles').update({ [column]: now }).eq('id', userId).then()
  } else {
    supabase.from('profiles').update({ [column]: now }).eq('id', userId).is(column, null).then()
  }
}
