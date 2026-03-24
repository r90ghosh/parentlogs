import Purchases, { type PurchasesPackage } from 'react-native-purchases'
import { supabase } from '@/lib/supabase'
import { ENTITLEMENT_ID } from '@/components/providers/RevenueCatProvider'

export const subscriptionMobileService = {
  async getOfferings() {
    try {
      const offerings = await Purchases.getOfferings()
      return offerings.current
    } catch (err) {
      console.warn('[Subscription] Failed to get offerings:', err)
      return null
    }
  },

  async purchase(pkg: PurchasesPackage) {
    const { customerInfo } = await Purchases.purchasePackage(pkg)
    console.log('[Subscription] Purchase complete, entitlements:', Object.keys(customerInfo.entitlements.active))

    // Sync to Supabase (in case webhook is delayed)
    await this.syncToSupabase(customerInfo)

    return customerInfo
  },

  async restorePurchases() {
    const customerInfo = await Purchases.restorePurchases()
    console.log('[Subscription] Restore complete, entitlements:', Object.keys(customerInfo.entitlements.active))

    if (customerInfo.entitlements.active[ENTITLEMENT_ID]) {
      await this.syncToSupabase(customerInfo)
    }

    return customerInfo
  },

  async syncToSupabase(customerInfo: Awaited<ReturnType<typeof Purchases.getCustomerInfo>>) {
    const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID]
    if (!entitlement) return

    const tier = entitlement.productIdentifier?.includes('lifetime') ? 'lifetime' : 'premium'

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      await supabase
        .from('profiles')
        .update({ subscription_tier: tier, subscription_expires_at: entitlement.expirationDate ?? null })
        .eq('id', user.id)

      console.log('[Subscription] Synced tier to Supabase:', tier)
    } catch (err) {
      console.warn('[Subscription] Failed to sync to Supabase:', err)
    }
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
      if (customerInfo.entitlements.active[ENTITLEMENT_ID]) {
        return false
      }
    } catch {
      // RevenueCat not configured, fall through
    }

    return true
  },
}
