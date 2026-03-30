import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { dadTips } from '@/data/dadTips'
import { Button } from '@/components/ui/button'
import { SingleTipView } from '@/components/features/tips/SingleTipView'

export const revalidate = false

const tipMeta: Record<string, { title: string; description: string; keywords: string[] }> = {
  'baby-changing': {
    title: 'How to Change a Diaper — Step-by-Step Guide for Dads',
    description:
      'Learn how to change a diaper in 5 simple steps with illustrated instructions. Prep, position, swap, clean, and button up — a practical guide for new dads.',
    keywords: [
      'how to change a diaper',
      'diaper changing steps',
      'baby changing guide',
      'new dad diaper tips',
      'diaper changing for beginners',
      'newborn diaper change',
    ],
  },
  'bottle-prep': {
    title: 'How to Prepare a Baby Bottle — Step-by-Step Guide for Dads',
    description:
      'Learn how to prepare a baby bottle safely in 2 easy steps. Clean, mix, test, and feed — a practical formula feeding guide for new dads.',
    keywords: [
      'how to make a baby bottle',
      'bottle feeding guide',
      'formula preparation steps',
      'baby bottle prep',
      'new dad bottle feeding',
      'how to mix baby formula',
    ],
  },
  'swaddling': {
    title: 'How to Swaddle a Baby — Step-by-Step Guide for Dads',
    description:
      'Learn how to swaddle a baby in 2 simple steps with illustrated instructions. Diamond setup and wrap technique — a practical guide for new dads.',
    keywords: [
      'how to swaddle a baby',
      'swaddling techniques',
      'baby swaddle guide',
      'newborn swaddling steps',
      'swaddle wrap for beginners',
      'how to swaddle a newborn',
    ],
  },
  'bath-time': {
    title: 'How to Bathe a Baby — Step-by-Step Guide for Dads',
    description:
      'Learn how to give your baby a bath in 2 simple steps. Setup, water temperature, washing order, and drying — a practical bath time guide for new dads.',
    keywords: [
      'how to bathe a baby',
      'baby bath time guide',
      'newborn bath steps',
      'baby bath temperature',
      'first baby bath tips',
      'how to wash a newborn',
    ],
  },
  'car-seat': {
    title: 'How to Install a Car Seat — Step-by-Step Guide for Dads',
    description:
      'Learn how to install a car seat and secure your baby in 2 steps. Base installation and harness adjustment — a practical car seat guide for new dads.',
    keywords: [
      'how to install a car seat',
      'car seat installation guide',
      'baby car seat setup',
      'car seat safety tips',
      'rear-facing car seat installation',
      'how to strap baby in car seat',
    ],
  },
  'burping': {
    title: 'How to Burp a Baby — Step-by-Step Guide for Dads',
    description:
      'Learn how to burp a baby with 2 effective techniques. Over-the-shoulder and sitting positions — a practical burping guide for new dads.',
    keywords: [
      'how to burp a baby',
      'baby burping techniques',
      'burping a newborn',
      'best burping positions',
      'how to burp a newborn',
      'baby gas relief tips',
    ],
  },
}

const supplyMap: Record<string, Array<{ '@type': string; name: string }>> = {
  'baby-changing': [
    { '@type': 'HowToSupply', name: 'Clean diaper' },
    { '@type': 'HowToSupply', name: 'Baby wipes' },
    { '@type': 'HowToSupply', name: 'Barrier cream' },
    { '@type': 'HowToSupply', name: 'Spare outfit' },
  ],
  'bottle-prep': [
    { '@type': 'HowToSupply', name: 'Baby bottle' },
    { '@type': 'HowToSupply', name: 'Formula' },
    { '@type': 'HowToSupply', name: 'Boiled water' },
  ],
  'swaddling': [
    { '@type': 'HowToSupply', name: 'Muslin or cotton blanket' },
  ],
  'bath-time': [
    { '@type': 'HowToSupply', name: 'Baby tub' },
    { '@type': 'HowToSupply', name: 'Washcloth' },
    { '@type': 'HowToSupply', name: 'Mild baby soap' },
    { '@type': 'HowToSupply', name: 'Towel' },
  ],
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return dadTips.map((tip) => ({ slug: tip.id }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const meta = tipMeta[slug]

  if (!meta) {
    return { title: 'Tip Not Found | The Dad Center' }
  }

  return {
    title: `${meta.title} | The Dad Center`,
    description: meta.description,
    keywords: meta.keywords,
    alternates: { canonical: `/tips/${slug}` },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://thedadcenter.com/tips/${slug}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
    },
  }
}

function buildHowToJsonLd(slug: string) {
  const topic = dadTips.find((t) => t.id === slug)
  if (!topic) return null

  const howToName =
    slug === 'car-seat'
      ? 'How to Install a Car Seat'
      : slug === 'burping'
        ? 'How to Burp a Baby'
        : `How to ${topic.name}`

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: howToName,
    description: tipMeta[slug]?.description ?? `Step-by-step visual guide for ${topic.name.toLowerCase()} — practical tips for new dads.`,
    url: `https://thedadcenter.com/tips/${slug}`,
    totalTime: topic.sections.length <= 2 ? 'PT5M' : 'PT10M',
    ...(supplyMap[slug] && { supply: supplyMap[slug] }),
    step: topic.sections.map((section) => ({
      '@type': 'HowToStep',
      name: section.title,
      text: section.points.join(' '),
      ...(section.proTip && {
        tip: { '@type': 'HowToTip', text: section.proTip },
      }),
    })),
  }
}

export default async function TipDetailPage({ params }: PageProps) {
  const { slug } = await params
  const tipIndex = dadTips.findIndex((t) => t.id === slug)

  if (tipIndex === -1) {
    notFound()
  }

  const topic = dadTips[tipIndex]
  const prevTip = tipIndex > 0 ? dadTips[tipIndex - 1] : null
  const nextTip = tipIndex < dadTips.length - 1 ? dadTips[tipIndex + 1] : null

  const howToSchema = buildHowToJsonLd(slug)

  return (
    <>
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}

      <div className="min-h-screen bg-[--bg]">
        {/* Hero area */}
        <section className="relative pt-20 pb-4 md:pt-28 md:pb-6">
          <div className="absolute inset-0 bg-gradient-to-b from-[--surface] to-transparent" />

          <div className="relative max-w-2xl mx-auto px-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6">
              <Link
                href="/tips"
                className="inline-flex items-center gap-1.5 font-ui text-[--muted] hover:text-[--white] text-sm transition-colors min-h-[44px]"
              >
                <ArrowLeft className="h-4 w-4" />
                All Tips
              </Link>
              <span className="text-[--dim]">/</span>
              <span className="font-ui text-[--cream] text-sm">{topic.name}</span>
            </div>

            {/* Title */}
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{topic.emoji}</span>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-[--white]">
                {topic.name}
              </h1>
            </div>
            <p className="font-body text-base text-[--muted] leading-relaxed">
              {topic.sections.length}-step visual guide — practical tips you can follow at 3am.
            </p>
          </div>
        </section>

        {/* Tip content */}
        <div className="pt-6 pb-4">
          <SingleTipView topic={topic} />
        </div>

        {/* Sign up CTA */}
        <div className="max-w-2xl mx-auto px-4 pb-8">
          <div className="p-8 rounded-2xl bg-[--surface]/50 border border-[--border] text-center">
            <h3 className="font-display text-xl font-bold text-[--white] mb-3">
              Want personalized weekly guidance?
            </h3>
            <p className="font-body text-[--muted] mb-6 max-w-lg mx-auto">
              Get week-by-week briefings, task management, and a full parenting toolkit
              built for dads who refuse to wing it.
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
        </div>

        {/* Prev / Next navigation */}
        <div className="max-w-2xl mx-auto px-4 pb-16">
          <div className="flex items-center justify-between gap-4 pt-8 border-t border-[--border]">
            {prevTip ? (
              <Link
                href={`/tips/${prevTip.id}`}
                className="flex items-center gap-2 font-ui text-sm text-[--muted] hover:text-[--white] transition-colors min-h-[44px]"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>
                  <span className="text-lg mr-1.5">{prevTip.emoji}</span>
                  {prevTip.name}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {nextTip ? (
              <Link
                href={`/tips/${nextTip.id}`}
                className="flex items-center gap-2 font-ui text-sm text-[--muted] hover:text-[--white] transition-colors min-h-[44px] text-right"
              >
                <span>
                  {nextTip.name}
                  <span className="text-lg ml-1.5">{nextTip.emoji}</span>
                </span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
