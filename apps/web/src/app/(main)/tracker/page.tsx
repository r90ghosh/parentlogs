import type { Metadata } from 'next'
import TrackerClient from './tracker-client'

export const metadata: Metadata = {
  title: 'Baby Tracker | Rooftop Crest',
}

export default function TrackerPage() {
  return <TrackerClient />
}
