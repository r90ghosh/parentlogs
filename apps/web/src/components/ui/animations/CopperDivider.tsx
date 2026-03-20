'use client'

import { useEffect, useState } from 'react'

interface CopperDividerProps {
  className?: string
  trigger?: boolean
  delay?: number
}

export function CopperDivider({ className = '', trigger = true, delay = 0 }: CopperDividerProps) {
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!trigger) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      setStarted(true)
      return
    }
    const timer = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(timer)
  }, [trigger, delay])

  return (
    <div className={`relative h-[2px] w-full overflow-hidden ${className}`}>
      <div
        className={`absolute inset-y-0 left-0 bg-copper ${started ? 'animate-draw-line' : 'w-0 opacity-0'}`}
        style={{ height: '100%' }}
      />
      {started && (
        <div
          className="absolute top-1/2 -translate-y-1/2 h-2 w-2 rounded-full animate-tip-travel"
          style={{
            backgroundColor: 'var(--copper)',
            boxShadow: '0 0 10px 3px rgba(196,112,63,0.7)',
          }}
        />
      )}
    </div>
  )
}
