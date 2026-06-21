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
import { BrandLogo } from '@/components/BrandLogo'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BlurView } from 'expo-blur'
import {
  BookOpen,
  CheckSquare,
  Activity,
  DollarSign,
  Check,
  Crown,
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
} from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import * as WebBrowser from 'expo-web-browser'
import { useColors } from '@/hooks/use-colors'
import { useTheme } from '@/components/providers/ThemeProvider'

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
  const colors = useColors()
  const { isDark, setTheme } = useTheme()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { enterGuestMode } = useAuth()

  const handleBrowseAsGuest = () => {
    enterGuestMode()
    router.replace('/(guest)')
  }

  const toggleTheme = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      {/* Theme toggle */}
      <Pressable
        onPress={toggleTheme}
        style={[styles.themeToggle, { top: insets.top + 12, backgroundColor: colors.card, borderColor: colors.line }]}
        accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        accessibilityRole="button"
      >
        {isDark ? (
          <Sun size={18} color={colors.gold} />
        ) : (
          <Moon size={18} color={colors.accent} />
        )}
      </Pressable>

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
        <View style={styles.heroSection}>
          <Text style={[styles.preLabel, { color: colors.accent }]}>FOR MODERN DADS</Text>

          <BrandLogo size={48} textSize={28} />

          <Text style={[styles.heroSubtitle, { color: colors.accent }]}>
            The operating system for modern fatherhood
          </Text>

          <Text style={[styles.heroDescription, { color: colors.muted }]}>
            Week-by-week guidance, actionable tasks, and zero fluff. Finally, a
            parenting app that respects your intelligence.
          </Text>

          {/* Get Started CTA */}
          <Link href="/(auth)/signup" asChild>
            <Pressable
              style={({ pressed }) => [
                styles.ctaButtonWrapper,
                { backgroundColor: colors.accent },
                pressed && styles.ctaButtonPressed,
              ]}
            >
              <View style={styles.ctaInner}>
                <Text style={styles.ctaText}>Get Started</Text>
                <ArrowRight size={18} color="#fff" />
              </View>
            </Pressable>
          </Link>

          {/* Sign In Link */}
          <View style={styles.signInRow}>
            <Text style={[styles.signInLabel, { color: colors.muted }]}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <Pressable>
                <Text style={[styles.signInLink, { color: colors.accentInk }]}>Sign In</Text>
              </Pressable>
            </Link>
          </View>

          {/* Browse as Guest */}
          <Pressable onPress={handleBrowseAsGuest} style={styles.guestRow}>
            <Text style={[styles.guestText, { color: colors.muted }]}>Browse as Guest</Text>
          </Pressable>

          {/* Trust stats */}
          <View style={styles.statsRow}>
            {[
              { value: '200+', label: 'Pre-loaded Tasks' },
              { value: '47', label: 'Weekly Briefings' },
              { value: 'Evidence', label: 'Based' },
            ].map((stat) => (
              <View key={stat.label} style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.ink }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ====== FEATURES SECTION ====== */}
        <View style={styles.section}>
          <Text style={[styles.sectionPreLabel, { color: colors.accent }]}>FEATURES</Text>
          <Text style={[styles.sectionTitle, { color: colors.ink }]}>
            Everything you need,{'\n'}nothing you don't
          </Text>

          <View style={styles.featuresGrid}>
            {FEATURES.map((feature) => (
              <View
                key={feature.title}
                style={[styles.featureCard, { backgroundColor: colors.card, borderColor: colors.line }]}
              >
                <View style={[styles.featureIconContainer, { backgroundColor: colors.accentSoft }]}>
                  <feature.icon size={22} color={colors.accent} strokeWidth={1.5} />
                </View>
                <Text style={[styles.featureTitle, { color: colors.ink }]}>{feature.title}</Text>
                <Text style={[styles.featureDescription, { color: colors.muted }]}>
                  {feature.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ====== HOW IT WORKS SECTION ====== */}
        <View style={styles.section}>
          <Text style={[styles.sectionPreLabel, { color: colors.accent }]}>HOW IT WORKS</Text>
          <Text style={[styles.sectionTitle, { color: colors.ink }]}>Up and running{'\n'}in 2 minutes</Text>

          {STEPS.map((step) => (
            <View key={step.number} style={styles.stepRow}>
              <View style={styles.stepNumberContainer}>
                <View style={[styles.stepNumberCircle, { backgroundColor: colors.accent }]}>
                  <Text style={styles.stepNumber}>{step.number}</Text>
                </View>
                {step.number !== '3' && <View style={[styles.stepLine, { backgroundColor: colors.line }]} />}
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: colors.ink }]}>{step.title}</Text>
                <Text style={[styles.stepDescription, { color: colors.muted }]}>
                  {step.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* ====== INSIDE THE APP SECTION ====== */}
        <View style={styles.section}>
          <Text style={[styles.sectionPreLabel, { color: colors.accent }]}>INSIDE THE APP</Text>
          <Text style={[styles.sectionTitle, { color: colors.ink }]}>
            Your Roadmap{'\n'}at Every Stage
          </Text>

          {APP_HIGHLIGHTS.map((highlight) => (
            <View
              key={highlight.week}
              style={[styles.highlightCard, { backgroundColor: colors.card, borderColor: colors.line }]}
            >
              {/* Week badge + icon */}
              <View style={styles.attributionRow}>
                <View style={[styles.avatarCircle, { backgroundColor: colors.accentSoft }]}>
                  <highlight.icon size={16} color={colors.accent} />
                </View>
                <View>
                  <Text style={[styles.authorName, { color: colors.ink }]}>{highlight.week}</Text>
                  <Text style={[styles.authorContext, { color: colors.muted }]}>
                    {highlight.title}
                  </Text>
                </View>
              </View>

              <Text style={[styles.quoteText, { color: colors.ink2 }]}>
                {highlight.quote}
              </Text>
            </View>
          ))}
        </View>

        {/* ====== PRICING SECTION ====== */}
        <View style={styles.section}>
          <Text style={[styles.sectionPreLabel, { color: colors.accent }]}>PRICING</Text>
          <Text style={[styles.sectionTitle, { color: colors.ink }]}>
            One price.{'\n'}Whole family.
          </Text>

          <View style={styles.plansContainer}>
            {PLANS.map((plan) => (
              <View
                key={plan.name}
                style={[
                  styles.planCard,
                  { backgroundColor: colors.card, borderColor: colors.line },
                  plan.highlight && { borderColor: colors.accent, borderWidth: 2 },
                ]}
              >
                {plan.badge && (
                  <View style={[styles.planBadge, { backgroundColor: colors.gold }]}>
                    <Sparkles size={10} color="#fff" />
                    <Text style={styles.planBadgeText}>{plan.badge}</Text>
                  </View>
                )}

                <View style={styles.planHeader}>
                  {plan.name === 'Lifetime' && (
                    <Crown size={16} color={colors.gold} style={{ marginRight: 6 }} />
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

                {/* Feature checks */}
                <View style={styles.planFeatures}>
                  {[
                    'All weekly briefings',
                    'Full task timeline',
                    'Partner sync',
                  ].map((feat) => (
                    <View key={feat} style={styles.planFeatureRow}>
                      <Check size={14} color={colors.sage} />
                      <Text style={[styles.planFeatureText, { color: colors.ink2 }]}>{feat}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>

          {/* Start Free CTA */}
          <Link href="/(auth)/signup" asChild>
            <Pressable
              style={({ pressed }) => [
                styles.ctaButtonWrapper,
                { backgroundColor: colors.accent },
                pressed && styles.ctaButtonPressed,
              ]}
            >
              <View style={styles.ctaInner}>
                <Text style={styles.ctaText}>Start Free</Text>
                <ArrowRight size={18} color="#fff" />
              </View>
            </Pressable>
          </Link>
          <Text style={[styles.noCreditCard, { color: colors.muted }]}>
            No credit card required. Cancel anytime.
          </Text>
        </View>

        {/* ====== FINAL CTA SECTION ====== */}
        <View style={[styles.section, styles.finalCtaSection]}>
          <Text style={[styles.finalCtaTitle, { color: colors.ink }]}>
            Ready to stop{'\n'}winging it?
          </Text>
          <Text style={[styles.finalCtaSubtitle, { color: colors.muted }]}>
            Join thousands of prepared dads who refuse to leave fatherhood to
            chance.
          </Text>

          <Link href="/(auth)/signup" asChild>
            <Pressable
              style={({ pressed }) => [
                styles.ctaButtonWrapper,
                { backgroundColor: colors.accent },
                pressed && styles.ctaButtonPressed,
              ]}
            >
              <View style={styles.ctaInner}>
                <Text style={styles.ctaText}>Get Started Free</Text>
                <ArrowRight size={18} color="#fff" />
              </View>
            </Pressable>
          </Link>

          <View style={styles.legalLinks}>
            <Pressable onPress={() => WebBrowser.openBrowserAsync('https://thedadcenter.com/privacy')}>
              <Text style={[styles.legalLink, { color: colors.faint }]}>Privacy Policy</Text>
            </Pressable>
            <Text style={[styles.legalDot, { color: colors.faint }]}>{'·'}</Text>
            <Pressable onPress={() => WebBrowser.openBrowserAsync('https://thedadcenter.com/terms')}>
              <Text style={[styles.legalLink, { color: colors.faint }]}>Terms of Service</Text>
            </Pressable>
          </View>
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
            { backgroundColor: colors.accent },
            pressed && styles.ctaButtonPressed,
          ]}
        >
          <View style={styles.stickyGradient}>
            <Text style={styles.stickyButtonText}>Get Started</Text>
            <ArrowRight size={16} color="#fff" />
          </View>
        </Pressable>
      </Link>
    </View>
  )

  if (Platform.OS === 'ios') {
    return (
      <BlurView tint={colors.blurTint} intensity={colors.blurIntensity} style={[styles.stickyContainer, { borderTopColor: colors.line }]}>
        {content}
      </BlurView>
    )
  }

  return (
    <View
      style={[styles.stickyContainer, styles.stickyAndroid, { borderTopColor: colors.line, backgroundColor: colors.card }]}
    >
      {content}
    </View>
  )
}

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  themeToggle: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },

  // Hero
  heroSection: {
    alignItems: 'center',
    marginBottom: 56,
  },
  preLabel: {
    fontFamily: 'Jakarta-SemiBold',
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  heroSubtitle: {
    fontFamily: 'Jakarta-Medium',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 14,
  },
  heroDescription: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
    marginBottom: 32,
  },

  // CTA Button (shared)
  ctaButtonWrapper: {
    alignSelf: 'center',
    borderRadius: 12,
  },
  ctaButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  ctaInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  ctaText: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 15,
    color: '#fff',
  },

  // Sign In
  signInRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  signInLabel: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 14,
  },
  signInLink: {
    fontFamily: 'Jakarta-SemiBold',
    fontSize: 14,
  },

  // Guest
  guestRow: {
    marginBottom: 32,
  },
  guestText: {
    fontFamily: 'Jakarta-Regular',
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
    fontFamily: 'Jakarta-ExtraBold',
    fontSize: 20,
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  // Sections
  section: {
    marginBottom: 56,
  },
  sectionPreLabel: {
    fontFamily: 'Jakarta-SemiBold',
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 26,
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 28,
    letterSpacing: -0.4,
  },

  // Features
  featuresGrid: {
    gap: 12,
  },
  featureCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  featureIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  featureTitle: {
    fontFamily: 'Jakarta-SemiBold',
    fontSize: 15.5,
    marginBottom: 6,
  },
  featureDescription: {
    fontFamily: 'Jakarta-Regular',
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
    width: 34,
  },
  stepNumberCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 15,
    color: '#fff',
  },
  stepLine: {
    width: 1,
    flex: 1,
    marginTop: 6,
    borderRadius: 1,
  },
  stepContent: {
    flex: 1,
    paddingTop: 4,
  },
  stepTitle: {
    fontFamily: 'Jakarta-SemiBold',
    fontSize: 15.5,
    marginBottom: 4,
  },
  stepDescription: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 14,
    lineHeight: 21,
  },

  // App Highlights
  highlightCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  quoteText: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 14.5,
    lineHeight: 22,
    marginTop: 12,
  },
  attributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorName: {
    fontFamily: 'Jakarta-SemiBold',
    fontSize: 13,
  },
  authorContext: {
    fontFamily: 'Jakarta-Regular',
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
    borderRadius: 16,
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
    borderRadius: 8,
  },
  planBadgeText: {
    fontFamily: 'Jakarta-SemiBold',
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
    fontFamily: 'Jakarta-Regular',
    fontSize: 13,
  },
  noCreditCard: {
    fontFamily: 'Jakarta-Regular',
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
    fontFamily: 'Jakarta-Bold',
    fontSize: 28,
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 12,
    letterSpacing: -0.4,
  },
  finalCtaSubtitle: {
    fontFamily: 'Jakarta-Regular',
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
    fontFamily: 'Jakarta-Regular',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  legalDot: {
    fontFamily: 'Jakarta-Regular',
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
    fontFamily: 'Jakarta-Bold',
    fontSize: 15,
    color: '#fff',
  },
})
