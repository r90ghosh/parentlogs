import type { Metadata } from 'next'
import { PrivacyContent } from './privacy-content'

export const metadata: Metadata = {
  title: 'Privacy Policy | Rooftop Crest',
  description:
    'Learn how Rooftop Crest collects, uses, and protects your personal information.',
}

export default function PrivacyPage() {
  return <PrivacyContent />
}
