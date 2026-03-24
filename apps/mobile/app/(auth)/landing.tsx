import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native'
import { Link } from 'expo-router'
import { BrandLogoIcon } from '@/components/BrandLogo'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated'
import {
  BookOpen,
  CheckSquare,
  Activity,
  DollarSign,
  Check,
  Crown,
  Sparkles,
  ArrowRight,
} from 'lucide-react-native'
import * as WebBrowser from 'expo-web-browser'
import { GlassCard } from '@/components/glass'
import { CardEntrance, StaggerList } from '@/components/animations'

// --- Data ---

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Weekly Briefings',
    description: '40+ weeks of dad-specific guidance, personalized to your exact week.',
  },
  {
    icon: CheckSquare,
    title: 'Smart Task Manager',
    description: 'Never miss a critical task. Pre-loaded and timed to your due date.',
  },
  {
    icon: Activity,
    title: 'Baby Tracker',
    description: 'Log feeds, diapers, and sleep in seconds. Track patterns effortlessly.',
  },
  {
    icon: DollarSign,
    title: 'Budget Planner',
    description: '200+ items with real pricing so you can plan the actual cost of parenthood.',
  },
]

const STEPS = [
  {
    number: '1',
    title: 'Sign up in 30 seconds',
    description: 'Enter your due date and you\'re in. Everything syncs to your timeline.',
  },
  {
    number: '2',
    title: 'Get your weekly briefing',
    description: 'Personalized for your exact week — what\'s happening and what to do.',
  },
  {
    number: '3',
    title: 'Stay ahead together',
    description: 'Both partners share one subscription. Tasks sync in real-time.',
  },
]

const APP_HIGHLIGHTS = [
  {
    week: 'Week 28',
    title: 'The Third Trimester Shift',
    quote: 'Install infant car seat. Research pediatricians. Pack hospital bag. Start birth plan. — All laid out, week by week.',
    icon: BookOpen,
  },
  {
    week: 'Week 12',
    title: 'First Trimester Wrap-Up',
    quote: 'Verify prenatal insurance. Schedule anatomy scan. Start a baby registry. Morning sickness support plan. — Nothing falls through the cracks.',
    icon: CheckSquare,
  },
  {
    week: '0–3 Months',
    title: 'The Fourth Trimester',
    quote: 'Set up feeding station. Learn swaddle technique. Track feeds and diapers. Split night shifts fairly. — From day one, you know what to do.',
    icon: Activity,
  },
]

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

// --- Component ---

export default function LandingScreen() {
  const insets = useSafeAreaInsets()
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#12100e', '#1a1714', '#12100e']}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative orbs */}
      <View style={styles.orbContainer} pointerEvents="none">
        <View style={styles.orbCopper} />
        <View style={styles.orbGold} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 48,
            paddingBottom: insets.bottom + 80,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ====== HERO SECTION ====== */}
        <Animated.View
          entering={FadeIn.duration(600)}
          style={styles.heroSection}
        >
          <Text style={styles.preLabel}>FOR MODERN DADS</Text>

          <BrandLogoIcon size={56} />
          <Text style={styles.heroTitle}>The Dad Center</Text>

          <Text style={styles.heroSubtitle}>
            The operating system for modern fatherhood
          </Text>

          <Text style={styles.heroDescription}>
            Week-by-week guidance, actionable tasks, and zero fluff. Finally, a
            parenting app that respects your intelligence.
          </Text>

          {/* Get Started CTA */}
          <Link href="/(auth)/signup" asChild>
            <Pressable
              style={({ pressed }) => [
                styles.ctaButtonWrapper,
                pressed && styles.ctaButtonPressed,
              ]}
            >
              <LinearGradient
                colors={['#c4703f', '#d4a853']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ctaGradient}
              >
                <Text style={styles.ctaText}>Get Started</Text>
                <ArrowRight size={18} color="#12100e" />
              </LinearGradient>
            </Pressable>
          </Link>

          {/* Sign In Link */}
          <View style={styles.signInRow}>
            <Text style={styles.signInLabel}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <Pressable>
                <Text style={styles.signInLink}>Sign In</Text>
              </Pressable>
            </Link>
          </View>

          {/* Trust stats */}
          <View style={styles.statsRow}>
            {[
              { value: '200+', label: 'Pre-loaded Tasks' },
              { value: '47', label: 'Weekly Briefings' },
              { value: 'Evidence', label: 'Based' },
            ].map((stat) => (
              <View key={stat.label} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* ====== FEATURES SECTION ====== */}
        <View style={styles.section}>
          <CardEntrance delay={100}>
            <Text style={styles.sectionPreLabel}>FEATURES</Text>
            <Text style={styles.sectionTitle}>
              Everything you need,{'\n'}nothing you don't
            </Text>
          </CardEntrance>

          <View style={styles.featuresGrid}>
            {FEATURES.map((feature, index) => (
              <CardEntrance key={feature.title} delay={200 + index * 120}>
                <GlassCard style={styles.featureCard}>
                  <View style={styles.featureIconContainer}>
                    <feature.icon size={22} color="#c4703f" strokeWidth={1.5} />
                  </View>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>
                    {feature.description}
                  </Text>
                </GlassCard>
              </CardEntrance>
            ))}
          </View>
        </View>

        {/* ====== HOW IT WORKS SECTION ====== */}
        <View style={styles.section}>
          <CardEntrance delay={100}>
            <Text style={styles.sectionPreLabel}>HOW IT WORKS</Text>
            <Text style={styles.sectionTitle}>Up and running{'\n'}in 2 minutes</Text>
          </CardEntrance>

          <StaggerList staggerMs={100}>
            {STEPS.map((step) => (
              <View key={step.number} style={styles.stepRow}>
                <View style={styles.stepNumberContainer}>
                  <LinearGradient
                    colors={['#c4703f', '#d4a853']}
                    style={styles.stepNumberGradient}
                  >
                    <Text style={styles.stepNumber}>{step.number}</Text>
                  </LinearGradient>
                  {step.number !== '3' && <View style={styles.stepLine} />}
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDescription}>
                    {step.description}
                  </Text>
                </View>
              </View>
            ))}
          </StaggerList>
        </View>

        {/* ====== INSIDE THE APP SECTION ====== */}
        <View style={styles.section}>
          <CardEntrance delay={100}>
            <Text style={styles.sectionPreLabel}>INSIDE THE APP</Text>
            <Text style={styles.sectionTitle}>
              Your Roadmap{'\n'}at Every Stage
            </Text>
          </CardEntrance>

          {APP_HIGHLIGHTS.map((highlight, index) => (
            <CardEntrance key={highlight.week} delay={200 + index * 120}>
              <GlassCard style={styles.testimonialCard}>
                {/* Week badge + icon */}
                <View style={styles.attributionRow}>
                  <LinearGradient
                    colors={['#c4703f', '#d4a853']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.avatarCircle}
                  >
                    <highlight.icon size={16} color="#faf6f0" />
                  </LinearGradient>
                  <View>
                    <Text style={styles.authorName}>{highlight.week}</Text>
                    <Text style={styles.authorContext}>
                      {highlight.title}
                    </Text>
                  </View>
                </View>

                {/* Quote text */}
                <Text style={[styles.quoteText, { marginTop: 12 }]}>
                  {highlight.quote}
                </Text>
              </GlassCard>
            </CardEntrance>
          ))}
        </View>

        {/* ====== PRICING SECTION ====== */}
        <View style={styles.section}>
          <CardEntrance delay={100}>
            <Text style={styles.sectionPreLabel}>PRICING</Text>
            <Text style={styles.sectionTitle}>
              One price.{'\n'}Whole family.
            </Text>
          </CardEntrance>

          <View style={styles.plansContainer}>
            {PLANS.map((plan, index) => (
              <CardEntrance key={plan.name} delay={200 + index * 120}>
                <GlassCard
                  style={[
                    styles.planCard,
                    plan.highlight && styles.planCardHighlight,
                  ]}
                >
                  {plan.badge && (
                    <View style={styles.planBadge}>
                      <Sparkles size={10} color="#12100e" />
                      <Text style={styles.planBadgeText}>{plan.badge}</Text>
                    </View>
                  )}

                  <View style={styles.planHeader}>
                    {plan.name === 'Lifetime' && (
                      <Crown size={16} color="#d4a853" style={{ marginRight: 6 }} />
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

                  {/* Feature checks */}
                  <View style={styles.planFeatures}>
                    {[
                      'All weekly briefings',
                      'Full task timeline',
                      'Partner sync',
                    ].map((feat) => (
                      <View key={feat} style={styles.planFeatureRow}>
                        <Check size={14} color="#6b8f71" />
                        <Text style={styles.planFeatureText}>{feat}</Text>
                      </View>
                    ))}
                  </View>
                </GlassCard>
              </CardEntrance>
            ))}
          </View>

          {/* Start Free CTA */}
          <CardEntrance delay={600}>
            <Link href="/(auth)/signup" asChild>
              <Pressable
                style={({ pressed }) => [
                  styles.ctaButtonWrapper,
                  pressed && styles.ctaButtonPressed,
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
            </Link>
            <Text style={styles.noCreditCard}>
              No credit card required. Cancel anytime.
            </Text>
          </CardEntrance>
        </View>

        {/* ====== FINAL CTA SECTION ====== */}
        <View style={[styles.section, styles.finalCtaSection]}>
          <CardEntrance delay={100}>
            <Text style={styles.finalCtaTitle}>
              Ready to stop{'\n'}winging it?
            </Text>
            <Text style={styles.finalCtaSubtitle}>
              Join thousands of prepared dads who refuse to leave fatherhood to
              chance.
            </Text>

            <Link href="/(auth)/signup" asChild>
              <Pressable
                style={({ pressed }) => [
                  styles.ctaButtonWrapper,
                  pressed && styles.ctaButtonPressed,
                ]}
              >
                <LinearGradient
                  colors={['#c4703f', '#d4a853']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.ctaGradient}
                >
                  <Text style={styles.ctaText}>Get Started Free</Text>
                  <ArrowRight size={18} color="#12100e" />
                </LinearGradient>
              </Pressable>
            </Link>

            <View style={styles.legalLinks}>
              <Pressable onPress={() => WebBrowser.openBrowserAsync('https://thedadcenter.com/privacy')}>
                <Text style={styles.legalLink}>Privacy Policy</Text>
              </Pressable>
              <Text style={styles.legalDot}>{'\u00B7'}</Text>
              <Pressable onPress={() => WebBrowser.openBrowserAsync('https://thedadcenter.com/terms')}>
                <Text style={styles.legalLink}>Terms of Service</Text>
              </Pressable>
            </View>
          </CardEntrance>
        </View>
      </ScrollView>

      {/* ====== STICKY BOTTOM CTA BAR ====== */}
      <StickyBottomBar bottomInset={insets.bottom} />
    </View>
  )
}

function StickyBottomBar({ bottomInset }: { bottomInset: number }) {
  const content = (
    <View
      style={[
        styles.stickyInner,
        { paddingBottom: Math.max(bottomInset, 8) },
      ]}
    >
      <Link href="/(auth)/signup" asChild>
        <Pressable
          style={({ pressed }) => [
            styles.stickyButtonWrapper,
            pressed && styles.ctaButtonPressed,
          ]}
        >
          <LinearGradient
            colors={['#c4703f', '#d4a853']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.stickyGradient}
          >
            <Text style={styles.stickyButtonText}>Get Started</Text>
            <ArrowRight size={16} color="#12100e" />
          </LinearGradient>
        </Pressable>
      </Link>
    </View>
  )

  if (Platform.OS === 'ios') {
    return (
      <Animated.View entering={FadeInDown.delay(800).springify()}>
        <BlurView tint="dark" intensity={80} style={styles.stickyContainer}>
          {content}
        </BlurView>
      </Animated.View>
    )
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(800).springify()}
      style={[styles.stickyContainer, styles.stickyAndroid]}
    >
      {content}
    </Animated.View>
  )
}

// --- Styles ---

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

  // Decorative orbs
  orbContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  orbCopper: {
    position: 'absolute',
    width: 300,
    height: 300,
    top: '8%',
    right: -100,
    borderRadius: 150,
    backgroundColor: 'rgba(196,112,63,0.06)',
  },
  orbGold: {
    position: 'absolute',
    width: 200,
    height: 200,
    top: '35%',
    left: -60,
    borderRadius: 100,
    backgroundColor: 'rgba(212,168,83,0.04)',
  },

  // Hero
  heroSection: {
    alignItems: 'center',
    marginBottom: 56,
  },
  preLabel: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 11,
    color: '#c4703f',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  heroTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 36,
    color: '#faf6f0',
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontFamily: 'Jost-Medium',
    fontSize: 18,
    color: '#c4703f',
    textAlign: 'center',
    marginBottom: 16,
  },
  heroDescription: {
    fontFamily: 'Jost-Regular',
    fontSize: 15,
    color: '#7a6f62',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
    marginBottom: 32,
  },

  // CTA Button (shared)
  ctaButtonWrapper: {
    alignSelf: 'center',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#c4703f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaButtonPressed: {
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

  // Sign In
  signInRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  signInLabel: {
    fontFamily: 'Karla-Regular',
    fontSize: 14,
    color: '#7a6f62',
  },
  signInLink: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 14,
    color: '#c4703f',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 20,
    color: '#faf6f0',
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: 'Karla-Regular',
    fontSize: 11,
    color: '#7a6f62',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  // Sections
  section: {
    marginBottom: 56,
  },
  sectionPreLabel: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 11,
    color: '#c4703f',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
    color: '#faf6f0',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 28,
  },

  // Features
  featuresGrid: {
    gap: 12,
  },
  featureCard: {
    padding: 20,
  },
  featureIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(196,112,63,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(196,112,63,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  featureTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
    color: '#faf6f0',
    marginBottom: 6,
  },
  featureDescription: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    color: '#7a6f62',
    lineHeight: 21,
  },

  // How It Works — Steps
  stepRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  stepNumberContainer: {
    alignItems: 'center',
    marginRight: 16,
    width: 36,
  },
  stepNumberGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
    color: '#12100e',
  },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(196,112,63,0.2)',
    marginTop: 8,
    borderRadius: 1,
  },
  stepContent: {
    flex: 1,
    paddingTop: 4,
  },
  stepTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
    color: '#faf6f0',
    marginBottom: 4,
  },
  stepDescription: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    color: '#7a6f62',
    lineHeight: 21,
  },

  // Testimonials
  testimonialCard: {
    padding: 20,
    marginBottom: 12,
  },
  quoteText: {
    fontFamily: 'Jost-Regular',
    fontSize: 15,
    color: '#ede6dc',
    lineHeight: 24,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  attributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarLetter: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 14,
    color: '#12100e',
  },
  authorName: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 13,
    color: '#faf6f0',
  },
  authorContext: {
    fontFamily: 'Karla-Regular',
    fontSize: 11,
    color: '#7a6f62',
    marginTop: 1,
  },

  // Pricing
  plansContainer: {
    gap: 12,
    marginBottom: 24,
  },
  planCard: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(237,230,220,0.08)',
  },
  planCardHighlight: {
    borderColor: 'rgba(212,168,83,0.4)',
    backgroundColor: 'rgba(212,168,83,0.06)',
  },
  planBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
    marginBottom: 14,
  },
  planFeatures: {
    gap: 8,
  },
  planFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planFeatureText: {
    fontFamily: 'Karla-Regular',
    fontSize: 13,
    color: '#ede6dc',
  },
  noCreditCard: {
    fontFamily: 'Karla-Regular',
    fontSize: 13,
    color: '#7a6f62',
    textAlign: 'center',
    marginTop: 12,
  },

  // Final CTA
  finalCtaSection: {
    alignItems: 'center',
    paddingTop: 24,
    marginBottom: 24,
  },
  finalCtaTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 30,
    color: '#faf6f0',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 12,
  },
  finalCtaSubtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 15,
    color: '#7a6f62',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
    marginBottom: 28,
  },
  legalLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
  },
  legalText: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    color: '#4a4239',
  },
  legalLink: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    color: '#4a4239',
    textDecorationLine: 'underline',
  },
  legalDot: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    color: '#4a4239',
  },

  // Sticky bottom bar
  stickyContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(237,230,220,0.08)',
  },
  stickyAndroid: {
    backgroundColor: 'rgba(26,23,20,0.97)',
  },
  stickyInner: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  stickyButtonWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#c4703f',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  stickyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  stickyButtonText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 15,
    color: '#12100e',
    letterSpacing: 0.5,
  },
})
