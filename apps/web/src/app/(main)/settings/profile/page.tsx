import type { Metadata } from 'next'
import ProfileClient from './profile-client'

export const metadata: Metadata = {
  title: 'Profile Settings | Rooftop Crest',
}

export default function ProfileSettingsPage() {
  return <ProfileClient />
}
