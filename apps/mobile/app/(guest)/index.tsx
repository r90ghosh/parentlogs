import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  Newspaper,
  Video,
  ChevronRight,
  ArrowRight,
} from 'lucide-react-native'
import { BrandLogoIcon } from '@/components/BrandLogo'
import { useColors } from '@/hooks/use-colors'

const CONTENT_SECTIONS = [
  {
    title: 'Blog',
    description: 'Evidence-based guides on pregnancy, birth, and early parenting.',
    icon: Newspaper,
    route: '/(tabs)/more/content' as const,
    accentColor: '#5b9bd5',
    accentBg: 'rgba(91,155,213,0.12)',
  },
  {
    title: 'Video Library',
    description: 'Curated videos covering every stage of the journey.',
    icon: Video,
    route: '/(tabs)/more/videos' as const,
    accentColor: '#d4a853',
    accentBg: 'rgba(212,168,83,0.12)',
  },
]

export default function GuestExploreScreen() {
  const colors = useColors()
  const insets = useSafeAreaInsets()
  const router = useRouter()

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: colors.line }]}>
        <View style={styles.headerLeft}>
          <BrandLogoIcon size={28} />
          <Text style={[styles.headerTitle, { color: colors.ink }]}>The Dad Center</Text>
        </View>
        <Pressable
          onPress={() => router.push('/(auth)/signup')}
          style={({ pressed }) => [styles.signUpButton, { backgroundColor: colors.accent, opacity: pressed ? 0.85 : 1 }]}
        >
          <Text style={styles.signUpText}>Sign Up</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome */}
        <View>
          <Text style={[styles.sectionPreLabel, { color: colors.accent }]}>GUEST MODE</Text>
          <Text style={[styles.welcomeTitle, { color: colors.ink }]}>
            Explore what's{'\n'}inside
          </Text>
          <Text style={[styles.welcomeSubtitle, { color: colors.muted }]}>
            Browse our content library. Sign up to unlock personalized
            briefings, task tracking, and partner sync.
          </Text>
        </View>

        {/* Content cards */}
        {CONTENT_SECTIONS.map((section) => (
          <Pressable
            key={section.title}
            onPress={() => router.push(section.route)}
            style={({ pressed }) => [styles.contentCard, { backgroundColor: colors.card, borderColor: colors.line, opacity: pressed ? 0.85 : 1 }]}
          >
            <View style={styles.cardRow}>
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: section.accentBg,
                    borderColor: colors.line,
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
                <Text style={[styles.cardTitle, { color: colors.ink }]}>{section.title}</Text>
                <Text style={[styles.cardDescription, { color: colors.muted }]}>
                  {section.description}
                </Text>
              </View>
              <ChevronRight size={18} color={colors.faint} />
            </View>
          </Pressable>
        ))}

        {/* Sign up nudge */}
        <View style={[styles.nudgeCard, { backgroundColor: colors.accentSoft, borderColor: colors.line }]}>
          <Text style={[styles.nudgeTitle, { color: colors.ink }]}>
            Ready for the full experience?
          </Text>
          <Text style={[styles.nudgeSubtitle, { color: colors.ink2 }]}>
            Get personalized weekly briefings, smart task management, and
            partner sync — all tailored to your due date.
          </Text>
          <Pressable
            onPress={() => router.push('/(auth)/signup')}
            style={({ pressed }) => [styles.nudgeButton, { backgroundColor: colors.accent, opacity: pressed ? 0.85 : 1 }]}
          >
            <Text style={styles.nudgeButtonText}>Create Free Account</Text>
            <ArrowRight size={16} color="#fff" />
          </Pressable>
        </View>
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
    fontFamily: 'Jakarta-Bold',
    fontSize: 17,
  },
  signUpButton: {
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  signUpText: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 13,
    color: '#fff',
  },

  // Welcome
  sectionPreLabel: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 28,
    marginBottom: 12,
  },
  welcomeTitle: {
    fontFamily: 'Jakarta-ExtraBold',
    fontSize: 28,
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
    alignSelf: 'center',
    marginBottom: 28,
  },

  // Content cards
  contentCard: {
    padding: 16,
    marginBottom: 10,
    borderRadius: 16,
    borderWidth: 1,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 13,
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
    fontFamily: 'Jakarta-SemiBold',
    fontSize: 15.5,
    marginBottom: 3,
  },
  cardDescription: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 13,
    lineHeight: 19,
  },

  // Nudge card
  nudgeCard: {
    padding: 22,
    marginTop: 10,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  nudgeTitle: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  nudgeSubtitle: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 20,
  },
  nudgeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 28,
  },
  nudgeButtonText: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 14,
    color: '#fff',
  },
})
