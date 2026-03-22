import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

interface Article {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  stage: string | null
  category: string | null
  is_free: boolean
  reviewed_by: string | null
  sources: string | null
  published_at: string | null
  created_at: string
}

export function useArticles(stage?: string) {
  return useQuery({
    queryKey: ['articles', stage],
    queryFn: async () => {
      let query = supabase
        .from('articles')
        .select('id, title, slug, excerpt, stage, category, is_free, reviewed_by, published_at')
        .order('published_at', { ascending: false })

      if (stage) {
        query = query.eq('stage', stage)
      }

      const { data, error } = await query
      if (error) throw error
      return (data || []) as Article[]
    },
    staleTime: 1000 * 60 * 10,
  })
}

export function useArticle(id: string) {
  return useQuery({
    queryKey: ['article', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data as Article
    },
    enabled: !!id,
  })
}

export type { Article }
