import type { Metadata } from 'next'
import { PrivacyContent } from './privacy-content'

export const metadata: Metadata = {
  title: 'Privacy Policy | The Dad Center',
  description:
    'Learn how The Dad Center collects, uses, and protects your personal information.',
}

export default function PrivacyPage() {
  return <PrivacyContent />
}
