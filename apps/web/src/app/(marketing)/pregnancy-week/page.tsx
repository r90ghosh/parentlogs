import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Baby } from 'lucide-react'
import { getAllPregnancyWeeks } from '@/lib/pregnancy-week'
import { getBabySize, TRIMESTER_WEEK_RANGES } from '@tdc/shared/utils'
import { EmailCapture } from '@/components/marketing/EmailCapture'
import { MedicalDisclaimer } from '@/components/shared/medical-disclaimer'
import { Button } from '@/components/ui/button'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Pregnancy Week by Week for Dads — Complete Guide | The Dad Center',
  description:
    'A free, week-by-week pregnancy guide written for dads. Baby development, what your partner is going through, and what to focus on each week from week 4 through 40.',
  alternates: { canonical: '/pregnancy-week' },
  openGraph: {
    title: 'Pregnancy Week by Week for Dads — Complete Guide',
    description:
      'A free, week-by-week pregnancy guide written for dads — from week 4 through 40.',
    type: 'website',
    url: 'https://thedadcenter.com/pregnancy-week',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pregnancy Week by Week for Dads — Complete Guide',
    description:
      'A free, week-by-week pregnancy guide written for dads — from week 4 through 40.',
  },
}

const TRIMESTERS = [
  { key: 'first-trimester' as const, label: 'First Trimester', subtitle: 'Weeks 1–13' },
  { key: 'second-trimester' as const, label: 'Second Trimester', subtitle: 'Weeks 14–27' },
  { key: 'third-trimester' as const, label: 'Third Trimester', subtitle: 'Weeks 28–40' },
]

export default async function PregnancyWeekIndexPage() {
  const weeks = await getAllPregnancyWeeks()
  const weekMap = new Map(weeks.map((w) => [w.week, w.title]))

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
    ],
  }

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Pregnancy Week by Week — Dad\u2019s Guide',
    itemListElement: weeks.map((w, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://thedadcenter.com/pregnancy-week/${w.week}`,
      name: `Pregnancy Week ${w.week}: ${w.title}`,
    })),
  }

  return (
    <div className="min-h-screen bg-[--bg]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      {/* Header */}
      <div className="bg-gradient-to-b from-[--surface] to-[--bg] pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-copper/10 text-copper font-ui text-xs font-medium mb-6">
            <Baby className="h-3.5 w-3.5" />
            Pregnancy Week Guide
          </div>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[--white] mb-4">
            Pregnancy Week by Week — for Dads
          </h1>
          <p className="font-body text-lg text-[--muted] max-w-2xl mx-auto">
            A no-fluff, week-by-week guide to what&apos;s happening with the baby, what your partner
            is going through, and what to actually focus on as a dad. Weeks 4 through 40 — all free,
            no signup required.
          </p>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <MedicalDisclaimer />
      </div>

      {/* Browse by Trimester */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-[--white] mb-6">
          Browse by Trimester
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TRIMESTERS.map((trimester) => (
            <Link
              key={trimester.key}
              href={`/pregnancy-week/${trimester.key}`}
              className="group p-6 rounded-2xl bg-[--surface]/50 border border-[--border] hover:border-copper/40 hover:bg-[--surface] transition-colors"
            >
              <h3 className="font-display text-lg font-semibold text-[--white] group-hover:text-copper transition-colors mb-1">
                {trimester.label}
              </h3>
              <p className="font-body text-sm text-[--muted] mb-3">{trimester.subtitle}</p>
              <span className="inline-flex items-center gap-1 font-ui text-xs font-medium text-copper">
                View guide
                <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Trimester sections */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {TRIMESTERS.map((trimester) => {
          const range = TRIMESTER_WEEK_RANGES[trimester.key]
          const weeksInRange = Array.from(
            { length: range.end - range.start + 1 },
            (_, i) => range.start + i
          ).filter((week) => weekMap.has(week))

          if (weeksInRange.length === 0) return null

          return (
            <section key={trimester.key}>
              <div className="flex items-baseline justify-between mb-6">
                <div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-[--white]">
                    {trimester.label}
                  </h2>
                  <p className="font-body text-sm text-[--muted] mt-1">{trimester.subtitle}</p>
                </div>
                <Link
                  href={`/pregnancy-week/${trimester.key}`}
                  className="hidden sm:inline-flex items-center gap-1 font-ui text-xs font-medium text-copper hover:text-copper/80 transition-colors"
                >
                  Full guide
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {weeksInRange.map((week) => {
                  const title = weekMap.get(week)!
                  const size = getBabySize(week)
                  return (
                    <Link
                      key={week}
                      href={`/pregnancy-week/${week}`}
                      className="group block p-5 rounded-2xl bg-[--surface]/50 border border-[--border] hover:border-copper/40 hover:bg-[--surface] transition-colors"
                    >
                      <div className="flex items-baseline justify-between mb-3">
                        <span className="font-ui text-xs font-bold uppercase tracking-wider text-copper">
                          Week {week}
                        </span>
                        {size && (
                          <span className="font-ui text-xs text-[--dim]">
                            {size.emoji} {size.fruit}
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-base font-semibold text-[--white] group-hover:text-copper transition-colors line-clamp-2">
                        {title}
                      </h3>
                    </Link>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>

      {/* Bottom CTA */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="p-8 rounded-2xl bg-[--surface]/50 border border-[--border] text-center">
          <h3 className="font-display text-2xl font-bold text-[--white] mb-3">
            Want this personalized to your due date?
          </h3>
          <p className="font-body text-[--muted] mb-6 max-w-lg mx-auto">
            Get every week tailored to your timeline, plus task lists, partner sync, budget
            tracking, and the &ldquo;from the trenches&rdquo; field notes from real dads.
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
      </div>

      {/* Email Capture */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <EmailCapture
          source="pregnancy-week-index"
          heading="Get weekly dad tips"
          description="Practical advice for expecting and new dads — no spam, unsubscribe anytime."
        />
      </div>
    </div>
  )
}
