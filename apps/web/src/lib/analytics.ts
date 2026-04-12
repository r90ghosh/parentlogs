// Analytics client — batched events sent to /api/analytics via sendBeacon
// Gated on cookie consent (localStorage 'cookie-consent' === 'accepted')

import {
  createAnalyticsEngine,
  type EventProperties,
  type AnalyticsPayload,
} from '@tdc/shared/analytics'

// Re-export shared types for existing consumers
export type { EventProperties, AnalyticsEvent } from '@tdc/shared/analytics'

// --- GTM DataLayer ---
declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

function pushToDataLayer(event: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({ event, ...params })
  }
}

// Events that should also fire in GTM/GA4 for conversion tracking
const GTM_EVENTS = new Set([
  'sign_up', 'login', 'onboarding_completed',
  'onboarding_role_selected', 'onboarding_family_created',
  'upgrade_viewed', 'begin_checkout', 'purchase', 'subscription_canceled',
  'family_created', 'family_joined',
  'cta_clicked', 'scroll_depth',
])

// --- Web-specific helpers ---
function hasConsent(): boolean {
  try {
    return localStorage.getItem('cookie-consent') === 'accepted'
  } catch {
    return false
  }
}

function getPagePath(): string {
  return typeof window !== 'undefined' ? window.location.pathname : ''
}

function generateSessionId(): string {
  return typeof crypto?.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function webSend(payload: AnalyticsPayload) {
  const body = JSON.stringify(payload)

  // Prefer sendBeacon (non-blocking, survives tab close)
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics', body)
  } else if (typeof fetch !== 'undefined') {
    fetch('/api/analytics', {
      method: 'POST',
      body,
      keepalive: true,
    }).catch(() => {})
  }
}

// --- Create engine ---
const engine = createAnalyticsEngine({
  platform: 'web',
  send: webSend,
  getPagePath,
  generateSessionId,
  hasConsent,
  isDev: process.env.NODE_ENV === 'development',
  onEvent: (eventName, properties) => {
    if (GTM_EVENTS.has(eventName)) {
      pushToDataLayer(eventName, properties as Record<string, unknown>)
    }
  },
})

// --- Web-specific lifecycle ---
let flushTimer: ReturnType<typeof setInterval> | null = null
let visibilityHandler: (() => void) | null = null

export function initAnalytics() {
  if (typeof window === 'undefined') return

  engine.init()

  // Flush on visibility change (user leaving tab)
  if (!visibilityHandler) {
    visibilityHandler = () => {
      if (document.visibilityState === 'hidden') engine.flush()
    }
    document.addEventListener('visibilitychange', visibilityHandler)
  }

  // Flush every 30 seconds as catch-all
  if (!flushTimer) {
    flushTimer = setInterval(() => engine.flush(), 30_000)
  }

  // Capture UTM parameters for attribution
  captureUtmParams()

  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Initialized, session:', engine.getSessionId())
  }
}

function captureUtmParams() {
  try {
    const params = new URLSearchParams(window.location.search)
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
    const utmData: Record<string, string> = {}

    for (const key of utmKeys) {
      const value = params.get(key)
      if (value) utmData[key] = value
    }

    if (Object.keys(utmData).length > 0) {
      sessionStorage.setItem('utm_params', JSON.stringify(utmData))
      pushToDataLayer('utm_captured', utmData)
    }
  } catch {
    // Ignore — SSR or no access to sessionStorage
  }
}

export function getStoredUtmParams(): Record<string, string> | null {
  try {
    const raw = sessionStorage.getItem('utm_params')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function destroyAnalytics() {
  engine.flush()
  if (visibilityHandler) {
    document.removeEventListener('visibilitychange', visibilityHandler)
    visibilityHandler = null
  }
  if (flushTimer) {
    clearInterval(flushTimer)
    flushTimer = null
  }
}

// --- Re-export engine methods with the same API surface ---
export const trackEvent = engine.trackEvent
export const trackPageView = (url: string, _title?: string) => engine.trackEvent('page_view', { url })
export const identifyUser = (id: string, _traits?: EventProperties) => engine.identifyUser(id)
export const resetUser = engine.resetUser
export const getSessionId = engine.getSessionId
export const getUserId = engine.getUserId

// Pre-defined event helpers — same API surface as before
export const analytics = engine.helpers
