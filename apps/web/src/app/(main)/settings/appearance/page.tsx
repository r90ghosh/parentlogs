import type { Metadata } from 'next'
import AppearanceClient from './appearance-client'

export const metadata: Metadata = {
  title: 'Appearance | The Dad Center',
}

export default function AppearanceSettingsPage() {
  return <AppearanceClient />
}
