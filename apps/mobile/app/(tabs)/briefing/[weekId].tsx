import { useCallback, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight } from 'lucide-react-native'
import { useAuth } from '@/components/providers/AuthProvider'
import { useBriefingByWeek } from '@/hooks/use-briefings'
import { isPregnancyStage } from '@tdc/shared/utils/pregnancy-utils'
import {
  getBabySize,
  formatWeight,
  formatLength,
} from '@tdc/shared/utils/baby-sizes'
import { GlassCard } from '@/components/glass'
import { CardEntrance, StaggerList } from '@/components/animations'
import { BriefingSection, FieldNotesCallout } from '@/components/briefing'
import type { FamilyStage } from '@tdc/shared/types'

export default function BriefingWeekScreen() {
  const { weekId } = useLocalSearchParams<{ weekId: string }>()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const queryClient = useQueryClient()
  const { family, profile } = useAuth()

  const stage = (family?.stage || 'first-trimester') as FamilyStage
  const currentWeek = (family as any)?.current_week ?? 1
  const isPregnancy = isPregnancyStage(stage)
  const maxWeek = isPregnancy ? 40 : 104
  const week = parseInt(weekId, 10) || currentWeek

  const [refreshing, setRefreshing] = useState(false)

  const { data: briefing, isLoading } = useBriefingByWeek(stage, week)
  const babySize = isPregnancy ? getBabySize(week) : undefined
  const role = profile?.role ?? 'dad'

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await queryClient.invalidateQueries({ queryKey: ['briefing', stage, week] })
    setRefreshing(false)
  }, [queryClient, stage, week])

  const navigateWeek = (direction: -1 | 1) => {
    const next = week + direction
    if (next >= 1 && next <= maxWeek) {
      router.setParams({ weekId: String(next) })
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#12100e', '#1a1714', '#12100e']}
        style={StyleSheet.absoluteFill}
      />

      {/* Fixed Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={22} color="#faf6f0" />
        </Pressable>
        <View style={styles.headerNav}>
          <Pressable
            onPress={() => navigateWeek(-1)}
            disabled={week <= 1}
            style={[styles.navButton, week <= 1 && styles.navButtonDisabled]}
          >
            <ChevronLeft size={18} color={week <= 1 ? '#4a4239' : '#ede6dc'} />
          </Pressable>
          <Text style={styles.headerTitle}>Week {week}</Text>
          <Pressable
            onPress={() => navigateWeek(1)}
            disabled={week >= maxWeek}
            style={[
              styles.navButton,
              week >= maxWeek && styles.navButtonDisabled,
            ]}
          >
            <ChevronRight
              size={18}
              color={week >= maxWeek ? '#4a4239' : '#ede6dc'}
            />
          </Pressable>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 60,
            paddingBottom: insets.bottom + 90,
          },
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
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#c4703f" />
          </View>
        )}

        {!isLoading && !briefing && (
          <CardEntrance delay={0}>
            <GlassCard style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                No briefing available for Week {week}.
              </Text>
            </GlassCard>
          </CardEntrance>
        )}

        {!isLoading && briefing && (
          <>
            {/* Hero */}
            <CardEntrance delay={0}>
              <View style={styles.hero}>
                <Text style={styles.weekLabel}>
                  WEEK {briefing.week}
                  {week === currentWeek && (
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
                        {formatLength(babySize)} long, {formatWeight(babySize)}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </CardEntrance>

            <StaggerList staggerMs={100}>
              <BriefingSection title="Baby Update" icon="👶" accentColor="#5b9bd5">
                <Text style={styles.sectionBody}>{briefing.baby_update}</Text>
              </BriefingSection>

              <BriefingSection
                title={role === 'dad' ? "What She's Experiencing" : 'Your Body'}
                icon="💝"
                accentColor="#c47a8f"
              >
                <Text style={styles.sectionBody}>{briefing.mom_update}</Text>
              </BriefingSection>

              <BriefingSection
                title="Your Focus This Week"
                icon="🎯"
                accentColor="#c4703f"
              >
                <Text style={styles.sectionIntro}>
                  Here's what to focus on this week:
                </Text>
                {briefing.dad_focus.map((item, idx) => (
                  <View key={idx} style={styles.focusItem}>
                    <View style={styles.focusBullet} />
                    <Text style={styles.focusText}>{item}</Text>
                  </View>
                ))}
              </BriefingSection>

              {briefing.field_notes && (
                <FieldNotesCallout notes={briefing.field_notes} />
              )}

              <BriefingSection
                title="Relationship Check-In"
                icon="💜"
                accentColor="#9b7fd4"
              >
                <Text style={styles.sectionBody}>
                  {briefing.relationship_tip}
                </Text>
              </BriefingSection>

              {briefing.coming_up && (
                <BriefingSection
                  title="Coming Up"
                  icon="📆"
                  accentColor="#d4a853"
                >
                  <Text style={styles.sectionBody}>{briefing.coming_up}</Text>
                </BriefingSection>
              )}
            </StaggerList>

            {briefing.medical_source && (
              <CardEntrance delay={400}>
                <View style={styles.sourceFooter}>
                  <View style={styles.sourceBadge}>
                    <Text style={styles.sourceBadgeText}>
                      Medically Reviewed
                    </Text>
                  </View>
                  <Text style={styles.sourceText}>
                    Sources: {briefing.medical_source}
                  </Text>
                </View>
              </CardEntrance>
            )}
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
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: 'rgba(18,16,14,0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(237,230,220,0.08)',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(237,230,220,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(237,230,220,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  headerTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 18,
    color: '#faf6f0',
  },
  headerSpacer: {
    width: 36,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  loadingContainer: {
    paddingVertical: 80,
    alignItems: 'center',
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
})
