import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { FadeIn } from 'react-native-reanimated'
import { Check, Crown, Sparkles, ArrowRight } from 'lucide-react-native'
import { GlassCard } from '@/components/glass'
import { CardEntrance } from '@/components/animations'

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
  const insets = useSafeAreaInsets()
  const router = useRouter()

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#12100e', '#1a1714', '#12100e']}
        style={StyleSheet.absoluteFill}
      />

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
        <Animated.View entering={FadeIn.duration(400)}>
          <Text style={styles.preLabel}>PRICING</Text>
          <Text style={styles.title}>
            One price.{'\n'}Whole family.
          </Text>
          <Text style={styles.subtitle}>
            Both partners share one subscription. Start free, upgrade when
            you're ready.
          </Text>
        </Animated.View>

        {/* Plan cards */}
        <View style={styles.plansContainer}>
          {PLANS.map((plan, index) => (
            <CardEntrance key={plan.name} delay={200 + index * 120}>
              <View style={{ marginTop: plan.badge ? 10 : 0 }}>
                {plan.badge && (
                  <View style={styles.planBadge}>
                    <Sparkles size={10} color="#12100e" />
                    <Text style={styles.planBadgeText}>{plan.badge}</Text>
                  </View>
                )}
                <View
                  style={[
                    styles.planCard,
                    plan.highlight && styles.planCardHighlight,
                  ]}
                >
                  <View style={styles.planHeader}>
                    {plan.name === 'Lifetime' && (
                      <Crown
                        size={16}
                        color="#d4a853"
                        style={{ marginRight: 6 }}
                      />
                    )}
                    <Text style={styles.planName}>{plan.name}</Text>
                  </View>

                  <View style={styles.planPriceRow}>
                    <Text style={styles.planPrice}>{plan.price}</Text>
                    {plan.period ? (
                      <Text style={styles.planPeriod}>{plan.period}</Text>
                    ) : null}
                  </View>
                  <Text style={styles.planSubtitle}>{plan.subtitle}</Text>
                </View>
              </View>
            </CardEntrance>
          ))}
        </View>

        {/* Feature list */}
        <CardEntrance delay={600}>
          <Text style={styles.includedLabel}>WHAT'S INCLUDED</Text>
          <GlassCard style={styles.featuresCard}>
            {FEATURES.map((feat) => (
              <View key={feat} style={styles.featureRow}>
                <Check size={16} color="#6b8f71" />
                <Text style={styles.featureText}>{feat}</Text>
              </View>
            ))}
          </GlassCard>
        </CardEntrance>

        {/* CTA */}
        <CardEntrance delay={800}>
          <Pressable
            onPress={() => router.push('/(auth)/signup')}
            style={({ pressed }) => [
              styles.ctaWrapper,
              pressed && styles.ctaPressed,
            ]}
          >
            <LinearGradient
              colors={['#c4703f', '#d4a853']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaText}>Start Free</Text>
              <ArrowRight size={18} color="#12100e" />
            </LinearGradient>
          </Pressable>
          <Text style={styles.noCreditCard}>
            No credit card required. Cancel anytime.
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },

  // Title
  preLabel: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 11,
    color: '#c4703f',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 30,
    color: '#faf6f0',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 15,
    color: '#7a6f62',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
    alignSelf: 'center',
    marginBottom: 28,
  },

  // Plans
  plansContainer: {
    gap: 12,
    marginBottom: 28,
  },
  planCard: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(237,230,220,0.1)',
    borderRadius: 12,
    backgroundColor: '#201c18',
  },
  planCardHighlight: {
    borderColor: 'rgba(212,168,83,0.5)',
    backgroundColor: 'rgba(212,168,83,0.08)',
  },
  planBadge: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#d4a853',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: -6,
    marginRight: 16,
    zIndex: 1,
  },
  planBadgeText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 10,
    color: '#12100e',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  planName: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
    color: '#faf6f0',
  },
  planPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  planPrice: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
    color: '#faf6f0',
  },
  planPeriod: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    color: '#7a6f62',
    marginLeft: 2,
  },
  planSubtitle: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    color: '#7a6f62',
  },

  // Features
  includedLabel: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 11,
    color: '#c4703f',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 12,
  },
  featuresCard: {
    padding: 20,
    gap: 14,
    marginBottom: 28,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontFamily: 'Karla-Regular',
    fontSize: 14,
    color: '#ede6dc',
    flex: 1,
  },

  // CTA
  ctaWrapper: {
    alignSelf: 'center',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#c4703f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 14,
  },
  ctaText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
    color: '#12100e',
    letterSpacing: 0.5,
  },
  noCreditCard: {
    fontFamily: 'Karla-Regular',
    fontSize: 13,
    color: '#7a6f62',
    textAlign: 'center',
    marginTop: 12,
  },
})
