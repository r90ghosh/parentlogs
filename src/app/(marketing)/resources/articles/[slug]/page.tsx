import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, BookOpen, CheckCircle, ArrowRight } from 'lucide-react'
import { getArticleBySlug, getRelatedArticles } from '@/lib/content'
import { ArticleContent } from '@/components/marketing/ArticleContent'
import { PaywallGate } from '@/components/marketing/PaywallGate'
import { RelatedContent } from '@/components/marketing/RelatedContent'
import { Button } from '@/components/ui/button'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

// Dynamic rendering - articles are fetched on each request
// This enables real-time content updates without redeploy
export const dynamic = 'force-dynamic'

// Generate metadata for each article
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    return {
      title: 'Article Not Found | ParentLogs',
    }
  }

  return {
    title: `${article.title} | ParentLogs`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
    },
  }
}

// Truncate content for locked articles
function truncateContent(content: string, maxChars: number = 500): string {
  // Remove the title from content for preview
  const contentWithoutTitle = content.replace(/^#\s+.+\n+/, '')

  if (contentWithoutTitle.length <= maxChars) return contentWithoutTitle

  // Find a good break point (end of sentence or paragraph)
  let truncated = contentWithoutTitle.substring(0, maxChars)
  const lastPeriod = truncated.lastIndexOf('.')
  const lastNewline = truncated.lastIndexOf('\n\n')

  const breakPoint = Math.max(lastPeriod, lastNewline)
  if (breakPoint > maxChars / 2) {
    truncated = contentWithoutTitle.substring(0, breakPoint + 1)
  }

  return truncated + '\n\n...'
}

const stageColors: Record<string, { bg: string; text: string }> = {
  'first-trimester': { bg: 'bg-pink-500/10', text: 'text-pink-400' },
  'second-trimester': { bg: 'bg-purple-500/10', text: 'text-purple-400' },
  'third-trimester': { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  'delivery': { bg: 'bg-amber-500/10', text: 'text-amber-400' },
  'fourth-trimester': { bg: 'bg-green-500/10', text: 'text-green-400' },
  '3-6-months': { bg: 'bg-teal-500/10', text: 'text-teal-400' },
  '6-12-months': { bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
  '12-18-months': { bg: 'bg-indigo-500/10', text: 'text-indigo-400' },
  '18-24-months': { bg: 'bg-violet-500/10', text: 'text-violet-400' },
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const relatedArticles = await getRelatedArticles(slug, article.stage, 3)
  const colors = stageColors[article.stage] || { bg: 'bg-slate-500/10', text: 'text-slate-400' }

  // For now, show full content for free articles, truncated for locked
  // In production, you'd check auth state here
  const isLocked = !article.isFree
  const displayContent = isLocked ? truncateContent(article.content) : article.content

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Resources
          </Link>

          {/* Article metadata */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span
              className={`px-3 py-1 rounded-md text-sm font-medium ${colors.bg} ${colors.text}`}
            >
              {article.week ? `Week ${article.week}` : article.stageLabel}
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <Clock className="h-4 w-4" />
              {article.readTime} min read
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <BookOpen className="h-4 w-4" />
              Article
            </span>
            {article.isFree && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-500/10 text-green-400">
                FREE
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg text-slate-400 mb-6">{article.excerpt}</p>

          {/* Reviewed by */}
          {article.reviewedBy && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Reviewed by {article.reviewedBy}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ArticleContent content={displayContent} />

        {/* Paywall gate for locked articles */}
        {isLocked && <PaywallGate title={article.title} />}

        {/* Sources */}
        {article.sources && article.sources.length > 0 && !isLocked && (
          <div className="mt-12 pt-8 border-t border-slate-800">
            <h3 className="text-lg font-semibold text-white mb-4">Sources</h3>
            <ul className="space-y-2">
              {article.sources.map((source, index) => (
                <li key={index} className="text-sm text-slate-400">
                  {source}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Bottom CTA for free articles */}
        {!isLocked && (
          <div className="mt-12 p-8 rounded-2xl bg-slate-900/50 border border-slate-800 text-center">
            <h3 className="text-xl font-bold text-white mb-3">
              Want personalized weekly briefings?
            </h3>
            <p className="text-slate-400 mb-6 max-w-lg mx-auto">
              Get articles like this delivered based on your due date, plus task management,
              budget tracking, and partner sync.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
            >
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        )}

        {/* Related articles */}
        <RelatedContent articles={relatedArticles} currentStage={article.stage} />
      </article>
    </div>
  )
}
