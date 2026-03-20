import Purchases, { type PurchasesPackage } from 'react-native-purchases'
import { supabase } from '@/lib/supabase'

export const subscriptionMobileService = {
  async getOfferings() {
    try {
      const offerings = await Purchases.getOfferings()
      return offerings.current
    } catch {
      return null
    }
  },

  async purchase(pkg: PurchasesPackage) {
    const { customerInfo } = await Purchases.purchasePackage(pkg)
    return customerInfo
  },

  async restorePurchases() {
    const customerInfo = await Purchases.restorePurchases()
    return customerInfo
  },

  async shouldShowPaywall(userId: string): Promise<boolean> {
    // Check Supabase first (catches web Stripe subscribers)
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', userId)
      .single()

    if (
      profile?.subscription_tier === 'premium' ||
      profile?.subscription_tier === 'lifetime'
    ) {
      return false
    }

    // Also check RevenueCat local state (in case webhook delayed)
    try {
      const customerInfo = await Purchases.getCustomerInfo()
      if (customerInfo.entitlements.active['premium']) {
        return false
      }
    } catch {
      // RevenueCat not configured, fall through
    }

    return true
  },
}
