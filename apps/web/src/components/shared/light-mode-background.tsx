'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { MeshGradient } from '@paper-design/shaders-react'

export function LightModeBackground() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(true)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const handler = () => setVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', handler)
    return () => document.removeEventListener('visibilitychange', handler)
  }, [])

  if (!mounted || resolvedTheme !== 'light' || !visible) return null

  return (
    <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <MeshGradient
        className="absolute inset-0 w-full h-full"
        colors={['#f0ece6', '#c4703f', '#d4a853', '#6b8f71', '#c47a8f', '#5b9bd5']}
        speed={0.15}
        distortion={0.4}
        swirl={0.3}
      />
    </div>
  )
}
