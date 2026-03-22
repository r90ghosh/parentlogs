import type { Metadata } from 'next'
import FamilyClient from './family-client'

export const metadata: Metadata = {
  title: 'Family Settings | Rooftop Crest',
}

export default function FamilySettingsPage() {
  return <FamilyClient />
}
