'use client'

import { type ReactNode, useState, useEffect } from 'react'
import { use3DTilt } from '@/hooks/use-3d-tilt'

interface Card3DTiltProps {
  children: ReactNode
  className?: string
  maxTilt?: number
  gloss?: boolean
}

export function Card3DTilt({ children, className = '', maxTilt = 6, gloss = true }: Card3DTiltProps) {
  const { ref, onPointerMove, onPointerLeave } = use3DTilt(maxTilt)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  if (isMobile) {
    return <div className={`relative ${className}`}>{children}</div>
  }

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`relative transition-transform duration-300 ease-out ${className}`}
      style={{ transformStyle: 'preserve-3d', perspective: '800px' }}
    >
      {children}
      {gloss && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 [.tilt-active>&]:opacity-100"
          style={{
            background: 'radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.04), transparent 60%)',
          }}
        />
      )}
    </div>
  )
}
