'use client'

import { type ReactNode } from 'react'
import { WarmBackground } from '@/components/ui/animations/WarmBackground'
import { ScrollProgressBar } from '@/components/ui/animations/ScrollProgressBar'

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollProgressBar />
      <WarmBackground />
      {children}
    </>
  )
}
