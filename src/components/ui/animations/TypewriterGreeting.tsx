'use client'

import { useEffect, useState } from 'react'

interface TypewriterGreetingProps {
  text: string
  className?: string
  speed?: number
  onComplete?: () => void
}

export function TypewriterGreeting({
  text,
  className = '',
  speed = 45,
  onComplete,
}: TypewriterGreetingProps) {
  const [displayText, setDisplayText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      setDisplayText(text)
      setIsComplete(true)
      setShowCursor(false)
      onComplete?.()
      return
    }

    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
        setIsComplete(true)
        setTimeout(() => {
          setShowCursor(false)
          onComplete?.()
        }, 800)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed, onComplete])

  return (
    <span className={className}>
      {displayText}
      {showCursor && (
        <span
          className="inline-block w-[2px] h-[1em] align-middle ml-0.5 animate-cursor-blink"
          style={{ backgroundColor: 'var(--copper)' }}
        />
      )}
    </span>
  )
}
