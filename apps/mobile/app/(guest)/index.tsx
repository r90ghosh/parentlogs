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

const CONTENT_SECTIONS = [
  {
    title: 'Pregnancy Week Guide',
    description: '40 weeks of development milestones, trimester by trimester.',
    icon: Baby,
    route: '/(screens)/pregnancy-weeks' as const,
    accentColor: '#c4703f',
    accentBg: 'rgba(196,112,63,0.12)',
    accentBorder: 'rgba(196,112,63,0.2)',
  },
  {
    title: 'Articles',
    description: 'Evidence-based guides on pregnancy, birth, and early parenting.',
    icon: Newspaper,
    route: '/(screens)/content' as const,
    accentColor: '#5b9bd5',
    accentBg: 'rgba(91,155,213,0.12)',
    accentBorder: 'rgba(91,155,213,0.2)',
  },
  {
    title: 'Video Library',
    description: 'Curated videos covering every stage of the journey.',
    icon: Video,
    route: '/(screens)/videos' as const,
    accentColor: '#d4a853',
    accentBg: 'rgba(212,168,83,0.12)',
    accentBorder: 'rgba(212,168,83,0.2)',
  },
]

export default function GuestExploreScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#12100e', '#1a1714', '#12100e']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <Animated.View
        entering={FadeIn.duration(400)}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <View style={styles.headerLeft}>
          <BrandLogoIcon size={28} />
          <Text style={styles.headerTitle}>The Dad Center</Text>
        </View>
        <Pressable
          onPress={() => router.push('/(auth)/signup')}
          style={styles.signUpButton}
        >
          <LinearGradient
            colors={['#c4703f', '#d4a853']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.signUpGradient}
          >
            <Text style={styles.signUpText}>Sign Up</Text>
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
          <Text style={styles.sectionPreLabel}>GUEST MODE</Text>
          <Text style={styles.welcomeTitle}>
            Explore what's{'\n'}inside
          </Text>
          <Text style={styles.welcomeSubtitle}>
            Browse our content library. Sign up to unlock personalized
            briefings, task tracking, and partner sync.
          </Text>
        </CardEntrance>

        {/* Content cards */}
        {CONTENT_SECTIONS.map((section, index) => (
          <CardEntrance key={section.title} delay={200 + index * 120}>
            <Pressable onPress={() => router.push(section.route)}>
              <GlassCard style={styles.contentCard}>
                <View style={styles.cardRow}>
                  <View
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor: section.accentBg,
                        borderColor: section.accentBorder,
                      },
                    ]}
                  >
                    <section.icon
                      size={22}
                      color={section.accentColor}
                      strokeWidth={1.5}
                    />
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{section.title}</Text>
                    <Text style={styles.cardDescription}>
                      {section.description}
                    </Text>
                  </View>
                  <ChevronRight size={18} color="#4a4239" />
                </View>
              </GlassCard>
            </Pressable>
          </CardEntrance>
        ))}

        {/* Sign up nudge */}
        <CardEntrance delay={600}>
          <GlassCard style={styles.nudgeCard}>
            <Text style={styles.nudgeTitle}>
              Ready for the full experience?
            </Text>
            <Text style={styles.nudgeSubtitle}>
              Get personalized weekly briefings, smart task management, and
              partner sync — all tailored to your due date.
            </Text>
            <Pressable
              onPress={() => router.push('/(auth)/signup')}
              style={styles.nudgeButton}
            >
              <LinearGradient
                colors={['#c4703f', '#d4a853']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.nudgeGradient}
              >
                <Text style={styles.nudgeButtonText}>Create Free Account</Text>
                <ArrowRight size={16} color="#12100e" />
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
    backgroundColor: '#12100e',
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
    borderBottomColor: 'rgba(237,230,220,0.06)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 18,
    color: '#faf6f0',
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
    color: '#12100e',
    letterSpacing: 0.3,
  },

  // Welcome
  sectionPreLabel: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 11,
    color: '#c4703f',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 28,
    marginBottom: 12,
  },
  welcomeTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 30,
    color: '#faf6f0',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 15,
    color: '#7a6f62',
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
    color: '#faf6f0',
    marginBottom: 4,
  },
  cardDescription: {
    fontFamily: 'Jost-Regular',
    fontSize: 13,
    color: '#7a6f62',
    lineHeight: 19,
  },

  // Nudge card
  nudgeCard: {
    padding: 24,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(196,112,63,0.2)',
  },
  nudgeTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 20,
    color: '#faf6f0',
    textAlign: 'center',
    marginBottom: 8,
  },
  nudgeSubtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    color: '#7a6f62',
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
    color: '#12100e',
    letterSpacing: 0.3,
  },
})
