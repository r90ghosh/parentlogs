import type { Metadata } from 'next'
import ArchiveClient from './archive-client'

export const metadata: Metadata = {
  title: 'Briefing Archive | Rooftop Crest',
}

export default function BriefingArchivePage() {
  return <ArchiveClient />
}
