import type { Metadata } from 'next'
import BriefingWeekClient from './briefing-week-client'

export const metadata: Metadata = {
  title: 'Weekly Briefing | The Dad Center',
}

export default function BriefingWeekPage() {
  return <BriefingWeekClient />
}
