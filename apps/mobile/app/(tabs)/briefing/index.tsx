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
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { Archive } from 'lucide-react-native'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/components/providers/AuthProvider'
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
    <View style={styles.container}>
      <LinearGradient
        colors={['#12100e', '#1a1714', '#12100e']}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 90 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#c4703f"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <CardEntrance delay={0}>
          <View style={styles.headerRow}>
            <Text style={styles.pageTitle}>Briefing</Text>
            <Pressable
              onPress={() => router.push('/(screens)/briefing-archive')}
              style={styles.archiveButton}
            >
              <Archive size={16} color="#c4703f" />
              <Text style={styles.archiveText}>Archive</Text>
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
            <ActivityIndicator size="large" color="#c4703f" />
            <Text style={styles.loadingText}>Loading briefing...</Text>
          </View>
        )}

        {/* No Briefing Available */}
        {!isLoading && !briefing && (
          <CardEntrance delay={160}>
            <GlassCard style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                No briefing available for Week {selectedWeek}.
              </Text>
              {!isViewingCurrent && (
                <Text
                  style={styles.backLink}
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
                <Text style={styles.weekLabel}>
                  WEEK {briefing.week}
                  {selectedWeek === currentWeek && (
                    <Text style={styles.currentBadge}> — THIS WEEK</Text>
                  )}
                </Text>
                <Text style={styles.heroTitle}>{briefing.title}</Text>
                {babySize && (
                  <View style={styles.babySizeRow}>
                    <Text style={styles.babySizeEmoji}>{babySize.emoji}</Text>
                    <View>
                      <Text style={styles.babySizeFruit}>
                        Baby is the size of a {babySize.fruit}
                      </Text>
                      <Text style={styles.babySizeDetail}>
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
                  style={styles.backLinkInline}
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
                accentColor="#5b9bd5"
              >
                <Text style={styles.sectionBody}>
                  {briefing.baby_update}
                </Text>
              </BriefingSection>

              {/* Mom / Her Body */}
              <BriefingSection
                title={
                  role === 'dad' ? "What She's Experiencing" : 'Your Body'
                }
                icon="💝"
                accentColor="#c47a8f"
              >
                <Text style={styles.sectionBody}>
                  {briefing.mom_update}
                </Text>
              </BriefingSection>

              {/* Dad Focus */}
              <BriefingSection
                title="Your Focus This Week"
                icon="🎯"
                accentColor="#c4703f"
              >
                <Text style={styles.sectionIntro}>
                  Here's what to focus on this week:
                </Text>
                {(briefing.dad_focus ?? []).map((item, idx) => (
                  <View key={idx} style={styles.focusItem}>
                    <View style={styles.focusBullet} />
                    <Text style={styles.focusText}>{item}</Text>
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
                accentColor="#9b7fd4"
              >
                <Text style={styles.sectionBody}>
                  {briefing.relationship_tip}
                </Text>
              </BriefingSection>

              {/* Coming Up */}
              {briefing.coming_up && (
                <BriefingSection
                  title="Coming Up"
                  icon="📆"
                  accentColor="#d4a853"
                >
                  <Text style={styles.sectionBody}>
                    {briefing.coming_up}
                  </Text>
                </BriefingSection>
              )}
            </StaggerList>

            {/* Source Footer */}
            {briefing.medical_source && (
              <CardEntrance delay={400}>
                <View style={styles.sourceFooter}>
                  <View style={styles.sourceBadge}>
                    <Text style={styles.sourceBadgeText}>
                      Source-Referenced
                    </Text>
                  </View>
                  <Text style={styles.sourceText}>
                    Sources: {briefing.medical_source}
                  </Text>
                </View>
              </CardEntrance>
            )}

            {/* Medical Disclaimer */}
            <CardEntrance delay={450}>
              <Text style={styles.disclaimerText}>
                For informational purposes only. Always consult your healthcare provider.
              </Text>
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
    backgroundColor: '#12100e',
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
    color: '#faf6f0',
  },
  archiveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(237,230,220,0.08)',
    backgroundColor: 'rgba(237,230,220,0.04)',
  },
  archiveText: {
    fontFamily: 'Karla-Medium',
    fontSize: 13,
    color: '#c4703f',
  },
  loadingContainer: {
    paddingVertical: 80,
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    color: '#7a6f62',
  },
  emptyCard: {
    padding: 32,
    alignItems: 'center',
    marginTop: 24,
  },
  emptyText: {
    fontFamily: 'Jost-Regular',
    fontSize: 16,
    color: '#7a6f62',
    textAlign: 'center',
  },
  backLink: {
    fontFamily: 'Karla-Medium',
    fontSize: 14,
    color: '#c4703f',
    marginTop: 12,
  },
  backLinkInline: {
    fontFamily: 'Karla-Medium',
    fontSize: 13,
    color: '#c4703f',
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
    color: '#c4703f',
    marginBottom: 6,
  },
  currentBadge: {
    color: '#d4a853',
  },
  heroTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 24,
    color: '#faf6f0',
    lineHeight: 32,
    marginBottom: 12,
  },
  babySizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(237,230,220,0.04)',
    borderRadius: 12,
    padding: 12,
  },
  babySizeEmoji: {
    fontSize: 32,
  },
  babySizeFruit: {
    fontFamily: 'Jost-Medium',
    fontSize: 15,
    color: '#ede6dc',
  },
  babySizeDetail: {
    fontFamily: 'Jost-Regular',
    fontSize: 13,
    color: '#7a6f62',
    marginTop: 2,
  },
  sectionBody: {
    fontFamily: 'Jost-Regular',
    fontSize: 15,
    color: '#ede6dc',
    lineHeight: 23,
  },
  sectionIntro: {
    fontFamily: 'Jost-Regular',
    fontSize: 15,
    color: '#ede6dc',
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
    backgroundColor: '#c4703f',
    marginTop: 8,
  },
  focusText: {
    flex: 1,
    fontFamily: 'Jost-Regular',
    fontSize: 15,
    color: '#ede6dc',
    lineHeight: 22,
  },
  sourceFooter: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(237,230,220,0.08)',
  },
  sourceBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(107,143,113,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  sourceBadgeText: {
    fontFamily: 'Karla-Medium',
    fontSize: 11,
    color: '#6b8f71',
  },
  sourceText: {
    fontFamily: 'Jost-Regular',
    fontSize: 12,
    color: '#7a6f62',
    lineHeight: 18,
  },
  disclaimerText: {
    fontFamily: 'Karla-Regular',
    fontSize: 11,
    color: '#4a4239',
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
    lineHeight: 16,
  },
})
