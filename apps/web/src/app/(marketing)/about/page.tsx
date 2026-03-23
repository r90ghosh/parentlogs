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

export default function AboutPage() {
  return <AboutContent />
}
