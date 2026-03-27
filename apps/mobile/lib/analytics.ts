import { AppState, Platform } from 'react-native'
import * as Crypto from 'expo-crypto'

type EventProperties = Record<string, string | number | boolean | null | undefined>

interface AnalyticsEvent {
  event_name: string
  properties: EventProperties
  page_path: string
  timestamp: string
}

// --- State ---
let userId: string | null = null
let sessionId: string | null = null
let initialized = false
let currentScreen: string = ''
const eventQueue: AnalyticsEvent[] = []
let flushTimer: ReturnType<typeof setInterval> | null = null

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://thedadcenter.com'

function flush() {
  if (eventQueue.length === 0) return

  const batch = eventQueue.splice(0, 50)
  const payload = JSON.stringify({
    type: 'events',
    user_id: userId,
    session_id: sessionId,
    platform: Platform.OS,
    events: batch,
  })

  fetch(`${API_URL}/api/analytics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
  }).catch(() => {})
}

// --- Public API ---

export function initAnalytics() {
  if (initialized) return

  sessionId = Crypto.randomUUID()
  initialized = true

  // Flush on app backgrounding
  const subscription = AppState.addEventListener('change', (nextState) => {
    if (nextState === 'background' || nextState === 'inactive') {
      flush()
    }
  })

  // Flush every 30 seconds
  flushTimer = setInterval(flush, 30_000)

  if (__DEV__) {
    console.log('[Analytics] Mobile initialized, session:', sessionId)
  }

  return () => {
    subscription.remove()
    if (flushTimer) clearInterval(flushTimer)
  }
}

export function setCurrentScreen(screen: string) {
  currentScreen = screen
}

export function trackEvent(eventName: string, properties: EventProperties = {}) {
  if (!initialized) {
    if (__DEV__) {
      console.log('[Analytics] Event (not init):', eventName, properties)
    }
    return
  }

  eventQueue.push({
    event_name: eventName,
    properties,
    page_path: currentScreen,
    timestamp: new Date().toISOString(),
  })

  if (eventQueue.length >= 10) flush()
}

export function identifyUser(id: string) {
  userId = id
  if (__DEV__) {
    console.log('[Analytics] Identified user:', id)
  }
}

export function resetUser() {
  userId = null
  if (__DEV__) {
    console.log('[Analytics] Reset user')
  }
}

export function getSessionId(): string | null {
  return sessionId
}

export function getUserId(): string | null {
  return userId
}

// Pre-defined event helpers — mirrors web analytics API surface
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

  // Errors
  errorOccurred: (errorType: string, message: string) => trackEvent('error_occurred', { error_type: errorType, message }),

  // Performance
  performanceMark: (metric: string, value: number) => trackEvent('performance', { metric, value }),
}
