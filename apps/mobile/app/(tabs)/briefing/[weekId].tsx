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
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Check, Square } from 'lucide-react-native'
import { useAuth } from '@/components/providers/AuthProvider'
import { useColors } from '@/hooks/use-colors'
import { MedicalDisclaimer } from '@/components/shared/MedicalDisclaimer'
import { useBriefingByWeek } from '@/hooks/use-briefings'
import { useTasks, useCompleteTask } from '@/hooks/use-tasks'
import { isPregnancyStage } from '@tdc/shared/utils/pregnancy-utils'
import {
  getBabySize,
  formatWeight,
  formatLength,
} from '@tdc/shared/utils/baby-sizes'
import { GlassCard } from '@/components/glass'
import { CardEntrance, StaggerList } from '@/components/animations'
import { BriefingSection, FieldNotesCallout, BriefingProgressBar } from '@/components/briefing'
import type { FamilyStage } from '@tdc/shared/types'
import { startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns'

export default function BriefingWeekScreen() {
  const colors = useColors()
  const { weekId } = useLocalSearchParams<{ weekId: string }>()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const queryClient = useQueryClient()
  const { family, profile } = useAuth()

  const stage = (family?.stage || 'first-trimester') as FamilyStage
  const currentWeek = family?.current_week ?? 1
  const isPregnancy = isPregnancyStage(stage)
  const maxWeek = isPregnancy ? 40 : 104
  const week = parseInt(weekId, 10) || currentWeek

  const [refreshing, setRefreshing] = useState(false)

  const { data: briefing, isLoading } = useBriefingByWeek(stage, week)
  const { data: allTasks } = useTasks()
  const completeTask = useCompleteTask()
  const babySize = isPregnancy ? getBabySize(week) : undefined
  const role = profile?.role ?? 'dad'

  // Filter tasks due this calendar week
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })
  const thisWeekTasks = (allTasks ?? []).filter((task) => {
    if (!task.due_date) return false
    try {
      return isWithinInterval(parseISO(task.due_date), { start: weekStart, end: weekEnd })
    } catch {
      return false
    }
  })

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
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      {/* Fixed Header */}
      <View style={[styles.header, { paddingTop: 8, backgroundColor: colors.overlay, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.subtleBg }]}>
          <ChevronLeft size={22} color={colors.textPrimary} />
        </Pressable>
        <View style={styles.headerNav}>
          <Pressable
            onPress={() => navigateWeek(-1)}
            disabled={week <= 1}
            style={[styles.navButton, { backgroundColor: colors.subtleBg }, week <= 1 && styles.navButtonDisabled]}
          >
            <ChevronLeft size={18} color={week <= 1 ? colors.textDim : colors.textSecondary} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Week {week}</Text>
          <Pressable
            onPress={() => navigateWeek(1)}
            disabled={week >= maxWeek}
            style={[
              styles.navButton,
              { backgroundColor: colors.subtleBg },
              week >= maxWeek && styles.navButtonDisabled,
            ]}
          >
            <ChevronRight
              size={18}
              color={week >= maxWeek ? colors.textDim : colors.textSecondary}
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
            paddingTop: 60,
            paddingBottom: insets.bottom + 90,
          },
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
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.copper} />
          </View>
        )}

        {!isLoading && !briefing && (
          <CardEntrance delay={0}>
            <GlassCard style={styles.emptyCard}>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
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
                <Text style={[styles.weekLabel, { color: colors.copper }]}>
                  WEEK {briefing.week}
                  {week === currentWeek && (
                    <Text style={{ color: colors.gold }}> — THIS WEEK</Text>
                  )}
                </Text>
                <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>{briefing.title}</Text>
                <BriefingProgressBar week={week} isPregnancy={isPregnancy} />
                {babySize && (
                  <View style={[styles.babySizeRow, { backgroundColor: colors.pressed }]}>
                    <Text style={styles.babySizeEmoji}>{babySize.emoji}</Text>
                    <View>
                      <Text style={[styles.babySizeFruit, { color: colors.textSecondary }]}>
                        Baby is the size of a {babySize.fruit}
                      </Text>
                      <Text style={[styles.babySizeDetail, { color: colors.textMuted }]}>
                        {formatLength(babySize)} long, {formatWeight(babySize)}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </CardEntrance>

            <StaggerList staggerMs={100}>
              <BriefingSection title="Baby Update" icon="👶" accentColor={colors.sky}>
                <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>{briefing.baby_update}</Text>
              </BriefingSection>

              <BriefingSection
                title={role === 'dad' ? "What She's Experiencing" : 'Your Body'}
                icon="💝"
                accentColor={colors.rose}
              >
                <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>{briefing.mom_update}</Text>
              </BriefingSection>

              <BriefingSection
                title="Your Focus This Week"
                icon="🎯"
                accentColor={colors.copper}
              >
                <Text style={[styles.sectionIntro, { color: colors.textSecondary }]}>
                  Here's what to focus on this week:
                </Text>
                {briefing.dad_focus.map((item: string, idx: number) => (
                  <View key={idx} style={styles.focusItem}>
                    <View style={[styles.focusBullet, { backgroundColor: colors.copper }]} />
                    <Text style={[styles.focusText, { color: colors.textSecondary }]}>{item}</Text>
                  </View>
                ))}
              </BriefingSection>

              {briefing.field_notes && (
                <FieldNotesCallout notes={briefing.field_notes} />
              )}

              <BriefingSection
                title="Relationship Check-In"
                icon="💜"
                accentColor={colors.purple}
              >
                <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>
                  {briefing.relationship_tip}
                </Text>
              </BriefingSection>

              {briefing.coming_up && (
                <BriefingSection
                  title="Coming Up"
                  icon="📆"
                  accentColor={colors.gold}
                >
                  <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>{briefing.coming_up}</Text>
                </BriefingSection>
              )}
            </StaggerList>

            {thisWeekTasks.length > 0 && (
              <BriefingSection
                title="This Week's Tasks"
                icon="✅"
                accentColor={colors.copper}
              >
                {thisWeekTasks.map((task) => (
                  <Pressable
                    key={task.id}
                    onPress={() => completeTask.mutate(task.id)}
                    style={[weekTaskStyles.row, { borderBottomColor: colors.subtleBg }]}
                  >
                    <View
                      style={[
                        weekTaskStyles.checkbox,
                        { borderColor: colors.textDim },
                        task.status === 'completed' && { backgroundColor: colors.sage, borderColor: colors.sage },
                      ]}
                    >
                      {task.status === 'completed' && (
                        <Check size={11} color={colors.bg} />
                      )}
                    </View>
                    <Text
                      style={[
                        weekTaskStyles.taskTitle,
                        { color: colors.textSecondary },
                        task.status === 'completed' && { textDecorationLine: 'line-through', color: colors.textMuted },
                      ]}
                      numberOfLines={2}
                    >
                      {task.title}
                    </Text>
                  </Pressable>
                ))}
              </BriefingSection>
            )}

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
    borderBottomWidth: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  headerTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 18,
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

const weekTaskStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  taskTitle: {
    flex: 1,
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
})
