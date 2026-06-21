import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Check, Crown, Sparkles, ArrowRight } from 'lucide-react-native'
import { useColors } from '@/hooks/use-colors'

const PLANS = [
  {
    name: 'Monthly',
    price: '$4.99',
    period: '/mo',
    subtitle: 'Cancel anytime',
    highlight: false,
  },
  {
    name: 'Annual',
    price: '$39.99',
    period: '/yr',
    subtitle: '$3.33/mo — Save 33%',
    badge: 'Best Value',
    highlight: true,
  },
  {
    name: 'Lifetime',
    price: '$99.99',
    period: '',
    subtitle: 'One-time purchase',
    highlight: false,
  },
]

const FEATURES = [
  'All 47 weekly briefings',
  'Full task timeline (200+ items)',
  'Baby tracker (feeds, diapers, sleep)',
  'Budget planner with real pricing',
  'Partner sync — one subscription, whole family',
  'Push notification reminders',
]

export default function GuestPricingScreen() {
  const colors = useColors()
  const insets = useSafeAreaInsets()
  const router = useRouter()

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={[styles.preLabel, { color: colors.accent }]}>PRICING</Text>
          <Text style={[styles.title, { color: colors.ink }]}>
            One price.{'\n'}Whole family.
          </Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Both partners share one subscription. Start free, upgrade when
            you're ready.
          </Text>
        </View>

        {/* Plan cards */}
        <View style={styles.plansContainer}>
          {PLANS.map((plan) => (
            <View key={plan.name} style={{ marginTop: plan.badge ? 10 : 0 }}>
              {plan.badge && (
                <View style={[styles.planBadge, { backgroundColor: colors.gold }]}>
                  <Sparkles size={10} color="#fff" />
                  <Text style={styles.planBadgeText}>{plan.badge}</Text>
                </View>
              )}
              <View
                style={[
                  styles.planCard,
                  { borderColor: colors.line, backgroundColor: colors.card },
                  plan.highlight && { borderColor: colors.accent, borderWidth: 2 },
                ]}
              >
                <View style={styles.planHeader}>
                  {plan.name === 'Lifetime' && (
                    <Crown
                      size={16}
                      color={colors.gold}
                      style={{ marginRight: 6 }}
                    />
                  )}
                  <Text style={[styles.planName, { color: colors.ink }]}>{plan.name}</Text>
                </View>

                <View style={styles.planPriceRow}>
                  <Text style={[styles.planPrice, { color: colors.ink }]}>{plan.price}</Text>
                  {plan.period ? (
                    <Text style={[styles.planPeriod, { color: colors.muted }]}>{plan.period}</Text>
                  ) : null}
                </View>
                <Text style={[styles.planSubtitle, { color: colors.muted }]}>{plan.subtitle}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Feature list */}
        <Text style={[styles.includedLabel, { color: colors.accent }]}>WHAT'S INCLUDED</Text>
        <View style={[styles.featuresCard, { backgroundColor: colors.card, borderColor: colors.line }]}>
          {FEATURES.map((feat) => (
            <View key={feat} style={styles.featureRow}>
              <Check size={16} color={colors.sage} />
              <Text style={[styles.featureText, { color: colors.ink2 }]}>{feat}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <Pressable
          onPress={() => router.push('/(auth)/signup')}
          style={({ pressed }) => [
            styles.ctaWrapper,
            { backgroundColor: colors.accent },
            pressed && styles.ctaPressed,
          ]}
        >
          <Text style={styles.ctaText}>Start Free</Text>
          <ArrowRight size={18} color="#fff" />
        </Pressable>
        <Text style={[styles.noCreditCard, { color: colors.muted }]}>
          No credit card required. Cancel anytime.
        </Text>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },

  // Title
  preLabel: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 28,
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 12,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
    alignSelf: 'center',
    marginBottom: 28,
  },

  // Plans
  plansContainer: {
    gap: 10,
    marginBottom: 28,
  },
  planCard: {
    padding: 18,
    borderWidth: 1,
    borderRadius: 16,
  },
  planBadge: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: -6,
    marginRight: 16,
    zIndex: 1,
  },
  planBadgeText: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#fff',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  planName: {
    fontFamily: 'Jakarta-SemiBold',
    fontSize: 15.5,
  },
  planPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  planPrice: {
    fontFamily: 'Jakarta-ExtraBold',
    fontSize: 28,
    letterSpacing: -0.5,
  },
  planPeriod: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 14,
    marginLeft: 2,
  },
  planSubtitle: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 12,
  },

  // Features
  includedLabel: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 12,
  },
  featuresCard: {
    padding: 18,
    gap: 14,
    marginBottom: 28,
    borderRadius: 16,
    borderWidth: 1,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 14,
    flex: 1,
  },

  // CTA
  ctaWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'center',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 40,
  },
  ctaPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  ctaText: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 15,
    color: '#fff',
  },
  noCreditCard: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 12,
  },
})
