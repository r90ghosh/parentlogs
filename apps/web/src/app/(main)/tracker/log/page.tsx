import type { Metadata } from 'next'
import LogClient from './log-client'

export const metadata: Metadata = {
  title: 'Log Entry | Rooftop Crest',
}

export default function LogEntryPage() {
  return <LogClient />
}
