import type { Metadata } from 'next'
import { JourneyPageClient } from './JourneyPageClient'

export const metadata: Metadata = {
  title: 'Dad Journey | Rooftop Crest',
}

export default function JourneyPage() {
  return <JourneyPageClient />
}
