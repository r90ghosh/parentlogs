import { useEffect, useState, createContext, useContext, useCallback } from 'react'
import Purchases, { LOG_LEVEL } from 'react-native-purchases'
import type { CustomerInfo, PurchasesOffering } from 'react-native-purchases'
import { Platform } from 'react-native'
import { Sentry } from '@/lib/sentry'

export const ENTITLEMENT_ID = 'The Dad Center Pro'

const RC_IOS_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY
const RC_ANDROID_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY

// Module-level state for imperative init from AuthProvider
let rcConfigured = false
let onInitCallback: ((info: CustomerInfo, offering: PurchasesOffering | null) => void) | null = null

export function initRevenueCat(userId: string) {
  const apiKey = Platform.OS === 'ios' ? RC_IOS_KEY : RC_ANDROID_KEY

  if (!apiKey || apiKey === 'placeholder') {
    Sentry.addBreadcrumb({ category: 'revenuecat', message: 'No API key, skipping', level: 'warning' })
    return
  }

  if (rcConfigured) {
    console.log('[RevenueCat] Already configured, skipping')
    return
  }

  // Set flag immediately to prevent concurrent init attempts
  rcConfigured = true

  ;(async () => {
    try {
      if (__DEV__) {
        Purchases.setLogLevel(LOG_LEVEL.DEBUG)
      }

      Purchases.configure({ apiKey, appUserID: userId })
      console.log('[RevenueCat] Configured for user:', userId)

      const info = await Purchases.getCustomerInfo()
      console.log('[RevenueCat] Entitlements:', Object.keys(info.entitlements.active))

      const offerings = await Purchases.getOfferings()
      console.log('[RevenueCat] Offerings:', offerings.current?.availablePackages.length ?? 0, 'packages')

      // Notify the React component
      onInitCallback?.(info, offerings.current)
    } catch (err) {
      Sentry.captureException(err, { extra: { context: 'revenuecat_init' } })
      rcConfigured = false
    }
  })()
}

interface RevenueCatContextType {
  isPro: boolean
  isReady: boolean
  customerInfo: CustomerInfo | null
  currentOffering: PurchasesOffering | null
}

const RevenueCatContext = createContext<RevenueCatContextType>({
  isPro: false,
  isReady: false,
  customerInfo: null,
  currentOffering: null,
})

export function RevenueCatProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null)
  const [currentOffering, setCurrentOffering] = useState<PurchasesOffering | null>(null)

  // Register callback so imperative init can update React state
  const handleInit = useCallback((info: CustomerInfo, offering: PurchasesOffering | null) => {
    setCustomerInfo(info)
    setCurrentOffering(offering)
    setIsReady(true)
  }, [])

  useEffect(() => {
    onInitCallback = handleInit
    return () => { onInitCallback = null }
  }, [handleInit])

  // Listen for customer info updates after configured
  useEffect(() => {
    if (!isReady) return

    const listener = (info: CustomerInfo) => {
      console.log('[RevenueCat] Customer info updated, entitlements:', Object.keys(info.entitlements.active))
      setCustomerInfo(info)
    }
    Purchases.addCustomerInfoUpdateListener(listener)

    return () => {
      Purchases.removeCustomerInfoUpdateListener(listener)
    }
  }, [isReady])

  const isPro = !!customerInfo?.entitlements.active[ENTITLEMENT_ID]

  return (
    <RevenueCatContext.Provider value={{ isPro, isReady, customerInfo, currentOffering }}>
      {children}
    </RevenueCatContext.Provider>
  )
}

export const useRevenueCat = () => useContext(RevenueCatContext)
