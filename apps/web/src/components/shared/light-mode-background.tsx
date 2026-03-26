'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function LightModeBackground() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted || resolvedTheme !== 'light') return null

  return (
    <div
      className="fixed inset-0 z-0"
      aria-hidden="true"
      style={{
        background: 'linear-gradient(135deg, #f0b4c8 0%, #e8edf5 30%, #a8d0e6 60%, #89b5d4 100%)',
      }}
    />
  )
}
