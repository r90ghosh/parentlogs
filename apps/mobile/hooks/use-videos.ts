import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export interface Video {
  id: string
  slug: string
  title: string
  source: string
  description: string | null
  url: string
  youtube_id: string | null
  stage: string
  stage_label: string
  duration: number | null
  thumbnail: string | null
}

async function getVideos(stage?: string): Promise<Video[]> {
  let query = supabase
    .from('videos')
    .select('id, slug, title, source, description, url, youtube_id, stage, stage_label, duration, thumbnail')
    .order('stage', { ascending: true })

  if (stage) {
    query = query.eq('stage', stage)
  }

  const { data, error } = await query
  if (error) throw error
  return (data || []) as Video[]
}

export function useVideos(stage?: string) {
  return useQuery({
    queryKey: ['videos', stage],
    queryFn: () => getVideos(stage),
    staleTime: 1000 * 60 * 10,
  })
}
