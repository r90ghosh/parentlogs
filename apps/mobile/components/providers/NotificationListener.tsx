import { useEffect, useRef } from 'react'
import * as Notifications from 'expo-notifications'
import { useRouter } from 'expo-router'

/**
 * Maps web-style URLs from notification payloads to mobile route paths.
 * Notifications come from the shared send-notifications edge function which
 * uses web paths. We translate them to expo-router paths here.
 */
function mapUrlToRoute(url: string | undefined | null): string {
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
  if (path === '/personalize') return '/(tabs)/more/personalize'

  // Modal screens
  if (path === '/upgrade') return '/(screens)/upgrade'
  if (path === '/create-task') return '/(screens)/create-task'
  if (path === '/appearance') return '/(screens)/appearance'

  // Unknown path — go to dashboard
  return '/(tabs)'
}

export function NotificationListener() {
  const router = useRouter()
  const handledRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    // Handle notification tapped while app is running (foreground/background)
    const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
      const id = response.notification.request.identifier
      if (handledRef.current.has(id)) return
      handledRef.current.add(id)

      const data = response.notification.request.content.data as { url?: string } | undefined
      const route = mapUrlToRoute(data?.url)
      try {
        router.push(route as never)
      } catch {
        router.push('/(tabs)')
      }
    })

    // Handle notification tap that launched the app from killed state
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!response) return
      const id = response.notification.request.identifier
      if (handledRef.current.has(id)) return
      handledRef.current.add(id)

      const data = response.notification.request.content.data as { url?: string } | undefined
      const route = mapUrlToRoute(data?.url)
      // Small delay to let router be ready after cold start
      setTimeout(() => {
        try {
          router.push(route as never)
        } catch {
          router.push('/(tabs)')
        }
      }, 500)
    })

    return () => {
      responseSub.remove()
    }
  }, [router])

  return null
}
