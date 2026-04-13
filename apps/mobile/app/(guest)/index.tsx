import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { FadeIn } from 'react-native-reanimated'
import {
  Baby,
  Newspaper,
  Video,
  ChevronRight,
  ArrowRight,
} from 'lucide-react-native'
import { BrandLogoIcon } from '@/components/BrandLogo'
import { GlassCard } from '@/components/glass'
import { CardEntrance } from '@/components/animations'
import { useColors } from '@/hooks/use-colors'

const CONTENT_SECTIONS = [
  {
    title: 'Pregnancy Week Guide',
    description: '40 weeks of development milestones, trimester by trimester.',
    icon: Baby,
    route: '/(screens)/pregnancy-weeks' as const,
    accentKey: 'copper' as const,
  },
  {
    title: 'Blog',
    description: 'Evidence-based guides on pregnancy, birth, and early parenting.',
    icon: Newspaper,
    route: '/(screens)/content' as const,
    accentKey: 'sky' as const,
  },
  {
    title: 'Video Library',
    description: 'Curated videos covering every stage of the journey.',
    icon: Video,
    route: '/(screens)/videos' as const,
    accentKey: 'gold' as const,
  },
]

export default function GuestExploreScreen() {
  const colors = useColors()
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const accentMap = {
    copper: { color: colors.copper, bg: colors.copperDim, border: colors.copperGlow },
    sky: { color: colors.sky, bg: colors.skyDim, border: colors.sky },
    gold: { color: colors.gold, bg: colors.goldDim, border: colors.goldGlow },
  }

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      {/* Header */}
      <Animated.View
        entering={FadeIn.duration(400)}
        style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: colors.subtleBg }]}
      >
        <View style={styles.headerLeft}>
          <BrandLogoIcon size={28} />
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>The Dad Center</Text>
        </View>
        <Pressable
          onPress={() => router.push('/(auth)/signup')}
          style={styles.signUpButton}
        >
          <LinearGradient
            colors={colors.ctaGradient as unknown as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.signUpGradient}
          >
            <Text style={[styles.signUpText, { color: colors.bg }]}>Sign Up</Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome */}
        <CardEntrance delay={100}>
          <Text style={[styles.sectionPreLabel, { color: colors.copper }]}>GUEST MODE</Text>
          <Text style={[styles.welcomeTitle, { color: colors.textPrimary }]}>
            Explore what's{'\n'}inside
          </Text>
          <Text style={[styles.welcomeSubtitle, { color: colors.textMuted }]}>
            Browse our content library. Sign up to unlock personalized
            briefings, task tracking, and partner sync.
          </Text>
        </CardEntrance>

        {/* Content cards */}
        {CONTENT_SECTIONS.map((section, index) => {
          const accent = accentMap[section.accentKey]
          return (
            <CardEntrance key={section.title} delay={200 + index * 120}>
              <Pressable onPress={() => router.push(section.route)}>
                <GlassCard style={styles.contentCard}>
                  <View style={styles.cardRow}>
                    <View
                      style={[
                        styles.iconContainer,
                        {
                          backgroundColor: accent.bg,
                          borderColor: accent.border,
                        },
                      ]}
                    >
                      <section.icon
                        size={22}
                        color={accent.color}
                        strokeWidth={1.5}
                      />
                    </View>
                    <View style={styles.cardInfo}>
                      <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{section.title}</Text>
                      <Text style={[styles.cardDescription, { color: colors.textMuted }]}>
                        {section.description}
                      </Text>
                    </View>
                    <ChevronRight size={18} color={colors.textDim} />
                  </View>
                </GlassCard>
              </Pressable>
            </CardEntrance>
          )
        })}

        {/* Sign up nudge */}
        <CardEntrance delay={600}>
          <GlassCard style={[styles.nudgeCard, { borderColor: colors.copperGlow }]}>
            <Text style={[styles.nudgeTitle, { color: colors.textPrimary }]}>
              Ready for the full experience?
            </Text>
            <Text style={[styles.nudgeSubtitle, { color: colors.textMuted }]}>
              Get personalized weekly briefings, smart task management, and
              partner sync — all tailored to your due date.
            </Text>
            <Pressable
              onPress={() => router.push('/(auth)/signup')}
              style={styles.nudgeButton}
            >
              <LinearGradient
                colors={colors.ctaGradient as unknown as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.nudgeGradient}
              >
                <Text style={[styles.nudgeButtonText, { color: colors.bg }]}>Create Free Account</Text>
                <ArrowRight size={16} color={colors.bg} />
              </LinearGradient>
            </Pressable>
          </GlassCard>
        </CardEntrance>
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
    paddingHorizontal: 20,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 18,
  },
  signUpButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  signUpGradient: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  signUpText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 13,
    letterSpacing: 0.3,
  },

  // Welcome
  sectionPreLabel: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 28,
    marginBottom: 12,
  },
  welcomeTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 30,
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
    alignSelf: 'center',
    marginBottom: 28,
  },

  // Content cards
  contentCard: {
    padding: 16,
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  cardTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
    marginBottom: 4,
  },
  cardDescription: {
    fontFamily: 'Jost-Regular',
    fontSize: 13,
    lineHeight: 19,
  },

  // Nudge card
  nudgeCard: {
    padding: 24,
    marginTop: 12,
    borderWidth: 1,
  },
  nudgeTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 8,
  },
  nudgeSubtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  nudgeButton: {
    alignSelf: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#c4703f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  nudgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  nudgeButtonText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 15,
    letterSpacing: 0.3,
  },
})
