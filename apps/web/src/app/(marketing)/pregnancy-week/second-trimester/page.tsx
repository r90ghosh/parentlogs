import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Baby, Activity, Dumbbell, CalendarCheck } from 'lucide-react'
import { getAllPregnancyWeeks } from '@/lib/pregnancy-week'
import { getBabySize, TRIMESTER_WEEK_RANGES } from '@tdc/shared/utils'
import { EmailCapture } from '@/components/marketing/EmailCapture'
import { MedicalDisclaimer } from '@/components/shared/medical-disclaimer'
import { Button } from '@/components/ui/button'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Second Trimester Guide for Dads (Weeks 14-27) | The Dad Center',
  description:
    'Week-by-week guide for expectant fathers during the second trimester. Baby kicks, anatomy scans, nursery prep, and how to support your partner through weeks 14 to 27.',
  alternates: { canonical: '/pregnancy-week/second-trimester' },
  openGraph: {
    title: 'Second Trimester Guide for Dads (Weeks 14-27)',
    description:
      'Week-by-week guide for expectant fathers during the second trimester. Baby kicks, anatomy scans, nursery prep, and how to support your partner.',
    type: 'website',
    url: 'https://thedadcenter.com/pregnancy-week/second-trimester',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Second Trimester Guide for Dads (Weeks 14-27)',
    description:
      'Week-by-week guide for expectant fathers during the second trimester. Baby kicks, anatomy scans, nursery prep, and how to support your partner.',
  },
}

const HIGHLIGHTS = [
  {
    icon: Baby,
    title: 'What happens this trimester',
    description:
      'Your baby grows from about 3 inches to 14 inches. You can find out the sex, see detailed anatomy on ultrasound, and your partner will start showing. Around week 18-22, you may feel the first kicks through her belly.',
  },
  {
    icon: Activity,
    title: "Dad's role",
    description:
      'This is the action trimester. Start the nursery, attend the anatomy scan (week 20), sign up for a childbirth class, and begin researching car seats and cribs. Your partner has more energy now — use this window to knock out big projects together.',
  },
  {
    icon: Dumbbell,
    title: 'Things to prepare',
    description:
      'Create a baby registry, finalize your budget for gear and medical costs, start interviewing pediatricians, and look into childcare options if needed. Tour the hospital or birth center. These tasks only get harder in the third trimester.',
  },
  {
    icon: CalendarCheck,
    title: 'Key appointments',
    description:
      'Anatomy scan (weeks 18-22) is the big one — you will see your baby in detail. Regular prenatal visits continue monthly. Glucose screening typically happens around week 24-28. Be at every appointment you can.',
  },
]

export default async function SecondTrimesterPage() {
  const weeks = await getAllPregnancyWeeks()
  const weekMap = new Map(weeks.map((w) => [w.week, w.title]))
  const range = TRIMESTER_WEEK_RANGES['second-trimester']
  const weeksInRange = Array.from(
    { length: range.end - range.start + 1 },
    (_, i) => range.start + i
  ).filter((week) => weekMap.has(week))

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
        name: 'Second Trimester',
        item: 'https://thedadcenter.com/pregnancy-week/second-trimester',
      },
    ],
  }

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Second Trimester Guide for Dads (Weeks 14-27)',
    description:
      'Week-by-week guide for expectant fathers during the second trimester.',
    url: 'https://thedadcenter.com/pregnancy-week/second-trimester',
    isPartOf: {
      '@type': 'WebPage',
      name: 'Pregnancy Week by Week for Dads',
      url: 'https://thedadcenter.com/pregnancy-week',
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: weeksInRange.length,
      itemListElement: weeksInRange.map((week, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://thedadcenter.com/pregnancy-week/${week}`,
        name: `Pregnancy Week ${week}: ${weekMap.get(week)}`,
      })),
    },
  }

  return (
    <div className="min-h-screen bg-[--bg]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      {/* Hero */}
      <div className="bg-gradient-to-b from-[--surface] to-[--bg] pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/pregnancy-week"
            className="inline-flex items-center gap-2 font-ui text-[--muted] hover:text-[--white] transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            All Pregnancy Weeks
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-copper/10 text-copper font-ui text-xs font-medium mb-6">
            <Baby className="h-3.5 w-3.5" />
            Weeks 14 - 27
          </div>

          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[--white] mb-4">
            Second Trimester Guide for Dads
          </h1>
          <p className="font-body text-lg text-[--muted] max-w-2xl">
            The &ldquo;golden trimester.&rdquo; Morning sickness fades, energy returns, and the
            pregnancy starts to feel real. This is when most dads shift from processing the news
            to actually preparing for the baby.
          </p>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <MedicalDisclaimer />
      </div>

      {/* Key Highlights */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-[--white] mb-8">
          What to know about the second trimester
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {HIGHLIGHTS.map((item) => (
            <div
              key={item.title}
              className="p-6 rounded-2xl bg-[--surface]/50 border border-[--border]"
            >
              <div className="flex items-center gap-3 mb-3">
                <item.icon className="h-5 w-5 text-copper" />
                <h3 className="font-display text-lg font-semibold text-[--white]">{item.title}</h3>
              </div>
              <p className="font-body text-sm text-[--cream] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Week Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-[--white] mb-6">
          Browse by week
        </h2>
        {weeksInRange.length > 0 ? (
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
        ) : (
          <p className="font-body text-[--muted]">
            Week-by-week content for the second trimester is coming soon.
          </p>
        )}
      </div>

      {/* Cross-links to other trimesters */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="font-display text-2xl font-bold text-[--white] mb-6">
          Continue reading
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/pregnancy-week/first-trimester"
            className="group flex items-center justify-between p-5 rounded-2xl bg-[--surface]/50 border border-[--border] hover:border-copper/40 hover:bg-[--surface] transition-colors"
          >
            <div>
              <div className="font-ui text-xs uppercase tracking-wider text-[--dim] mb-1">
                Previous
              </div>
              <div className="font-display text-lg font-semibold text-[--white] group-hover:text-copper transition-colors">
                First Trimester
              </div>
              <div className="font-body text-sm text-[--muted]">Weeks 1 - 13</div>
            </div>
            <ArrowLeft className="h-5 w-5 text-[--muted] group-hover:text-copper transition-colors shrink-0" />
          </Link>
          <Link
            href="/pregnancy-week/third-trimester"
            className="group flex items-center justify-between p-5 rounded-2xl bg-[--surface]/50 border border-[--border] hover:border-copper/40 hover:bg-[--surface] transition-colors"
          >
            <div>
              <div className="font-ui text-xs uppercase tracking-wider text-[--dim] mb-1">
                Up next
              </div>
              <div className="font-display text-lg font-semibold text-[--white] group-hover:text-copper transition-colors">
                Third Trimester
              </div>
              <div className="font-body text-sm text-[--muted]">Weeks 28 - 40</div>
            </div>
            <ArrowRight className="h-5 w-5 text-[--muted] group-hover:text-copper transition-colors shrink-0" />
          </Link>
        </div>
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
          source="pregnancy-week-second-trimester"
          heading="Get weekly dad tips"
          description="Practical advice for expecting and new dads — no spam, unsubscribe anytime."
        />
      </div>
    </div>
  )
}
