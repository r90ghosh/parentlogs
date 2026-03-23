import { Metadata } from 'next'
import { FaqContent } from '@/components/marketing/FaqContent'

export const metadata: Metadata = {
  title: 'FAQ — The Dad Center',
  description:
    'Answers to common questions about The Dad Center — pricing, features, family subscriptions, privacy, and more.',
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'FAQ — The Dad Center',
    description:
      'Answers to common questions about The Dad Center — pricing, features, family subscriptions, privacy, and more.',
    url: '/faq',
  },
}

export default function FaqPage() {
  return <FaqContent />
}
