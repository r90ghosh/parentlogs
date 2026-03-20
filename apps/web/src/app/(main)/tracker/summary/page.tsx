import type { Metadata } from 'next'
import SummaryClient from './summary-client'

export const metadata: Metadata = {
  title: 'Tracker Summary | The Dad Center',
}

export default function TrackerSummaryPage() {
  return <SummaryClient />
}
