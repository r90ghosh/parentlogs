import type { AppSupabaseClient, ServiceContext } from './types'

export interface Article {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  stage: string | null
  is_free: boolean
  reviewed_by: string | null
  sources: string[] | null
  published_at: string | null
  created_at: string
}

export function createArticlesService(supabase: AppSupabaseClient) {
  return {
    async getArticles(stage?: string, ctx?: Partial<ServiceContext>): Promise<Article[]> {
      let query = supabase
        .from('articles')
        .select('id, title, slug, excerpt, stage, is_free, reviewed_by, created_at')
        .order('created_at', { ascending: false })

      if (stage) {
        query = query.eq('stage', stage)
      }

      const { data, error } = await query
      if (error) throw error
      return (data || []) as Article[]
    },

    async getArticleById(id: string, ctx?: Partial<ServiceContext>): Promise<Article | null> {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single()
      if (error && error.code !== 'PGRST116') throw error
      return data as Article | null
    },

    async getArticleBySlug(slug: string, ctx?: Partial<ServiceContext>): Promise<Article | null> {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .single()
      if (error && error.code !== 'PGRST116') throw error
      return data as Article | null
    },
  }
}

export type ArticlesService = ReturnType<typeof createArticlesService>
