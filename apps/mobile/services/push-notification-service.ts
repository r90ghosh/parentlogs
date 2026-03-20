import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import Constants from 'expo-constants'
import { Platform } from 'react-native'
import { supabase } from '@/lib/supabase'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

let cachedToken: string | null = null

export const pushNotificationService = {
  async register(userId: string): Promise<string | null> {
    if (!Device.isDevice) return null

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
      })
    }

    const { status: existing } = await Notifications.getPermissionsAsync()
    let finalStatus = existing
    if (existing !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') return null

    const projectId = Constants.expoConfig?.extra?.eas?.projectId
    const tokenData = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined
    )

    const { error } = await supabase.from('device_tokens').upsert(
      {
        user_id: userId,
        token: tokenData.data,
        platform: Platform.OS as 'ios' | 'android',
        app_version: Constants.expoConfig?.version,
        is_active: true,
      },
      { onConflict: 'user_id,token' }
    )
    if (error) {
      console.error('Failed to register device token:', error.message)
      return null
    }

    cachedToken = tokenData.data
    return tokenData.data
  },

  getCurrentToken(): string | null {
    return cachedToken
  },

  async unregister(userId: string, token: string) {
    await supabase
      .from('device_tokens')
      .update({ is_active: false })
      .eq('user_id', userId)
      .eq('token', token)
  },
}
