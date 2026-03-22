import type { Metadata } from 'next'
import BriefingClient from './briefing-client'

export const metadata: Metadata = {
  title: 'Weekly Briefing | Rooftop Crest',
}

export default function BriefingPage() {
  return <BriefingClient />
}
