import type { Metadata } from 'next'
import ChecklistDetailClient from './checklist-detail-client'

export const metadata: Metadata = {
  title: 'Checklist | The Dad Center',
}

export default function ChecklistDetailPage() {
  return <ChecklistDetailClient />
}
