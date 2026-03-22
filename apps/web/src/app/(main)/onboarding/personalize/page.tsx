import type { Metadata } from 'next'
import PersonalizeClient from './personalize-client'

export const metadata: Metadata = {
  title: 'Personalize | Rooftop Crest',
}

export default function PersonalizePage() {
  return <PersonalizeClient />
}
