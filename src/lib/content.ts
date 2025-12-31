import { createServerSupabaseClient } from '@/lib/supabase/server'

export interface Article {
  slug: string
  title: string
  stage: string
  stageLabel: string
  week?: number | null
  excerpt: string
  readTime: number
  isFree: boolean
  reviewedBy?: string | null
  content: string
  sources?: string[]
}

export interface Video {
  slug: string
  title: string
  source: string
  description: string
  url: string
  youtubeId?: string | null
  stage: string
  stageLabel: string
  duration?: number | null
  thumbnail?: string | null
}

export interface ContentCounts {
  articles: number
  videos: number
}

export interface StageInfo {
  id: string
  label: string
  articleCount: number
  videoCount: number
}

// Stage mapping
export const stageConfig: Record<string, { label: string; order: number }> = {
  'first-trimester': { label: 'First Trimester', order: 1 },
  'second-trimester': { label: 'Second Trimester', order: 2 },
  'third-trimester': { label: 'Third Trimester', order: 3 },
  'delivery': { label: 'Delivery & Week 1', order: 4 },
  'fourth-trimester': { label: 'Fourth Trimester', order: 5 },
  '3-6-months': { label: '3-6 Months', order: 6 },
  '6-12-months': { label: '6-12 Months', order: 7 },
  '12-18-months': { label: '12-18 Months', order: 8 },
  '18-24-months': { label: '18-24 Months', order: 9 },
}

// Transform database row to Article interface
function transformArticle(row: Record<string, unknown>): Article {
  return {
    slug: row.slug as string,
    title: row.title as string,
    stage: row.stage as string,
    stageLabel: row.stage_label as string,
    week: row.week as number | null,
    excerpt: (row.excerpt as string) || '',
    readTime: row.read_time as number,
    isFree: row.is_free as boolean,
    reviewedBy: row.reviewed_by as string | null,
    content: row.content as string,
    sources: (row.sources as string[]) || [],
  }
}

// Transform database row to Video interface
function transformVideo(row: Record<string, unknown>): Video {
  return {
    slug: row.slug as string,
    title: row.title as string,
    source: row.source as string,
    description: (row.description as string) || '',
    url: row.url as string,
    youtubeId: row.youtube_id as string | null,
    stage: row.stage as string,
    stageLabel: row.stage_label as string,
    duration: row.duration as number | null,
    thumbnail: row.thumbnail as string | null,
  }
}

export async function getArticles(): Promise<Article[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('week', { ascending: true, nullsFirst: false })

  if (error) {
    console.error('Error fetching articles:', error)
    return []
  }

  return (data || []).map(transformArticle)
}

export async function getVideos(): Promise<Video[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('stage', { ascending: true })

  if (error) {
    console.error('Error fetching videos:', error)
    return []
  }

  return (data || []).map(transformVideo)
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    console.error('Error fetching article:', error)
    return null
  }

  return transformArticle(data)
}

export async function getVideoBySlug(slug: string): Promise<Video | null> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    console.error('Error fetching video:', error)
    return null
  }

  return transformVideo(data)
}

export async function getContentCounts(): Promise<ContentCounts> {
  const supabase = await createServerSupabaseClient()

  const [articlesResult, videosResult] = await Promise.all([
    supabase.from('articles').select('*', { count: 'exact', head: true }),
    supabase.from('videos').select('*', { count: 'exact', head: true }),
  ])

  return {
    articles: articlesResult.count || 0,
    videos: videosResult.count || 0,
  }
}

export async function getRelatedArticles(
  currentSlug: string,
  stage: string,
  limit: number = 3
): Promise<Article[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('stage', stage)
    .neq('slug', currentSlug)
    .limit(limit)

  if (error) {
    console.error('Error fetching related articles:', error)
    return []
  }

  return (data || []).map(transformArticle)
}

export async function getStages(): Promise<StageInfo[]> {
  const supabase = await createServerSupabaseClient()

  // Get counts by stage for both articles and videos
  const [articlesResult, videosResult] = await Promise.all([
    supabase.from('articles').select('stage'),
    supabase.from('videos').select('stage'),
  ])

  const stageCounts = new Map<string, { articles: number; videos: number }>()

  // Count articles per stage
  for (const row of articlesResult.data || []) {
    const current = stageCounts.get(row.stage) || { articles: 0, videos: 0 }
    current.articles++
    stageCounts.set(row.stage, current)
  }

  // Count videos per stage
  for (const row of videosResult.data || []) {
    const current = stageCounts.get(row.stage) || { articles: 0, videos: 0 }
    current.videos++
    stageCounts.set(row.stage, current)
  }

  return Object.entries(stageConfig)
    .sort(([, a], [, b]) => a.order - b.order)
    .map(([id, config]) => ({
      id,
      label: config.label,
      articleCount: stageCounts.get(id)?.articles || 0,
      videoCount: stageCounts.get(id)?.videos || 0,
    }))
}

export async function searchContent(
  query: string
): Promise<{ articles: Article[]; videos: Video[] }> {
  const supabase = await createServerSupabaseClient()

  const [articlesResult, videosResult] = await Promise.all([
    supabase
      .from('articles')
      .select('*')
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
      .limit(20),
    supabase
      .from('videos')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,source.ilike.%${query}%`)
      .limit(20),
  ])

  return {
    articles: (articlesResult.data || []).map(transformArticle),
    videos: (videosResult.data || []).map(transformVideo),
  }
}

export async function getFilteredContent(options: {
  stage?: string
  format?: 'articles' | 'videos' | 'all'
  search?: string
  limit?: number
  offset?: number
}): Promise<{
  articles: Article[]
  videos: Video[]
  totalArticles: number
  totalVideos: number
}> {
  const supabase = await createServerSupabaseClient()

  // Build article query
  let articleQuery = supabase.from('articles').select('*', { count: 'exact' })
  let videoQuery = supabase.from('videos').select('*', { count: 'exact' })

  // Filter by stage
  if (options.stage && options.stage !== 'all') {
    articleQuery = articleQuery.eq('stage', options.stage)
    videoQuery = videoQuery.eq('stage', options.stage)
  }

  // Filter by search
  if (options.search) {
    const search = options.search
    articleQuery = articleQuery.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`)
    videoQuery = videoQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%,source.ilike.%${search}%`)
  }

  // Order
  articleQuery = articleQuery.order('week', { ascending: true, nullsFirst: false })
  videoQuery = videoQuery.order('stage', { ascending: true })

  // Execute queries based on format
  let articles: Article[] = []
  let videos: Video[] = []
  let totalArticles = 0
  let totalVideos = 0

  if (options.format !== 'videos') {
    const { data, count, error } = await articleQuery

    if (!error) {
      articles = (data || []).map(transformArticle)
      totalArticles = count || 0
    }
  }

  if (options.format !== 'articles') {
    const { data, count, error } = await videoQuery

    if (!error) {
      videos = (data || []).map(transformVideo)
      totalVideos = count || 0
    }
  }

  return { articles, videos, totalArticles, totalVideos }
}

// Get article metadata only (for listing pages - more efficient)
export async function getArticlesList(): Promise<Omit<Article, 'content'>[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('articles')
    .select('slug, title, stage, stage_label, week, excerpt, read_time, is_free, reviewed_by, sources')
    .order('week', { ascending: true, nullsFirst: false })

  if (error) {
    console.error('Error fetching articles list:', error)
    return []
  }

  return (data || []).map((row) => ({
    slug: row.slug,
    title: row.title,
    stage: row.stage,
    stageLabel: row.stage_label,
    week: row.week,
    excerpt: row.excerpt || '',
    readTime: row.read_time,
    isFree: row.is_free,
    reviewedBy: row.reviewed_by,
    sources: row.sources || [],
    content: '', // Not fetched for list
  }))
}
