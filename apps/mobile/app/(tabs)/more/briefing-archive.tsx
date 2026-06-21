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
  '0-3-months': '0–3 Months',
  '3-6-months': '3–6 Months',
  '6-12-months': '6–12 Months',
  '12-18-months': '12–18 Months',
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
    <Text style={[styles.sectionHeader, { color: colors.faint }]}>{section.title}</Text>
  )

  const renderItem = ({ item }: { item: BriefingTemplate }) => {
    const isCurrentWeek = currentWeek !== null && item.week === currentWeek
    return (
      <Pressable
        onPress={() => handleBriefingPress(item.week)}
        style={({ pressed }) => [
          styles.briefingRow,
          { borderBottomColor: colors.line2, backgroundColor: pressed ? colors.cardHover : 'transparent' },
        ]}
      >
        <View style={[styles.weekBadge, { backgroundColor: colors.accentSoft }]}>
          <Text style={[styles.weekBadgeText, { color: colors.accentInk }]}>W{item.week}</Text>
        </View>
        <View style={styles.briefingInfo}>
          <Text style={[styles.briefingTitle, { color: colors.ink2 }]} numberOfLines={2}>
            {item.title}
          </Text>
          {isCurrentWeek && (
            <View style={[styles.currentWeekBadge, { backgroundColor: colors.accentSoft }]}>
              <Text style={[styles.currentWeekText, { color: colors.accentInk }]}>THIS WEEK</Text>
            </View>
          )}
        </View>
        <ChevronRight size={16} color={colors.faint} />
      </Pressable>
    )
  }

  const archiveHeader = (
    <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: colors.line }]}>
      <Pressable onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.card, borderColor: colors.line }]}>
        <ArrowLeft size={20} color={colors.ink2} />
      </Pressable>
      <Text style={[styles.headerTitle, { color: colors.ink }]}>Briefing Archive</Text>
      <View style={styles.headerSpacer} />
    </View>
  )

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          {archiveHeader}
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color={colors.accent} size="large" />
          </View>
        </View>
      ) : sections.length === 0 ? (
        <View style={styles.emptyContainer}>
          {archiveHeader}
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 12 }}>
            <BookOpen size={40} color={colors.faint} />
            <Text style={[styles.emptyTitle, { color: colors.ink }]}>No briefings available yet</Text>
            <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
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
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontFamily: 'Jakarta-SemiBold', fontSize: 16 },
  headerSpacer: { width: 38 },

  // Section list
  listContent: { paddingHorizontal: 0 },
  sectionHeader: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    marginTop: 20,
    marginBottom: 2,
    paddingHorizontal: 24,
  },

  // Row
  briefingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 12,
    borderBottomWidth: 1,
  },
  weekBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  weekBadgeText: { fontFamily: 'Jakarta-Bold', fontSize: 13 },
  briefingInfo: { flex: 1, minWidth: 0 },
  briefingTitle: { fontFamily: 'Jakarta-Medium', fontSize: 15 },
  currentWeekBadge: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  currentWeekText: { fontFamily: 'Jakarta-Bold', fontSize: 10, letterSpacing: 0.5 },

  // Loading / Empty
  loadingContainer: { flex: 1 },
  emptyContainer: { flex: 1 },
  emptyTitle: { fontFamily: 'Jakarta-Bold', fontSize: 18, textAlign: 'center' },
  emptySubtitle: { fontFamily: 'Jakarta-Regular', fontSize: 14, textAlign: 'center', lineHeight: 21 },
})
