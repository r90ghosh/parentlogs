import type { Metadata } from 'next'
import LogClient from './log-client'

export const metadata: Metadata = {
  title: 'Log Entry | The Dad Center',
}

export default function LogEntryPage() {
  return <LogClient />
}
