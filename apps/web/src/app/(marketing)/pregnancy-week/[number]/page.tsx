import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Lock, Heart, Baby, Users, Target } from 'lucide-react'
import {
  getPregnancyWeekBriefing,
  getPregnancyWeeksForStaticParams,
} from '@/lib/pregnancy-week'
import { getBabySize, getTrimesterFromWeek, getTrimesterLabel } from '@tdc/shared/utils'
import { Button } from '@/components/ui/button'
import { EmailCapture } from '@/components/marketing/EmailCapture'
import { MedicalDisclaimer } from '@/components/shared/medical-disclaimer'

export const revalidate = 86400

interface PageProps {
  params: Promise<{ number: string }>
}

export async function generateStaticParams() {
  const weeks = await getPregnancyWeeksForStaticParams()
  return weeks.map((week) => ({ number: String(week) }))
}

function parseWeek(value: string): number | null {
  if (!/^\d+$/.test(value)) return null
  const week = Number(value)
  if (!Number.isInteger(week) || week < 1 || week > 40) return null
  return week
}

function truncate(text: string | null | undefined, max: number): string {
  if (!text) return ''
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return clean.slice(0, max - 1).trimEnd() + '\u2026'
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { number } = await params
  const week = parseWeek(number)
  if (!week) return { title: 'Pregnancy Week Not Found | The Dad Center' }

  const briefing = await getPregnancyWeekBriefing(week)
  if (!briefing) return { title: 'Pregnancy Week Not Found | The Dad Center' }

  const title = `Pregnancy Week ${week}: ${briefing.title} (Dad's Guide)`
  const description = truncate(
    briefing.babyUpdate || `What to expect in pregnancy week ${week}, written for dads.`,
    155
  )
  const url = `/pregnancy-week/${week}`

  return {
    title: `${title} | The Dad Center`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: 'article',
      url,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function PregnancyWeekPage({ params }: PageProps) {
  const { number } = await params
  const week = parseWeek(number)
  if (!week) notFound()

  const briefing = await getPregnancyWeekBriefing(week)
  if (!briefing) notFound()

  const babySize = getBabySize(week)
  const trimester = getTrimesterFromWeek(week)
  const trimesterLabel = getTrimesterLabel(trimester)

  const visibleDadFocus = briefing.dadFocus.slice(0, 2)
  const hiddenDadFocusCount = Math.max(0, briefing.dadFocus.length - visibleDadFocus.length)

  const [prev, next] = await Promise.all([
    week > 1 ? getPregnancyWeekBriefing(week - 1) : Promise.resolve(null),
    week < 40 ? getPregnancyWeekBriefing(week + 1) : Promise.resolve(null),
  ])

  const publishedDate = briefing.createdAt || new Date().toISOString()
  const wordCount = [
    briefing.babyUpdate,
    briefing.momUpdate,
    visibleDadFocus.join(' '),
    briefing.relationshipTip,
  ]
    .filter(Boolean)
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Pregnancy Week ${week}: ${briefing.title}`,
    description: truncate(briefing.babyUpdate, 200),
    datePublished: publishedDate,
    dateModified: publishedDate,
    wordCount,
    articleSection: 'Pregnancy',
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
      '@id': `https://thedadcenter.com/pregnancy-week/${week}`,
    },
  }

  const breadcrumbJsonLd = {
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
        name: 'Pregnancy Week Guide',
        item: 'https://thedadcenter.com/pregnancy-week',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `Week ${week}: ${briefing.title}`,
        item: `https://thedadcenter.com/pregnancy-week/${week}`,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-[--bg]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Header */}
      <div className="bg-gradient-to-b from-[--surface] to-[--bg] pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/pregnancy-week"
            className="inline-flex items-center gap-2 font-ui text-[--muted] hover:text-[--white] transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            All Pregnancy Weeks
          </Link>

          {/* Trimester pill + week badge */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="font-ui px-2.5 py-1 rounded-md text-xs font-medium bg-copper/10 text-copper">
              {trimesterLabel}
            </span>
            <span className="font-ui text-sm text-[--dim]">Week {week} of 40</span>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[--white] mb-6">
            Pregnancy Week {week}: {briefing.title}
          </h1>

          {/* Baby size card */}
          {babySize && (
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-[--surface]/50 border border-[--border]">
              <div className="text-5xl" aria-hidden="true">
                {babySize.emoji}
              </div>
              <div>
                <div className="font-ui text-xs uppercase tracking-wider text-[--dim] mb-1">
                  Your baby this week
                </div>
                <div className="font-display text-xl font-semibold text-[--white]">
                  About the size of a {babySize.fruit.toLowerCase()}
                </div>
                <div className="font-body text-sm text-[--muted] mt-1">
                  ~{babySize.lengthInches} in &middot; ~{babySize.weightOz}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <MedicalDisclaimer />
      </div>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {briefing.babyUpdate && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Baby className="h-5 w-5 text-copper" />
              <h2 className="font-display text-2xl font-bold text-[--white]">
                How your baby is growing this week
              </h2>
            </div>
            <p className="font-body text-base text-[--cream] leading-relaxed whitespace-pre-line">
              {briefing.babyUpdate}
            </p>
          </section>
        )}

        {briefing.momUpdate && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-5 w-5 text-copper" />
              <h2 className="font-display text-2xl font-bold text-[--white]">
                What your partner is going through
              </h2>
            </div>
            <p className="font-body text-base text-[--cream] leading-relaxed whitespace-pre-line">
              {briefing.momUpdate}
            </p>
          </section>
        )}

        {visibleDadFocus.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-copper" />
              <h2 className="font-display text-2xl font-bold text-[--white]">
                What to focus on this week, dad
              </h2>
            </div>
            <ul className="space-y-3">
              {visibleDadFocus.map((item, i) => (
                <li
                  key={i}
                  className="flex gap-3 p-4 rounded-xl bg-[--surface]/50 border border-[--border]"
                >
                  <span className="font-ui text-sm font-bold text-copper shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-body text-base text-[--cream] leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            {hiddenDadFocusCount > 0 && (
              <Link
                href="/signup"
                className="mt-3 flex items-center gap-3 p-4 rounded-xl bg-[--surface]/30 border border-dashed border-copper/30 hover:border-copper/60 hover:bg-[--surface]/60 transition-colors"
              >
                <Lock className="h-4 w-4 text-copper shrink-0" />
                <span className="font-body text-sm text-[--muted]">
                  <span className="text-copper font-semibold">
                    +{hiddenDadFocusCount} more focus{' '}
                    {hiddenDadFocusCount === 1 ? 'item' : 'items'}
                  </span>{' '}
                  in the full briefing for week {week} &mdash;{' '}
                  <span className="text-[--white] font-semibold">Start free</span>
                </span>
              </Link>
            )}
          </section>
        )}

        {briefing.relationshipTip && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Heart className="h-5 w-5 text-copper" />
              <h2 className="font-display text-2xl font-bold text-[--white]">
                Connect with your partner
              </h2>
            </div>
            <p className="font-body text-base text-[--cream] leading-relaxed whitespace-pre-line">
              {briefing.relationshipTip}
            </p>
          </section>
        )}

        {briefing.medicalSource && (
          <p className="font-body text-xs text-[--dim] italic">
            Source: {briefing.medicalSource}
          </p>
        )}

        {/* Prev / Next nav */}
        <nav
          aria-label="Pregnancy week navigation"
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-8 border-t border-[--border]"
        >
          {prev ? (
            <Link
              href={`/pregnancy-week/${week - 1}`}
              className="group flex items-center gap-3 p-4 rounded-xl bg-[--surface]/50 border border-[--border] hover:border-copper/40 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-[--muted] group-hover:text-copper transition-colors shrink-0" />
              <div className="min-w-0">
                <div className="font-ui text-xs uppercase tracking-wider text-[--dim]">
                  Previous &middot; Week {week - 1}
                </div>
                <div className="font-display text-base font-semibold text-[--white] truncate">
                  {prev.title}
                </div>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/pregnancy-week/${week + 1}`}
              className="group flex items-center justify-end gap-3 p-4 rounded-xl bg-[--surface]/50 border border-[--border] hover:border-copper/40 transition-colors text-right"
            >
              <div className="min-w-0">
                <div className="font-ui text-xs uppercase tracking-wider text-[--dim]">
                  Next &middot; Week {week + 1}
                </div>
                <div className="font-display text-base font-semibold text-[--white] truncate">
                  {next.title}
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-[--muted] group-hover:text-copper transition-colors shrink-0" />
            </Link>
          ) : (
            <div />
          )}
        </nav>

        {/* Bottom CTA */}
        <div className="mt-4 p-8 rounded-2xl bg-[--surface]/50 border border-[--border] text-center">
          <h3 className="font-display text-xl font-bold text-[--white] mb-3">
            Get all 40 weeks personalized to your due date
          </h3>
          <p className="font-body text-[--muted] mb-6 max-w-lg mx-auto">
            Plus task lists, partner sync, budget tracking, and the &ldquo;from the trenches&rdquo;
            field notes from real dads &mdash; all free to start.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-copper hover:bg-copper/80 text-white font-ui font-semibold"
          >
            <Link href="/signup">
              Start Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        {/* Email Capture */}
        <div>
          <EmailCapture source="pregnancy-week" />
        </div>
      </article>
    </div>
  )
}
