import { useEffect, useRef } from 'react'
import { AppState, Platform } from 'react-native'
import { usePathname } from 'expo-router'
import { getSessionId, getUserId } from '@/lib/analytics'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://thedadcenter.com'

const SCREEN_GROUP_MAP: Record<string, string> = {
  '(tabs)/index': 'dashboard',
  '(tabs)/tasks': 'tasks',
  '(tabs)/briefing': 'briefing',
  '(tabs)/tracker': 'tracker',
  '(tabs)/more': 'more',
  '(screens)/budget': 'budget',
  '(screens)/journey': 'journey',
  '(screens)/checklists': 'checklists',
  '(screens)/settings': 'settings',
}

function getScreenGroup(pathname: string): string {
  for (const [prefix, group] of Object.entries(SCREEN_GROUP_MAP)) {
    if (pathname.includes(prefix)) return group
  }
  if (pathname.includes('(auth)')) return 'auth'
  if (pathname.includes('(onboarding)')) return 'onboarding'
  return 'other'
}

function sendEngagement(pathname: string, durationSeconds: number) {
  if (durationSeconds < 2) return

  const payload = JSON.stringify({
    type: 'engagement',
    user_id: getUserId(),
    session_id: getSessionId(),
    page_path: pathname,
    page_group: getScreenGroup(pathname),
    duration_seconds: Math.min(durationSeconds, 86400),
    platform: Platform.OS,
  })

  fetch(`${API_URL}/api/analytics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
  }).catch(() => {})
}

export function useScreenEngagement() {
  const pathname = usePathname()
  const startTimeRef = useRef<number>(Date.now())
  const accumulatedRef = useRef<number>(0)
  const pathnameRef = useRef<string>(pathname)

  // Handle screen changes
  useEffect(() => {
    if (pathnameRef.current !== pathname) {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
      const total = accumulatedRef.current + elapsed
      sendEngagement(pathnameRef.current, total)

      pathnameRef.current = pathname
      startTimeRef.current = Date.now()
      accumulatedRef.current = 0
    }
  }, [pathname])

  // Handle app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'background' || nextState === 'inactive') {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
        accumulatedRef.current += elapsed
        sendEngagement(pathnameRef.current, accumulatedRef.current)
        accumulatedRef.current = 0
        startTimeRef.current = Date.now() // Prevent double-count on cleanup
      } else if (nextState === 'active') {
        startTimeRef.current = Date.now()
      }
    })

    return () => {
      subscription.remove()
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
      const total = accumulatedRef.current + elapsed
      sendEngagement(pathnameRef.current, total)
    }
  }, [])
}

// Component wrapper
export function ScreenEngagementTracker() {
  useScreenEngagement()
  return null
}
