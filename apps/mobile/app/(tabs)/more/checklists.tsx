import { useState, useMemo, useEffect } from 'react'
import { View, Text, Pressable, ScrollView, Modal, RefreshControl, ActivityIndicator, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Check, ChevronDown, Lock, X } from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { useAuth } from '@/components/providers/AuthProvider'
import { useColors } from '@/hooks/use-colors'
import { useChecklists, useChecklistById, useToggleChecklistItem } from '@/hooks/use-checklists'
import { PhaseChips, SectionLabel } from '@/components/digest'
import type { ChecklistWithItems } from '@tdc/services'

type ChecklistItem = {
  item_id: string
  item: string
  details?: string
  category: string
  required: boolean
  bring_or_do: 'bring' | 'do'
  completed: boolean
}

function parseWeekRange(wr: string): { start: number; end: number } {
  const plus = wr?.includes('+')
  const clean = (wr ?? '').replace('+', '').trim()
  const parts = clean.split('-').map((s) => parseInt(s.trim(), 10))
  const start = isNaN(parts[0]) ? 0 : parts[0]
  const end = plus ? Infinity : parts.length > 1 && !isNaN(parts[1]) ? parts[1] : start
  return { start, end }
}
function isNow(wr: string, week: number): boolean {
  const { start, end } = parseWeekRange(wr)
  return week >= start && week <= end
}
function relevanceKey(wr: string, week: number): number {
  const { start, end } = parseWeekRange(wr)
  if (week >= start && week <= end) return 0
  if (week < start) return start - week
  return 100000 + (week - end)
}

export default function ChecklistsScreen() {
  const colors = useColors()
  const insets = useSafeAreaInsets()
  const { family } = useAuth()
  const currentWeek = (family as { current_week?: number })?.current_week ?? 1

  const checklistsQuery = useChecklists()
  const toggleItem = useToggleChecklistItem()

  const lists = useMemo(() => (checklistsQuery.data ?? []) as ChecklistWithItems[], [checklistsQuery.data])
  const unlocked = useMemo(
    () => lists.filter((c) => !c.is_locked).sort((a, b) => relevanceKey(a.week_relevant, currentWeek) - relevanceKey(b.week_relevant, currentWeek)),
    [lists, currentWeek]
  )

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showIndex, setShowIndex] = useState(false)

  useEffect(() => {
    if (!selectedId && unlocked.length) setSelectedId(unlocked[0].checklist_id)
  }, [selectedId, unlocked])

  const detailQuery = useChecklistById(selectedId ?? '')
  const active = detailQuery.data as (ChecklistWithItems & { items?: ChecklistItem[] }) | undefined
  const items = (active?.items ?? []) as ChecklistItem[]

  const grouped = useMemo(() => {
    const map = new Map<string, ChecklistItem[]>()
    for (const it of items) {
      const key = it.category || 'Other'
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(it)
    }
    return Array.from(map.entries())
  }, [items])

  const onToggle = (it: ChecklistItem) => {
    if (!selectedId) return
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    toggleItem.mutate({ checklistId: selectedId, itemId: it.item_id, completed: !it.completed })
  }

  // All-lists index buckets
  const buckets = useMemo(() => {
    const completed: ChecklistWithItems[] = []
    const forNow: ChecklistWithItems[] = []
    const comingUp: ChecklistWithItems[] = []
    const locked: ChecklistWithItems[] = []
    for (const c of lists) {
      if (c.is_locked) locked.push(c)
      else if (c.progress.percentage === 100) completed.push(c)
      else if (isNow(c.week_relevant, currentWeek)) forNow.push(c)
      else comingUp.push(c)
    }
    return { forNow, comingUp, completed, locked }
  }, [lists, currentWeek])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => setShowIndex(true)} hitSlop={8} style={styles.allLists}>
          <Text style={[styles.allListsText, { color: colors.ink2 }]}>All lists</Text>
          <ChevronDown size={16} color={colors.ink2} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={checklistsQuery.isRefetching} onRefresh={() => checklistsQuery.refetch()} tintColor={colors.accent} />}
      >
        {unlocked.length > 0 && (
          <PhaseChips
            chips={unlocked.map((c) => ({ key: c.checklist_id, label: c.name }))}
            activeKey={selectedId}
            onSelect={setSelectedId}
          />
        )}

        {!selectedId || detailQuery.isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.accent} />
          </View>
        ) : active ? (
          <>
            {/* Hero */}
            <View style={styles.hero}>
              <Text style={[styles.heroName, { color: colors.ink }]}>{active.name}</Text>
              <Text style={[styles.heroMeta, { color: colors.muted }]}>
                {active.progress.completed} of {active.progress.total} done{active.week_relevant ? ` · Weeks ${active.week_relevant}` : ''}
              </Text>
              <View style={[styles.progress, { backgroundColor: colors.line }]}>
                <View style={[styles.progressFill, { width: `${active.progress.percentage}%`, backgroundColor: active.progress.percentage === 100 ? colors.sage : colors.accent }]} />
              </View>
            </View>

            {grouped.map(([cat, catItems]) => (
              <View key={cat}>
                <SectionLabel>{cat}</SectionLabel>
                {catItems.map((it) => (
                  <Pressable
                    key={it.item_id}
                    onPress={() => onToggle(it)}
                    style={({ pressed }) => [styles.item, { borderBottomColor: colors.line2, backgroundColor: pressed ? colors.cardHover : 'transparent' }]}
                  >
                    <View style={[styles.check, { borderColor: it.completed ? colors.sage : colors.line, backgroundColor: it.completed ? colors.sage : 'transparent' }]}>
                      {it.completed && <Check size={12} color="#fff" strokeWidth={3} />}
                    </View>
                    <View style={styles.itemBody}>
                      <Text style={[styles.itemName, { color: it.completed ? colors.muted : colors.ink, textDecorationLine: it.completed ? 'line-through' : 'none' }]}>
                        {it.item}
                      </Text>
                      {!!it.details && (
                        <Text style={[styles.itemDetails, { color: colors.muted }]} numberOfLines={2}>{it.details}</Text>
                      )}
                    </View>
                    <View style={styles.itemTags}>
                      {it.bring_or_do === 'bring' && <Text style={[styles.tag, { color: colors.dotBaby }]}>Pack</Text>}
                      {!it.required && <Text style={[styles.tag, { color: colors.faint }]}>Optional</Text>}
                    </View>
                  </Pressable>
                ))}
              </View>
            ))}
          </>
        ) : (
          <Text style={[styles.empty, { color: colors.muted }]}>No checklists available yet.</Text>
        )}
      </ScrollView>

      {/* All-lists index */}
      <Modal visible={showIndex} transparent animationType="slide" onRequestClose={() => setShowIndex(false)}>
        <Pressable style={[styles.backdrop, { backgroundColor: colors.overlay }]} onPress={() => setShowIndex(false)}>
          <Pressable style={[styles.sheet, { backgroundColor: colors.card, paddingBottom: insets.bottom + 16 }]} onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetHead}>
              <Text style={[styles.sheetTitle, { color: colors.ink }]}>All lists</Text>
              <Pressable onPress={() => setShowIndex(false)} hitSlop={10}><X size={20} color={colors.ink2} /></Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 460 }}>
              {([
                ['For now', buckets.forNow] as const,
                ['Coming up', buckets.comingUp] as const,
                ['Completed', buckets.completed] as const,
                ['Locked', buckets.locked] as const,
              ]).map(([label, group]) =>
                group.length === 0 ? null : (
                  <View key={label}>
                    <SectionLabel>{label}</SectionLabel>
                    {group.map((c) => (
                      <Pressable
                        key={c.checklist_id}
                        onPress={() => {
                          if (c.is_locked) return
                          setSelectedId(c.checklist_id)
                          setShowIndex(false)
                        }}
                        style={({ pressed }) => [styles.indexRow, { borderBottomColor: colors.line2, backgroundColor: pressed ? colors.cardHover : 'transparent', opacity: c.is_locked ? 0.6 : 1 }]}
                      >
                        <View style={styles.indexBody}>
                          <Text style={[styles.indexName, { color: colors.ink }]} numberOfLines={1}>{c.name}</Text>
                          <Text style={[styles.indexMeta, { color: colors.muted }]}>{c.progress.completed}/{c.progress.total} · Weeks {c.week_relevant}</Text>
                        </View>
                        {c.is_locked && <Lock size={15} color={colors.faint} />}
                      </Pressable>
                    ))}
                  </View>
                )
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 2 },
  allLists: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' },
  allListsText: { fontFamily: 'Jakarta-Bold', fontSize: 13, letterSpacing: 0.2, textTransform: 'uppercase' },
  loading: { paddingVertical: 60, alignItems: 'center' },
  hero: { paddingHorizontal: 22, paddingTop: 10, paddingBottom: 4 },
  heroName: { fontFamily: 'Jakarta-ExtraBold', fontSize: 24, letterSpacing: -0.5 },
  heroMeta: { fontFamily: 'Jakarta-Medium', fontSize: 13.5, marginTop: 6 },
  progress: { height: 6, borderRadius: 6, overflow: 'hidden', marginTop: 14 },
  progressFill: { height: '100%', borderRadius: 6 },
  item: { flexDirection: 'row', alignItems: 'flex-start', gap: 13, paddingVertical: 14, paddingHorizontal: 22, borderBottomWidth: 1 },
  check: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginTop: 1, flexShrink: 0 },
  itemBody: { flex: 1, minWidth: 0 },
  itemName: { fontFamily: 'Jakarta-SemiBold', fontSize: 15.5, lineHeight: 21, letterSpacing: -0.1 },
  itemDetails: { fontFamily: 'Jakarta-Regular', fontSize: 13, lineHeight: 18, marginTop: 3 },
  itemTags: { alignItems: 'flex-end', gap: 3, flexShrink: 0 },
  tag: { fontFamily: 'Jakarta-Bold', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: 0.5 },
  empty: { fontFamily: 'Jakarta-Medium', fontSize: 14, textAlign: 'center', paddingVertical: 48 },
  backdrop: { flex: 1, justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 16, paddingHorizontal: 4 },
  sheetHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingBottom: 6 },
  sheetTitle: { fontFamily: 'Jakarta-Bold', fontSize: 17 },
  indexRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 18, borderBottomWidth: 1 },
  indexBody: { flex: 1, minWidth: 0 },
  indexName: { fontFamily: 'Jakarta-SemiBold', fontSize: 15 },
  indexMeta: { fontFamily: 'Jakarta-Medium', fontSize: 12, marginTop: 2 },
})
