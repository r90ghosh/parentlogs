import { Suspense } from 'react'
import Link from 'next/link'
import { Video, ArrowRight, Sparkles, CheckCircle } from 'lucide-react'
import { getFilteredContent, getStages, getContentCounts } from '@/lib/content'
import { getServerAuth } from '@/lib/supabase/server-auth'
import { VideoCard } from '@/components/marketing/VideoCard'
import { Button } from '@/components/ui/button'
import { MedicalDisclaimer } from '@/components/shared/medical-disclaimer'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Videos — Curated Parenting Videos | The Dad Center',
  description:
    'Expert-curated video guides covering pregnancy through toddlerhood. Bite-sized, dad-friendly videos from trusted sources.',
  keywords: ['parenting videos', 'dad videos', 'pregnancy videos', 'new dad guides', 'baby care videos', 'fatherhood tips'],
  alternates: { canonical: '/videos' },
  openGraph: {
    title: 'Videos — Curated Parenting Videos | The Dad Center',
    description: 'Expert-curated video guides covering pregnancy through toddlerhood. Bite-sized, dad-friendly videos from trusted sources.',
    url: '/videos',
  },
}

interface PageProps {
  searchParams: Promise<{
    stage?: string
  }>
}

async function VideosContent({ searchParams }: PageProps) {
  const params = await searchParams
  const stage = params.stage || 'all'

  const [content, stages] = await Promise.all([
    getFilteredContent({ stage, format: 'videos' }),
    getStages(),
  ])

  const videos = content.videos
  const stagesWithVideos = stages.filter((s) => s.videoCount > 0)

  return (
    <>
      {/* Stage Filter Pills */}
      <div className="md:sticky md:top-20 z-40 bg-[--bg] md:bg-[--bg]/95 md:backdrop-blur-md border-b border-[--border]/50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            <a
              href="/videos"
              className={
                stage === 'all'
                  ? 'font-ui px-3 py-1.5 rounded-full text-sm font-medium bg-copper text-white transition-colors'
                  : 'font-ui px-3 py-1.5 rounded-full text-sm font-medium bg-[--card]/50 text-[--muted] hover:bg-[--card-hover]/50 hover:text-[--white] transition-colors'
              }
            >
              All Stages
            </a>
            {stagesWithVideos.map((s) => (
              <a
                key={s.id}
                href={`/videos?stage=${s.id}`}
                className={
                  stage === s.id
                    ? 'font-ui px-3 py-1.5 rounded-full text-sm font-medium bg-copper text-white transition-colors'
                    : 'font-ui px-3 py-1.5 rounded-full text-sm font-medium bg-[--card]/50 text-[--muted] hover:bg-[--card-hover]/50 hover:text-[--white] transition-colors'
                }
              >
                {s.label}
                <span className="ml-1.5 text-xs opacity-70">({s.videoCount})</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard key={video.slug} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[--card] mb-6">
              <Video className="h-8 w-8 text-[--dim]" />
            </div>
            <h3 className="font-display text-xl font-semibold text-[--white] mb-2">No videos found</h3>
            <p className="font-body text-[--muted] mb-6">
              No videos match this stage filter.
            </p>
            <Button
              asChild
              variant="outline"
              className="border-[--border] text-[--cream] hover:bg-[--card] font-ui font-semibold"
            >
              <a href="/videos">Clear Filters</a>
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

export default async function VideosPage(props: PageProps) {
  const [counts, { user, profile }] = await Promise.all([
    getContentCounts(),
    getServerAuth(),
  ])

  const isAuthenticated = !!user
  const isPremium = profile?.subscription_tier === 'premium' || profile?.subscription_tier === 'lifetime'

  return (
    <div className="min-h-screen bg-[--bg]">
      {/* Header Section */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-16">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[--surface] via-[--bg] to-[--bg]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-copper/5 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-copper/10 text-copper font-ui font-medium text-sm mb-6">
              <CheckCircle className="h-4 w-4" />
              Expert Curated
            </span>

            {/* Title */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[--white] mb-6">
              Curated{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-copper to-gold">
                Videos
              </span>
            </h1>

            {/* Description */}
            <p className="font-body text-lg text-[--muted] mb-10 max-w-2xl mx-auto">
              Bite-sized, dad-friendly video guides from trusted sources. Covering pregnancy
              through toddlerhood.
            </p>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-10">
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
                <span className="font-ui text-sm text-[--dim]">Expert Curated</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Medical Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <MedicalDisclaimer />
      </div>

      {/* Main Content with Suspense for streaming */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-copper" />
          </div>
        }
      >
        <VideosContent searchParams={props.searchParams} />
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
                Get access to personalized weekly briefings, task management, budget tracking,
                and partner sync.
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
                  Free for 30 days — no credit card needed.
                </p>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
