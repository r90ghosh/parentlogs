import type { Metadata } from 'next'
import { TermsContent } from './terms-content'

export const metadata: Metadata = {
  title: 'Terms of Service | Rooftop Crest',
  description:
    'Read the terms and conditions for using Rooftop Crest parenting companion app.',
}

export default function TermsPage() {
  return <TermsContent />
}
