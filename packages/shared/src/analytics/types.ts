/** Property values allowed in analytics event payloads */
export type EventProperties = Record<string, string | number | boolean | null | undefined>

/** A single analytics event as queued for batching */
export interface AnalyticsEvent {
  event_name: string
  properties: EventProperties
  page_path: string
  timestamp: string
}

/** The batched payload sent to the analytics endpoint */
export interface AnalyticsPayload {
  type: 'events'
  user_id: string | null
  session_id: string | null
  platform: string
  events: AnalyticsEvent[]
}

/** Event names used across both web and mobile */
export const EVENT_NAMES = {
  // Authentication
  SIGN_UP: 'sign_up',
  LOGIN: 'login',
  LOGOUT: 'logout',

  // Onboarding
  ONBOARDING_STARTED: 'onboarding_started',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  FAMILY_CREATED: 'family_created',
  FAMILY_JOINED: 'family_joined',

  // Tasks
  TASK_CREATED: 'task_created',
  TASK_COMPLETED: 'task_completed',
  TASK_SKIPPED: 'task_skipped',
  TASK_SNOOZED: 'task_snoozed',

  // Tracker
  LOG_CREATED: 'log_created',
  LOG_DELETED: 'log_deleted',

  // Briefing
  BRIEFING_VIEWED: 'briefing_viewed',

  // Budget
  BUDGET_ITEM_ADDED: 'budget_item_added',
  BUDGET_ITEM_PURCHASED: 'budget_item_purchased',

  // Checklists
  CHECKLIST_VIEWED: 'checklist_viewed',
  CHECKLIST_ITEM_CHECKED: 'checklist_item_checked',

  // Journey
  JOURNEY_TILE_OPENED: 'journey_tile_opened',

  // Mood
  MOOD_CHECKED_IN: 'mood_checked_in',

  // Subscription
  UPGRADE_VIEWED: 'upgrade_viewed',
  BEGIN_CHECKOUT: 'begin_checkout',
  PURCHASE: 'purchase',
  SUBSCRIPTION_CANCELED: 'subscription_canceled',

  // Feature usage
  FEATURE_USED: 'feature_used',
  PREMIUM_FEATURE_BLOCKED: 'premium_feature_blocked',

  // Notifications
  NOTIFICATIONS_ENABLED: 'notifications_enabled',
  NOTIFICATIONS_DISABLED: 'notifications_disabled',

  // Errors
  ERROR_OCCURRED: 'error_occurred',

  // Performance
  PERFORMANCE: 'performance',

  // Navigation
  PAGE_VIEW: 'page_view',
} as const

export type EventName = (typeof EVENT_NAMES)[keyof typeof EVENT_NAMES]
