'use client'

import { useRef, useCallback, useEffect, type ReactNode } from 'react'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  maxOffset?: number
}

export function MagneticButton({ children, className = '', maxOffset = 4 }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.current = mq.matches
    const onChange = (e: MediaQueryListEvent) => { prefersReducedMotion.current = e.matches }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current
    if (!el || prefersReducedMotion.current) return

    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    const dx = (x / rect.width) * maxOffset * 2
    const dy = (y / rect.height) * maxOffset * 2
    el.style.transform = `translate(${dx}px, ${dy}px)`
  }, [maxOffset])

  const onMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'translate(0, 0)'
  }, [])

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`inline-block transition-transform duration-300 ease-out ${className}`}
      style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
    >
      {children}
    </div>
  )
}
