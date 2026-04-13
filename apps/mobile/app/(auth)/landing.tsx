import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native'
import { Link, useRouter } from 'expo-router'
import { useAuth } from '@/components/providers/AuthProvider'
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
import { useColors } from '@/hooks/use-colors'

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
    week: '0\u20133 Months',
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
  const colors = useColors()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { enterGuestMode } = useAuth()

  const handleBrowseAsGuest = () => {
    enterGuestMode()
    router.replace('/(guest)')
  }

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      {/* Decorative orbs */}
      <View style={styles.orbContainer} pointerEvents="none">
        <View style={[styles.orbCopper, { backgroundColor: colors.copperDim }]} />
        <View style={[styles.orbGold, { backgroundColor: colors.goldDim }]} />
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
          <Text style={[styles.preLabel, { color: colors.copper }]}>FOR MODERN DADS</Text>

          <BrandLogoIcon size={56} />
          <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>The Dad Center</Text>

          <Text style={[styles.heroSubtitle, { color: colors.copper }]}>
            The operating system for modern fatherhood
          </Text>

          <Text style={[styles.heroDescription, { color: colors.textMuted }]}>
            Week-by-week guidance, actionable tasks, and zero fluff. Finally, a
            parenting app that respects your intelligence.
          </Text>

          {/* Get Started CTA */}
          <Link href="/(auth)/signup" asChild>
            <Pressable
              style={({ pressed }) => [
                styles.ctaButtonWrapper,
                { shadowColor: colors.copper },
                pressed && styles.ctaButtonPressed,
              ]}
            >
              <LinearGradient
                colors={colors.ctaGradient as unknown as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ctaGradient}
              >
                <Text style={[styles.ctaText, { color: colors.bg }]}>Get Started</Text>
                <ArrowRight size={18} color={colors.bg} />
              </LinearGradient>
            </Pressable>
          </Link>

          {/* Sign In Link */}
          <View style={styles.signInRow}>
            <Text style={[styles.signInLabel, { color: colors.textMuted }]}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <Pressable>
                <Text style={[styles.signInLink, { color: colors.copper }]}>Sign In</Text>
              </Pressable>
            </Link>
          </View>

          {/* Browse as Guest */}
          <Pressable onPress={handleBrowseAsGuest} style={styles.guestRow}>
            <Text style={[styles.guestText, { color: colors.textMuted }]}>Browse as Guest</Text>
          </Pressable>

          {/* Trust stats */}
          <View style={styles.statsRow}>
            {[
              { value: '200+', label: 'Pre-loaded Tasks' },
              { value: '47', label: 'Weekly Briefings' },
              { value: 'Evidence', label: 'Based' },
            ].map((stat) => (
              <View key={stat.label} style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: colors.textMuted }]}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* ====== FEATURES SECTION ====== */}
        <View style={styles.section}>
          <CardEntrance delay={100}>
            <Text style={[styles.sectionPreLabel, { color: colors.copper }]}>FEATURES</Text>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Everything you need,{'\n'}nothing you don't
            </Text>
          </CardEntrance>

          <View style={styles.featuresGrid}>
            {FEATURES.map((feature, index) => (
              <CardEntrance key={feature.title} delay={200 + index * 120}>
                <GlassCard style={styles.featureCard}>
                  <View style={[styles.featureIconContainer, { backgroundColor: colors.copperDim, borderColor: colors.copperGlow }]}>
                    <feature.icon size={22} color={colors.copper} strokeWidth={1.5} />
                  </View>
                  <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>{feature.title}</Text>
                  <Text style={[styles.featureDescription, { color: colors.textMuted }]}>
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
            <Text style={[styles.sectionPreLabel, { color: colors.copper }]}>HOW IT WORKS</Text>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Up and running{'\n'}in 2 minutes</Text>
          </CardEntrance>

          <StaggerList staggerMs={100}>
            {STEPS.map((step) => (
              <View key={step.number} style={styles.stepRow}>
                <View style={styles.stepNumberContainer}>
                  <LinearGradient
                    colors={colors.ctaGradient as unknown as [string, string]}
                    style={styles.stepNumberGradient}
                  >
                    <Text style={[styles.stepNumber, { color: colors.bg }]}>{step.number}</Text>
                  </LinearGradient>
                  {step.number !== '3' && <View style={[styles.stepLine, { backgroundColor: colors.copperGlow }]} />}
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>{step.title}</Text>
                  <Text style={[styles.stepDescription, { color: colors.textMuted }]}>
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
            <Text style={[styles.sectionPreLabel, { color: colors.copper }]}>INSIDE THE APP</Text>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Your Roadmap{'\n'}at Every Stage
            </Text>
          </CardEntrance>

          {APP_HIGHLIGHTS.map((highlight, index) => (
            <CardEntrance key={highlight.week} delay={200 + index * 120}>
              <GlassCard style={styles.testimonialCard}>
                {/* Week badge + icon */}
                <View style={styles.attributionRow}>
                  <LinearGradient
                    colors={colors.ctaGradient as unknown as [string, string]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.avatarCircle}
                  >
                    <highlight.icon size={16} color={colors.textPrimary} />
                  </LinearGradient>
                  <View>
                    <Text style={[styles.authorName, { color: colors.textPrimary }]}>{highlight.week}</Text>
                    <Text style={[styles.authorContext, { color: colors.textMuted }]}>
                      {highlight.title}
                    </Text>
                  </View>
                </View>

                {/* Quote text */}
                <Text style={[styles.quoteText, { marginTop: 12, color: colors.textSecondary }]}>
                  {highlight.quote}
                </Text>
              </GlassCard>
            </CardEntrance>
          ))}
        </View>

        {/* ====== PRICING SECTION ====== */}
        <View style={styles.section}>
          <CardEntrance delay={100}>
            <Text style={[styles.sectionPreLabel, { color: colors.copper }]}>PRICING</Text>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              One price.{'\n'}Whole family.
            </Text>
          </CardEntrance>

          <View style={styles.plansContainer}>
            {PLANS.map((plan, index) => (
              <CardEntrance key={plan.name} delay={200 + index * 120}>
                <GlassCard
                  style={[
                    styles.planCard,
                    { borderColor: colors.border },
                    plan.highlight && { borderColor: colors.goldGlow, backgroundColor: colors.goldDim },
                  ]}
                >
                  {plan.badge && (
                    <View style={[styles.planBadge, { backgroundColor: colors.gold }]}>
                      <Sparkles size={10} color={colors.bg} />
                      <Text style={[styles.planBadgeText, { color: colors.bg }]}>{plan.badge}</Text>
                    </View>
                  )}

                  <View style={styles.planHeader}>
                    {plan.name === 'Lifetime' && (
                      <Crown size={16} color={colors.gold} style={{ marginRight: 6 }} />
                    )}
                    <Text style={[styles.planName, { color: colors.textPrimary }]}>{plan.name}</Text>
                  </View>

                  <View style={styles.planPriceRow}>
                    <Text style={[styles.planPrice, { color: colors.textPrimary }]}>{plan.price}</Text>
                    {plan.period ? (
                      <Text style={[styles.planPeriod, { color: colors.textMuted }]}>{plan.period}</Text>
                    ) : null}
                  </View>
                  <Text style={[styles.planSubtitle, { color: colors.textMuted }]}>{plan.subtitle}</Text>

                  {/* Feature checks */}
                  <View style={styles.planFeatures}>
                    {[
                      'All weekly briefings',
                      'Full task timeline',
                      'Partner sync',
                    ].map((feat) => (
                      <View key={feat} style={styles.planFeatureRow}>
                        <Check size={14} color={colors.sage} />
                        <Text style={[styles.planFeatureText, { color: colors.textSecondary }]}>{feat}</Text>
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
                  { shadowColor: colors.copper },
                  pressed && styles.ctaButtonPressed,
                ]}
              >
                <LinearGradient
                  colors={colors.ctaGradient as unknown as [string, string]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.ctaGradient}
                >
                  <Text style={[styles.ctaText, { color: colors.bg }]}>Start Free</Text>
                  <ArrowRight size={18} color={colors.bg} />
                </LinearGradient>
              </Pressable>
            </Link>
            <Text style={[styles.noCreditCard, { color: colors.textMuted }]}>
              No credit card required. Cancel anytime.
            </Text>
          </CardEntrance>
        </View>

        {/* ====== FINAL CTA SECTION ====== */}
        <View style={[styles.section, styles.finalCtaSection]}>
          <CardEntrance delay={100}>
            <Text style={[styles.finalCtaTitle, { color: colors.textPrimary }]}>
              Ready to stop{'\n'}winging it?
            </Text>
            <Text style={[styles.finalCtaSubtitle, { color: colors.textMuted }]}>
              Join thousands of prepared dads who refuse to leave fatherhood to
              chance.
            </Text>

            <Link href="/(auth)/signup" asChild>
              <Pressable
                style={({ pressed }) => [
                  styles.ctaButtonWrapper,
                  { shadowColor: colors.copper },
                  pressed && styles.ctaButtonPressed,
                ]}
              >
                <LinearGradient
                  colors={colors.ctaGradient as unknown as [string, string]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.ctaGradient}
                >
                  <Text style={[styles.ctaText, { color: colors.bg }]}>Get Started Free</Text>
                  <ArrowRight size={18} color={colors.bg} />
                </LinearGradient>
              </Pressable>
            </Link>

            <View style={styles.legalLinks}>
              <Pressable onPress={() => WebBrowser.openBrowserAsync('https://thedadcenter.com/privacy')}>
                <Text style={[styles.legalLink, { color: colors.textDim }]}>Privacy Policy</Text>
              </Pressable>
              <Text style={[styles.legalDot, { color: colors.textDim }]}>{'\u00B7'}</Text>
              <Pressable onPress={() => WebBrowser.openBrowserAsync('https://thedadcenter.com/terms')}>
                <Text style={[styles.legalLink, { color: colors.textDim }]}>Terms of Service</Text>
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
  const colors = useColors()

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
            { shadowColor: colors.copper },
            pressed && styles.ctaButtonPressed,
          ]}
        >
          <LinearGradient
            colors={colors.ctaGradient as unknown as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.stickyGradient}
          >
            <Text style={[styles.stickyButtonText, { color: colors.bg }]}>Get Started</Text>
            <ArrowRight size={16} color={colors.bg} />
          </LinearGradient>
        </Pressable>
      </Link>
    </View>
  )

  if (Platform.OS === 'ios') {
    return (
      <Animated.View entering={FadeInDown.delay(800).springify()}>
        <BlurView tint={colors.blurTint} intensity={colors.blurIntensity} style={[styles.stickyContainer, { borderTopColor: colors.border }]}>
          {content}
        </BlurView>
      </Animated.View>
    )
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(800).springify()}
      style={[styles.stickyContainer, styles.stickyAndroid, { borderTopColor: colors.border, backgroundColor: colors.glassBg }]}
    >
      {content}
    </Animated.View>
  )
}

// --- Styles ---

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
  },
  orbGold: {
    position: 'absolute',
    width: 200,
    height: 200,
    top: '35%',
    left: -60,
    borderRadius: 100,
  },

  // Hero
  heroSection: {
    alignItems: 'center',
    marginBottom: 56,
  },
  preLabel: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  heroTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 36,
    textAlign: 'center',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontFamily: 'Jost-Medium',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  heroDescription: {
    fontFamily: 'Jost-Regular',
    fontSize: 15,
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
    letterSpacing: 0.5,
  },

  // Sign In
  signInRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  signInLabel: {
    fontFamily: 'Karla-Regular',
    fontSize: 14,
  },
  signInLink: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 14,
  },

  // Guest
  guestRow: {
    marginBottom: 32,
  },
  guestText: {
    fontFamily: 'Karla-Regular',
    fontSize: 14,
    textAlign: 'center',
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
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: 'Karla-Regular',
    fontSize: 11,
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
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
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
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  featureTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
    marginBottom: 6,
  },
  featureDescription: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
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
  },
  stepLine: {
    width: 2,
    flex: 1,
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
    marginBottom: 4,
  },
  stepDescription: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
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
  authorName: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 13,
  },
  authorContext: {
    fontFamily: 'Karla-Regular',
    fontSize: 11,
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
  },
  planBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  planBadgeText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 10,
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
  },
  planPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  planPrice: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
  },
  planPeriod: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    marginLeft: 2,
  },
  planSubtitle: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
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
  },
  noCreditCard: {
    fontFamily: 'Karla-Regular',
    fontSize: 13,
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
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 12,
  },
  finalCtaSubtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 15,
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
  legalLink: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  legalDot: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
  },

  // Sticky bottom bar
  stickyContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
  },
  stickyAndroid: {},
  stickyInner: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  stickyButtonWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
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
    letterSpacing: 0.5,
  },
})
