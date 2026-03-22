import type { Metadata } from 'next'
import ChecklistsClient from './checklists-client'

export const metadata: Metadata = {
  title: 'Checklists | Rooftop Crest',
}

export default function ChecklistsPage() {
  return <ChecklistsClient />
}
