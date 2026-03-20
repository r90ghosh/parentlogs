import type { Metadata } from 'next'
import HelpClient from './help-client'

export const metadata: Metadata = {
  title: 'Help & Support | The Dad Center',
}

export default function HelpPage() {
  return <HelpClient />
}
