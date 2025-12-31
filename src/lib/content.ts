import articlesData from '@/../content/articles.json'
import videosData from '@/../content/videos.json'

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

// Transform JSON data to match our interfaces
function transformArticle(data: (typeof articlesData)[0]): Article {
  return {
    slug: data.slug,
    title: data.title,
    stage: data.stage,
    stageLabel: data.stage_label,
    week: data.week,
    excerpt: data.excerpt,
    readTime: data.read_time,
    isFree: data.is_free,
    reviewedBy: data.reviewed_by,
    content: data.content,
    sources: data.sources,
  }
}

function transformVideo(data: (typeof videosData)[0]): Video {
  return {
    slug: data.slug,
    title: data.title,
    source: data.source,
    description: data.description,
    url: data.url,
    youtubeId: data.youtube_id,
    stage: data.stage,
    stageLabel: data.stage_label,
    duration: data.duration,
    thumbnail: data.thumbnail,
  }
}

// Cache transformed data
let articlesCache: Article[] | null = null
let videosCache: Video[] | null = null

export async function getArticles(): Promise<Article[]> {
  if (!articlesCache) {
    articlesCache = articlesData.map(transformArticle)
  }
  return articlesCache
}

export async function getVideos(): Promise<Video[]> {
  if (!videosCache) {
    videosCache = videosData.map(transformVideo)
  }
  return videosCache
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await getArticles()
  return articles.find((a) => a.slug === slug) || null
}

export async function getVideoBySlug(slug: string): Promise<Video | null> {
  const videos = await getVideos()
  return videos.find((v) => v.slug === slug) || null
}

export async function getContentCounts(): Promise<ContentCounts> {
  const [articles, videos] = await Promise.all([getArticles(), getVideos()])
  return {
    articles: articles.length,
    videos: videos.length,
  }
}

export async function getRelatedArticles(
  currentSlug: string,
  stage: string,
  limit: number = 3
): Promise<Article[]> {
  const articles = await getArticles()
  return articles.filter((a) => a.slug !== currentSlug && a.stage === stage).slice(0, limit)
}

export async function getStages(): Promise<StageInfo[]> {
  const [articles, videos] = await Promise.all([getArticles(), getVideos()])

  const stageCounts = new Map<string, { articles: number; videos: number }>()

  for (const article of articles) {
    const current = stageCounts.get(article.stage) || { articles: 0, videos: 0 }
    current.articles++
    stageCounts.set(article.stage, current)
  }

  for (const video of videos) {
    const current = stageCounts.get(video.stage) || { articles: 0, videos: 0 }
    current.videos++
    stageCounts.set(video.stage, current)
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
  const [articles, videos] = await Promise.all([getArticles(), getVideos()])

  const lowerQuery = query.toLowerCase()

  const matchedArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(lowerQuery) ||
      a.excerpt.toLowerCase().includes(lowerQuery) ||
      a.stageLabel.toLowerCase().includes(lowerQuery)
  )

  const matchedVideos = videos.filter(
    (v) =>
      v.title.toLowerCase().includes(lowerQuery) ||
      v.description.toLowerCase().includes(lowerQuery) ||
      v.source.toLowerCase().includes(lowerQuery) ||
      v.stageLabel.toLowerCase().includes(lowerQuery)
  )

  return { articles: matchedArticles, videos: matchedVideos }
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
  let [articles, videos] = await Promise.all([getArticles(), getVideos()])

  // Filter by stage
  if (options.stage && options.stage !== 'all') {
    articles = articles.filter((a) => a.stage === options.stage)
    videos = videos.filter((v) => v.stage === options.stage)
  }

  // Filter by search
  if (options.search) {
    const lowerSearch = options.search.toLowerCase()
    articles = articles.filter(
      (a) =>
        a.title.toLowerCase().includes(lowerSearch) ||
        a.excerpt.toLowerCase().includes(lowerSearch)
    )
    videos = videos.filter(
      (v) =>
        v.title.toLowerCase().includes(lowerSearch) ||
        v.description.toLowerCase().includes(lowerSearch) ||
        v.source.toLowerCase().includes(lowerSearch)
    )
  }

  // Filter by format
  if (options.format === 'articles') {
    videos = []
  } else if (options.format === 'videos') {
    articles = []
  }

  const totalArticles = articles.length
  const totalVideos = videos.length

  // Apply pagination
  if (options.offset !== undefined && options.limit !== undefined) {
    articles = articles.slice(options.offset, options.offset + options.limit)
    videos = videos.slice(options.offset, options.offset + options.limit)
  } else if (options.limit !== undefined) {
    articles = articles.slice(0, options.limit)
    videos = videos.slice(0, options.limit)
  }

  return { articles, videos, totalArticles, totalVideos }
}
