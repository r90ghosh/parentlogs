import type { Metadata } from 'next'
import { DadTipsClient } from '@/components/features/tips/DadTipsClient'
import { dadTips } from '@/data/dadTips'

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

function buildHowToJsonLd() {
  const baseUrl = 'https://thedadcenter.com'

  return dadTips.map((topic) => ({
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to ${topic.name === 'Car Seat' ? 'Install a Car Seat' : topic.name}${topic.name === 'Burping' ? ' a Baby' : ''}`,
    description: `Step-by-step visual guide for ${topic.name.toLowerCase()} — practical tips for new dads.`,
    url: `${baseUrl}/tips`,
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
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Dad Tips — Visual Parenting Guides',
    description:
      'A collection of illustrated step-by-step parenting guides for new dads, covering diaper changing, bottle prep, swaddling, bath time, car seat installation, and burping.',
    url: 'https://thedadcenter.com/tips',
    isPartOf: {
      '@type': 'WebSite',
      name: 'The Dad Center',
      url: 'https://thedadcenter.com',
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: dadTips.length,
      itemListElement: dadTips.map((topic, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: topic.name,
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
      <DadTipsClient />
    </>
  )
}
