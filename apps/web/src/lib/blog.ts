import { createClient } from '@supabase/supabase-js'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export interface BlogPost {
  slug: string
  title: string
  content: string
  excerpt: string
  category: string
  tags: string[]
  featuredImage: string | null
  metaTitle: string | null
  metaDescription: string | null
  publishedAt: string
  updatedAt: string
  createdAt: string
  author: string
  readTime: number
}

export const blogCategories = {
  budget: { label: 'Budget & Costs', color: 'bg-gold/10 text-gold' },
  guides: { label: 'Dad Guides', color: 'bg-copper/10 text-copper' },
  lifestyle: { label: 'New Dad Life', color: 'bg-sage/10 text-sage' },
} as const

export type BlogCategory = keyof typeof blogCategories

export const blogStages = {
  'first-trimester': 'First Trimester',
  'second-trimester': 'Second Trimester',
  'third-trimester': 'Third Trimester',
  'delivery': 'Delivery & Week 1',
  'fourth-trimester': 'Fourth Trimester',
  '3-6-months': '3-6 Months',
  '6-12-months': '6-12 Months',
  '12-18-months': '12-18 Months',
  '18-24-months': '18-24 Months',
} as const

export type BlogStage = keyof typeof blogStages

function transformPost(row: Record<string, unknown>): BlogPost {
  return {
    slug: row.slug as string,
    title: row.title as string,
    content: row.content as string,
    excerpt: (row.excerpt as string) || '',
    category: row.category as string,
    tags: (row.tags as string[]) || [],
    featuredImage: row.featured_image as string | null,
    metaTitle: row.meta_title as string | null,
    metaDescription: row.meta_description as string | null,
    publishedAt: row.published_at as string,
    updatedAt: row.updated_at as string,
    createdAt: row.created_at as string,
    author: row.author as string,
    readTime: row.read_time as number,
  }
}

export async function getPublishedPosts(category?: string, stage?: string): Promise<BlogPost[]> {
  const supabase = await createServerSupabaseClient()

  let query = supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  if (stage && stage !== 'all') {
    query = query.contains('tags', [stage])
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }

  return (data || []).map(transformPost)
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !data) {
    return null
  }

  return transformPost(data)
}

export async function getRelatedPosts(
  currentSlug: string,
  category: string,
  limit: number = 3
): Promise<BlogPost[]> {
  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .eq('category', category)
    .neq('slug', currentSlug)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching related posts:', error)
    return []
  }

  return (data || []).map(transformPost)
}

// For generateStaticParams and sitemap — uses anon client (no server context)
export async function getAllPublishedSlugs(): Promise<{ slug: string; publishedAt: string }[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data } = await supabase
    .from('blog_posts')
    .select('slug, published_at')
    .eq('status', 'published')

  return (data || []).map((row) => ({
    slug: row.slug,
    publishedAt: row.published_at,
  }))
}
