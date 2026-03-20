// Analytics utility for tracking events across the app
// Supports multiple providers (Google Analytics, Mixpanel, Amplitude, etc.)

type EventProperties = Record<string, string | number | boolean | null | undefined>

interface AnalyticsConfig {
  enabled: boolean
  debug: boolean
  googleAnalyticsId?: string
}

// Configuration - can be extended with more providers
const config: AnalyticsConfig = {
  enabled: process.env.NODE_ENV === 'production',
  debug: process.env.NODE_ENV === 'development',
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
}

// Initialize analytics (call once on app load)
export function initAnalytics() {
  if (!config.enabled) {
    if (config.debug) {
      console.log('[Analytics] Disabled in development mode')
    }
    return
  }

  // Google Analytics initialization
  if (config.googleAnalyticsId && typeof window !== 'undefined') {
    // GA4 is typically loaded via script tag in layout
    console.log('[Analytics] Initialized with GA:', config.googleAnalyticsId)
  }
}

// Track page views
export function trackPageView(url: string, title?: string) {
  if (config.debug) {
    console.log('[Analytics] Page view:', { url, title })
  }

  if (!config.enabled) return

  // Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'page_view', {
      page_path: url,
      page_title: title,
    })
  }
}

// Track custom events
export function trackEvent(
  eventName: string,
  properties?: EventProperties
) {
  if (config.debug) {
    console.log('[Analytics] Event:', eventName, properties)
  }

  if (!config.enabled) return

  // Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, properties)
  }
}

// Pre-defined event helpers for common actions
export const analytics = {
  // Authentication events
  signUp: (method: 'email' | 'google') => {
    trackEvent('sign_up', { method })
  },
  signIn: (method: 'email' | 'google') => {
    trackEvent('login', { method })
  },
  signOut: () => {
    trackEvent('logout')
  },

  // Onboarding events
  onboardingStarted: () => {
    trackEvent('onboarding_started')
  },
  onboardingCompleted: (role: string) => {
    trackEvent('onboarding_completed', { role })
  },
  familyCreated: () => {
    trackEvent('family_created')
  },
  familyJoined: () => {
    trackEvent('family_joined')
  },

  // Task events
  taskCreated: (category: string) => {
    trackEvent('task_created', { category })
  },
  taskCompleted: (category: string) => {
    trackEvent('task_completed', { category })
  },
  taskSkipped: (category: string) => {
    trackEvent('task_skipped', { category })
  },
  taskSnoozed: (category: string, days: number) => {
    trackEvent('task_snoozed', { category, days })
  },

  // Tracker events
  logCreated: (logType: string) => {
    trackEvent('log_created', { log_type: logType })
  },
  logDeleted: (logType: string) => {
    trackEvent('log_deleted', { log_type: logType })
  },

  // Briefing events
  briefingViewed: (week: number) => {
    trackEvent('briefing_viewed', { week })
  },

  // Budget events
  budgetItemAdded: (category: string) => {
    trackEvent('budget_item_added', { category })
  },
  budgetItemPurchased: (category: string) => {
    trackEvent('budget_item_purchased', { category })
  },

  // Checklist events
  checklistViewed: (checklistId: string) => {
    trackEvent('checklist_viewed', { checklist_id: checklistId })
  },
  checklistItemChecked: (checklistId: string) => {
    trackEvent('checklist_item_checked', { checklist_id: checklistId })
  },

  // Subscription events
  upgradeViewed: () => {
    trackEvent('upgrade_viewed')
  },
  checkoutStarted: (plan: string) => {
    trackEvent('begin_checkout', { plan })
  },
  subscriptionPurchased: (plan: string, value: number) => {
    trackEvent('purchase', { plan, value, currency: 'USD' })
  },
  subscriptionCanceled: () => {
    trackEvent('subscription_canceled')
  },

  // Feature usage
  featureUsed: (feature: string) => {
    trackEvent('feature_used', { feature })
  },
  premiumFeatureBlocked: (feature: string) => {
    trackEvent('premium_feature_blocked', { feature })
  },

  // Notifications
  notificationsEnabled: () => {
    trackEvent('notifications_enabled')
  },
  notificationsDisabled: () => {
    trackEvent('notifications_disabled')
  },

  // Errors
  errorOccurred: (errorType: string, message: string) => {
    trackEvent('error_occurred', { error_type: errorType, message })
  },

  // Performance
  performanceMark: (metric: string, value: number) => {
    trackEvent('performance', { metric, value })
  },
}

// Identify user (for user tracking across sessions)
export function identifyUser(userId: string, traits?: EventProperties) {
  if (config.debug) {
    console.log('[Analytics] Identify user:', userId, traits)
  }

  if (!config.enabled) return

  // Google Analytics - set user ID
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('set', { user_id: userId })
    if (traits) {
      (window as any).gtag('set', 'user_properties', traits)
    }
  }
}

// Reset user (on sign out)
export function resetUser() {
  if (config.debug) {
    console.log('[Analytics] Reset user')
  }

  if (!config.enabled) return

  // Google Analytics - clear user ID
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('set', { user_id: null })
  }
}

// Track timing (for performance monitoring)
export function trackTiming(
  category: string,
  variable: string,
  value: number,
  label?: string
) {
  if (config.debug) {
    console.log('[Analytics] Timing:', { category, variable, value, label })
  }

  if (!config.enabled) return

  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'timing_complete', {
      name: variable,
      value,
      event_category: category,
      event_label: label,
    })
  }
}
