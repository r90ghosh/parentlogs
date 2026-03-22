import type { Metadata } from 'next'
import BriefingWeekClient from './briefing-week-client'

export const metadata: Metadata = {
  title: 'Weekly Briefing | Rooftop Crest',
}

export default function BriefingWeekPage() {
  return <BriefingWeekClient />
}
