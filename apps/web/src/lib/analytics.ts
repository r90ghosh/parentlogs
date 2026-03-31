// Analytics client — batched events sent to /api/analytics via sendBeacon
// Gated on cookie consent (localStorage 'cookie-consent' === 'accepted')

type EventProperties = Record<string, string | number | boolean | null | undefined>

interface AnalyticsEvent {
  event_name: string
  properties: EventProperties
  page_path: string
  timestamp: string
}

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
  'onboarding_role_selected', 'onboarding_family_created', 'onboarding_ready',
  'upgrade_viewed', 'begin_checkout', 'purchase', 'subscription_canceled',
  'family_created', 'family_joined',
  'cta_clicked', 'scroll_depth',
])

// --- State ---
let userId: string | null = null
let sessionId: string | null = null
let initialized = false
const eventQueue: AnalyticsEvent[] = []
let flushTimer: ReturnType<typeof setInterval> | null = null
let visibilityHandler: (() => void) | null = null

// --- Helpers ---
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

function flush() {
  if (eventQueue.length === 0) return

  const batch = eventQueue.splice(0, 50) // cap at 50
  const payload = JSON.stringify({
    type: 'events',
    user_id: userId,
    session_id: sessionId,
    platform: 'web',
    events: batch,
  })

  // Prefer sendBeacon (non-blocking, survives tab close)
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics', payload)
  } else if (typeof fetch !== 'undefined') {
    fetch('/api/analytics', {
      method: 'POST',
      body: payload,
      keepalive: true,
    }).catch(() => {})
  }
}

// --- Public API ---

export function initAnalytics() {
  if (initialized || typeof window === 'undefined') return
  if (!hasConsent()) return

  sessionId = typeof crypto?.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  initialized = true

  // Flush on visibility change (user leaving tab)
  visibilityHandler = () => {
    if (document.visibilityState === 'hidden') flush()
  }
  document.addEventListener('visibilitychange', visibilityHandler)

  // Flush every 30 seconds as catch-all
  flushTimer = setInterval(flush, 30_000)

  // Capture UTM parameters for attribution
  captureUtmParams()

  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Initialized, session:', sessionId)
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

export function trackEvent(eventName: string, properties: EventProperties = {}) {
  if (!initialized || !hasConsent()) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Event (dev only):', eventName, properties)
    }
    return
  }

  eventQueue.push({
    event_name: eventName,
    properties,
    page_path: getPagePath(),
    timestamp: new Date().toISOString(),
  })

  // Forward key events to GTM dataLayer for GA4 conversion tracking
  if (GTM_EVENTS.has(eventName)) {
    pushToDataLayer(eventName, properties as Record<string, unknown>)
  }

  // Flush when batch threshold reached
  if (eventQueue.length >= 10) flush()
}

export function trackPageView(url: string, _title?: string) {
  trackEvent('page_view', { url })
}

export function identifyUser(id: string, _traits?: EventProperties) {
  userId = id
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Identified user:', id)
  }
}

export function resetUser() {
  userId = null
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Reset user')
  }
}

export function getSessionId(): string | null {
  return sessionId
}

export function getUserId(): string | null {
  return userId
}

export function destroyAnalytics() {
  if (!initialized) return
  flush()
  if (visibilityHandler) {
    document.removeEventListener('visibilitychange', visibilityHandler)
    visibilityHandler = null
  }
  if (flushTimer) {
    clearInterval(flushTimer)
    flushTimer = null
  }
  initialized = false
  sessionId = null
}

// Pre-defined event helpers — same API surface as before
export const analytics = {
  // Authentication
  signUp: (method: string) => trackEvent('sign_up', { method }),
  signIn: (method: string) => trackEvent('login', { method }),
  signOut: () => trackEvent('logout'),

  // Onboarding
  onboardingStarted: () => trackEvent('onboarding_started'),
  onboardingCompleted: (role: string) => trackEvent('onboarding_completed', { role }),
  familyCreated: () => trackEvent('family_created'),
  familyJoined: () => trackEvent('family_joined'),

  // Tasks
  taskCreated: (category: string) => trackEvent('task_created', { category }),
  taskCompleted: (category: string) => trackEvent('task_completed', { category }),
  taskSkipped: (category: string) => trackEvent('task_skipped', { category }),
  taskSnoozed: (category: string, days: number) => trackEvent('task_snoozed', { category, days }),

  // Tracker
  logCreated: (logType: string) => trackEvent('log_created', { log_type: logType }),
  logDeleted: (logType: string) => trackEvent('log_deleted', { log_type: logType }),

  // Briefing
  briefingViewed: (week: number) => trackEvent('briefing_viewed', { week }),

  // Budget
  budgetItemAdded: (category: string) => trackEvent('budget_item_added', { category }),
  budgetItemPurchased: (category: string) => trackEvent('budget_item_purchased', { category }),

  // Checklists
  checklistViewed: (checklistId: string) => trackEvent('checklist_viewed', { checklist_id: checklistId }),
  checklistItemChecked: (checklistId: string) => trackEvent('checklist_item_checked', { checklist_id: checklistId }),

  // Journey
  journeyTileOpened: (pillar: string) => trackEvent('journey_tile_opened', { pillar }),

  // Mood
  moodCheckedIn: (mood: string) => trackEvent('mood_checked_in', { mood }),

  // Subscription
  upgradeViewed: () => trackEvent('upgrade_viewed'),
  checkoutStarted: (plan: string) => trackEvent('begin_checkout', { plan }),
  subscriptionPurchased: (plan: string, value: number) => trackEvent('purchase', { plan, value, currency: 'USD' }),
  subscriptionCanceled: () => trackEvent('subscription_canceled'),

  // Feature usage
  featureUsed: (feature: string) => trackEvent('feature_used', { feature }),
  premiumFeatureBlocked: (feature: string) => trackEvent('premium_feature_blocked', { feature }),

  // Notifications
  notificationsEnabled: () => trackEvent('notifications_enabled'),
  notificationsDisabled: () => trackEvent('notifications_disabled'),

  // Errors (dev fallback — production errors go to Sentry)
  errorOccurred: (errorType: string, message: string) => trackEvent('error_occurred', { error_type: errorType, message }),

  // Performance
  performanceMark: (metric: string, value: number) => trackEvent('performance', { metric, value }),
}
