'use client'

import { useEffect, useRef } from 'react'
import { trackEvent } from '@/lib/analytics'

export function ScrollDepthTracker() {
  const firedRef = useRef<Set<number>>(new Set())

  useEffect(() => {
    const thresholds = [25, 50, 75, 100]

    function handleScroll() {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight <= 0) return
      const depth = Math.round((window.scrollY / scrollHeight) * 100)

      for (const t of thresholds) {
        if (depth >= t && !firedRef.current.has(t)) {
          firedRef.current.add(t)
          trackEvent('scroll_depth', { depth: t, page: 'landing' })
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return null
}
