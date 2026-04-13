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
import { Baby, ChevronRight } from 'lucide-react-native'
import { useBriefingsList } from '@/hooks/use-briefings'
import { useAuth } from '@/components/providers/AuthProvider'
import { GlassCard } from '@/components/glass'
import { CardEntrance } from '@/components/animations'
import type { BriefingTemplate } from '@tdc/shared/types'
import { ScreenHeader } from '@/components/ui'
import { useColors } from '@/hooks/use-colors'

interface WeekSection {
  title: string
  data: WeekItem[]
}

interface WeekItem {
  week: number
  title: string
  briefingId: string
  babyUpdate: string | null
}

const TRIMESTER_RANGES: { title: string; min: number; max: number }[] = [
  { title: 'First Trimester (Weeks 1\u201313)', min: 1, max: 13 },
  { title: 'Second Trimester (Weeks 14\u201327)', min: 14, max: 27 },
  { title: 'Third Trimester (Weeks 28\u201340)', min: 28, max: 40 },
]

export default function PregnancyWeeksScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { family } = useAuth()
  const colors = useColors()
  const { data: briefings, isLoading } = useBriefingsList()

  const currentWeek = family?.current_week ?? null

  const sections = useMemo<WeekSection[]>(() => {
    if (!briefings?.length) return []

    // Filter to pregnancy briefings only (PREG-W prefix, weeks 1-40)
    const pregnancyBriefings = briefings.filter(
      (b: BriefingTemplate) => b.briefing_id.startsWith('PREG-W') && b.week >= 1 && b.week <= 40
    )

    const weekMap = new Map<number, BriefingTemplate>()
    for (const b of pregnancyBriefings) {
      weekMap.set(b.week, b)
    }

    return TRIMESTER_RANGES.map((range) => {
      const items: WeekItem[] = []
      for (let w = range.min; w <= range.max; w++) {
        const briefing = weekMap.get(w)
        items.push({
          week: w,
          title: briefing?.title ?? `Week ${w}`,
          briefingId: briefing?.briefing_id ?? `PREG-W${String(w).padStart(2, '0')}`,
          babyUpdate: briefing?.baby_update ?? null,
        })
      }
      return { title: range.title, data: items }
    })
  }, [briefings])

  function handleWeekPress(week: number) {
    router.push({
      pathname: '/(tabs)/briefing/[weekId]',
      params: { weekId: String(week) },
    })
  }

  const renderSectionHeader = ({ section }: { section: WeekSection }) => (
    <Text style={[styles.sectionHeader, { color: colors.copper }]}>{section.title}</Text>
  )

  const renderItem = ({ item, index }: { item: WeekItem; index: number }) => {
    const isCurrentWeek = currentWeek !== null && item.week === currentWeek
    return (
      <CardEntrance delay={Math.min(index * 40, 400)}>
        <Pressable onPress={() => handleWeekPress(item.week)}>
          <GlassCard style={styles.weekCard}>
            <View style={styles.weekRow}>
              <View
                style={[
                  styles.weekBadge,
                  { backgroundColor: colors.copperDim },
                  isCurrentWeek && { backgroundColor: colors.copper },
                ]}
              >
                <Text
                  style={[
                    styles.weekBadgeText,
                    { color: colors.copper },
                    isCurrentWeek && { color: colors.textPrimary },
                  ]}
                >
                  {item.week}
                </Text>
              </View>
              <View style={styles.weekInfo}>
                <Text style={[styles.weekTitle, { color: colors.textSecondary }]} numberOfLines={2}>
                  {item.title}
                </Text>
                {item.babyUpdate ? (
                  <Text style={[styles.weekPreview, { color: colors.textMuted }]} numberOfLines={1}>
                    {item.babyUpdate}
                  </Text>
                ) : null}
                {isCurrentWeek && (
                  <View style={[styles.currentBadge, { backgroundColor: colors.copperDim }]}>
                    <Text style={[styles.currentBadgeText, { color: colors.copper }]}>CURRENT WEEK</Text>
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

  return (
    <View style={styles.container}>
      <ScreenHeader title="Pregnancy Week Guide" />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.copper} size="large" />
        </View>
      ) : sections.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Baby size={40} color={colors.textDim} />
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No weeks available</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
            Pregnancy week briefings will appear here soon
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => String(item.week)}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
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

  // Week card
  weekCard: {
    padding: 14,
    marginBottom: 8,
  },
  weekRow: {
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
    fontSize: 16,
  },
  weekInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  weekTitle: {
    fontFamily: 'Karla-Medium',
    fontSize: 15,
  },
  weekPreview: {
    fontFamily: 'Jost-Regular',
    fontSize: 12,
    marginTop: 2,
  },
  currentBadge: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  currentBadgeText: {
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
