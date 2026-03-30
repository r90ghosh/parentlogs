import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { ArrowLeft, Clock, BookOpen, CheckCircle, ArrowRight } from 'lucide-react'
import { getArticleBySlug, getRelatedArticles } from '@/lib/content'
import { ArticleContent } from '@/components/marketing/ArticleContent'
import { RelatedContent } from '@/components/marketing/RelatedContent'
import { Button } from '@/components/ui/button'
import { MedicalDisclaimer } from '@/components/shared/medical-disclaimer'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

// ISR - rebuild hourly for fresh content without sacrificing performance
export const revalidate = 3600

// Pre-build all article pages at deploy time
export async function generateStaticParams() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data } = await supabase.from('articles').select('slug')
  return (data || []).map((a) => ({ slug: a.slug }))
}

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
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      url: `/blog/${slug}`,
      publishedTime: article.createdAt,
      modifiedTime: article.updatedAt,
      section: article.stageLabel,
    },
  }
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
  const article = await getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const relatedArticles = await getRelatedArticles(slug, article.stage, 3)
  const colors = stageColors[article.stage] || { bg: 'bg-[--card]', text: 'text-[--muted]' }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.createdAt,
    dateModified: article.updatedAt,
    wordCount: article.content.split(/\s+/).length,
    articleSection: article.stageLabel,
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
      '@id': `https://thedadcenter.com/blog/${slug}`,
    },
  }

  return (
    <div className="min-h-screen bg-[--bg]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://thedadcenter.com',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Blog',
                item: 'https://thedadcenter.com/blog',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: article.stageLabel,
                item: `https://thedadcenter.com/blog?stage=${article.stage}`,
              },
              {
                '@type': 'ListItem',
                position: 4,
                name: article.title,
                item: `https://thedadcenter.com/blog/${slug}`,
              },
            ],
          }),
        }}
      />
      {/* Header */}
      <div className="bg-gradient-to-b from-[--surface] to-[--bg] pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-ui text-[--muted] hover:text-[--white] transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
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

        <ArticleContent content={article.content.replace(/^#\s+.+\n+/, '')} />

        {/* Sources */}
        {article.sources && article.sources.length > 0 && (
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

        {/* Bottom CTA */}
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

        {/* Related articles */}
        <RelatedContent articles={relatedArticles} currentStage={article.stage} />
      </article>
    </div>
  )
}
