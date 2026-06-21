import type { Metadata } from 'next'
import { getServerAuth } from '@/lib/supabase/server-auth'
import { getArticles, getVideos } from '@/lib/content'
import { preferredArticleStages } from '@/lib/article-stage'
import LibraryClient, { type LibraryArticle, type LibraryVideo } from './library-client'

export const metadata: Metadata = {
  title: 'Library | The Dad Center',
}

export default async function LibraryPage() {
  const { family, activeBaby } = await getServerAuth()
  const stage = (activeBaby?.stage ?? family?.stage ?? 'pregnancy') as string
  const week = activeBaby?.current_week ?? family?.current_week ?? 1

  const [articlesRaw, videosRaw] = await Promise.all([getArticles(), getVideos()])

  const articles: LibraryArticle[] = articlesRaw.map((a) => ({
    slug: a.slug,
    title: a.title,
    stage: a.stage,
    stageLabel: a.stageLabel,
    excerpt: a.excerpt,
    readTime: a.readTime,
    isFree: a.isFree,
  }))
  const videos: LibraryVideo[] = videosRaw.map((v) => ({
    title: v.title,
    source: v.source,
    url: v.url,
    stage: v.stage,
  }))

  const available = new Set(articles.map((a) => a.stage))
  const wanted = preferredArticleStages(stage, week)
  const defaultStage = wanted.find((s) => available.has(s)) ?? 'all'

  return <LibraryClient articles={articles} videos={videos} defaultStage={defaultStage} />
}
