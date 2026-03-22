import type { Metadata } from 'next'
import AppearanceClient from './appearance-client'

export const metadata: Metadata = {
  title: 'Appearance | Rooftop Crest',
}

export default function AppearanceSettingsPage() {
  return <AppearanceClient />
}
