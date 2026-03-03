'use client'

import { useUser } from '@/components/user-provider'
import { JourneyPageClient } from './JourneyPageClient'

export default function JourneyPage() {
  const { user, profile } = useUser()

  return (
    <JourneyPageClient
      userId={user.id}
      userRole={profile.role}
    />
  )
}
