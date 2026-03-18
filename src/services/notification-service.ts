import { createClient } from '@/lib/supabase/client'
import { NotificationPreferences } from '@/types'
import { isPremiumTier } from '@/lib/subscription-utils'

const supabase = createClient()

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''

export const notificationService = {
  // Check if browser supports push notifications
  isSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
  },

  // Get current permission status
  getPermissionStatus(): NotificationPermission {
    if (!this.isSupported()) return 'denied'
    return Notification.permission
  },

  // Request notification permission
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) return 'denied'
    return await Notification.requestPermission()
  },

  // Register service worker
  async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) return null

    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      return registration
    } catch {
      return null
    }
  },

  // Subscribe to push notifications
  async subscribeToPush(): Promise<PushSubscription | null> {
    const registration = await this.registerServiceWorker()
    if (!registration) return null

    try {
      // Check for existing subscription
      let subscription = await registration.pushManager.getSubscription()

      if (!subscription) {
        // Create new subscription
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        })
      }

      // Save subscription to database
      await this.saveSubscription(subscription)

      return subscription
    } catch {
      return null
    }
  },

  // Unsubscribe from push notifications
  async unsubscribeFromPush(): Promise<boolean> {
    if (!this.isSupported()) return false

    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()

    if (subscription) {
      await subscription.unsubscribe()
      await this.removeSubscription(subscription)
      return true
    }

    return false
  },

  // Save subscription to Supabase
  // NOTE: onConflict uses 'endpoint' to support multiple devices per user.
  // Requires a unique constraint on the endpoint column in push_subscriptions.
  // If the current DB schema only has a unique constraint on user_id, a migration
  // adding a unique constraint on endpoint is needed.
  async saveSubscription(subscription: PushSubscription): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const subscriptionJson = subscription.toJSON()

    await supabase.from('push_subscriptions').upsert({
      user_id: user.id,
      endpoint: subscriptionJson.endpoint!,
      p256dh: subscriptionJson.keys?.p256dh || '',
      auth: subscriptionJson.keys?.auth || '',
    }, {
      onConflict: 'endpoint',
    })
  },

  // Remove subscription from Supabase
  async removeSubscription(subscription: PushSubscription): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const subscriptionJson = subscription.toJSON()

    await supabase
      .from('push_subscriptions')
      .delete()
      .eq('endpoint', subscriptionJson.endpoint!)
      .eq('user_id', user.id)
  },

  // Get notification preferences
  async getPreferences(): Promise<NotificationPreferences | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    return data as NotificationPreferences | null
  },

  // Update notification preferences
  async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<{ error: Error | null }> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: new Error('Not authenticated') }

    const { error } = await supabase
      .from('notification_preferences')
      .upsert({
        user_id: user.id,
        ...preferences,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      })

    return { error: error as Error | null }
  },

  // Show local notification (for testing)
  async showLocalNotification(title: string, options: NotificationOptions = {}): Promise<void> {
    if (!this.isSupported()) return
    if (Notification.permission !== 'granted') return

    const registration = await navigator.serviceWorker.ready
    await registration.showNotification(title, {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      ...options,
    })
  },

  // Check if user is within the 30-day free push notification window
  async isPushWindowActive(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier, created_at')
      .eq('id', user.id)
      .single()

    if (!profile) return false

    // Premium users always have push access
    if (isPremiumTier(profile.subscription_tier)) return true

    // Free users: 30-day window from signup
    if (!profile.created_at) return true // If no signup date, grant access
    const signupDate = new Date(profile.created_at)
    const now = new Date()
    const daysSinceSignup = Math.floor((now.getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24))

    return daysSinceSignup <= 30
  },

  // Get detailed push notification window status
  async getPushWindowStatus(): Promise<{ isActive: boolean; daysRemaining: number | null; isPremium: boolean }> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { isActive: false, daysRemaining: null, isPremium: false }

    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier, created_at')
      .eq('id', user.id)
      .single()

    if (!profile) return { isActive: false, daysRemaining: null, isPremium: false }

    if (isPremiumTier(profile.subscription_tier)) {
      return { isActive: true, daysRemaining: null, isPremium: true }
    }

    if (!profile.created_at) return { isActive: true, daysRemaining: 30, isPremium: false }

    const signupDate = new Date(profile.created_at)
    const now = new Date()
    const daysSinceSignup = Math.floor((now.getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24))
    const daysRemaining = Math.max(0, 30 - daysSinceSignup)

    // Consistent with isPushWindowActive: day 30 is active (daysRemaining >= 0 means <= 30 days)
    return { isActive: daysRemaining >= 0, daysRemaining, isPremium: false }
  },

  // Helper: Convert VAPID key
  urlBase64ToUint8Array(base64String: string): ArrayBuffer {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray.buffer as ArrayBuffer
  },
}
