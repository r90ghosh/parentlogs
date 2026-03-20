import { useEffect } from 'react'
import Purchases from 'react-native-purchases'
import { Platform } from 'react-native'
import { useAuth } from './AuthProvider'

const RC_IOS_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY
const RC_ANDROID_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY

export function RevenueCatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    const apiKey = Platform.OS === 'ios' ? RC_IOS_KEY : RC_ANDROID_KEY
    if (!apiKey || apiKey === 'placeholder') return

    Purchases.configure({
      apiKey,
      appUserID: user.id,
    })
  }, [user])

  return <>{children}</>
}
