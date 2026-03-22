import type { Metadata } from 'next'
import ChecklistsClient from './checklists-client'

export const metadata: Metadata = {
  title: 'Checklists | The Dad Center',
}

export default function ChecklistsPage() {
  return <ChecklistsClient />
}
