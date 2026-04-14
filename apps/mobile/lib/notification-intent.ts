import type { Router } from 'expo-router'

/**
 * Single-slot queue for deep-link routes from notifications.
 *
 * Notifications (especially cold-start ones) can arrive before the auth
 * state has settled. If we `router.push()` immediately, AuthProvider's
 * route-protection effect may clobber the push with its own redirect
 * (e.g. to `/(tabs)` after sign-in). Previously a hardcoded 500ms
 * `setTimeout` tried to avoid this — it raced whatever else was happening.
 *
 * This module replaces that with a deterministic intent queue:
 *   1. NotificationListener calls `setPendingRoute(route)` on tap.
 *   2. AuthProvider calls `markAuthReady()` once its route-protection
 *      effect has settled.
 *   3. The queue drains only when both a route is pending AND auth is
 *      ready AND the router instance is known.
 */
let pendingRoute: string | null = null
let routerRef: Router | null = null
let authReady = false

export function setRouter(router: Router | null) {
  routerRef = router
  drainIfReady()
}

export function markAuthReady() {
  authReady = true
  drainIfReady()
}

/** Call on sign-out so a stale "ready" flag doesn't drain a route into a signed-out app. */
export function resetAuthReady() {
  authReady = false
}

export function setPendingRoute(route: string) {
  pendingRoute = route
  drainIfReady()
}

function drainIfReady() {
  if (!authReady || !pendingRoute || !routerRef) return
  const route = pendingRoute
  pendingRoute = null
  try {
    routerRef.push(route as never)
  } catch {
    routerRef.push('/(tabs)' as never)
  }
}
