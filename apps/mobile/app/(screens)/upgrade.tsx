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
import { LinearGradient } from 'expo-linear-gradient'
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
import { GlassCard } from '@/components/glass'
import { CardEntrance } from '@/components/animations'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRevenueCat, ENTITLEMENT_ID } from '@/components/providers/RevenueCatProvider'
import { subscriptionMobileService } from '@/services/subscription-mobile-service'
import { useColors } from '@/hooks/use-colors'

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
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Go Premium</Text>
        <Pressable onPress={() => router.back()} style={[styles.closeButton, { backgroundColor: colors.subtleBg }]} accessibilityLabel="Close" accessibilityRole="button">
          <X size={20} color={colors.textMuted} />
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
        <CardEntrance delay={0}>
          <View style={styles.heroSection}>
            <View style={[styles.crownBadge, { backgroundColor: colors.goldDim }]}>
              <Crown size={28} color={colors.gold} />
            </View>
            <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>Unlock Everything</Text>
            <Text style={[styles.heroSubtitle, { color: colors.textMuted }]}>
              One subscription covers your whole family.{'\n'}Both partners get
              full access.
            </Text>
          </View>
        </CardEntrance>

        {/* Feature Comparison */}
        <CardEntrance delay={120}>
          <GlassCard style={styles.featureCard}>
            <View style={[styles.featureHeader, { borderBottomColor: colors.border }]}>
              <View style={styles.featureHeaderCol} />
              <Text style={[styles.featureHeaderLabel, { color: colors.textMuted }]}>Free</Text>
              <Text style={[styles.featureHeaderLabel, styles.premiumLabel, { color: colors.gold }]}>
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
                    index < FEATURES.length - 1 && [styles.featureRowBorder, { borderBottomColor: colors.pressed }],
                  ]}
                >
                  <View style={styles.featureNameCol}>
                    <Icon size={14} color={colors.textMuted} />
                    <Text style={[styles.featureName, { color: colors.textSecondary }]}>{feature.label}</Text>
                  </View>
                  <Text style={[styles.freeValue, { color: colors.textDim }]}>{feature.free}</Text>
                  <View style={styles.premiumValueCol}>
                    <Check size={12} color={colors.sage} />
                    <Text style={[styles.premiumValue, { color: colors.sage }]}>{feature.premium}</Text>
                  </View>
                </View>
              )
            })}
          </GlassCard>
        </CardEntrance>

        {/* Plan Cards */}
        <View style={styles.plansSection}>
          {plans.map((plan, index) => (
            <CardEntrance key={plan.key} delay={240 + index * 100}>
              <Pressable onPress={() => setSelectedPlan(plan.key)} accessibilityLabel={`Select ${plan.title} plan, ${plan.price}`} accessibilityRole="radio" accessibilityState={{ selected: selectedPlan === plan.key }}>
                <View style={{ marginTop: plan.badge ? 10 : 0 }}>
                  {plan.badge && (
                    <View style={[styles.planBadge, { backgroundColor: colors.gold }]}>
                      <Text style={[styles.planBadgeText, { color: colors.bg }]}>{plan.badge}</Text>
                    </View>
                  )}
                  <View
                    style={[
                      styles.planCard,
                      { borderColor: colors.border, backgroundColor: colors.card },
                      selectedPlan === plan.key && { borderColor: 'rgba(196,112,63,0.5)' },
                      plan.highlight && selectedPlan === plan.key && { borderColor: 'rgba(212,168,83,0.5)', backgroundColor: colors.goldDim },
                    ]}
                  >
                    <View style={styles.planRadio}>
                      <View
                        style={[
                          styles.radioOuter,
                          { borderColor: colors.textDim },
                          selectedPlan === plan.key && { borderColor: colors.copper },
                        ]}
                      >
                        {selectedPlan === plan.key && (
                          <View style={[styles.radioInner, { backgroundColor: colors.copper }]} />
                        )}
                      </View>
                    </View>
                    <View style={styles.planInfo}>
                      <Text style={[styles.planTitle, { color: colors.textPrimary }]}>{plan.title}</Text>
                      <Text style={[styles.planSubtitle, { color: colors.textMuted }]}>{plan.subtitle}</Text>
                    </View>
                    <Text
                      style={[
                        styles.planPrice,
                        { color: colors.textSecondary },
                        selectedPlan === plan.key && { color: colors.copper },
                      ]}
                    >
                      {plan.price}
                    </Text>
                  </View>
                </View>
              </Pressable>
            </CardEntrance>
          ))}
        </View>

        {/* Purchase Button */}
        <CardEntrance delay={600}>
          <Pressable
            onPress={handlePurchase}
            disabled={purchasing}
            accessibilityLabel={purchasing ? 'Purchasing...' : `Subscribe ${selectedPlan === 'lifetime' ? 'one-time' : 'now'}`}
            accessibilityRole="button"
            style={[styles.purchaseButton, purchasing && styles.purchaseButtonDisabled]}
          >
            <LinearGradient
              colors={colors.ctaGradient as unknown as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.purchaseGradient}
            >
              {purchasing ? (
                <ActivityIndicator color={colors.bg} />
              ) : (
                <Text style={[styles.purchaseText, { color: colors.bg }]}>
                  Subscribe{' '}
                  {selectedPlan === 'lifetime' ? '(One-Time)' : 'Now'}
                </Text>
              )}
            </LinearGradient>
          </Pressable>
        </CardEntrance>

        {/* Restore + Legal */}
        <CardEntrance delay={700}>
          <Pressable
            onPress={handleRestore}
            disabled={restoring}
            accessibilityLabel="Restore purchases"
            accessibilityRole="button"
            style={styles.restoreButton}
          >
            {restoring ? (
              <ActivityIndicator size="small" color={colors.textMuted} />
            ) : (
              <>
                <RotateCcw size={14} color={colors.textMuted} />
                <Text style={[styles.restoreText, { color: colors.textMuted }]}>Restore Purchases</Text>
              </>
            )}
          </Pressable>
          <Text style={[styles.legalText, { color: colors.textDim }]}>
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
              <Text style={[styles.legalLink, { color: colors.textMuted }]}>Privacy Policy</Text>
            </Pressable>
            <Text style={[styles.legalDot, { color: colors.textDim }]}>{'\u00B7'}</Text>
            <Pressable onPress={() => WebBrowser.openBrowserAsync('https://thedadcenter.com/terms')} accessibilityLabel="Terms of Service" accessibilityRole="link">
              <Text style={[styles.legalLink, { color: colors.textMuted }]}>Terms of Service</Text>
            </Pressable>
          </View>
        </CardEntrance>
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
    fontFamily: 'Karla-SemiBold',
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
    paddingBottom: 24,
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
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Feature Comparison
  featureCard: {
    padding: 16,
    marginBottom: 24,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    marginBottom: 4,
  },
  featureHeaderCol: {
    flex: 1,
  },
  featureHeaderLabel: {
    fontFamily: 'Karla-SemiBold',
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
  },
  featureRowBorder: {
    borderBottomWidth: 1,
  },
  featureNameCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureName: {
    fontFamily: 'Karla-Regular',
    fontSize: 13,
  },
  freeValue: {
    fontFamily: 'Karla-Regular',
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
    fontFamily: 'Karla-Medium',
    fontSize: 11,
  },

  // Plans
  plansSection: {
    gap: 12,
    marginBottom: 24,
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
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
    fontFamily: 'Karla-SemiBold',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
    fontFamily: 'Karla-SemiBold',
    fontSize: 15,
  },
  planSubtitle: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    marginTop: 2,
  },
  planPrice: {
    fontFamily: 'Jost-Medium',
    fontSize: 16,
  },

  // Purchase
  purchaseButton: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  purchaseButtonDisabled: {
    opacity: 0.6,
  },
  purchaseGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  purchaseText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
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
    fontFamily: 'Karla-Medium',
    fontSize: 13,
  },
  legalText: {
    fontFamily: 'Karla-Regular',
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
    fontFamily: 'Karla-Regular',
    fontSize: 11,
    textDecorationLine: 'underline',
  },
  legalDot: {
    fontFamily: 'Karla-Regular',
    fontSize: 11,
  },
})
