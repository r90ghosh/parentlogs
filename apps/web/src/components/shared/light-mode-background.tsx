'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { MeshGradient } from '@paper-design/shaders-react'

export function LightModeBackground() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted || resolvedTheme !== 'light') return null

  return (
    <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Primary mesh gradient — copper, gold, sage, rose, sky */}
      <MeshGradient
        className="absolute inset-0 w-full h-full"
        colors={['#f0ece6', '#c4703f', '#d4a853', '#6b8f71', '#c47a8f', '#5b9bd5']}
        speed={0.15}
        distortion={0.4}
        swirl={0.3}
      />
      {/* Secondary layer — lighter tones for depth */}
      <MeshGradient
        className="absolute inset-0 w-full h-full opacity-40"
        colors={['#f0ece6', '#d4a853', '#5b9bd5', '#c4703f']}
        speed={0.1}
        distortion={0.3}
        swirl={0.2}
      />
    </div>
  )
}
