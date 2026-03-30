import type { Metadata } from 'next'
import { TermsContent } from './terms-content'

export const metadata: Metadata = {
  title: 'Terms of Service | The Dad Center',
  description:
    'Read the terms and conditions for using The Dad Center parenting companion app.',
  alternates: { canonical: '/terms' },
  openGraph: {
    title: 'Terms of Service | The Dad Center',
    description: 'Read the terms and conditions for using The Dad Center parenting companion app.',
    url: '/terms',
  },
}

export default function TermsPage() {
  return <TermsContent />
}
