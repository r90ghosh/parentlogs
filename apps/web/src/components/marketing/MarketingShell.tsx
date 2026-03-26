'use client'

import { type ReactNode } from 'react'
import { WarmBackground } from '@/components/ui/animations/WarmBackground'
import { ScrollProgressBar } from '@/components/ui/animations/ScrollProgressBar'
import { FloatingParticles } from '@/components/ui/animations/FloatingParticles'
import { LightModeBackground } from '@/components/shared/light-mode-background'
import { InfiniteGrid } from '@/components/ui/infinite-grid'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

function LightModeGrid() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted || resolvedTheme !== 'light') return null
  return <InfiniteGrid className="fixed inset-0 z-0 pointer-events-auto" />
}

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollProgressBar />
      {/* Dark mode backgrounds */}
      <WarmBackground />
      <FloatingParticles count={12} />
      {/* Light mode backgrounds */}
      <LightModeBackground />
      <LightModeGrid />
      {children}
    </>
  )
}
