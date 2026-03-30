import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, BookOpen, CheckCircle, ArrowRight } from 'lucide-react'
import { getArticleBySlug, getRelatedArticles } from '@/lib/content'
import { getServerAuth } from '@/lib/supabase/server-auth'
import { ArticleContent } from '@/components/marketing/ArticleContent'
import { PaywallGate } from '@/components/marketing/PaywallGate'
import { RelatedContent } from '@/components/marketing/RelatedContent'
import { Button } from '@/components/ui/button'
import { MedicalDisclaimer } from '@/components/shared/medical-disclaimer'

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
      title: 'Article Not Found | The Dad Center',
    }
  }

  return {
    title: `${article.title} | The Dad Center`,
    description: article.excerpt,
    alternates: { canonical: `/content/articles/${slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      url: `/content/articles/${slug}`,
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
  'first-trimester': { bg: 'bg-rose-500/10', text: 'text-rose-400' },
  'second-trimester': { bg: 'bg-purple-500/10', text: 'text-purple-400' },
  'third-trimester': { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  'delivery': { bg: 'bg-copper/10', text: 'text-copper' },
  'fourth-trimester': { bg: 'bg-sage/10', text: 'text-sage' },
  '3-6-months': { bg: 'bg-sky/10', text: 'text-sky' },
  '6-12-months': { bg: 'bg-sky/10', text: 'text-sky' },
  '12-18-months': { bg: 'bg-copper/10', text: 'text-copper' },
  '18-24-months': { bg: 'bg-violet-500/10', text: 'text-violet-400' },
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const [article, { user, profile }] = await Promise.all([
    getArticleBySlug(slug),
    getServerAuth(),
  ])

  if (!article) {
    notFound()
  }

  const relatedArticles = await getRelatedArticles(slug, article.stage, 3)
  const colors = stageColors[article.stage] || { bg: 'bg-[--card]', text: 'text-[--muted]' }

  // Check if user is authenticated and has premium access
  const isAuthenticated = !!user
  const isPremium = profile?.subscription_tier === 'premium' || profile?.subscription_tier === 'lifetime'

  // Premium users and free articles get full content
  const isLocked = !article.isFree && !isPremium
  const displayContent = isLocked ? truncateContent(article.content) : article.content

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    author: {
      '@type': 'Organization',
      name: 'The Dad Center',
      url: 'https://thedadcenter.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'The Dad Center',
      url: 'https://thedadcenter.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://thedadcenter.com/images/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://thedadcenter.com/content/articles/${slug}`,
    },
  }

  return (
    <div className="min-h-screen bg-[--bg]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {/* Header */}
      <div className="bg-gradient-to-b from-[--surface] to-[--bg] pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/content"
            className="inline-flex items-center gap-2 font-ui text-[--muted] hover:text-[--white] transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Content
          </Link>

          {/* Article metadata */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span
              className={`font-ui px-3 py-1 rounded-md text-sm font-medium ${colors.bg} ${colors.text}`}
            >
              {article.week ? `Week ${article.week}` : article.stageLabel}
            </span>
            <span className="flex items-center gap-1.5 font-body text-[--dim]">
              <Clock className="h-4 w-4" />
              {article.readTime} min read
            </span>
            <span className="flex items-center gap-1.5 font-body text-[--dim]">
              <BookOpen className="h-4 w-4" />
              Article
            </span>
            {article.isFree && (
              <span className="px-2 py-0.5 rounded font-ui text-xs font-medium bg-sage/10 text-sage">
                FREE
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[--white] mb-6">
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className="font-body text-lg text-[--muted] mb-6">{article.excerpt}</p>

          {/* Reviewed by */}
          {article.reviewedBy && (
            <div className="flex items-center gap-2 font-body text-sm text-[--dim]">
              <CheckCircle className="h-4 w-4 text-sage" />
              <span>Reviewed by {article.reviewedBy}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <MedicalDisclaimer className="mb-4 max-w-2xl mx-auto" />

        <ArticleContent content={displayContent} />

        {/* Paywall gate for locked articles */}
        {isLocked && (
          <PaywallGate
            title={article.title}
            isAuthenticated={isAuthenticated}
          />
        )}

        {/* Sources */}
        {article.sources && article.sources.length > 0 && !isLocked && (
          <div className="mt-12 pt-8 border-t border-[--border]">
            <h3 className="font-display text-lg font-semibold text-[--white] mb-4">Sources</h3>
            <ul className="space-y-2">
              {article.sources.map((source, index) => (
                <li key={index} className="font-body text-sm text-[--muted]">
                  {source}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Bottom CTA for free articles - only show for unauthenticated users */}
        {!isLocked && !isAuthenticated && (
          <div className="mt-12 p-8 rounded-2xl bg-[--surface]/50 border border-[--border] text-center">
            <h3 className="font-display text-xl font-bold text-[--white] mb-3">
              Want personalized weekly briefings?
            </h3>
            <p className="font-body text-[--muted] mb-6 max-w-lg mx-auto">
              Get articles like this delivered based on your due date, plus task management,
              budget tracking, and partner sync.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-copper hover:bg-copper/80 text-white font-ui font-semibold"
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
