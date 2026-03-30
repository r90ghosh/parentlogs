import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { dadTips } from '@/data/dadTips'
import { MedicalDisclaimer } from '@/components/shared/medical-disclaimer'

export const metadata: Metadata = {
  title: 'Dad Tips — Visual Step-by-Step Parenting Guides | The Dad Center',
  description:
    'Illustrated how-to guides for new dads: diaper changing, bottle prep, swaddling, bath time, car seat installation, and burping. Simple visual steps you can follow at 3am.',
  keywords: [
    'new dad tips',
    'how to change a diaper',
    'bottle feeding guide',
    'how to swaddle a baby',
    'baby bath time tips',
    'car seat installation guide',
    'how to burp a baby',
    'parenting tips for dads',
    'newborn care guide',
    'first-time dad advice',
    'diaper changing steps',
    'baby care instructions',
  ],
  alternates: {
    canonical: '/tips',
  },
  openGraph: {
    title: 'Dad Tips — Visual Step-by-Step Parenting Guides',
    description:
      'Illustrated how-to guides for new dads. Diaper changes, bottle prep, swaddling, bath time, car seats, and burping — visual steps you can follow at 3am.',
    type: 'website',
    url: 'https://thedadcenter.com/tips',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dad Tips — Visual Step-by-Step Parenting Guides',
    description:
      'Illustrated how-to guides for new dads. Simple visual steps for diaper changes, bottle prep, swaddling, and more.',
  },
}

const tipDescriptions: Record<string, string> = {
  'baby-changing': 'Prep, position, swap, clean, and button up in 5 clear steps.',
  'bottle-prep': 'Sterilize, mix, test temperature, and feed with confidence.',
  'swaddling': 'Diamond setup and snug wrap technique for calm, cozy sleep.',
  'bath-time': 'Safe water temp, washing order, and gentle drying routine.',
  'car-seat': 'Base installation and harness adjustment for a secure ride.',
  'burping': 'Over-the-shoulder and sitting techniques to release trapped air.',
}

function buildHowToJsonLd() {
  const baseUrl = 'https://thedadcenter.com'

  return dadTips.map((topic) => ({
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to ${topic.name === 'Car Seat' ? 'Install a Car Seat' : topic.name}${topic.name === 'Burping' ? ' a Baby' : ''}`,
    description: `Step-by-step visual guide for ${topic.name.toLowerCase()} — practical tips for new dads.`,
    url: `${baseUrl}/tips/${topic.id}`,
    totalTime: topic.sections.length <= 2 ? 'PT5M' : 'PT10M',
    supply: topic.id === 'baby-changing'
      ? [
          { '@type': 'HowToSupply', name: 'Clean diaper' },
          { '@type': 'HowToSupply', name: 'Baby wipes' },
          { '@type': 'HowToSupply', name: 'Barrier cream' },
          { '@type': 'HowToSupply', name: 'Spare outfit' },
        ]
      : topic.id === 'bottle-prep'
      ? [
          { '@type': 'HowToSupply', name: 'Baby bottle' },
          { '@type': 'HowToSupply', name: 'Formula' },
          { '@type': 'HowToSupply', name: 'Boiled water' },
        ]
      : topic.id === 'swaddling'
      ? [{ '@type': 'HowToSupply', name: 'Muslin or cotton blanket' }]
      : topic.id === 'bath-time'
      ? [
          { '@type': 'HowToSupply', name: 'Baby tub' },
          { '@type': 'HowToSupply', name: 'Washcloth' },
          { '@type': 'HowToSupply', name: 'Mild baby soap' },
          { '@type': 'HowToSupply', name: 'Towel' },
        ]
      : undefined,
    step: topic.sections.map((section) => ({
      '@type': 'HowToStep',
      name: section.title,
      text: section.points.join(' '),
      ...(section.proTip && {
        tip: { '@type': 'HowToTip', text: section.proTip },
      }),
    })),
  }))
}

function buildCollectionJsonLd() {
  const baseUrl = 'https://thedadcenter.com'

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Dad Tips — Visual Parenting Guides',
    description:
      'A collection of illustrated step-by-step parenting guides for new dads, covering diaper changing, bottle prep, swaddling, bath time, car seat installation, and burping.',
    url: `${baseUrl}/tips`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'The Dad Center',
      url: baseUrl,
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: dadTips.length,
      itemListElement: dadTips.map((topic, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: topic.name,
        url: `${baseUrl}/tips/${topic.id}`,
        description: `${topic.sections.length}-step visual guide for ${topic.name.toLowerCase()}`,
      })),
    },
  }
}

export default function DadTipsPage() {
  const howToSchemas = buildHowToJsonLd()
  const collectionSchema = buildCollectionJsonLd()

  return (
    <>
      {/* HowTo structured data — one per topic */}
      {howToSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {/* CollectionPage structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <div className="min-h-screen bg-[--bg]">
        {/* Hero area */}
        <section className="relative pt-20 pb-4 md:pt-28 md:pb-6">
          <div className="absolute inset-0 bg-gradient-to-b from-[--surface] to-transparent" />

          <div className="relative max-w-3xl mx-auto px-4">
            {/* Back link */}
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-ui text-[--muted] hover:text-[--white] text-sm transition-colors mb-6 min-h-[44px]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>

            {/* Title */}
            <h1 className="font-display text-3xl md:text-4xl font-bold text-[--white] mb-2">
              Dad Tips
            </h1>
            <p className="font-body text-base text-[--muted] leading-relaxed">
              Step-by-step visual guides for hands-on parenting skills.
            </p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4">
          <MedicalDisclaimer className="mb-8" />

          {/* Tip cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-12">
            {dadTips.map((topic) => (
              <Link
                key={topic.id}
                href={`/tips/${topic.id}`}
                className="group block"
              >
                <div className="p-5 rounded-xl bg-[--surface] border border-[--border] hover:border-[--border-hover] transition-all h-full">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">{topic.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-display text-lg font-bold text-[--white] group-hover:text-copper transition-colors">
                        {topic.name}
                      </h2>
                      <p className="font-ui text-xs text-[--dim] mt-0.5">
                        {topic.sections.length} steps
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[--dim] group-hover:text-copper transition-colors shrink-0 mt-1" />
                  </div>
                  <p className="font-body text-sm text-[--muted] leading-relaxed">
                    {tipDescriptions[topic.id]}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Sign up CTA */}
          <div className="pb-16">
            <div className="p-8 rounded-2xl bg-[--surface]/50 border border-[--border] text-center">
              <h3 className="font-display text-xl font-bold text-[--white] mb-3">
                Want personalized weekly guidance?
              </h3>
              <p className="font-body text-[--muted] mb-6 max-w-lg mx-auto">
                Get week-by-week briefings, task management, and a full parenting toolkit
                built for dads who refuse to wing it.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-copper hover:bg-copper/80 text-white font-ui font-semibold text-sm transition-colors"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
