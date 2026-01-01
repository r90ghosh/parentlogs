import { Suspense } from 'react'
import Link from 'next/link'
import { BookOpen, Video, ArrowRight, Sparkles } from 'lucide-react'
import { getFilteredContent, getStages, getContentCounts } from '@/lib/content'
import { getServerAuth } from '@/lib/supabase/server-auth'
import { ContentFilters } from '@/components/marketing/ContentFilters'
import { ResourceLibrary } from '@/components/marketing/ResourceLibrary'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Parenting Resources for Dads | ParentLogs',
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
    <div className="min-h-screen bg-slate-950">
      {/* Header Section */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-16">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-6">
              <BookOpen className="h-4 w-4" />
              Resource Library
            </span>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Everything you need to navigate{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                fatherhood
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
              Expert-reviewed articles, curated videos, and practical guides. From first positive
              test to toddler years.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-6 md:gap-10">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <BookOpen className="h-5 w-5 text-amber-400" />
                  <span className="text-3xl font-bold text-white">{counts.articles}</span>
                </div>
                <span className="text-sm text-slate-500">Articles</span>
              </div>

              <div className="w-px h-12 bg-slate-700" />

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Video className="h-5 w-5 text-amber-400" />
                  <span className="text-3xl font-bold text-white">{counts.videos}</span>
                </div>
                <span className="text-sm text-slate-500">Videos</span>
              </div>

              <div className="w-px h-12 bg-slate-700" />

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Sparkles className="h-5 w-5 text-green-400" />
                </div>
                <span className="text-sm text-slate-500">Expert Reviewed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Suspense for streaming */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
          </div>
        }
      >
        <ResourcesContent searchParams={props.searchParams} />
      </Suspense>

      {/* Bottom CTA - only show for non-premium users */}
      {!isPremium && (
        <section className="relative py-20 bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-8 md:p-12 rounded-2xl bg-gradient-to-br from-amber-500/10 to-slate-900 border border-amber-500/20">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {isAuthenticated ? 'Upgrade to Premium' : 'Unlock All Content'}
              </h2>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                Get access to all {counts.articles} articles, personalized weekly briefings, task
                management, budget tracking, and partner sync.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
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
                    className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <Link href="/#pricing">See Pricing</Link>
                  </Button>
                )}
              </div>

              {!isAuthenticated && (
                <p className="mt-6 text-sm text-slate-500">
                  14-day free trial. No credit card required.
                </p>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
