import { AppState, Platform } from 'react-native'
import * as Crypto from 'expo-crypto'

import {
  createAnalyticsEngine,
  type AnalyticsPayload,
} from '@tdc/shared/analytics'

// Re-export shared types for existing consumers
export type { EventProperties, AnalyticsEvent } from '@tdc/shared/analytics'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://thedadcenter.com'

function mobileSend(payload: AnalyticsPayload) {
  fetch(`${API_URL}/api/analytics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {})
}

let currentScreen = ''

const engine = createAnalyticsEngine({
  platform: Platform.OS,
  send: mobileSend,
  getPagePath: () => currentScreen,
  generateSessionId: () => Crypto.randomUUID(),
  isDev: __DEV__,
})

// --- Public API ---

export function initAnalytics() {
  engine.init()

  // Flush on app backgrounding
  const subscription = AppState.addEventListener('change', (nextState) => {
    if (nextState === 'background' || nextState === 'inactive') {
      engine.flush()
    }
  })

  // Flush every 30 seconds
  const flushTimer = setInterval(() => engine.flush(), 30_000)

  if (__DEV__) {
    console.log('[Analytics] Mobile initialized, session:', engine.getSessionId())
  }

  return () => {
    subscription.remove()
    clearInterval(flushTimer)
  }
}

export function setCurrentScreen(screen: string) {
  currentScreen = screen
}

export const trackEvent = engine.trackEvent
export const identifyUser = (id: string) => engine.identifyUser(id)
export const resetUser = engine.resetUser
export const getSessionId = engine.getSessionId
export const getUserId = engine.getUserId

// Pre-defined event helpers — mirrors web analytics API surface
export const analytics = engine.helpers
