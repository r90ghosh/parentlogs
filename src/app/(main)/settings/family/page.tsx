import type { Metadata } from 'next'
import FamilyClient from './family-client'

export const metadata: Metadata = {
  title: 'Family Settings | The Dad Center',
}

export default function FamilySettingsPage() {
  return <FamilyClient />
}
