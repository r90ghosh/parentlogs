import type { Metadata } from 'next'
import PersonalizeClient from './personalize-client'

export const metadata: Metadata = {
  title: 'Personalize | The Dad Center',
}

export default function PersonalizePage() {
  return <PersonalizeClient />
}
