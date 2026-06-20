import { useState, useCallback, useMemo } from 'react'
import { View, Text, ScrollView, Pressable, RefreshControl, Modal, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { ArrowRight, X } from 'lucide-react-native'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/components/providers/AuthProvider'
import { useColors } from '@/hooks/use-colors'
import { MedicalDisclaimer } from '@/components/shared/MedicalDisclaimer'
import { useCurrentBriefing, useBriefingByWeek } from '@/hooks/use-briefings'
import { useBriefingDone } from '@/hooks/use-briefing-done'
import { isPregnancyStage } from '@tdc/shared/utils/pregnancy-utils'
import { getBabySize } from '@tdc/shared/utils/baby-sizes'
import type { FamilyStage } from '@tdc/shared/types'
import { buildBriefingDigest, categoryColor } from '@/lib/briefing-digest'
import { DigestRow, DigestHero, WeekStepper, FieldNoteCard, SectionLabel } from '@/components/digest'
import { WeekNavPills } from '@/components/briefing'
import { BriefingSkeleton } from '@/components/skeletons'

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
  const role = profile?.role ?? 'dad'

  const [selectedWeek, setSelectedWeek] = useState<number>(currentWeek)
  const [refreshing, setRefreshing] = useState(false)
  const [jumpOpen, setJumpOpen] = useState(false)

  const isViewingCurrent = selectedWeek === currentWeek
  const { data: currentBriefing, isLoading: currentLoading } = useCurrentBriefing()
  const { data: weekBriefing, isLoading: weekLoading } = useBriefingByWeek(stage, selectedWeek)

  const briefing = isViewingCurrent ? currentBriefing : weekBriefing
  const isLoading = isViewingCurrent ? currentLoading : weekLoading
  const babySize = isPregnancy ? getBabySize(selectedWeek) : undefined

  const digest = useMemo(
    () => (briefing ? buildBriefingDigest(briefing, babySize, role, { isPregnancy }) : null),
    [briefing, babySize, role, isPregnancy]
  )

  const { done, toggle } = useBriefingDone(profile?.family_id, stage, selectedWeek)

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await queryClient.invalidateQueries({ queryKey: ['current-briefing'] })
    await queryClient.invalidateQueries({ queryKey: ['briefing'] })
    setRefreshing(false)
  }, [queryClient])

  const stepWeek = (dir: -1 | 1) => {
    setSelectedWeek((w) => Math.min(maxWeek, Math.max(1, w + dir)))
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 90 }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
        showsVerticalScrollIndicator={false}
      >
        <WeekStepper
          title="Briefing"
          label={`Week ${selectedWeek}`}
          onPrev={() => stepWeek(-1)}
          onNext={() => stepWeek(1)}
          prevDisabled={selectedWeek <= 1}
          nextDisabled={selectedWeek >= maxWeek}
          onPressLabel={() => setJumpOpen(true)}
        />

        {isLoading && <BriefingSkeleton />}

        {!isLoading && !briefing && (
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              No briefing available for Week {selectedWeek}.
            </Text>
            {!isViewingCurrent && (
              <Text style={[styles.backLink, { color: colors.accentInk }]} onPress={() => setSelectedWeek(currentWeek)}>
                ← Back to current week (Week {currentWeek})
              </Text>
            )}
          </View>
        )}

        {!isLoading && briefing && digest && (
          <>
            <DigestHero
              title={`Week ${digest.hero.week}`}
              sub={digest.hero.sub}
              progressPct={digest.hero.progressPct}
              tldr={digest.hero.tldr}
            />

            {!isViewingCurrent && (
              <Text
                style={[styles.backLinkInline, { color: colors.accentInk }]}
                onPress={() => setSelectedWeek(currentWeek)}
              >
                ← Back to current week (Week {currentWeek})
              </Text>
            )}

            <SectionLabel>This week</SectionLabel>
            {digest.items.map((item) => (
              <DigestRow
                key={item.key}
                category={{ label: item.label, color: categoryColor(item.categoryKey, colors) }}
                headline={item.headline}
                detail={item.detail}
                checkable={item.checkable}
                checked={item.doIndex != null ? !!done[item.doIndex] : undefined}
                onToggleCheck={item.doIndex != null ? () => toggle(item.doIndex!) : undefined}
              />
            ))}

            {digest.fieldNote && <FieldNoteCard quote={digest.fieldNote} />}

            {digest.next && (
              <DigestRow
                category={{ label: digest.next.label, color: categoryColor(digest.next.categoryKey, colors) }}
                headline={digest.next.headline}
                detail={digest.next.detail}
              />
            )}

            <Pressable
              onPress={() => router.push(`/(tabs)/briefing/${selectedWeek}` as never)}
              style={({ pressed }) => [
                styles.ffull,
                { backgroundColor: colors.card, borderColor: colors.line, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={[styles.ffullText, { color: colors.accentInk }]}>Read the full briefing</Text>
              <ArrowRight size={16} color={colors.accentInk} strokeWidth={2} />
            </Pressable>

            <Text style={[styles.fsrc, { color: colors.faint }]}>
              Source-referenced{briefing.medical_source ? ` · ${briefing.medical_source}` : ''} · Not medical advice
            </Text>

            <MedicalDisclaimer />
          </>
        )}
      </ScrollView>

      {/* Jump-to-week sheet (reuses WeekNavPills on demand) */}
      <Modal visible={jumpOpen} transparent animationType="slide" onRequestClose={() => setJumpOpen(false)}>
        <Pressable style={[styles.sheetBackdrop, { backgroundColor: colors.overlay }]} onPress={() => setJumpOpen(false)}>
          <Pressable style={[styles.sheet, { backgroundColor: colors.card, paddingBottom: insets.bottom + 16 }]} onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetHead}>
              <Text style={[styles.sheetTitle, { color: colors.ink }]}>Jump to week</Text>
              <Pressable onPress={() => setJumpOpen(false)} hitSlop={10}>
                <X size={20} color={colors.ink2} />
              </Pressable>
            </View>
            <WeekNavPills
              currentWeek={currentWeek}
              selectedWeek={selectedWeek}
              maxWeek={maxWeek}
              showPhaseLabels
              onSelect={(week) => {
                setSelectedWeek(week)
                setJumpOpen(false)
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingTop: 4 },
  empty: { paddingHorizontal: 24, paddingVertical: 48, alignItems: 'center' },
  emptyText: { fontFamily: 'Jakarta-Medium', fontSize: 15, textAlign: 'center' },
  backLink: { fontFamily: 'Jakarta-SemiBold', fontSize: 14, marginTop: 14 },
  backLinkInline: { fontFamily: 'Jakarta-SemiBold', fontSize: 13, paddingHorizontal: 22, paddingTop: 4 },
  ffull: {
    marginHorizontal: 22,
    marginTop: 18,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ffullText: { fontFamily: 'Jakarta-Bold', fontSize: 14 },
  fsrc: { fontFamily: 'Jakarta-Medium', fontSize: 11, textAlign: 'center', paddingTop: 14, paddingHorizontal: 24, letterSpacing: 0.3 },
  sheetBackdrop: { flex: 1, justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 16 },
  sheetHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22, paddingBottom: 8 },
  sheetTitle: { fontFamily: 'Jakarta-Bold', fontSize: 17 },
})
