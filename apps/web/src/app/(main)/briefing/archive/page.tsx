import type { Metadata } from 'next'
import ArchiveClient from './archive-client'

export const metadata: Metadata = {
  title: 'Briefing Archive | The Dad Center',
}

export default function BriefingArchivePage() {
  return <ArchiveClient />
}
