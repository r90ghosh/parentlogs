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
import { LinearGradient } from 'expo-linear-gradient'
import { ArrowLeft, BookOpen, ChevronRight } from 'lucide-react-native'
import { useBriefingsList } from '@/hooks/use-briefings'
import { useAuth } from '@/components/providers/AuthProvider'
import { GlassCard } from '@/components/glass'
import { CardEntrance } from '@/components/animations'
import type { BriefingTemplate } from '@tdc/shared/types'

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
    <Text style={styles.sectionHeader}>{section.title}</Text>
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
              <View style={styles.weekBadge}>
                <Text style={styles.weekBadgeText}>W{item.week}</Text>
              </View>
              <View style={styles.briefingInfo}>
                <Text style={styles.briefingTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                {isCurrentWeek && (
                  <View style={styles.currentWeekBadge}>
                    <Text style={styles.currentWeekText}>THIS WEEK</Text>
                  </View>
                )}
              </View>
              <ChevronRight size={18} color="#4a4239" />
            </View>
          </GlassCard>
        </Pressable>
      </CardEntrance>
    )
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#12100e', '#1a1714', '#12100e']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={20} color="#ede6dc" />
        </Pressable>
        <Text style={styles.headerTitle}>Briefing Archive</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#c4703f" size="large" />
        </View>
      ) : sections.length === 0 ? (
        <View style={styles.emptyContainer}>
          <BookOpen size={40} color="#4a4239" />
          <Text style={styles.emptyTitle}>No briefings available yet</Text>
          <Text style={styles.emptySubtitle}>
            Briefings will appear here as your journey progresses
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.briefing_id}
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
    backgroundColor: '#12100e',
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
    backgroundColor: 'rgba(237,230,220,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
    color: '#faf6f0',
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
    color: '#7a6f62',
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
    backgroundColor: 'rgba(196,112,63,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekBadgeText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 14,
    color: '#c4703f',
  },
  briefingInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  briefingTitle: {
    fontFamily: 'Karla-Medium',
    fontSize: 15,
    color: '#ede6dc',
  },
  currentWeekBadge: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(196,112,63,0.15)',
  },
  currentWeekText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 10,
    color: '#c4703f',
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
    color: '#faf6f0',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    color: '#7a6f62',
    textAlign: 'center',
  },
})
