'use client'

import { type ReactNode } from 'react'
import { WarmBackground } from '@/components/ui/animations/WarmBackground'
import { ScrollProgressBar } from '@/components/ui/animations/ScrollProgressBar'
import { FloatingParticles } from '@/components/ui/animations/FloatingParticles'

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollProgressBar />
      <WarmBackground />
      <FloatingParticles count={30} />
      {children}
    </>
  )
}
