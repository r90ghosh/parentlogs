import type { Metadata } from 'next'
import HelpClient from './help-client'

export const metadata: Metadata = {
  title: 'Help & Support | Rooftop Crest',
}

export default function HelpPage() {
  return <HelpClient />
}
