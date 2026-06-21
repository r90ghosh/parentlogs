import { useState, useMemo, useCallback, useEffect } from 'react'
import { View, Text, ScrollView, Pressable, TextInput, RefreshControl, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { ListFilter, Search, Plus } from 'lucide-react-native'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/components/providers/AuthProvider'
import { useColors } from '@/hooks/use-colors'
import { useTasks, useCompleteTask, useSnoozeTask } from '@/hooks/use-tasks'
import { ScopeSwitch, PhaseChips } from '@/components/digest'
import { TaskRow } from '@/components/tasks'
import { TasksSkeleton } from '@/components/skeletons'
import { TIMELINE_CATEGORIES, getTaskTimelineCategory, type TimelineSource } from '@tdc/shared/utils/task-timeline'
import type { FamilyTask, FamilyStage } from '@tdc/shared/types'
import { isToday, isPast, startOfWeek, endOfWeek, format } from 'date-fns'

type Scope = 'now' | 'upcoming' | 'done'
type AssigneeFilter = 'all' | 'mine' | 'partner'

export default function TasksScreen() {
  const colors = useColors()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { family, profile } = useAuth()

  const [scope, setScope] = useState<Scope>('now')
  const [assigneeFilter, setAssigneeFilter] = useState<AssigneeFilter>('all')
  const [filterOpen, setFilterOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [debounced, setDebounced] = useState('')
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null)

  const { data: tasks, isLoading, isRefetching } = useTasks()
  const completeTask = useCompleteTask()
  const snoozeTask = useSnoozeTask()

  const userRole = profile?.role ?? 'dad'
  const partnerRole = userRole === 'dad' ? 'mom' : 'dad'
  const allTasks = tasks ?? []

  useEffect(() => {
    const t = setTimeout(() => setDebounced(searchTerm), 250)
    return () => clearTimeout(t)
  }, [searchTerm])

  const onRefresh = useCallback(() => queryClient.invalidateQueries({ queryKey: ['tasks'] }), [queryClient])
  const handleComplete = useCallback((id: string) => completeTask.mutate(id), [completeTask])
  const handleSnooze = useCallback((id: string) => snoozeTask.mutate({ id }), [snoozeTask])

  const matchAssignee = useCallback(
    (t: FamilyTask) => {
      if (assigneeFilter === 'mine') return t.assigned_to === userRole || t.assigned_to === 'both' || t.assigned_to === 'either'
      if (assigneeFilter === 'partner') return t.assigned_to === partnerRole || t.assigned_to === 'both'
      return true
    },
    [assigneeFilter, userRole, partnerRole]
  )
  const matchSearch = useCallback(
    (t: FamilyTask) => {
      const q = debounced.trim().toLowerCase()
      if (!q) return true
      return t.title.toLowerCase().includes(q) || (t.description?.toLowerCase().includes(q) ?? false)
    },
    [debounced]
  )

  const byDue = (a: FamilyTask, b: FamilyTask) => a.due_date.localeCompare(b.due_date)

  // ── NOW ──
  const now = useMemo(() => {
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })
    const active = allTasks.filter((t) => (t.status === 'pending' || t.status === 'snoozed') && matchAssignee(t) && matchSearch(t))
    const today: FamilyTask[] = []
    const thisWeek: FamilyTask[] = []
    const catchUp: FamilyTask[] = []
    for (const t of active) {
      const d = new Date(t.due_date)
      if (isToday(d)) today.push(t)
      else if (isPast(d)) catchUp.push(t)
      else if (d <= weekEnd) thisWeek.push(t)
    }
    return { today: today.sort(byDue), thisWeek: thisWeek.sort(byDue), catchUp: catchUp.sort(byDue) }
  }, [allTasks, matchAssignee, matchSearch])

  // ── UPCOMING (active, due beyond this week, grouped by phase) ──
  const upcoming = useMemo(() => {
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })
    const active = allTasks
      .filter((t) => (t.status === 'pending' || t.status === 'snoozed') && matchAssignee(t) && matchSearch(t))
      .filter((t) => new Date(t.due_date) > weekEnd)
      .sort(byDue)

    const fam = family as { stage?: FamilyStage; due_date?: string | null; birth_date?: string | null; current_week?: number } | null | undefined
    const canPhase = !!(fam && (fam.due_date || fam.birth_date))
    const groups: { key: string; label: string; tasks: FamilyTask[] }[] = []

    if (canPhase && fam) {
      const source = { stage: fam.stage, due_date: fam.due_date, birth_date: fam.birth_date, current_week: fam.current_week } as TimelineSource
      const byPhase = new Map<string, FamilyTask[]>()
      for (const t of active) {
        const cat = getTaskTimelineCategory(t.due_date, source)
        if (!byPhase.has(cat)) byPhase.set(cat, [])
        byPhase.get(cat)!.push(t)
      }
      for (const c of TIMELINE_CATEGORIES) {
        const list = byPhase.get(c.id)
        if (list && list.length) groups.push({ key: c.id, label: c.label, tasks: list })
      }
    } else {
      const byMonth = new Map<string, FamilyTask[]>()
      for (const t of active) {
        const key = format(new Date(t.due_date), 'MMMM yyyy')
        if (!byMonth.has(key)) byMonth.set(key, [])
        byMonth.get(key)!.push(t)
      }
      for (const [key, list] of byMonth) groups.push({ key, label: key, tasks: list })
    }
    return groups
  }, [allTasks, matchAssignee, matchSearch, family])

  // ── DONE ──
  const done = useMemo(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })
    const completed = allTasks
      .filter((t) => t.status === 'completed' && matchAssignee(t) && matchSearch(t))
      .sort((a, b) => (b.completed_at ?? b.due_date).localeCompare(a.completed_at ?? a.due_date))
    const thisWeek: FamilyTask[] = []
    const earlier: FamilyTask[] = []
    for (const t of completed) {
      const d = new Date(t.completed_at ?? t.due_date)
      if (d >= weekStart && d <= weekEnd) thisWeek.push(t)
      else earlier.push(t)
    }
    return { thisWeek, earlier }
  }, [allTasks, matchAssignee, matchSearch])

  const phaseChips = upcoming.map((g) => ({ key: g.key, label: g.label }))
  const visibleUpcoming = selectedPhase ? upcoming.filter((g) => g.key === selectedPhase) : upcoming
  const nowEmpty = now.today.length === 0 && now.thisWeek.length === 0 && now.catchUp.length === 0

  const row = (t: FamilyTask) => <TaskRow key={t.id} task={t} onComplete={handleComplete} onSnooze={handleSnooze} />
  const secLabel = (text: string, amber?: boolean) => (
    <Text key={`sec-${text}`} style={[styles.secLabel, { color: amber ? colors.gold : colors.faint }]}>
      {text}
    </Text>
  )

  return (
    <View style={styles.container}>
      {/* Fixed header */}
      <View style={styles.header}>
        <View style={styles.topbar}>
          <Text style={[styles.title, { color: colors.ink }]}>Tasks</Text>
          <View style={styles.topIcons}>
            <Pressable
              onPress={() => { setFilterOpen((o) => !o); setSearchOpen(false) }}
              style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.line }]}
            >
              <ListFilter size={18} color={assigneeFilter !== 'all' ? colors.accent : colors.ink2} />
            </Pressable>
            <Pressable
              onPress={() => { setSearchOpen((o) => !o); setFilterOpen(false) }}
              style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.line }]}
            >
              <Search size={18} color={searchOpen ? colors.accent : colors.ink2} />
            </Pressable>
          </View>
        </View>

        {filterOpen && (
          <View style={styles.filterRow}>
            {(['all', 'mine', 'partner'] as AssigneeFilter[]).map((f) => (
              <Pressable
                key={f}
                onPress={() => setAssigneeFilter(f)}
                style={[styles.fChip, { borderColor: assigneeFilter === f ? colors.accent : colors.line, backgroundColor: assigneeFilter === f ? colors.accent : 'transparent' }]}
              >
                <Text style={[styles.fChipText, { color: assigneeFilter === f ? '#fff' : colors.ink2 }]}>
                  {f === 'all' ? 'All' : f === 'mine' ? 'Mine' : 'Partner'}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {searchOpen && (
          <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.line }]}>
            <Search size={16} color={colors.muted} />
            <TextInput
              style={[styles.searchInput, { color: colors.ink }]}
              placeholder="Search tasks…"
              placeholderTextColor={colors.faint}
              value={searchTerm}
              onChangeText={setSearchTerm}
              autoFocus
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
          </View>
        )}

        <ScopeSwitch
          style={styles.scope}
          value={scope}
          onChange={(k) => { setScope(k as Scope); setSelectedPhase(null) }}
          options={[
            { key: 'now', label: 'Now', badge: now.today.length, badgeTone: 'accent' },
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'done', label: 'Done' },
          ]}
        />
      </View>

      {isLoading ? (
        <TasksSkeleton />
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={onRefresh} tintColor={colors.accent} />}
        >
          {scope === 'now' &&
            (nowEmpty ? (
              <Text style={[styles.empty, { color: colors.muted }]}>You&apos;re clear today — nice.</Text>
            ) : (
              <>
                <View style={styles.summary}>
                  <Text style={[styles.summaryBig, { color: colors.ink }]}>
                    You&apos;ve got{' '}
                    <Text style={{ color: colors.accentInk }}>
                      {now.today.length} {now.today.length === 1 ? 'thing' : 'things'} today
                    </Text>{' '}
                    and {now.thisWeek.length} more this week.
                  </Text>
                </View>
                {now.today.length > 0 && [secLabel(`Today · ${now.today.length}`), ...now.today.map(row)]}
                {now.thisWeek.length > 0 && [secLabel(`This week · ${now.thisWeek.length}`), ...now.thisWeek.map(row)]}
                {now.catchUp.length > 0 && [secLabel(`Catch up · ${now.catchUp.length}`, true), ...now.catchUp.map(row)]}
              </>
            ))}

          {scope === 'upcoming' &&
            (upcoming.length === 0 ? (
              <Text style={[styles.empty, { color: colors.muted }]}>Nothing scheduled beyond this week.</Text>
            ) : (
              <>
                <PhaseChips
                  label="Jump to a phase"
                  chips={phaseChips}
                  activeKey={selectedPhase}
                  onSelect={(k) => setSelectedPhase(selectedPhase === k ? null : k)}
                />
                {visibleUpcoming.map((g) => (
                  <View key={g.key}>
                    {secLabel(g.label)}
                    {g.tasks.map(row)}
                  </View>
                ))}
              </>
            ))}

          {scope === 'done' &&
            (done.thisWeek.length === 0 && done.earlier.length === 0 ? (
              <Text style={[styles.empty, { color: colors.muted }]}>No completed tasks yet.</Text>
            ) : (
              <>
                {done.thisWeek.length > 0 && [secLabel('Done this week'), ...done.thisWeek.map(row)]}
                {done.earlier.length > 0 && [secLabel('Earlier'), ...done.earlier.map(row)]}
              </>
            ))}
        </ScrollView>
      )}

      {/* FAB */}
      <Pressable
        onPress={() => router.push('/(screens)/create-task')}
        style={[styles.fab, { bottom: insets.bottom + 100, backgroundColor: colors.accent }]}
      >
        <Plus size={24} color="#fff" strokeWidth={2.4} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingBottom: 4 },
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4 },
  title: { fontFamily: 'Jakarta-ExtraBold', fontSize: 26, letterSpacing: -0.6 },
  topIcons: { flexDirection: 'row', gap: 10 },
  iconBtn: { width: 38, height: 38, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  filterRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 2 },
  fChip: { borderWidth: 1, borderRadius: 999, paddingVertical: 7, paddingHorizontal: 14 },
  fChipText: { fontFamily: 'Jakarta-Bold', fontSize: 12.5 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 42, borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, marginHorizontal: 20, marginTop: 8 },
  searchInput: { flex: 1, fontFamily: 'Jakarta-Regular', fontSize: 14 },
  scope: { marginHorizontal: 22, marginTop: 12, marginBottom: 2 },
  summary: { paddingHorizontal: 24, paddingTop: 14, paddingBottom: 2 },
  summaryBig: { fontFamily: 'Jakarta-Bold', fontSize: 18, lineHeight: 25, letterSpacing: -0.2 },
  secLabel: { fontFamily: 'Jakarta-Bold', fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase', paddingHorizontal: 24, paddingTop: 18, paddingBottom: 2 },
  empty: { fontFamily: 'Jakarta-Medium', fontSize: 14, textAlign: 'center', paddingTop: 56, paddingHorizontal: 40, lineHeight: 21 },
  fab: { position: 'absolute', right: 20, width: 54, height: 54, borderRadius: 18, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8 },
})
