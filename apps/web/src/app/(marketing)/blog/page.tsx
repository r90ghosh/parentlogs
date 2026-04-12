import type { Metadata } from 'next'
import Link from 'next/link'
import { PenLine, Baby, ArrowRight } from 'lucide-react'
import { getPublishedPosts, blogCategories, blogStages, type BlogCategory } from '@/lib/blog'
import { BlogCard } from '@/components/marketing/BlogCard'
import { EmailCapture } from '@/components/marketing/EmailCapture'
import { MedicalDisclaimer } from '@/components/shared/medical-disclaimer'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Dad Guides, Tips & Real Costs | The Dad Center',
  description:
    'Practical guides, real cost breakdowns, and honest advice for expecting and new dads. No fluff, no condescension — just what you need to know.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog — Guides, Tips & Real Numbers for Dads',
    description:
      'Practical guides, real cost breakdowns, and honest advice for expecting and new dads.',
    type: 'website',
    url: 'https://thedadcenter.com/blog',
  },
}

interface PageProps {
  searchParams: Promise<{ category?: string; stage?: string }>
}

export default async function BlogPage({ searchParams }: PageProps) {
  const { category, stage } = await searchParams
  const posts = await getPublishedPosts(category, stage)
  const activeCategory = category || 'all'
  const activeStage = stage || 'all'

  const categories = [
    { key: 'all', label: 'All' },
    ...Object.entries(blogCategories).map(([key, val]) => ({
      key,
      label: val.label,
    })),
  ]

  const stages = [
    { key: 'all', label: 'All Stages' },
    ...Object.entries(blogStages).map(([key, label]) => ({
      key,
      label,
    })),
  ]

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'The Dad Center Blog',
    description: 'Guides, tips, and real numbers for expecting and new dads.',
    url: 'https://thedadcenter.com/blog',
    mainEntity: posts.map((post, i) => ({
      '@type': 'Article',
      position: i + 1,
      headline: post.title,
      description: post.excerpt,
      url: `https://thedadcenter.com/blog/${post.slug}`,
      datePublished: post.publishedAt,
      author: { '@type': 'Person', name: 'The Dad Center Team' },
    })),
  }

  return (
    <div className="min-h-screen bg-[--bg]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      {/* Header */}
      <div className="bg-gradient-to-b from-[--surface] to-[--bg] pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-copper/10 text-copper font-ui text-xs font-medium mb-6">
            <PenLine className="h-3.5 w-3.5" />
            Blog
          </div>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[--white] mb-4">
            Guides, Tips & Real Numbers
          </h1>
          <p className="font-body text-lg text-[--muted] max-w-2xl mx-auto">
            Practical advice for expecting and new dads. No fluff, no condescension — just what you
            need to know.
          </p>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <MedicalDisclaimer />
      </div>

      {/* Pregnancy week guide callout */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link
          href="/pregnancy-week"
          className="group flex items-center gap-4 p-5 rounded-2xl bg-copper/5 border border-copper/20 hover:border-copper/40 hover:bg-copper/10 transition-colors"
        >
          <div className="shrink-0 w-12 h-12 rounded-xl bg-copper/15 flex items-center justify-center">
            <Baby className="h-6 w-6 text-copper" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-lg font-semibold text-[--white]">
              Pregnancy Week-by-Week Guide
            </h2>
            <p className="font-body text-sm text-[--muted]">
              Free walkthrough for dads, weeks 4 through 40 — baby development, partner support, and what to focus on.
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-[--muted] group-hover:text-copper transition-colors shrink-0" />
        </Link>
      </div>

      {/* Filters */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-1">
        {/* Topic Label */}
        <p className="font-ui text-[10px] font-bold uppercase tracking-[0.1em] text-[--dim]">Topic</p>
        {/* Category Filter */}
        <div className="flex items-center gap-1 flex-wrap">
          {categories.map((cat) => {
            const params = new URLSearchParams()
            if (cat.key !== 'all') params.set('category', cat.key)
            if (activeStage !== 'all') params.set('stage', activeStage)
            const href = params.toString() ? `/blog?${params}` : '/blog'
            return (
              <Link
                key={cat.key}
                href={href}
                className={`px-3 py-2 font-ui text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeCategory === cat.key
                    ? 'text-copper border-b-2 border-copper'
                    : 'text-[--muted] border-b-2 border-transparent hover:text-[--cream]'
                }`}
              >
                {cat.label}
              </Link>
            )
          })}
        </div>

        {/* Stage Label */}
        <p className="font-ui text-[10px] font-bold uppercase tracking-[0.1em] text-[--dim] pt-2">Stage</p>
        {/* Stage Filter */}
        <div className="flex items-center gap-1 flex-wrap">
          {stages.map((s) => {
            const params = new URLSearchParams()
            if (activeCategory !== 'all') params.set('category', activeCategory)
            if (s.key !== 'all') params.set('stage', s.key)
            const href = params.toString() ? `/blog?${params}` : '/blog'
            return (
              <Link
                key={s.key}
                href={href}
                className={`px-3 py-2 font-ui text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeStage === s.key
                    ? 'text-copper border-b-2 border-copper/40'
                    : 'text-[--muted] border-b-2 border-transparent hover:text-[--cream]'
                }`}
              >
                {s.label}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="font-body text-lg text-[--muted] mb-2">No posts yet.</p>
            <p className="font-body text-sm text-[--dim]">
              Check back soon — we&apos;re working on something good.
            </p>
          </div>
        )}
      </div>

      {/* Email Capture */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <EmailCapture
          source="blog"
          heading="Get weekly dad tips"
          description="Practical advice for expecting and new dads — no spam, unsubscribe anytime."
        />
      </div>
    </div>
  )
}
