'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface Particle {
  id: number
  size: number
  left: number
  duration: number
  delay: number
  drift: number
  color: string
}

const COLORS = [
  'rgba(196, 112, 63, 0.6)',  // copper
  'rgba(212, 168, 83, 0.5)',  // gold
  'rgba(237, 230, 220, 0.3)', // cream
  'rgba(196, 112, 63, 0.4)',  // copper dim
  'rgba(212, 168, 83, 0.35)', // gold dim
]

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 2 + Math.random() * 3,
    left: Math.random() * 100,
    duration: 11 + Math.random() * 9,
    delay: Math.random() * 10,
    drift: (Math.random() - 0.5) * 60,
    color: COLORS[i % COLORS.length],
  }))
}

export function FloatingParticles({ count = 10 }: { count?: number }) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) return

    setParticles(generateParticles(count))
  }, [count])

  if (mounted && resolvedTheme === 'light') return null
  if (particles.length === 0) return null

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 5 }}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-float-up"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            bottom: '-10px',
            backgroundColor: p.color,
            '--duration': `${p.duration}s`,
            '--drift': `${p.drift}px`,
            animationDelay: `${p.delay}s`,
            willChange: 'transform, opacity',
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}
