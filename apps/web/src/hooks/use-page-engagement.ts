'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { getSessionId, getUserId } from '@/lib/analytics'

const PAGE_GROUP_MAP: Record<string, string> = {
  '/dashboard': 'dashboard',
  '/tasks': 'tasks',
  '/briefing': 'briefing',
  '/budget': 'budget',
  '/tracker': 'tracker',
  '/journey': 'journey',
  '/checklists': 'checklists',
  '/content': 'content',
  '/tips': 'tips',
  '/settings': 'settings',
}

function getPageGroup(pathname: string): string {
  if (pathname === '/') return 'landing'
  for (const [prefix, group] of Object.entries(PAGE_GROUP_MAP)) {
    if (pathname.startsWith(prefix)) return group
  }
  return 'other'
}

function hasConsent(): boolean {
  try {
    return localStorage.getItem('cookie-consent') === 'accepted'
  } catch {
    return false
  }
}

function sendEngagement(pathname: string, durationSeconds: number) {
  if (durationSeconds < 2 || !hasConsent()) return

  const payload = JSON.stringify({
    type: 'engagement',
    user_id: getUserId(),
    session_id: getSessionId(),
    page_path: pathname,
    page_group: getPageGroup(pathname),
    duration_seconds: Math.min(durationSeconds, 86400),
    platform: 'web',
  })

  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics', payload)
  } else {
    fetch('/api/analytics', {
      method: 'POST',
      body: payload,
      keepalive: true,
    }).catch(() => {})
  }
}

export function usePageEngagement() {
  const pathname = usePathname()
  const startTimeRef = useRef<number>(Date.now())
  const accumulatedRef = useRef<number>(0)
  const pathnameRef = useRef<string>(pathname)

  useEffect(() => {
    // When pathname changes, record accumulated time for previous page
    if (pathnameRef.current !== pathname) {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
      const total = accumulatedRef.current + elapsed
      sendEngagement(pathnameRef.current, total)

      // Reset for new page
      pathnameRef.current = pathname
      startTimeRef.current = Date.now()
      accumulatedRef.current = 0
    }
  }, [pathname])

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
        accumulatedRef.current += elapsed
        sendEngagement(pathnameRef.current, accumulatedRef.current)
        accumulatedRef.current = 0
        startTimeRef.current = Date.now() // Prevent double-count on cleanup
      } else {
        startTimeRef.current = Date.now()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
      const total = accumulatedRef.current + elapsed
      sendEngagement(pathnameRef.current, total)
    }
  }, [])

  return null
}

// Component wrapper for use in providers
export function PageEngagementTracker() {
  usePageEngagement()
  return null
}
