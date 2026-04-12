import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-static'
export const revalidate = 86400 // regenerate daily

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://thedadcenter.com'

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/videos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/budget-guide`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/baby-checklists`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tips`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/upgrade`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Checklist detail pages
  const checklistPages: MetadataRoute.Sitemap = Array.from({ length: 15 }, (_, i) => ({
    url: `${baseUrl}/baby-checklists/CL-${String(i + 1).padStart(2, '0')}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Tip detail pages
  const tipSlugs = ['baby-changing', 'bottle-prep', 'swaddling', 'bath-time', 'car-seat', 'burping']
  const tipPages: MetadataRoute.Sitemap = tipSlugs.map((slug) => ({
    url: `${baseUrl}/tips/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Pregnancy week guide index + trimester pages
  const pregnancyIndex: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/pregnancy-week`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pregnancy-week/first-trimester`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/pregnancy-week/second-trimester`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/pregnancy-week/third-trimester`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
  ]

  // Blog posts + per-week pregnancy pages (share one anon client)
  let blogPages: MetadataRoute.Sitemap = []
  let pregnancyWeekPages: MetadataRoute.Sitemap = []
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: blogData } = await supabase
      .from('blog_posts')
      .select('slug, published_at, updated_at')
      .eq('status', 'published')

    if (blogData) {
      blogPages = blogData.map((post) => {
        const lastModified =
          post.updated_at
            ? new Date(post.updated_at)
            : post.published_at
              ? new Date(post.published_at)
              : new Date()
        return {
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified,
          changeFrequency: 'monthly' as const,
          priority: 0.8,
        }
      })
    }

    const { data: weekData } = await supabase
      .from('briefing_templates')
      .select('week')
      .like('briefing_id', 'PREG-W%')
      .order('week')

    if (weekData) {
      pregnancyWeekPages = weekData.map((row) => ({
        url: `${baseUrl}/pregnancy-week/${row.week}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }))
    }
  } catch (error) {
    console.error('Error fetching dynamic sitemap entries:', error)
  }

  return [
    ...staticPages,
    ...blogPages,
    ...checklistPages,
    ...tipPages,
    ...pregnancyIndex,
    ...pregnancyWeekPages,
  ]
}
