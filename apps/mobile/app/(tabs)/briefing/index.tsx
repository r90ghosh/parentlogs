import { useState, useCallback } from 'react'
import {
  View,
  Text,
  ScrollView,
  Pressable,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Archive } from 'lucide-react-native'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/components/providers/AuthProvider'
import { useColors } from '@/hooks/use-colors'
import { MedicalDisclaimer } from '@/components/shared/MedicalDisclaimer'
import { useCurrentBriefing, useBriefingByWeek } from '@/hooks/use-briefings'
import { isPregnancyStage } from '@tdc/shared/utils/pregnancy-utils'
import { getBabySize, formatWeight, formatLength } from '@tdc/shared/utils/baby-sizes'
import { GlassCard } from '@/components/glass'
import { CardEntrance, StaggerList } from '@/components/animations'
import {
  WeekNavPills,
  BriefingSection,
  FieldNotesCallout,
} from '@/components/briefing'
import type { FamilyStage } from '@tdc/shared/types'

export default function BriefingScreen() {
  const colors = useColors()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { family, profile } = useAuth()

  const stage = (family?.stage || 'first-trimester') as FamilyStage
  const currentWeek = family?.current_week ?? 1
  const isPregnancy = isPregnancyStage(stage)
  const maxWeek = isPregnancy ? 40 : 104

  const [selectedWeek, setSelectedWeek] = useState<number>(currentWeek)
  const [refreshing, setRefreshing] = useState(false)

  const { data: currentBriefing, isLoading: currentLoading } = useCurrentBriefing()
  const isViewingCurrent = selectedWeek === currentWeek
  const { data: weekBriefing, isLoading: weekLoading } = useBriefingByWeek(
    stage,
    selectedWeek
  )

  const briefing = isViewingCurrent ? currentBriefing : weekBriefing
  const isLoading = isViewingCurrent ? currentLoading : weekLoading

  const babySize = isPregnancy ? getBabySize(selectedWeek) : undefined
  const role = profile?.role ?? 'dad'

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await queryClient.invalidateQueries({ queryKey: ['current-briefing'] })
    await queryClient.invalidateQueries({ queryKey: ['briefing'] })
    setRefreshing(false)
  }, [queryClient])

  const handleWeekSelect = (week: number) => {
    if (week >= 1 && week <= maxWeek) {
      setSelectedWeek(week)
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: 12, paddingBottom: insets.bottom + 90 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.copper}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <CardEntrance delay={0}>
          <View style={styles.headerRow}>
            <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>Briefing</Text>
            <Pressable
              onPress={() => router.push('/(tabs)/more/briefing-archive')}
              style={[styles.archiveButton, { borderColor: colors.border, backgroundColor: colors.pressed }]}
            >
              <Archive size={16} color={colors.copper} />
              <Text style={[styles.archiveText, { color: colors.copper }]}>Archive</Text>
            </Pressable>
          </View>
        </CardEntrance>

        {/* Week Navigation Pills */}
        <CardEntrance delay={80}>
          <WeekNavPills
            currentWeek={currentWeek}
            selectedWeek={selectedWeek}
            maxWeek={maxWeek}
            onSelect={handleWeekSelect}
          />
        </CardEntrance>

        {/* Loading State */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.copper} />
            <Text style={[styles.loadingText, { color: colors.textMuted }]}>Loading briefing...</Text>
          </View>
        )}

        {/* No Briefing Available */}
        {!isLoading && !briefing && (
          <CardEntrance delay={160}>
            <GlassCard style={styles.emptyCard}>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                No briefing available for Week {selectedWeek}.
              </Text>
              {!isViewingCurrent && (
                <Text
                  style={[styles.backLink, { color: colors.copper }]}
                  onPress={() => setSelectedWeek(currentWeek)}
                >
                  Back to current week
                </Text>
              )}
            </GlassCard>
          </CardEntrance>
        )}

        {/* Briefing Content */}
        {!isLoading && briefing && (
          <>
            {/* Hero */}
            <CardEntrance delay={120}>
              <View style={styles.hero}>
                <Text style={[styles.weekLabel, { color: colors.copper }]}>
                  WEEK {briefing.week}
                  {selectedWeek === currentWeek && (
                    <Text style={{ color: colors.gold }}> — THIS WEEK</Text>
                  )}
                </Text>
                <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>{briefing.title}</Text>
                {babySize && (
                  <View style={[styles.babySizeRow, { backgroundColor: colors.pressed }]}>
                    <Text style={styles.babySizeEmoji}>{babySize.emoji}</Text>
                    <View>
                      <Text style={[styles.babySizeFruit, { color: colors.textSecondary }]}>
                        Baby is the size of a {babySize.fruit}
                      </Text>
                      <Text style={[styles.babySizeDetail, { color: colors.textMuted }]}>
                        {formatLength(babySize)} long,{' '}
                        {formatWeight(babySize)}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </CardEntrance>

            {/* Back to current week */}
            {!isViewingCurrent && (
              <CardEntrance delay={160}>
                <Text
                  style={[styles.backLinkInline, { color: colors.copper }]}
                  onPress={() => setSelectedWeek(currentWeek)}
                >
                  ← Back to current week (Week {currentWeek})
                </Text>
              </CardEntrance>
            )}

            {/* Sections */}
            <StaggerList staggerMs={100}>
              {/* Baby Update */}
              <BriefingSection
                title="Baby Update"
                icon="👶"
                accentColor={colors.sky}
              >
                <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>
                  {briefing.baby_update}
                </Text>
              </BriefingSection>

              {/* Mom / Her Body */}
              <BriefingSection
                title={
                  role === 'dad' ? "What She's Experiencing" : 'Your Body'
                }
                icon="💝"
                accentColor={colors.rose}
              >
                <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>
                  {briefing.mom_update}
                </Text>
              </BriefingSection>

              {/* Dad Focus */}
              <BriefingSection
                title="Your Focus This Week"
                icon="🎯"
                accentColor={colors.copper}
              >
                <Text style={[styles.sectionIntro, { color: colors.textSecondary }]}>
                  Here's what to focus on this week:
                </Text>
                {(briefing.dad_focus ?? []).map((item: string, idx: number) => (
                  <View key={idx} style={styles.focusItem}>
                    <View style={[styles.focusBullet, { backgroundColor: colors.copper }]} />
                    <Text style={[styles.focusText, { color: colors.textSecondary }]}>{item}</Text>
                  </View>
                ))}
              </BriefingSection>

              {/* Field Notes */}
              {briefing.field_notes && (
                <FieldNotesCallout notes={briefing.field_notes} />
              )}

              {/* Relationship Tip */}
              <BriefingSection
                title="Relationship Check-In"
                icon="💜"
                accentColor={colors.purple}
              >
                <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>
                  {briefing.relationship_tip}
                </Text>
              </BriefingSection>

              {/* Coming Up */}
              {briefing.coming_up && (
                <BriefingSection
                  title="Coming Up"
                  icon="📆"
                  accentColor={colors.gold}
                >
                  <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>
                    {briefing.coming_up}
                  </Text>
                </BriefingSection>
              )}
            </StaggerList>

            {/* Source Footer */}
            {briefing.medical_source && (
              <CardEntrance delay={400}>
                <View style={[styles.sourceFooter, { borderTopColor: colors.border }]}>
                  <View style={[styles.sourceBadge, { backgroundColor: colors.sageDim }]}>
                    <Text style={[styles.sourceBadgeText, { color: colors.sage }]}>
                      Source-Referenced
                    </Text>
                  </View>
                  <Text style={[styles.sourceText, { color: colors.textMuted }]}>
                    Sources: {briefing.medical_source}
                  </Text>
                </View>
              </CardEntrance>
            )}

            {/* Medical Disclaimer */}
            <CardEntrance delay={450}>
              <MedicalDisclaimer />
            </CardEntrance>
          </>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  pageTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
  },
  archiveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  archiveText: {
    fontFamily: 'Karla-Medium',
    fontSize: 13,
  },
  loadingContainer: {
    paddingVertical: 80,
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
  },
  emptyCard: {
    padding: 32,
    alignItems: 'center',
    marginTop: 24,
  },
  emptyText: {
    fontFamily: 'Jost-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
  backLink: {
    fontFamily: 'Karla-Medium',
    fontSize: 14,
    marginTop: 12,
  },
  backLinkInline: {
    fontFamily: 'Karla-Medium',
    fontSize: 13,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  hero: {
    paddingVertical: 16,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  weekLabel: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 12,
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  heroTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 24,
    lineHeight: 32,
    marginBottom: 12,
  },
  babySizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 12,
    padding: 12,
  },
  babySizeEmoji: {
    fontSize: 32,
  },
  babySizeFruit: {
    fontFamily: 'Jost-Medium',
    fontSize: 15,
  },
  babySizeDetail: {
    fontFamily: 'Jost-Regular',
    fontSize: 13,
    marginTop: 2,
  },
  sectionBody: {
    fontFamily: 'Jost-Regular',
    fontSize: 15,
    lineHeight: 23,
  },
  sectionIntro: {
    fontFamily: 'Jost-Regular',
    fontSize: 15,
    marginBottom: 12,
  },
  focusItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  focusBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  focusText: {
    flex: 1,
    fontFamily: 'Jost-Regular',
    fontSize: 15,
    lineHeight: 22,
  },
  sourceFooter: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  sourceBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  sourceBadgeText: {
    fontFamily: 'Karla-Medium',
    fontSize: 11,
  },
  sourceText: {
    fontFamily: 'Jost-Regular',
    fontSize: 12,
    lineHeight: 18,
  },
})
