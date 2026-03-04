'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { TimelineMilestone, TimelineDot } from '@/types/timeline'

const supabase = createClient()

async function fetchTimeline(): Promise<TimelineMilestone[]> {
  const { data: milestones, error: mErr } = await supabase
    .from('timeline_milestones')
    .select('*')
    .order('sort_order', { ascending: true })

  if (mErr) throw mErr
  if (!milestones || milestones.length === 0) return []

  const { data: dots, error: dErr } = await supabase
    .from('timeline_dots')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (dErr) throw dErr

  const dotsByMilestone = new Map<string, TimelineDot[]>()
  for (const dot of (dots || [])) {
    const list = dotsByMilestone.get(dot.milestone_id) || []
    list.push(dot as TimelineDot)
    dotsByMilestone.set(dot.milestone_id, list)
  }

  return milestones.map((m) => ({
    ...m,
    dots: dotsByMilestone.get(m.id) || [],
  })) as TimelineMilestone[]
}

export function useSnakeTimeline() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['snake-timeline'],
    queryFn: fetchTimeline,
    staleTime: 1000 * 60 * 10, // 10 minutes — content changes rarely
  })

  return {
    milestones: data || [],
    loading: isLoading,
    error,
  }
}
