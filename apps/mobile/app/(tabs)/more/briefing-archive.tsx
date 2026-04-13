import { useMemo } from 'react'
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SectionList,
  ActivityIndicator,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ArrowLeft, BookOpen, ChevronRight } from 'lucide-react-native'
import { useBriefingsList } from '@/hooks/use-briefings'
import { useAuth } from '@/components/providers/AuthProvider'
import { GlassCard } from '@/components/glass'
import { CardEntrance } from '@/components/animations'
import type { BriefingTemplate } from '@tdc/shared/types'
import { useColors } from '@/hooks/use-colors'

const STAGE_ORDER = [
  'first-trimester',
  'second-trimester',
  'third-trimester',
  '0-3-months',
  '3-6-months',
  '6-12-months',
  '12-18-months',
  '18-plus',
]

const STAGE_LABELS: Record<string, string> = {
  'first-trimester': 'First Trimester',
  'second-trimester': 'Second Trimester',
  'third-trimester': 'Third Trimester',
  '0-3-months': '0\u20133 Months',
  '3-6-months': '3\u20136 Months',
  '6-12-months': '6\u201312 Months',
  '12-18-months': '12\u201318 Months',
  '18-plus': '18+ Months',
}

interface BriefingSection {
  title: string
  data: BriefingTemplate[]
}

export default function BriefingArchiveScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { family } = useAuth()
  const colors = useColors()
  const { data: briefings, isLoading } = useBriefingsList()

  const currentWeek = family?.current_week ?? null

  const sections = useMemo<BriefingSection[]>(() => {
    if (!briefings?.length) return []

    const grouped = new Map<string, BriefingTemplate[]>()
    for (const briefing of briefings) {
      const stage = briefing.stage
      if (!grouped.has(stage)) {
        grouped.set(stage, [])
      }
      grouped.get(stage)!.push(briefing)
    }

    return STAGE_ORDER.filter((stage) => grouped.has(stage)).map((stage) => ({
      title: STAGE_LABELS[stage] ?? stage,
      data: grouped.get(stage)!,
    }))
  }, [briefings])

  function handleBriefingPress(week: number) {
    router.push({
      pathname: '/(tabs)/briefing/[weekId]',
      params: { weekId: String(week) },
    })
  }

  const renderSectionHeader = ({ section }: { section: BriefingSection }) => (
    <Text style={[styles.sectionHeader, { color: colors.textMuted }]}>{section.title}</Text>
  )

  const renderItem = ({
    item,
    index,
  }: {
    item: BriefingTemplate
    index: number
  }) => {
    const isCurrentWeek = currentWeek !== null && item.week === currentWeek
    return (
      <CardEntrance delay={index * 60}>
        <Pressable onPress={() => handleBriefingPress(item.week)}>
          <GlassCard style={styles.briefingCard}>
            <View style={styles.briefingRow}>
              <View style={[styles.weekBadge, { backgroundColor: colors.copperDim }]}>
                <Text style={[styles.weekBadgeText, { color: colors.copper }]}>W{item.week}</Text>
              </View>
              <View style={styles.briefingInfo}>
                <Text style={[styles.briefingTitle, { color: colors.textSecondary }]} numberOfLines={2}>
                  {item.title}
                </Text>
                {isCurrentWeek && (
                  <View style={[styles.currentWeekBadge, { backgroundColor: colors.copperDim }]}>
                    <Text style={[styles.currentWeekText, { color: colors.copper }]}>THIS WEEK</Text>
                  </View>
                )}
              </View>
              <ChevronRight size={18} color={colors.textDim} />
            </View>
          </GlassCard>
        </Pressable>
      </CardEntrance>
    )
  }

  const archiveHeader = (
    <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
      <Pressable onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.subtleBg }]}>
        <ArrowLeft size={20} color={colors.textSecondary} />
      </Pressable>
      <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Briefing Archive</Text>
      <View style={styles.headerSpacer} />
    </View>
  )

  return (
    <View style={styles.container}>
      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          {archiveHeader}
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color={colors.copper} size="large" />
          </View>
        </View>
      ) : sections.length === 0 ? (
        <View style={styles.emptyContainer}>
          {archiveHeader}
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 12 }}>
            <BookOpen size={40} color={colors.textDim} />
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No briefings available yet</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              Briefings will appear here as your journey progresses
            </Text>
          </View>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.briefing_id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          ListHeaderComponent={archiveHeader}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
  },
  headerSpacer: {
    width: 36,
  },

  // Section list
  listContent: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginTop: 20,
    marginBottom: 10,
  },

  // Briefing card
  briefingCard: {
    padding: 16,
    marginBottom: 8,
  },
  briefingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weekBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekBadgeText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 14,
  },
  briefingInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  briefingTitle: {
    fontFamily: 'Karla-Medium',
    fontSize: 15,
  },
  currentWeekBadge: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  currentWeekText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 10,
  },

  // Loading / Empty
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 20,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    textAlign: 'center',
  },
})
