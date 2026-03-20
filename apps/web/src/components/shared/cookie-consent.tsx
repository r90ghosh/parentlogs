'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const STORAGE_KEY = 'cookie-consent'

export function CookieConsent() {
  const [show, setShow] = useState(false)
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return

    setShow(true)
    // Trigger animation after mount so the transition plays
    const timer = setTimeout(() => setAnimateIn(true), 50)
    return () => clearTimeout(timer)
  }, [])

  function handleChoice(value: 'accepted' | 'declined') {
    localStorage.setItem(STORAGE_KEY, value)
    setAnimateIn(false)
    // Remove from DOM after slide-out transition
    setTimeout(() => setShow(false), 500)
  }

  if (!show) return null

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-50 border-t border-[--border] bg-[--surface] transition-all duration-500 ease-out ${
        animateIn
          ? 'translate-y-0 opacity-100'
          : 'translate-y-full opacity-0'
      }`}
    >
      <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="text-sm font-body text-[--cream] leading-relaxed">
            We use cookies to improve your experience.{' '}
            <Link
              href="/privacy"
              className="text-copper underline-offset-4 hover:underline hover:text-gold transition-colors"
            >
              Learn more
            </Link>
          </p>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleChoice('declined')}
            >
              Decline
            </Button>
            <Button
              size="sm"
              onClick={() => handleChoice('accepted')}
            >
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
