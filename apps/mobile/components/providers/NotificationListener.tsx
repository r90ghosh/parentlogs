import { useEffect, useRef } from 'react'
import * as Notifications from 'expo-notifications'
import { useRouter } from 'expo-router'
import { setPendingRoute, setRouter } from '@/lib/notification-intent'
import { Sentry } from '@/lib/sentry'

/**
 * Maps web-style URLs from notification payloads to mobile route paths.
 * Returns null for unknown paths so the caller can log them before falling
 * back — we want visibility into notifications that silently redirect to
 * the dashboard.
 */
function mapUrlToRoute(url: string | undefined | null): string | null {
  if (!url) return '/(tabs)'

  // Normalize: strip trailing slash, lowercase
  const path = url.replace(/\/$/, '').toLowerCase()

  // Main tabs
  if (path === '' || path === '/' || path === '/dashboard' || path === '/home') {
    return '/(tabs)'
  }
  if (path === '/tasks' || path.startsWith('/tasks/')) return '/(tabs)/tasks'
  if (path === '/briefing' || path.startsWith('/briefing/')) return '/(tabs)/briefing'
  if (path === '/tracker' || path.startsWith('/tracker/')) return '/(tabs)/tracker'

  // More tab sub-screens
  if (path === '/more') return '/(tabs)/more'
  if (path === '/budget') return '/(tabs)/more/budget'
  if (path === '/checklists') return '/(tabs)/more/checklists'
  if (path === '/journey') return '/(tabs)/more/journey'
  if (path === '/settings') return '/(tabs)/more/settings'
  if (path === '/family') return '/(tabs)/more/family'
  if (path === '/notifications') return '/(tabs)/more/notifications'
  if (path === '/notification-inbox') return '/(tabs)/more/notification-inbox'
  if (path === '/help') return '/(tabs)/more/help'
  if (path === '/faq') return '/(tabs)/more/faq'
  if (path === '/about') return '/(tabs)/more/about'
  if (path === '/feedback') return '/(tabs)/more/feedback'
  if (path === '/content' || path === '/blog') return '/(tabs)/more/content'
  if (path === '/videos') return '/(tabs)/more/videos'
  if (path === '/triage') return '/(tabs)/more/triage'

  // Modal screens
  if (path === '/upgrade') return '/(screens)/upgrade'
  if (path === '/create-task') return '/(screens)/create-task'
  if (path === '/appearance') return '/(screens)/appearance'

  // Unknown path — caller decides fallback
  return null
}

function resolveRoute(url: string | undefined | null): string {
  const route = mapUrlToRoute(url)
  if (route === null) {
    Sentry.captureMessage('Unknown notification URL', {
      level: 'warning',
      extra: { url },
    })
    return '/(tabs)'
  }
  return route
}

export function NotificationListener() {
  const router = useRouter()
  const handledRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    setRouter(router)

    // Handle notification tapped while app is running (foreground/background)
    const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
      const id = response.notification.request.identifier
      if (handledRef.current.has(id)) return
      handledRef.current.add(id)

      const data = response.notification.request.content.data as { url?: string } | undefined
      setPendingRoute(resolveRoute(data?.url))
    })

    // Handle notification tap that launched the app from killed state.
    // No setTimeout — the intent queue drains when AuthProvider marks
    // auth ready, which is deterministic (not a race with a 500ms guess).
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!response) return
      const id = response.notification.request.identifier
      if (handledRef.current.has(id)) return
      handledRef.current.add(id)

      const data = response.notification.request.content.data as { url?: string } | undefined
      setPendingRoute(resolveRoute(data?.url))
    })

    return () => {
      responseSub.remove()
      setRouter(null)
    }
  }, [router])

  return null
}
