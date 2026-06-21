import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  X,
  Zap,
  Scale,
  Heart,
  Users,
  ArrowRight,
} from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { useColors } from '@/hooks/use-colors'
import { SectionLabel } from '@/components/digest'

const VALUES = [
  {
    icon: Zap,
    title: 'Speed to Value',
    description:
      'Useful content within 60 seconds. No fluff — just specific numbers and actionable guidance.',
    colorKey: 'copper' as const,
  },
  {
    icon: Scale,
    title: 'Neutral Third Party',
    description:
      'The app is the authority, not either partner. Data-backed, judgment-free guidance.',
    colorKey: 'sky' as const,
  },
  {
    icon: Heart,
    title: 'Dad-First, Not Dad-Only',
    description:
      'Designed for dads but built for the whole family. Moms get tailored content and the same tools.',
    colorKey: 'rose' as const,
  },
  {
    icon: Users,
    title: 'One Family, One Subscription',
    description:
      'Both partners share full access with a single plan. No double billing, no separate accounts.',
    colorKey: 'gold' as const,
  },
]

export default function AboutScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const colors = useColors()

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Text style={[styles.headerTitle, { color: colors.ink }]}>About</Text>
          <Pressable onPress={() => router.back()} style={[styles.closeButton, { backgroundColor: colors.accentSoft }]}>
            <X size={20} color={colors.muted} />
          </Pressable>
        </View>

        {/* Hero */}
        <View style={styles.heroSection}>
          <Text style={[styles.heroLabel, { color: colors.accent }]}>OUR MISSION</Text>
          <Text style={[styles.heroTitle, { color: colors.ink }]}>
            Built by dads, for dads who refuse to wing it
          </Text>
          <Text style={[styles.heroDescription, { color: colors.muted }]}>
            Fatherhood shouldn't feel like improvisation. The Dad Center gives
            you week-by-week guidance, actionable tasks, and partner sync — so
            you show up prepared, not panicked.
          </Text>
        </View>

        {/* Values */}
        <SectionLabel>What We Believe</SectionLabel>
        {VALUES.map((value) => {
          const iconColor = colors[value.colorKey]
          const dimKey = `${value.colorKey}Dim` as keyof typeof colors
          const bgColor = colors[dimKey] as string
          return (
            <View key={value.title} style={[styles.valueCard, { backgroundColor: colors.card, borderColor: colors.line }]}>
              <View style={styles.valueContent}>
                <View style={[styles.valueIconCircle, { backgroundColor: bgColor }]}>
                  <value.icon size={20} color={iconColor} />
                </View>
                <View style={styles.valueText}>
                  <Text style={[styles.valueTitle, { color: colors.ink }]}>{value.title}</Text>
                  <Text style={[styles.valueDescription, { color: colors.muted }]}>
                    {value.description}
                  </Text>
                </View>
              </View>
            </View>
          )
        })}

        {/* Story */}
        <SectionLabel>The Story</SectionLabel>
        <View style={[styles.storyCard, { backgroundColor: colors.card, borderColor: colors.line }]}>
          <Text style={[styles.storyHeading, { color: colors.ink }]}>
            Why The Dad Center exists
          </Text>
          <Text style={[styles.storyParagraph, { color: colors.muted }]}>
            When one dad found out he was going to be a father, he did what
            any engineer would do — he went looking for a system. A
            week-by-week playbook. Something that respected his intelligence.
          </Text>
          <Text style={[styles.storyParagraph, { color: colors.muted }]}>
            He found baby trackers designed for moms, forums full of
            conflicting advice, and apps that assumed dads were secondary
            passengers.
          </Text>
          <Text style={[styles.storyHighlight, { color: colors.ink2 }]}>
            So he built The Dad Center — the operating system for modern
            fatherhood. No fluff. No condescension. Just the tools to be
            the dad you want to be.
          </Text>
        </View>

        {/* CTA */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
            router.push('/(screens)/upgrade')
          }}
          style={({ pressed }) => [
            styles.ctaCard,
            { backgroundColor: colors.accentSoft, borderColor: colors.line },
            pressed && { opacity: 0.85 },
          ]}
        >
          <View style={styles.ctaContent}>
            <Text style={[styles.ctaTitle, { color: colors.accentInk }]}>Ready to stop winging it?</Text>
            <Text style={[styles.ctaSubtitle, { color: colors.muted }]}>
              Free to start — no credit card required
            </Text>
          </View>
          <ArrowRight size={20} color={colors.accentInk} />
        </Pressable>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
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
    fontFamily: 'Jakarta-SemiBold',
    fontSize: 16,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  // Hero
  heroSection: {
    marginBottom: 8,
  },
  heroLabel: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: 12,
  },
  heroTitle: {
    fontFamily: 'Jakarta-ExtraBold',
    fontSize: 24,
    lineHeight: 32,
    marginBottom: 14,
    letterSpacing: -0.4,
  },
  heroDescription: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 15,
    lineHeight: 24,
  },

  // Values
  valueCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 8,
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
    fontFamily: 'Jakarta-Bold',
    fontSize: 15.5,
    marginBottom: 4,
  },
  valueDescription: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 14,
    lineHeight: 21,
  },

  // Story
  storyCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 4,
  },
  storyHeading: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 18,
    marginBottom: 16,
  },
  storyParagraph: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },
  storyHighlight: {
    fontFamily: 'Jakarta-Medium',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 4,
  },

  // CTA
  ctaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 24,
  },
  ctaContent: {
    flex: 1,
  },
  ctaTitle: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 15.5,
  },
  ctaSubtitle: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 13,
    marginTop: 2,
  },
})
