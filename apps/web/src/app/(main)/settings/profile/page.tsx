import type { Metadata } from 'next'
import ProfileClient from './profile-client'

export const metadata: Metadata = {
  title: 'Profile Settings | The Dad Center',
}

export default function ProfileSettingsPage() {
  return <ProfileClient />
}
