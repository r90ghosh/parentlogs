import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native'
import { Link } from 'expo-router'
import { BrandLogoIcon } from '@/components/BrandLogo'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  BookOpen,
  CheckSquare,
  Activity,
  DollarSign,
  ArrowRight,
} from 'lucide-react-native'
import { useColors } from '@/hooks/use-colors'

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

export default function GuestHome() {
  const colors = useColors()
  const insets = useSafeAreaInsets()

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
        {/* Hero */}
        <View style={styles.heroSection}>
          <Text style={[styles.preLabel, { color: colors.accent }]}>FOR MODERN DADS</Text>
          <BrandLogoIcon size={52} />
          <Text style={[styles.heroTitle, { color: colors.ink }]}>The Dad Center</Text>
          <Text style={[styles.heroSubtitle, { color: colors.accent }]}>
            The operating system for modern fatherhood
          </Text>
          <Text style={[styles.heroDescription, { color: colors.muted }]}>
            Week-by-week guidance, actionable tasks, and zero fluff. Finally, a
            parenting app that respects your intelligence.
          </Text>

          <Link href="/(auth)/signup" asChild>
            <Pressable style={({ pressed }) => [styles.ctaWrapper, { backgroundColor: colors.accent }, pressed && styles.ctaPressed]}>
              <Text style={styles.ctaText}>Get Started Free</Text>
              <ArrowRight size={18} color="#fff" />
            </Pressable>
          </Link>

          <View style={styles.signInRow}>
            <Text style={[styles.signInLabel, { color: colors.muted }]}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <Pressable>
                <Text style={[styles.signInLink, { color: colors.accentInk }]}>Sign In</Text>
              </Pressable>
            </Link>
          </View>

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

        {/* Features */}
        <View style={styles.section}>
          <Text style={[styles.sectionPreLabel, { color: colors.accent }]}>FEATURES</Text>
          <Text style={[styles.sectionTitle, { color: colors.ink }]}>
            Everything you need,{'\n'}nothing you don't
          </Text>
          <View style={styles.featuresGrid}>
            {FEATURES.map((feature) => (
              <View key={feature.title} style={[styles.featureCard, { backgroundColor: colors.card, borderColor: colors.line }]}>
                <View style={[styles.featureIconContainer, { backgroundColor: colors.accentSoft }]}>
                  <feature.icon size={22} color={colors.accent} strokeWidth={1.5} />
                </View>
                <Text style={[styles.featureTitle, { color: colors.ink }]}>{feature.title}</Text>
                <Text style={[styles.featureDescription, { color: colors.muted }]}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* How It Works */}
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
                <Text style={[styles.stepDescription, { color: colors.muted }]}>{step.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Inside The App */}
        <View style={styles.section}>
          <Text style={[styles.sectionPreLabel, { color: colors.accent }]}>INSIDE THE APP</Text>
          <Text style={[styles.sectionTitle, { color: colors.ink }]}>Your Roadmap{'\n'}at Every Stage</Text>
          {APP_HIGHLIGHTS.map((highlight) => (
            <View key={highlight.week} style={[styles.highlightCard, { backgroundColor: colors.card, borderColor: colors.line }]}>
              <View style={styles.attributionRow}>
                <View style={[styles.avatarCircle, { backgroundColor: colors.accentSoft }]}>
                  <highlight.icon size={16} color={colors.accent} />
                </View>
                <View>
                  <Text style={[styles.authorName, { color: colors.ink }]}>{highlight.week}</Text>
                  <Text style={[styles.authorContext, { color: colors.muted }]}>{highlight.title}</Text>
                </View>
              </View>
              <Text style={[styles.quoteText, { color: colors.ink2 }]}>{highlight.quote}</Text>
            </View>
          ))}
        </View>

        {/* Final CTA */}
        <View style={[styles.section, styles.finalCta]}>
          <Text style={[styles.finalCtaTitle, { color: colors.ink }]}>Ready to stop{'\n'}winging it?</Text>
          <Text style={[styles.finalCtaSubtitle, { color: colors.muted }]}>
            Join thousands of prepared dads who refuse to leave fatherhood to chance.
          </Text>
          <Link href="/(auth)/signup" asChild>
            <Pressable style={({ pressed }) => [styles.ctaWrapper, { backgroundColor: colors.accent }, pressed && styles.ctaPressed]}>
              <Text style={styles.ctaText}>Get Started Free</Text>
              <ArrowRight size={18} color="#fff" />
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 24 },

  heroSection: { alignItems: 'center', marginBottom: 56 },
  preLabel: { fontFamily: 'Jakarta-Bold', fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', marginBottom: 16 },
  heroTitle: { fontFamily: 'Jakarta-ExtraBold', fontSize: 30, textAlign: 'center', marginBottom: 10, letterSpacing: -0.5 },
  heroSubtitle: { fontFamily: 'Jakarta-Medium', fontSize: 16, textAlign: 'center', marginBottom: 14 },
  heroDescription: { fontFamily: 'Jakarta-Regular', fontSize: 15, textAlign: 'center', lineHeight: 23, maxWidth: 320, marginBottom: 28 },

  ctaWrapper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, alignSelf: 'center', borderRadius: 12, paddingVertical: 15, paddingHorizontal: 36 },
  ctaPressed: { opacity: 0.85, transform: [{ scale: 0.97 }] },
  ctaText: { fontFamily: 'Jakarta-Bold', fontSize: 15, color: '#fff' },

  signInRow: { flexDirection: 'row', alignItems: 'center', marginTop: 18, marginBottom: 28 },
  signInLabel: { fontFamily: 'Jakarta-Regular', fontSize: 14 },
  signInLink: { fontFamily: 'Jakarta-SemiBold', fontSize: 14 },

  statsRow: { flexDirection: 'row', justifyContent: 'center', gap: 24 },
  statItem: { alignItems: 'center' },
  statValue: { fontFamily: 'Jakarta-ExtraBold', fontSize: 20, marginBottom: 2 },
  statLabel: { fontFamily: 'Jakarta-Regular', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8 },

  section: { marginBottom: 56 },
  sectionPreLabel: { fontFamily: 'Jakarta-Bold', fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 },
  sectionTitle: { fontFamily: 'Jakarta-Bold', fontSize: 26, textAlign: 'center', lineHeight: 34, marginBottom: 24, letterSpacing: -0.4 },

  featuresGrid: { gap: 10 },
  featureCard: { padding: 18, borderRadius: 16, borderWidth: 1 },
  featureIconContainer: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  featureTitle: { fontFamily: 'Jakarta-SemiBold', fontSize: 15.5, marginBottom: 5 },
  featureDescription: { fontFamily: 'Jakarta-Regular', fontSize: 14, lineHeight: 21 },

  stepRow: { flexDirection: 'row', marginBottom: 22 },
  stepNumberContainer: { alignItems: 'center', marginRight: 16, width: 34 },
  stepNumberCircle: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  stepNumber: { fontFamily: 'Jakarta-Bold', fontSize: 15, color: '#fff' },
  stepLine: { width: 1, flex: 1, marginTop: 6, borderRadius: 1 },
  stepContent: { flex: 1, paddingTop: 4 },
  stepTitle: { fontFamily: 'Jakarta-SemiBold', fontSize: 15.5, marginBottom: 4 },
  stepDescription: { fontFamily: 'Jakarta-Regular', fontSize: 14, lineHeight: 21 },

  highlightCard: { padding: 18, borderRadius: 16, borderWidth: 1, marginBottom: 10 },
  quoteText: { fontFamily: 'Jakarta-Regular', fontSize: 14.5, lineHeight: 22, marginTop: 12 },
  attributionRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatarCircle: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  authorName: { fontFamily: 'Jakarta-SemiBold', fontSize: 13 },
  authorContext: { fontFamily: 'Jakarta-Regular', fontSize: 11, marginTop: 1 },

  finalCta: { alignItems: 'center', paddingTop: 24, marginBottom: 24 },
  finalCtaTitle: { fontFamily: 'Jakarta-Bold', fontSize: 26, textAlign: 'center', lineHeight: 34, marginBottom: 12, letterSpacing: -0.4 },
  finalCtaSubtitle: { fontFamily: 'Jakarta-Regular', fontSize: 15, textAlign: 'center', lineHeight: 23, maxWidth: 300, marginBottom: 24 },
})
