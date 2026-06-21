import { useCallback, useState, useMemo } from 'react'
import { View, Text, ScrollView, RefreshControl, Pressable, ActivityIndicator, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react-native'
import { useAuth } from '@/components/providers/AuthProvider'
import { useColors } from '@/hooks/use-colors'
import { MedicalDisclaimer } from '@/components/shared/MedicalDisclaimer'
import { useBriefingByWeek } from '@/hooks/use-briefings'
import { useBriefingDone } from '@/hooks/use-briefing-done'
import { useTasks, useCompleteTask } from '@/hooks/use-tasks'
import { isPregnancyStage } from '@tdc/shared/utils/pregnancy-utils'
import { getBabySize } from '@tdc/shared/utils/baby-sizes'
import type { FamilyStage } from '@tdc/shared/types'
import { buildBriefingDigest, categoryColor } from '@/lib/briefing-digest'
import { DigestRow, DigestHero, FieldNoteCard, SectionLabel } from '@/components/digest'
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
  const role = profile?.role ?? 'dad'

  const [refreshing, setRefreshing] = useState(false)

  const { data: briefing, isLoading } = useBriefingByWeek(stage, week)
  const { data: allTasks } = useTasks()
  const completeTask = useCompleteTask()
  const babySize = isPregnancy ? getBabySize(week) : undefined
  const { done, toggle } = useBriefingDone(profile?.family_id, stage, week)

  const digest = useMemo(
    () => (briefing ? buildBriefingDigest(briefing, babySize, role, { isPregnancy }) : null),
    [briefing, babySize, role, isPregnancy]
  )

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

  const navigateWeek = (dir: -1 | 1) => {
    const next = week + dir
    if (next >= 1 && next <= maxWeek) router.setParams({ weekId: String(next) })
  }

  return (
    <View style={styles.container}>
      {/* Fixed header */}
      <View style={[styles.header, { borderBottomColor: colors.line }]}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.iconBtn}>
          <ChevronLeft size={24} color={colors.ink} />
        </Pressable>
        <View style={styles.headerNav}>
          <Pressable onPress={() => navigateWeek(-1)} disabled={week <= 1} hitSlop={8} style={[styles.iconBtn, week <= 1 && styles.disabled]}>
            <ChevronLeft size={18} color={colors.ink2} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.ink }]}>Week {week}</Text>
          <Pressable onPress={() => navigateWeek(1)} disabled={week >= maxWeek} hitSlop={8} style={[styles.iconBtn, week >= maxWeek && styles.disabled]}>
            <ChevronRight size={18} color={colors.ink2} />
          </Pressable>
        </View>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
        showsVerticalScrollIndicator={false}
      >
        {isLoading && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
        )}

        {!isLoading && !briefing && (
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.muted }]}>No briefing available for Week {week}.</Text>
          </View>
        )}

        {!isLoading && briefing && digest && (
          <>
            <DigestHero
              title={`Week ${week}`}
              sub={`${digest.hero.sub}${week === currentWeek ? ' · this week' : ''}`}
              progressPct={digest.hero.progressPct}
              tldr={digest.hero.tldr}
            />

            <SectionLabel>The full briefing</SectionLabel>
            {digest.items.map((item) =>
              item.categoryKey === 'do' ? (
                <DigestRow
                  key={item.key}
                  category={{ label: item.label, color: categoryColor(item.categoryKey, colors) }}
                  headline={item.headline}
                  checkable
                  checked={item.doIndex != null ? !!done[item.doIndex] : undefined}
                  onToggleCheck={item.doIndex != null ? () => toggle(item.doIndex!) : undefined}
                />
              ) : (
                <FullSection
                  key={item.key}
                  label={item.label}
                  color={categoryColor(item.categoryKey, colors)}
                  body={item.detail || item.headline}
                  ink={colors.ink2}
                  line={colors.line2}
                />
              )
            )}

            {digest.fieldNote && <FieldNoteCard quote={digest.fieldNote} />}

            {digest.next && (
              <FullSection
                label={digest.next.label}
                color={categoryColor(digest.next.categoryKey, colors)}
                body={digest.next.detail || digest.next.headline}
                ink={colors.ink2}
                line={colors.line2}
              />
            )}

            {thisWeekTasks.length > 0 && (
              <>
                <SectionLabel>This week's tasks</SectionLabel>
                <View style={styles.taskWrap}>
                  {thisWeekTasks.map((task) => {
                    const completed = task.status === 'completed'
                    return (
                      <Pressable
                        key={task.id}
                        onPress={() => completeTask.mutate(task.id)}
                        style={[styles.taskRow, { borderBottomColor: colors.line2 }]}
                      >
                        <View
                          style={[
                            styles.taskCheck,
                            { borderColor: completed ? colors.accent : colors.line, backgroundColor: completed ? colors.accent : 'transparent' },
                          ]}
                        >
                          {completed && <Check size={12} color="#fff" strokeWidth={3} />}
                        </View>
                        <Text
                          style={[
                            styles.taskTitle,
                            { color: completed ? colors.muted : colors.ink, textDecorationLine: completed ? 'line-through' : 'none' },
                          ]}
                          numberOfLines={2}
                        >
                          {task.title}
                        </Text>
                      </Pressable>
                    )
                  })}
                </View>
              </>
            )}

            <Text style={[styles.fsrc, { color: colors.faint }]}>
              Source-referenced{briefing.medical_source ? ` · ${briefing.medical_source}` : ''} · Not medical advice
            </Text>
            <MedicalDisclaimer />
          </>
        )}
      </ScrollView>
    </View>
  )
}

function FullSection({ label, color, body, ink, line }: { label: string; color: string; body: string; ink: string; line: string }) {
  return (
    <View style={[fs.section, { borderBottomColor: line }]}>
      <View style={fs.catRow}>
        <View style={[fs.dot, { backgroundColor: color }]} />
        <Text style={[fs.cat, { color }]}>{label}</Text>
      </View>
      <Text style={[fs.body, { color: ink }]}>{body}</Text>
    </View>
  )
}

const fs = StyleSheet.create({
  section: { paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1 },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  cat: { fontFamily: 'Jakarta-Bold', fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase' },
  body: { fontFamily: 'Jakarta-Regular', fontSize: 15, lineHeight: 24 },
})

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerNav: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerTitle: { fontFamily: 'Jakarta-Bold', fontSize: 16 },
  disabled: { opacity: 0.35 },
  loading: { paddingVertical: 80, alignItems: 'center' },
  empty: { paddingHorizontal: 24, paddingVertical: 48, alignItems: 'center' },
  emptyText: { fontFamily: 'Jakarta-Medium', fontSize: 15, textAlign: 'center' },
  taskWrap: { paddingTop: 2 },
  taskRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 14, paddingHorizontal: 24, borderBottomWidth: 1 },
  taskCheck: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginTop: 1, flexShrink: 0 },
  taskTitle: { flex: 1, fontFamily: 'Jakarta-SemiBold', fontSize: 15, lineHeight: 22 },
  fsrc: { fontFamily: 'Jakarta-Medium', fontSize: 11, textAlign: 'center', paddingTop: 18, paddingHorizontal: 24, letterSpacing: 0.3 },
})
