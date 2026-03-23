import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import {
  X,
  Zap,
  Scale,
  Heart,
  Users,
  ArrowRight,
} from 'lucide-react-native'
import { GlassCard } from '@/components/glass'
import { CardEntrance } from '@/components/animations'
import * as Haptics from 'expo-haptics'

const VALUES = [
  {
    icon: Zap,
    title: 'Speed to Value',
    description:
      'Useful content within 60 seconds. No fluff — just specific numbers and actionable guidance.',
    color: '#c4703f',
  },
  {
    icon: Scale,
    title: 'Neutral Third Party',
    description:
      'The app is the authority, not either partner. Data-backed, judgment-free guidance.',
    color: '#5b9bd5',
  },
  {
    icon: Heart,
    title: 'Dad-First, Not Dad-Only',
    description:
      'Designed for dads but built for the whole family. Moms get tailored content and the same tools.',
    color: '#c47a8f',
  },
  {
    icon: Users,
    title: 'One Family, One Subscription',
    description:
      'Both partners share full access with a single plan. No double billing, no separate accounts.',
    color: '#d4a853',
  },
]

export default function AboutScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#12100e', '#1a1714', '#12100e']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>About</Text>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <X size={20} color="#7a6f62" />
        </Pressable>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <CardEntrance delay={0}>
          <View style={styles.heroSection}>
            <Text style={styles.heroLabel}>OUR MISSION</Text>
            <Text style={styles.heroTitle}>
              Built by dads, for dads who refuse to wing it
            </Text>
            <Text style={styles.heroDescription}>
              Fatherhood shouldn't feel like improvisation. The Dad Center gives
              you week-by-week guidance, actionable tasks, and partner sync — so
              you show up prepared, not panicked.
            </Text>
          </View>
        </CardEntrance>

        {/* Values */}
        <CardEntrance delay={120}>
          <Text style={styles.sectionTitle}>What We Believe</Text>
          {VALUES.map((value, index) => (
            <GlassCard key={value.title} style={styles.valueCard}>
              <View style={styles.valueContent}>
                <View
                  style={[
                    styles.valueIconCircle,
                    { backgroundColor: `${value.color}15` },
                  ]}
                >
                  <value.icon size={20} color={value.color} />
                </View>
                <View style={styles.valueText}>
                  <Text style={styles.valueTitle}>{value.title}</Text>
                  <Text style={styles.valueDescription}>
                    {value.description}
                  </Text>
                </View>
              </View>
            </GlassCard>
          ))}
        </CardEntrance>

        {/* Story */}
        <CardEntrance delay={240}>
          <Text style={styles.sectionTitle}>The Story</Text>
          <GlassCard style={styles.storyCard}>
            <Text style={styles.storyHeading}>
              Why The Dad Center exists
            </Text>
            <Text style={styles.storyParagraph}>
              When one dad found out he was going to be a father, he did what
              any engineer would do — he went looking for a system. A
              week-by-week playbook. Something that respected his intelligence.
            </Text>
            <Text style={styles.storyParagraph}>
              He found baby trackers designed for moms, forums full of
              conflicting advice, and apps that assumed dads were secondary
              passengers.
            </Text>
            <Text style={styles.storyHighlight}>
              So he built The Dad Center — the operating system for modern
              fatherhood. No fluff. No condescension. Just the tools to be
              the dad you want to be.
            </Text>
          </GlassCard>
        </CardEntrance>

        {/* CTA */}
        <CardEntrance delay={360}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
              router.push('/(screens)/upgrade')
            }}
            style={styles.ctaCard}
          >
            <LinearGradient
              colors={['rgba(196,112,63,0.15)', 'rgba(212,168,83,0.1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaGradient}
            >
              <View style={styles.ctaContent}>
                <Text style={styles.ctaTitle}>Ready to stop winging it?</Text>
                <Text style={styles.ctaSubtitle}>
                  Free to start — no credit card required
                </Text>
              </View>
              <ArrowRight size={20} color="#c4703f" />
            </LinearGradient>
          </Pressable>
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
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
    color: '#faf6f0',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(237,230,220,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  // Hero
  heroSection: {
    marginBottom: 32,
  },
  heroLabel: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 11,
    color: '#c4703f',
    letterSpacing: 2,
    marginBottom: 12,
  },
  heroTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 26,
    color: '#faf6f0',
    lineHeight: 34,
    marginBottom: 14,
  },
  heroDescription: {
    fontFamily: 'Jost-Regular',
    fontSize: 15,
    color: '#7a6f62',
    lineHeight: 24,
  },

  // Section
  sectionTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 13,
    color: '#7a6f62',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
    marginTop: 8,
  },

  // Values
  valueCard: {
    padding: 16,
    marginBottom: 12,
  },
  valueContent: {
    flexDirection: 'row',
    gap: 14,
  },
  valueIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    flex: 1,
  },
  valueTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
    color: '#faf6f0',
    marginBottom: 4,
  },
  valueDescription: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    color: '#7a6f62',
    lineHeight: 21,
  },

  // Story
  storyCard: {
    padding: 20,
    marginBottom: 24,
  },
  storyHeading: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 20,
    color: '#faf6f0',
    marginBottom: 16,
  },
  storyParagraph: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    color: '#7a6f62',
    lineHeight: 22,
    marginBottom: 12,
  },
  storyHighlight: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    color: '#ede6dc',
    lineHeight: 22,
    marginTop: 4,
  },

  // CTA
  ctaCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(196,112,63,0.2)',
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  ctaContent: {
    flex: 1,
  },
  ctaTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
    color: '#c4703f',
  },
  ctaSubtitle: {
    fontFamily: 'Karla-Regular',
    fontSize: 13,
    color: '#7a6f62',
    marginTop: 2,
  },
})
