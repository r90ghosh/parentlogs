'use client'

import { useRef, useEffect, useState, type ReactNode } from 'react'
import { observe } from '@/lib/shared-observer'

type RevealVariant = 'scroll' | 'card' | 'fade'

interface RevealProps {
  children: ReactNode
  variant?: RevealVariant
  delay?: number
  className?: string
}

const transforms: Record<RevealVariant, string> = {
  scroll: 'translateY(20px)',
  card: 'perspective(800px) rotateX(8deg) translateY(24px)',
  fade: 'none',
}

const easings: Record<RevealVariant, string> = {
  scroll: 'cubic-bezier(0.16, 1, 0.3, 1)',
  card: 'cubic-bezier(0.22, 1, 0.36, 1)',
  fade: 'cubic-bezier(0.16, 1, 0.3, 1)',
}

const durations: Record<RevealVariant, string> = {
  scroll: '0.65s',
  card: '0.55s',
  fade: '0.6s',
}

export function Reveal({ children, variant = 'scroll', delay = 0, className = '' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      setIsVisible(true)
      return
    }

    const unobserve = observe(el, (isIntersecting) => {
      if (isIntersecting) {
        setIsVisible(true)
        unobserve()
      }
    })

    const fallback = setTimeout(() => setIsVisible(true), (delay || 0) + 800)

    return () => {
      unobserve()
      clearTimeout(fallback)
    }
  }, [delay])

  const dur = durations[variant]
  const ease = easings[variant]

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : transforms[variant],
        transition: `opacity ${dur} ${ease} ${delay}ms, transform ${dur} ${ease} ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
