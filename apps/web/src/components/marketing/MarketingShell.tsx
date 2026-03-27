'use client'

import { type ReactNode } from 'react'
import { WarmBackground } from '@/components/ui/animations/WarmBackground'
import { ScrollProgressBar } from '@/components/ui/animations/ScrollProgressBar'
import { FloatingParticles } from '@/components/ui/animations/FloatingParticles'
import { LightModeBackground, LightModeGrid } from '@/components/shared/light-mode-background'

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollProgressBar />
      {/* Dark mode backgrounds */}
      <WarmBackground />
      <FloatingParticles count={30} />
      {/* Light mode backgrounds */}
      <LightModeBackground />
      <LightModeGrid />
      {children}
    </>
  )
}
