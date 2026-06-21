import type { Metadata } from 'next'
import { getServerAuth } from '@/lib/supabase/server-auth'
import { getArticles } from '@/lib/content'
import { DashboardClient, type RecommendedArticle } from '@/components/dashboard/DashboardClient'

export const metadata: Metadata = {
  title: 'Dashboard | The Dad Center',
}

/** Ordered article-stage preferences for the "Recommended read" pick. */
function preferredArticleStages(stage: string, week: number): string[] {
  switch (stage) {
    case 'first-trimester':
      return ['first-trimester', 'second-trimester']
    case 'second-trimester':
      return ['second-trimester', 'first-trimester', 'third-trimester']
    case 'third-trimester':
      return ['third-trimester', 'delivery', 'second-trimester']
    case 'post-birth':
      if (week <= 12) return ['fourth-trimester', 'delivery', '3-6-months']
      if (week <= 26) return ['3-6-months', 'fourth-trimester', '6-12-months']
      if (week <= 52) return ['6-12-months', '3-6-months', '12-18-months']
      if (week <= 78) return ['12-18-months', '6-12-months', '18-24-months']
      return ['18-24-months', '12-18-months']
    case 'pregnancy':
    default:
      if (week <= 13) return ['first-trimester']
      if (week <= 27) return ['second-trimester']
      return ['third-trimester']
  }
}

export default async function DashboardPage() {
  const { family, activeBaby } = await getServerAuth()
  const stage = (activeBaby?.stage ?? family?.stage ?? 'pregnancy') as string
  const week = activeBaby?.current_week ?? family?.current_week ?? 1

  let recommendedArticle: RecommendedArticle | null = null
  try {
    const articles = await getArticles()
    if (articles.length > 0) {
      const wanted = preferredArticleStages(stage, week)
      const pick =
        wanted.map((s) => articles.find((a) => a.stage === s)).find(Boolean) ?? articles[0]
      if (pick) {
        recommendedArticle = {
          slug: pick.slug,
          title: pick.title,
          excerpt: pick.excerpt,
          readTime: pick.readTime,
          isFree: pick.isFree,
          stageLabel: pick.stageLabel,
        }
      }
    }
  } catch {
    recommendedArticle = null
  }

  return <DashboardClient recommendedArticle={recommendedArticle} />
}
