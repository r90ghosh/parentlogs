import type { Metadata } from 'next'
import HistoryClient from './history-client'

export const metadata: Metadata = {
  title: 'Tracker History | Rooftop Crest',
}

export default function TrackerHistoryPage() {
  return <HistoryClient />
}
