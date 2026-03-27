import Purchases, { type PurchasesPackage } from 'react-native-purchases'
import { Platform } from 'react-native'
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

      // Update profiles table (existing behavior)
      await supabase
        .from('profiles')
        .update({ subscription_tier: tier, subscription_expires_at: entitlement.expirationDate ?? null })
        .eq('id', user.id)

      // Upsert subscriptions table to match web's Stripe webhook behavior.
      // Wrapped in its own try/catch so a failure here doesn't block the profiles update above.
      try {
        const platform = Platform.OS === 'ios' ? 'ios' : 'android'

        const { error: subError } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: user.id,
            tier,
            status: 'active',
            current_period_start: entitlement.latestPurchaseDate ?? new Date().toISOString(),
            current_period_end: entitlement.expirationDate ?? null,
            cancel_at_period_end: false,
            platform,
            revenucat_app_user_id: customerInfo.originalAppUserId,
            store_product_id: entitlement.productIdentifier,
            store_original_transaction_id: entitlement.originalPurchaseDate ?? null,
            last_verified_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' })

        if (subError) {
          console.warn('[Subscription] Failed to upsert subscriptions row:', subError.message)
        } else {
          console.log('[Subscription] Synced subscriptions row for platform:', platform)
        }
      } catch (subErr) {
        console.warn('[Subscription] Failed to sync subscriptions table:', subErr)
      }

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
