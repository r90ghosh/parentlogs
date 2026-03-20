import type { Metadata } from 'next'
import TrackerClient from './tracker-client'

export const metadata: Metadata = {
  title: 'Baby Tracker | The Dad Center',
}

export default function TrackerPage() {
  return <TrackerClient />
}
