'use client'

import { useRef, useCallback, useEffect } from 'react'

export function use3DTilt(maxTilt = 6) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.current = mq.matches
    const onChange = (e: MediaQueryListEvent) => { prefersReducedMotion.current = e.matches }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const el = ref.current
    if (!el || prefersReducedMotion.current) return

    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const rotateX = (0.5 - y) * maxTilt
    const rotateY = (x - 0.5) * maxTilt
    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    el.style.setProperty('--mx', `${x * 100}%`)
    el.style.setProperty('--my', `${y * 100}%`)
    el.classList.add('tilt-active')
  }, [maxTilt])

  const onPointerLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)'
    el.classList.remove('tilt-active')
  }, [])

  return { ref, onPointerMove, onPointerLeave }
}
