import { createClient } from '@/lib/supabase/client'
import { NotificationPreferences } from '@/types'

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
      console.log('Service Worker registered:', registration.scope)
      return registration
    } catch (error) {
      console.error('Service Worker registration failed:', error)
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
    } catch (error) {
      console.error('Push subscription failed:', error)
      return null
    }
  },

  // Unsubscribe from push notifications
  async unsubscribeFromPush(): Promise<boolean> {
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
      onConflict: 'user_id',
    })
  },

  // Remove subscription from Supabase
  async removeSubscription(subscription: PushSubscription): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('push_subscriptions')
      .delete()
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
      .single()

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
