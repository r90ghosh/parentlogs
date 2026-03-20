import { useState, useEffect } from 'react'
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
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
import { GlassCard } from '@/components/glass'
import { CardEntrance } from '@/components/animations'
import { useAuth } from '@/components/providers/AuthProvider'
import { subscriptionMobileService } from '@/services/subscription-mobile-service'

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
  const [offering, setOffering] = useState<PurchasesOffering | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>('annual')
  const [purchasing, setPurchasing] = useState(false)
  const [restoring, setRestoring] = useState(false)

  useEffect(() => {
    subscriptionMobileService.getOfferings().then(setOffering)
  }, [])

  const plans: PlanConfig[] = offering
    ? FALLBACK_PLANS.map((plan) => {
        const pkg = getPackageForPlan(offering, plan.key)
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
    const pkg = getPackageForPlan(offering, selectedPlan)
    if (!pkg) {
      Alert.alert(
        'Not Available',
        'In-app purchases are not available on this device. Visit thedadcenter.com to subscribe.'
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
      if (customerInfo.entitlements.active['premium']) {
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
    <View style={styles.container}>
      <LinearGradient
        colors={['#12100e', '#1a1714', '#12100e']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Go Premium</Text>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <X size={20} color="#7a6f62" />
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
            <View style={styles.crownBadge}>
              <Crown size={28} color="#d4a853" />
            </View>
            <Text style={styles.heroTitle}>Unlock Everything</Text>
            <Text style={styles.heroSubtitle}>
              One subscription covers your whole family.{'\n'}Both partners get
              full access.
            </Text>
          </View>
        </CardEntrance>

        {/* Feature Comparison */}
        <CardEntrance delay={120}>
          <GlassCard style={styles.featureCard}>
            <View style={styles.featureHeader}>
              <View style={styles.featureHeaderCol} />
              <Text style={styles.featureHeaderLabel}>Free</Text>
              <Text style={[styles.featureHeaderLabel, styles.premiumLabel]}>
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
                    index < FEATURES.length - 1 && styles.featureRowBorder,
                  ]}
                >
                  <View style={styles.featureNameCol}>
                    <Icon size={14} color="#7a6f62" />
                    <Text style={styles.featureName}>{feature.label}</Text>
                  </View>
                  <Text style={styles.freeValue}>{feature.free}</Text>
                  <View style={styles.premiumValueCol}>
                    <Check size={12} color="#6b8f71" />
                    <Text style={styles.premiumValue}>{feature.premium}</Text>
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
              <Pressable onPress={() => setSelectedPlan(plan.key)}>
                <GlassCard
                  style={[
                    styles.planCard,
                    selectedPlan === plan.key && styles.planCardSelected,
                    plan.highlight && selectedPlan === plan.key && styles.planCardHighlight,
                  ]}
                >
                  {plan.badge && (
                    <View style={styles.planBadge}>
                      <Text style={styles.planBadgeText}>{plan.badge}</Text>
                    </View>
                  )}
                  <View style={styles.planRadio}>
                    <View
                      style={[
                        styles.radioOuter,
                        selectedPlan === plan.key && styles.radioOuterActive,
                      ]}
                    >
                      {selectedPlan === plan.key && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                  </View>
                  <View style={styles.planInfo}>
                    <Text style={styles.planTitle}>{plan.title}</Text>
                    <Text style={styles.planSubtitle}>{plan.subtitle}</Text>
                  </View>
                  <Text
                    style={[
                      styles.planPrice,
                      selectedPlan === plan.key && styles.planPriceActive,
                    ]}
                  >
                    {plan.price}
                  </Text>
                </GlassCard>
              </Pressable>
            </CardEntrance>
          ))}
        </View>

        {/* Purchase Button */}
        <CardEntrance delay={600}>
          <Pressable
            onPress={handlePurchase}
            disabled={purchasing}
            style={[styles.purchaseButton, purchasing && styles.purchaseButtonDisabled]}
          >
            <LinearGradient
              colors={['#c4703f', '#d4a853']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.purchaseGradient}
            >
              {purchasing ? (
                <ActivityIndicator color="#12100e" />
              ) : (
                <Text style={styles.purchaseText}>
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
            style={styles.restoreButton}
          >
            {restoring ? (
              <ActivityIndicator size="small" color="#7a6f62" />
            ) : (
              <>
                <RotateCcw size={14} color="#7a6f62" />
                <Text style={styles.restoreText}>Restore Purchases</Text>
              </>
            )}
          </Pressable>
          <Text style={styles.legalText}>
            Payment will be charged to your App Store or Google Play account.
            Subscriptions renew automatically unless canceled at least 24 hours
            before the current period ends.
          </Text>
        </CardEntrance>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12100e',
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
    color: '#faf6f0',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(237,230,220,0.06)',
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
    backgroundColor: 'rgba(212,168,83,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
    color: '#faf6f0',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 15,
    color: '#7a6f62',
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
    borderBottomColor: 'rgba(237,230,220,0.06)',
    marginBottom: 4,
  },
  featureHeaderCol: {
    flex: 1,
  },
  featureHeaderLabel: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 11,
    color: '#7a6f62',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    width: 72,
    textAlign: 'center',
  },
  premiumLabel: {
    color: '#d4a853',
    width: 90,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  featureRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(237,230,220,0.04)',
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
    color: '#ede6dc',
  },
  freeValue: {
    fontFamily: 'Karla-Regular',
    fontSize: 11,
    color: '#4a4239',
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
    color: '#6b8f71',
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
    borderColor: 'rgba(237,230,220,0.08)',
  },
  planCardSelected: {
    borderColor: 'rgba(196,112,63,0.4)',
  },
  planCardHighlight: {
    borderColor: 'rgba(212,168,83,0.5)',
    backgroundColor: 'rgba(212,168,83,0.06)',
  },
  planBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: '#d4a853',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  planBadgeText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 10,
    color: '#12100e',
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
    borderColor: '#4a4239',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    borderColor: '#c4703f',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#c4703f',
  },
  planInfo: {
    flex: 1,
  },
  planTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 15,
    color: '#faf6f0',
  },
  planSubtitle: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    color: '#7a6f62',
    marginTop: 2,
  },
  planPrice: {
    fontFamily: 'Jost-Medium',
    fontSize: 16,
    color: '#ede6dc',
  },
  planPriceActive: {
    color: '#c4703f',
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
    color: '#12100e',
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
    color: '#7a6f62',
  },
  legalText: {
    fontFamily: 'Karla-Regular',
    fontSize: 11,
    color: '#4a4239',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 12,
  },
})
