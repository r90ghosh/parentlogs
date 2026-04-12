import { Metadata } from 'next'
import { AboutContent } from '@/components/marketing/AboutContent'

export const metadata: Metadata = {
  title: 'About — The Dad Center',
  description:
    'Built by dads, for dads who refuse to wing it. Learn about our mission to make fatherhood less overwhelming and more intentional.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About — The Dad Center',
    description:
      'Built by dads, for dads who refuse to wing it. Learn about our mission to make fatherhood less overwhelming and more intentional.',
    url: '/about',
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'The Dad Center',
  url: 'https://thedadcenter.com',
  logo: 'https://thedadcenter.com/og-default.png',
  description:
    'The operating system for modern fatherhood. Week-by-week pregnancy guidance, task management, and parenting tools designed for dads.',
  foundingDate: '2025',
  sameAs: [],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://thedadcenter.com' },
    { '@type': 'ListItem', position: 2, name: 'About', item: 'https://thedadcenter.com/about' },
  ],
}

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <AboutContent />
    </>
  )
}
