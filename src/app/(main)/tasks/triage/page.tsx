import type { Metadata } from 'next'
import TriageClient from './triage-client'

export const metadata: Metadata = {
  title: 'Triage Backlog | The Dad Center',
}

export default function TriagePage() {
  return <TriageClient />
}
