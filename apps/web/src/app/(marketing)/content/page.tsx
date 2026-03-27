import { Suspense } from 'react'
import Link from 'next/link'
import { BookOpen, Video, ArrowRight, Sparkles } from 'lucide-react'
import { getFilteredContent, getStages, getContentCounts } from '@/lib/content'
import { getServerAuth } from '@/lib/supabase/server-auth'
import { ContentFilters } from '@/components/marketing/ContentFilters'
import { ResourceLibrary } from '@/components/marketing/ResourceLibrary'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Parenting Resources for Dads | The Dad Center',
  description:
    'Expert-reviewed articles and curated videos covering pregnancy through toddlerhood. Written for dads, by dads.',
}

interface PageProps {
  searchParams: Promise<{
    stage?: string
    format?: string
    search?: string
  }>
}

async function ResourcesContent({ searchParams }: PageProps) {
  const params = await searchParams
  const stage = params.stage || 'all'
  const format = (params.format as 'articles' | 'videos' | 'all') || 'all'
  const search = params.search || ''

  const [content, stages, counts] = await Promise.all([
    getFilteredContent({ stage, format, search }),
    getStages(),
    getContentCounts(),
  ])

  return (
    <>
      {/* Filters */}
      <ContentFilters
        stages={stages}
        currentStage={stage}
        currentFormat={format}
        searchQuery={search}
      />

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ResourceLibrary
          articles={content.articles}
          videos={content.videos}
          stages={stages}
          currentStage={stage}
          currentFormat={format}
          searchQuery={search}
          totalArticles={content.totalArticles}
          totalVideos={content.totalVideos}
        />
      </div>
    </>
  )
}

export default async function ResourcesPage(props: PageProps) {
  const [counts, { user, profile }] = await Promise.all([
    getContentCounts(),
    getServerAuth(),
  ])

  const isAuthenticated = !!user
  const isPremium = profile?.subscription_tier === 'premium' || profile?.subscription_tier === 'lifetime'

  return (
    <div className="min-h-screen bg-[--bg]">
      {/* Header Section */}
      <section className="relative pt-32 pb-12 md:pt-32 md:pb-16">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[--surface] via-[--bg] to-[--bg]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-copper/5 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-copper/10 text-copper font-ui font-medium text-sm mb-6">
              <BookOpen className="h-4 w-4" />
              Resource Library
            </span>

            {/* Title */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[--white] mb-6">
              Everything you need to navigate{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-copper to-gold">
                fatherhood
              </span>
            </h1>

            {/* Description */}
            <p className="font-body text-lg text-[--muted] mb-10 max-w-2xl mx-auto">
              Expert-reviewed articles, curated videos, and practical guides. From first positive
              test to toddler years.
            </p>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-10">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <BookOpen className="h-5 w-5 text-copper" />
                  <span className="font-display text-3xl font-bold text-[--white]">{counts.articles}</span>
                </div>
                <span className="font-ui text-sm text-[--dim]">Articles</span>
              </div>

              <div className="hidden sm:block w-px h-12 bg-[--border]" />

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Video className="h-5 w-5 text-copper" />
                  <span className="font-display text-3xl font-bold text-[--white]">{counts.videos}</span>
                </div>
                <span className="font-ui text-sm text-[--dim]">Videos</span>
              </div>

              <div className="hidden sm:block w-px h-12 bg-[--border]" />

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Sparkles className="h-5 w-5 text-sage" />
                </div>
                <span className="font-ui text-sm text-[--dim]">Expert Reviewed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Suspense for streaming */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-copper" />
          </div>
        }
      >
        <ResourcesContent searchParams={props.searchParams} />
      </Suspense>

      {/* Bottom CTA - only show for non-premium users */}
      {!isPremium && (
        <section className="relative py-20 bg-[--surface]">
          <div className="absolute inset-0 bg-gradient-to-b from-[--bg] via-[--surface] to-[--surface]" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-8 md:p-12 rounded-2xl bg-gradient-to-br from-copper/10 to-[--surface] border border-copper/20">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-[--white] mb-4">
                {isAuthenticated ? 'Upgrade to Premium' : 'Unlock All Content'}
              </h2>
              <p className="font-body text-[--muted] mb-8 max-w-xl mx-auto">
                Get access to all {counts.articles} articles, personalized weekly briefings, task
                management, budget tracking, and partner sync.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-copper hover:bg-copper/80 text-white font-ui font-semibold"
                >
                  <Link href={isAuthenticated ? '/upgrade' : '/signup'}>
                    {isAuthenticated ? 'Upgrade Now' : 'Start Free Trial'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                {!isAuthenticated && (
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-[--border] text-[--cream] hover:bg-[--card] hover:text-[--white] font-ui font-semibold"
                  >
                    <Link href="/#pricing">See Pricing</Link>
                  </Button>
                )}
              </div>

              {!isAuthenticated && (
                <p className="font-body mt-6 text-sm text-[--dim]">
                  No credit card required. 30-day money-back guarantee.
                </p>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
