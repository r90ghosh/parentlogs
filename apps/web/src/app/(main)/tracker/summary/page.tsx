import type { Metadata } from 'next'
import SummaryClient from './summary-client'

export const metadata: Metadata = {
  title: 'Tracker Summary | Rooftop Crest',
}

export default function TrackerSummaryPage() {
  return <SummaryClient />
}
