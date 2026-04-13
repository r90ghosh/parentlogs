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
import { LinearGradient } from 'expo-linear-gradient'
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
import { GlassCard } from '@/components/glass'
import { CardEntrance, StaggerList } from '@/components/animations'

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
  const insets = useSafeAreaInsets()

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#12100e', '#1a1714', '#12100e']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.orbContainer} pointerEvents="none">
        <View style={styles.orbCopper} />
        <View style={styles.orbGold} />
      </View>

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
        <Animated.View entering={FadeIn.duration(600)} style={styles.heroSection}>
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

          <Link href="/(auth)/signup" asChild>
            <Pressable style={({ pressed }) => [styles.ctaWrapper, pressed && styles.ctaPressed]}>
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

          <View style={styles.signInRow}>
            <Text style={styles.signInLabel}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <Pressable>
                <Text style={styles.signInLink}>Sign In</Text>
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
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Features */}
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
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </GlassCard>
              </CardEntrance>
            ))}
          </View>
        </View>

        {/* How It Works */}
        <View style={styles.section}>
          <CardEntrance delay={100}>
            <Text style={styles.sectionPreLabel}>HOW IT WORKS</Text>
            <Text style={styles.sectionTitle}>Up and running{'\n'}in 2 minutes</Text>
          </CardEntrance>
          <StaggerList staggerMs={100}>
            {STEPS.map((step) => (
              <View key={step.number} style={styles.stepRow}>
                <View style={styles.stepNumberContainer}>
                  <LinearGradient colors={['#c4703f', '#d4a853']} style={styles.stepNumberGradient}>
                    <Text style={styles.stepNumber}>{step.number}</Text>
                  </LinearGradient>
                  {step.number !== '3' && <View style={styles.stepLine} />}
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                </View>
              </View>
            ))}
          </StaggerList>
        </View>

        {/* Inside The App */}
        <View style={styles.section}>
          <CardEntrance delay={100}>
            <Text style={styles.sectionPreLabel}>INSIDE THE APP</Text>
            <Text style={styles.sectionTitle}>Your Roadmap{'\n'}at Every Stage</Text>
          </CardEntrance>
          {APP_HIGHLIGHTS.map((highlight, index) => (
            <CardEntrance key={highlight.week} delay={200 + index * 120}>
              <GlassCard style={styles.highlightCard}>
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
                    <Text style={styles.authorContext}>{highlight.title}</Text>
                  </View>
                </View>
                <Text style={styles.quoteText}>{highlight.quote}</Text>
              </GlassCard>
            </CardEntrance>
          ))}
        </View>

        {/* Final CTA */}
        <View style={[styles.section, styles.finalCta]}>
          <CardEntrance delay={100}>
            <Text style={styles.finalCtaTitle}>Ready to stop{'\n'}winging it?</Text>
            <Text style={styles.finalCtaSubtitle}>
              Join thousands of prepared dads who refuse to leave fatherhood to chance.
            </Text>
            <Link href="/(auth)/signup" asChild>
              <Pressable style={({ pressed }) => [styles.ctaWrapper, pressed && styles.ctaPressed]}>
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
          </CardEntrance>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#12100e' },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 24 },

  orbContainer: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
  orbCopper: { position: 'absolute', width: 300, height: 300, top: '8%', right: -100, borderRadius: 150, backgroundColor: 'rgba(196,112,63,0.06)' },
  orbGold: { position: 'absolute', width: 200, height: 200, top: '35%', left: -60, borderRadius: 100, backgroundColor: 'rgba(212,168,83,0.04)' },

  heroSection: { alignItems: 'center', marginBottom: 56 },
  preLabel: { fontFamily: 'Karla-SemiBold', fontSize: 11, color: '#c4703f', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 },
  heroTitle: { fontFamily: 'PlayfairDisplay-Bold', fontSize: 36, color: '#faf6f0', textAlign: 'center', marginBottom: 12 },
  heroSubtitle: { fontFamily: 'Jost-Medium', fontSize: 18, color: '#c4703f', textAlign: 'center', marginBottom: 16 },
  heroDescription: { fontFamily: 'Jost-Regular', fontSize: 15, color: '#7a6f62', textAlign: 'center', lineHeight: 24, maxWidth: 320, marginBottom: 32 },

  ctaWrapper: { alignSelf: 'center', borderRadius: 14, overflow: 'hidden', shadowColor: '#c4703f', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  ctaPressed: { opacity: 0.85, transform: [{ scale: 0.97 }] },
  ctaGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, paddingHorizontal: 40, borderRadius: 14 },
  ctaText: { fontFamily: 'Karla-SemiBold', fontSize: 16, color: '#12100e', letterSpacing: 0.5 },

  signInRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 32 },
  signInLabel: { fontFamily: 'Karla-Regular', fontSize: 14, color: '#7a6f62' },
  signInLink: { fontFamily: 'Karla-SemiBold', fontSize: 14, color: '#c4703f' },

  statsRow: { flexDirection: 'row', justifyContent: 'center', gap: 24 },
  statItem: { alignItems: 'center' },
  statValue: { fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: '#faf6f0', marginBottom: 2 },
  statLabel: { fontFamily: 'Karla-Regular', fontSize: 11, color: '#7a6f62', textTransform: 'uppercase', letterSpacing: 0.8 },

  section: { marginBottom: 56 },
  sectionPreLabel: { fontFamily: 'Karla-SemiBold', fontSize: 11, color: '#c4703f', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', marginBottom: 12 },
  sectionTitle: { fontFamily: 'PlayfairDisplay-Bold', fontSize: 28, color: '#faf6f0', textAlign: 'center', lineHeight: 36, marginBottom: 28 },

  featuresGrid: { gap: 12 },
  featureCard: { padding: 20 },
  featureIconContainer: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(196,112,63,0.1)', borderWidth: 1, borderColor: 'rgba(196,112,63,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  featureTitle: { fontFamily: 'Karla-SemiBold', fontSize: 16, color: '#faf6f0', marginBottom: 6 },
  featureDescription: { fontFamily: 'Jost-Regular', fontSize: 14, color: '#7a6f62', lineHeight: 21 },

  stepRow: { flexDirection: 'row', marginBottom: 24 },
  stepNumberContainer: { alignItems: 'center', marginRight: 16, width: 36 },
  stepNumberGradient: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  stepNumber: { fontFamily: 'Karla-SemiBold', fontSize: 16, color: '#12100e' },
  stepLine: { width: 2, flex: 1, backgroundColor: 'rgba(196,112,63,0.2)', marginTop: 8, borderRadius: 1 },
  stepContent: { flex: 1, paddingTop: 4 },
  stepTitle: { fontFamily: 'Karla-SemiBold', fontSize: 16, color: '#faf6f0', marginBottom: 4 },
  stepDescription: { fontFamily: 'Jost-Regular', fontSize: 14, color: '#7a6f62', lineHeight: 21 },

  highlightCard: { padding: 20, marginBottom: 12 },
  quoteText: { fontFamily: 'Jost-Regular', fontSize: 15, color: '#ede6dc', lineHeight: 24, fontStyle: 'italic', marginTop: 12 },
  attributionRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatarCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  authorName: { fontFamily: 'Karla-SemiBold', fontSize: 13, color: '#faf6f0' },
  authorContext: { fontFamily: 'Karla-Regular', fontSize: 11, color: '#7a6f62', marginTop: 1 },

  finalCta: { alignItems: 'center', paddingTop: 24, marginBottom: 24 },
  finalCtaTitle: { fontFamily: 'PlayfairDisplay-Bold', fontSize: 30, color: '#faf6f0', textAlign: 'center', lineHeight: 40, marginBottom: 12 },
  finalCtaSubtitle: { fontFamily: 'Jost-Regular', fontSize: 15, color: '#7a6f62', textAlign: 'center', lineHeight: 24, maxWidth: 300, marginBottom: 28 },
})
