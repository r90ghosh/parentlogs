'use client'

import { useEffect, useState } from 'react'

interface ScrollProgressBarProps {
  className?: string
}

export function ScrollProgressBar({ className = '' }: ScrollProgressBarProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')

    function onScroll() {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight > 0) {
        setProgress(Math.min((scrollTop / docHeight) * 100, 100))
      }
    }

    if (!mq.matches) {
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
    }
  }, [])

  if (progress === 0) return null

  return (
    <div className={`fixed top-0 left-0 right-0 h-[2px] z-[9999] ${className}`}>
      <div
        className="h-full transition-[width] duration-100 ease-out"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, var(--copper), var(--gold))',
          boxShadow: '0 0 6px rgba(196,112,63,0.5)',
        }}
      />
    </div>
  )
}
