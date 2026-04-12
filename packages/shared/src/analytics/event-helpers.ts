import type { AnalyticsEvent, AnalyticsPayload, EventProperties } from './types'

/** Configuration for the analytics engine */
export interface AnalyticsConfig {
  /** Platform identifier included in payloads (e.g. 'web', 'ios', 'android') */
  platform: string
  /** Send a batch of events to the analytics endpoint */
  send: (payload: AnalyticsPayload) => void
  /** Return the current page/screen path */
  getPagePath: () => string
  /** Generate a session ID (UUID or fallback) */
  generateSessionId: () => string
  /** Whether tracking is allowed (e.g. cookie consent check). Defaults to () => true */
  hasConsent?: () => boolean
  /** Whether we're in dev mode. Defaults to false */
  isDev?: boolean
  /** Optional hook called for every tracked event (e.g. GTM dataLayer push) */
  onEvent?: (eventName: string, properties: EventProperties) => void
}

export interface AnalyticsEngine {
  init: () => void
  trackEvent: (eventName: string, properties?: EventProperties) => void
  identifyUser: (id: string) => void
  resetUser: () => void
  getSessionId: () => string | null
  getUserId: () => string | null
  flush: () => void
  /** Pre-defined event helpers */
  helpers: AnalyticsHelpers
}

export interface AnalyticsHelpers {
  // Authentication
  signUp: (method: string) => void
  signIn: (method: string) => void
  signOut: () => void

  // Onboarding
  onboardingStarted: () => void
  onboardingCompleted: (role: string) => void
  familyCreated: () => void
  familyJoined: () => void

  // Tasks
  taskCreated: (category: string) => void
  taskCompleted: (category: string) => void
  taskSkipped: (category: string) => void
  taskSnoozed: (category: string, days: number) => void

  // Tracker
  logCreated: (logType: string) => void
  logDeleted: (logType: string) => void

  // Briefing
  briefingViewed: (week: number) => void

  // Budget
  budgetItemAdded: (category: string) => void
  budgetItemPurchased: (category: string) => void

  // Checklists
  checklistViewed: (checklistId: string) => void
  checklistItemChecked: (checklistId: string) => void

  // Journey
  journeyTileOpened: (pillar: string) => void

  // Mood
  moodCheckedIn: (mood: string) => void

  // Subscription
  upgradeViewed: () => void
  checkoutStarted: (plan: string) => void
  subscriptionPurchased: (plan: string, value: number) => void
  subscriptionCanceled: () => void

  // Feature usage
  featureUsed: (feature: string) => void
  premiumFeatureBlocked: (feature: string) => void

  // Notifications
  notificationsEnabled: () => void
  notificationsDisabled: () => void

  // Errors
  errorOccurred: (errorType: string, message: string) => void

  // Performance
  performanceMark: (metric: string, value: number) => void
}

const BATCH_SIZE = 50
const FLUSH_THRESHOLD = 10

/**
 * Creates a platform-agnostic analytics engine.
 * Each platform provides its own transport, consent check, and page path resolver.
 */
export function createAnalyticsEngine(config: AnalyticsConfig): AnalyticsEngine {
  const {
    platform,
    send,
    getPagePath,
    generateSessionId,
    hasConsent = () => true,
    isDev = false,
    onEvent,
  } = config

  let userId: string | null = null
  let sessionId: string | null = null
  let initialized = false
  const eventQueue: AnalyticsEvent[] = []

  function flush() {
    if (eventQueue.length === 0) return

    const batch = eventQueue.splice(0, BATCH_SIZE)
    send({
      type: 'events',
      user_id: userId,
      session_id: sessionId,
      platform,
      events: batch,
    })
  }

  function init() {
    if (initialized) return
    if (!hasConsent()) return

    sessionId = generateSessionId()
    initialized = true

    if (isDev) {
      console.log('[Analytics] Initialized, session:', sessionId)
    }
  }

  function trackEvent(eventName: string, properties: EventProperties = {}) {
    if (!initialized || !hasConsent()) {
      if (isDev) {
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

    onEvent?.(eventName, properties)

    if (eventQueue.length >= FLUSH_THRESHOLD) flush()
  }

  function identifyUser(id: string) {
    userId = id
    if (isDev) {
      console.log('[Analytics] Identified user:', id)
    }
  }

  function resetUser() {
    userId = null
    if (isDev) {
      console.log('[Analytics] Reset user')
    }
  }

  function getSessionIdFn(): string | null {
    return sessionId
  }

  function getUserIdFn(): string | null {
    return userId
  }

  const helpers: AnalyticsHelpers = {
    // Authentication
    signUp: (method) => trackEvent('sign_up', { method }),
    signIn: (method) => trackEvent('login', { method }),
    signOut: () => trackEvent('logout'),

    // Onboarding
    onboardingStarted: () => trackEvent('onboarding_started'),
    onboardingCompleted: (role) => trackEvent('onboarding_completed', { role }),
    familyCreated: () => trackEvent('family_created'),
    familyJoined: () => trackEvent('family_joined'),

    // Tasks
    taskCreated: (category) => trackEvent('task_created', { category }),
    taskCompleted: (category) => trackEvent('task_completed', { category }),
    taskSkipped: (category) => trackEvent('task_skipped', { category }),
    taskSnoozed: (category, days) => trackEvent('task_snoozed', { category, days }),

    // Tracker
    logCreated: (logType) => trackEvent('log_created', { log_type: logType }),
    logDeleted: (logType) => trackEvent('log_deleted', { log_type: logType }),

    // Briefing
    briefingViewed: (week) => trackEvent('briefing_viewed', { week }),

    // Budget
    budgetItemAdded: (category) => trackEvent('budget_item_added', { category }),
    budgetItemPurchased: (category) => trackEvent('budget_item_purchased', { category }),

    // Checklists
    checklistViewed: (checklistId) => trackEvent('checklist_viewed', { checklist_id: checklistId }),
    checklistItemChecked: (checklistId) => trackEvent('checklist_item_checked', { checklist_id: checklistId }),

    // Journey
    journeyTileOpened: (pillar) => trackEvent('journey_tile_opened', { pillar }),

    // Mood
    moodCheckedIn: (mood) => trackEvent('mood_checked_in', { mood }),

    // Subscription
    upgradeViewed: () => trackEvent('upgrade_viewed'),
    checkoutStarted: (plan) => trackEvent('begin_checkout', { plan }),
    subscriptionPurchased: (plan, value) => trackEvent('purchase', { plan, value, currency: 'USD' }),
    subscriptionCanceled: () => trackEvent('subscription_canceled'),

    // Feature usage
    featureUsed: (feature) => trackEvent('feature_used', { feature }),
    premiumFeatureBlocked: (feature) => trackEvent('premium_feature_blocked', { feature }),

    // Notifications
    notificationsEnabled: () => trackEvent('notifications_enabled'),
    notificationsDisabled: () => trackEvent('notifications_disabled'),

    // Errors
    errorOccurred: (errorType, message) => trackEvent('error_occurred', { error_type: errorType, message }),

    // Performance
    performanceMark: (metric, value) => trackEvent('performance', { metric, value }),
  }

  return {
    init,
    trackEvent,
    identifyUser,
    resetUser,
    getSessionId: getSessionIdFn,
    getUserId: getUserIdFn,
    flush,
    helpers,
  }
}
