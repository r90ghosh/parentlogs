import type { Metadata } from 'next'
import TriageClient from './triage-client'

export const metadata: Metadata = {
  title: 'Triage Backlog | Rooftop Crest',
}

export default function TriagePage() {
  return <TriageClient />
}
