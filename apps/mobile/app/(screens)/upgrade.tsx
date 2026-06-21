import { useState } from 'react'
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  X,
  Check,
  Crown,
  Zap,
  Shield,
  Heart,
  Baby,
  Clock,
  RotateCcw,
} from 'lucide-react-native'
import type { PurchasesOffering, PurchasesPackage } from 'react-native-purchases'
import * as WebBrowser from 'expo-web-browser'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRevenueCat, ENTITLEMENT_ID } from '@/components/providers/RevenueCatProvider'
import { subscriptionMobileService } from '@/services/subscription-mobile-service'
import { useColors } from '@/hooks/use-colors'
import { SectionLabel } from '@/components/digest'

type PlanKey = 'monthly' | 'annual' | 'lifetime'

interface PlanConfig {
  key: PlanKey
  title: string
  price: string
  subtitle: string
  badge?: string
  highlight: boolean
}

const FALLBACK_PLANS: PlanConfig[] = [
  {
    key: 'monthly',
    title: 'Monthly',
    price: '$4.99/mo',
    subtitle: 'Cancel anytime',
    highlight: false,
  },
  {
    key: 'annual',
    title: 'Annual',
    price: '$39.99/yr',
    subtitle: '$3.33/mo — save 33%',
    badge: 'Best Value',
    highlight: true,
  },
  {
    key: 'lifetime',
    title: 'Lifetime',
    price: '$99.99',
    subtitle: 'One-time purchase',
    highlight: false,
  },
]

const FEATURES = [
  { label: 'Weekly briefings', free: '4 weeks', premium: 'All 40+ weeks', icon: Zap },
  { label: 'Task management', free: '30-day window', premium: 'Full timeline', icon: Clock },
  { label: 'Baby tracker', free: '3 log types', premium: 'All types + history', icon: Baby },
  { label: 'Budget planner', free: 'Browse only', premium: 'Full access + edit', icon: Shield },
  { label: 'Partner sync', free: '--', premium: 'Included', icon: Heart },
  { label: 'Push notifications', free: '30 days', premium: 'Unlimited', icon: Crown },
]

function getPackageForPlan(
  offering: PurchasesOffering | null,
  plan: PlanKey
): PurchasesPackage | null {
  if (!offering) return null

  const identifierMap: Record<PlanKey, string> = {
    monthly: '$rc_monthly',
    annual: '$rc_annual',
    lifetime: '$rc_lifetime',
  }

  return (
    offering.availablePackages.find(
      (pkg) => pkg.identifier === identifierMap[plan]
    ) ?? null
  )
}

export default function UpgradeScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { user, refreshProfile } = useAuth()
  const { currentOffering } = useRevenueCat()
  const colors = useColors()
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>('annual')
  const [purchasing, setPurchasing] = useState(false)
  const [restoring, setRestoring] = useState(false)

  const plans: PlanConfig[] = currentOffering
    ? FALLBACK_PLANS.map((plan) => {
        const pkg = getPackageForPlan(currentOffering, plan.key)
        if (!pkg) return plan
        return {
          ...plan,
          price:
            plan.key === 'monthly'
              ? `${pkg.product.priceString}/mo`
              : plan.key === 'annual'
                ? `${pkg.product.priceString}/yr`
                : pkg.product.priceString,
        }
      })
    : FALLBACK_PLANS

  async function handlePurchase() {
    const pkg = getPackageForPlan(currentOffering, selectedPlan)
    if (!pkg) {
      Alert.alert(
        'Not Available',
        'In-app purchases are temporarily unavailable. Please try again later.'
      )
      return
    }

    setPurchasing(true)
    try {
      await subscriptionMobileService.purchase(pkg)
      await refreshProfile()
      Alert.alert('Welcome to Premium!', 'Your family now has full access.', [
        { text: 'OK', onPress: () => router.back() },
      ])
    } catch (err: unknown) {
      const error = err as { userCancelled?: boolean; message?: string }
      if (!error.userCancelled) {
        Alert.alert('Purchase Failed', error.message || 'Please try again.')
      }
    } finally {
      setPurchasing(false)
    }
  }

  async function handleRestore() {
    setRestoring(true)
    try {
      const customerInfo = await subscriptionMobileService.restorePurchases()
      if (customerInfo.entitlements.active[ENTITLEMENT_ID]) {
        await refreshProfile()
        Alert.alert('Restored!', 'Your premium access has been restored.', [
          { text: 'OK', onPress: () => router.back() },
        ])
      } else {
        Alert.alert(
          'No Purchases Found',
          'No previous purchases were found for this account.'
        )
      }
    } catch {
      Alert.alert('Restore Failed', 'Please try again later.')
    } finally {
      setRestoring(false)
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={[styles.headerTitle, { color: colors.ink }]}>Go Premium</Text>
        <Pressable onPress={() => router.back()} style={[styles.closeButton, { backgroundColor: colors.accentSoft }]} accessibilityLabel="Close" accessibilityRole="button">
          <X size={20} color={colors.muted} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.heroSection}>
          <View style={[styles.crownBadge, { backgroundColor: colors.accentSoft }]}>
            <Crown size={28} color={colors.accent} />
          </View>
          <Text style={[styles.heroTitle, { color: colors.ink }]}>Unlock Everything</Text>
          <Text style={[styles.heroSubtitle, { color: colors.muted }]}>
            One subscription covers your whole family.{'\n'}Both partners get
            full access.
          </Text>
        </View>

        {/* Feature Comparison */}
        <SectionLabel>What You Get</SectionLabel>
        <View style={[styles.featureCard, { backgroundColor: colors.card, borderColor: colors.line }]}>
          <View style={[styles.featureHeader, { borderBottomColor: colors.line2 }]}>
            <View style={styles.featureHeaderCol} />
            <Text style={[styles.featureHeaderLabel, { color: colors.muted }]}>Free</Text>
            <Text style={[styles.featureHeaderLabel, styles.premiumLabel, { color: colors.accentInk }]}>
              Premium
            </Text>
          </View>
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon
            return (
              <View
                key={feature.label}
                style={[
                  styles.featureRow,
                  index < FEATURES.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.line2 },
                ]}
              >
                <View style={styles.featureNameCol}>
                  <Icon size={14} color={colors.muted} />
                  <Text style={[styles.featureName, { color: colors.ink2 }]}>{feature.label}</Text>
                </View>
                <Text style={[styles.freeValue, { color: colors.faint }]}>{feature.free}</Text>
                <View style={styles.premiumValueCol}>
                  <Check size={12} color={colors.sage} />
                  <Text style={[styles.premiumValue, { color: colors.sage }]}>{feature.premium}</Text>
                </View>
              </View>
            )
          })}
        </View>

        {/* Plan Cards */}
        <SectionLabel>Choose a Plan</SectionLabel>
        <View style={styles.plansSection}>
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.key
            const isFeatured = plan.highlight && isSelected
            return (
              <View key={plan.key} style={{ marginTop: plan.badge ? 10 : 0 }}>
                {plan.badge && (
                  <View style={[styles.planBadge, { backgroundColor: colors.accent }]}>
                    <Text style={styles.planBadgeText}>{plan.badge}</Text>
                  </View>
                )}
                <Pressable
                  onPress={() => setSelectedPlan(plan.key)}
                  accessibilityLabel={`Select ${plan.title} plan, ${plan.price}`}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  style={[
                    styles.planCard,
                    {
                      borderColor: isSelected ? colors.accent : colors.line,
                      backgroundColor: isFeatured ? colors.accentSoft : colors.card,
                    },
                  ]}
                >
                  <View style={styles.planRadio}>
                    <View
                      style={[
                        styles.radioOuter,
                        { borderColor: isSelected ? colors.accent : colors.faint },
                      ]}
                    >
                      {isSelected && (
                        <View style={[styles.radioInner, { backgroundColor: colors.accent }]} />
                      )}
                    </View>
                  </View>
                  <View style={styles.planInfo}>
                    <Text style={[styles.planTitle, { color: colors.ink }]}>{plan.title}</Text>
                    <Text style={[styles.planSubtitle, { color: colors.muted }]}>{plan.subtitle}</Text>
                  </View>
                  <Text
                    style={[
                      styles.planPrice,
                      { color: isSelected ? colors.accentInk : colors.ink2 },
                    ]}
                  >
                    {plan.price}
                  </Text>
                </Pressable>
              </View>
            )
          })}
        </View>

        {/* Purchase Button */}
        <Pressable
          onPress={handlePurchase}
          disabled={purchasing}
          accessibilityLabel={purchasing ? 'Purchasing...' : `Subscribe ${selectedPlan === 'lifetime' ? 'one-time' : 'now'}`}
          accessibilityRole="button"
          style={[
            styles.purchaseButton,
            { backgroundColor: colors.accent },
            purchasing && styles.purchaseButtonDisabled,
          ]}
        >
          {purchasing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.purchaseText}>
              Subscribe{' '}
              {selectedPlan === 'lifetime' ? '(One-Time)' : 'Now'}
            </Text>
          )}
        </Pressable>

        {/* Restore + Legal */}
        <Pressable
          onPress={handleRestore}
          disabled={restoring}
          accessibilityLabel="Restore purchases"
          accessibilityRole="button"
          style={styles.restoreButton}
        >
          {restoring ? (
            <ActivityIndicator size="small" color={colors.muted} />
          ) : (
            <>
              <RotateCcw size={14} color={colors.muted} />
              <Text style={[styles.restoreText, { color: colors.muted }]}>Restore Purchases</Text>
            </>
          )}
        </Pressable>
        <Text style={[styles.legalText, { color: colors.faint }]}>
          Payment will be charged to your{' '}
          {Platform.OS === 'ios' ? 'Apple ID' : 'Google Play account'} at
          confirmation of purchase. Subscription automatically renews unless
          canceled at least 24 hours before the end of the current period.
          Your account will be charged for renewal within 24 hours prior to
          the end of the current period at the cost of the chosen plan. You
          can manage and cancel your subscriptions by going to your Account
          Settings on the{' '}
          {Platform.OS === 'ios' ? 'App Store' : 'Google Play Store'} after
          purchase.
        </Text>
        <View style={styles.legalLinks}>
          <Pressable onPress={() => WebBrowser.openBrowserAsync('https://thedadcenter.com/privacy')} accessibilityLabel="Privacy Policy" accessibilityRole="link">
            <Text style={[styles.legalLink, { color: colors.muted }]}>Privacy Policy</Text>
          </Pressable>
          <Text style={[styles.legalDot, { color: colors.faint }]}>{'·'}</Text>
          <Pressable onPress={() => WebBrowser.openBrowserAsync('https://thedadcenter.com/terms')} accessibilityLabel="Terms of Service" accessibilityRole="link">
            <Text style={[styles.legalLink, { color: colors.muted }]}>Terms of Service</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontFamily: 'Jakarta-SemiBold',
    fontSize: 16,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },

  // Hero
  heroSection: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
  },
  crownBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontFamily: 'Jakarta-ExtraBold',
    fontSize: 26,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Feature Comparison
  featureCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 4,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  featureHeaderCol: {
    flex: 1,
  },
  featureHeaderLabel: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    width: 72,
    textAlign: 'center',
  },
  premiumLabel: {
    width: 90,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  featureNameCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureName: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 13,
  },
  freeValue: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 11,
    width: 72,
    textAlign: 'center',
  },
  premiumValueCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: 90,
    justifyContent: 'center',
  },
  premiumValue: {
    fontFamily: 'Jakarta-Medium',
    fontSize: 11,
  },

  // Plans
  plansSection: {
    gap: 10,
    marginBottom: 4,
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderRadius: 16,
  },
  planBadge: {
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    marginBottom: -6,
    marginRight: 16,
    zIndex: 1,
    paddingVertical: 3,
    borderRadius: 10,
  },
  planBadgeText: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#fff',
  },
  planRadio: {
    marginRight: 12,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  planInfo: {
    flex: 1,
  },
  planTitle: {
    fontFamily: 'Jakarta-SemiBold',
    fontSize: 15,
  },
  planSubtitle: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 12,
    marginTop: 2,
  },
  planPrice: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 15,
  },

  // Purchase
  purchaseButton: {
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  purchaseButtonDisabled: {
    opacity: 0.6,
  },
  purchaseText: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 15,
    color: '#fff',
  },

  // Restore + Legal
  restoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    marginBottom: 12,
  },
  restoreText: {
    fontFamily: 'Jakarta-Medium',
    fontSize: 13,
  },
  legalText: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 12,
  },
  legalLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    paddingBottom: 8,
  },
  legalLink: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 11,
    textDecorationLine: 'underline',
  },
  legalDot: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 11,
  },
})
