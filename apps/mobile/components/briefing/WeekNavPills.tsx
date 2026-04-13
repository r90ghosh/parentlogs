import { useRef, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  type LayoutChangeEvent,
} from 'react-native'
import { useColors } from '@/hooks/use-colors'

interface WeekNavPillsProps {
  currentWeek: number
  selectedWeek: number | null
  maxWeek: number
  onSelect: (week: number) => void
  taskCountByWeek?: Record<number, number>
  showPhaseLabels?: boolean
  showHeader?: boolean
  onClearSelection?: () => void
}

const PILL_WIDTH = 48
const PILL_GAP = 8
const PILL_TOTAL = PILL_WIDTH + PILL_GAP

const PHASES = [
  { label: 'Trimester 1', startWeek: 1, endWeek: 13 },
  { label: 'Trimester 2', startWeek: 14, endWeek: 27 },
  { label: 'Trimester 3', startWeek: 28, endWeek: 40 },
  { label: 'Post-birth', startWeek: 41, endWeek: Infinity },
] as const

function getActivePhaseIndex(week: number): number {
  return PHASES.findIndex((p) => week >= p.startWeek && week <= p.endWeek)
}

export function WeekNavPills({
  currentWeek,
  selectedWeek,
  maxWeek,
  onSelect,
  taskCountByWeek,
  showPhaseLabels = false,
  showHeader = false,
  onClearSelection,
}: WeekNavPillsProps) {
  const colors = useColors()
  const scrollRef = useRef<ScrollView>(null)
  const containerWidth = useRef(0)

  const scrollToWeek = useCallback(
    (week: number, animated = true) => {
      const offset = Math.max(
        0,
        (week - 1) * PILL_TOTAL - containerWidth.current / 2 + PILL_WIDTH / 2
      )
      scrollRef.current?.scrollTo({ x: offset, animated })
    },
    []
  )

  // Auto-scroll on mount and when selection changes (not on currentWeek change to avoid yanking scroll)
  useEffect(() => {
    const targetWeek = selectedWeek ?? currentWeek
    const timer = setTimeout(() => scrollToWeek(targetWeek), 100)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWeek])

  const handleLayout = (e: LayoutChangeEvent) => {
    containerWidth.current = e.nativeEvent.layout.width
  }

  const weeks = Array.from({ length: maxWeek }, (_, i) => i + 1)
  const activePhaseIndex = getActivePhaseIndex(currentWeek)

  return (
    <View>
      {showHeader && (
        <View style={styles.header}>
          <Text style={[styles.headerLabel, { color: colors.textMuted }]}>Tasks by Week</Text>
          {selectedWeek !== null && onClearSelection && (
            <Pressable onPress={onClearSelection} hitSlop={8}>
              <Text style={[styles.showAllText, { color: colors.copper }]}>Show all</Text>
            </Pressable>
          )}
        </View>
      )}

      {showPhaseLabels && (
        <View style={styles.phaseRow}>
          {PHASES.map((phase, index) => {
            const isActive = index === activePhaseIndex
            return (
              <Pressable
                key={phase.label}
                onPress={() => scrollToWeek(phase.startWeek)}
                hitSlop={{ top: 10, bottom: 10 }}
                style={[
                  styles.phaseItem,
                  { borderBottomColor: colors.border },
                  isActive && { borderBottomColor: colors.copper },
                ]}
              >
                <Text
                  style={[
                    styles.phaseText,
                    { color: colors.textMuted },
                    isActive && { color: colors.copper },
                  ]}
                >
                  {phase.label}
                </Text>
              </Pressable>
            )
          })}
        </View>
      )}

      <View onLayout={handleLayout}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {weeks.map((week) => {
            const isSelected = selectedWeek !== null && week === selectedWeek
            const isCurrent = week === currentWeek
            const count = taskCountByWeek?.[week] ?? 0

            return (
              <Pressable
                key={week}
                onPress={() => onSelect(week)}
                style={[
                  styles.pill,
                  { backgroundColor: colors.subtleBg, borderColor: 'transparent' },
                  isSelected && { backgroundColor: colors.copper, borderColor: colors.copper },
                  isCurrent && !isSelected && { borderColor: colors.copperGlow },
                ]}
              >
                <Text
                  style={[
                    styles.pillText,
                    { color: colors.textMuted },
                    isSelected && { color: colors.textPrimary },
                    isCurrent && !isSelected && { color: colors.copper },
                  ]}
                >
                  {week}
                </Text>
                {isCurrent && (
                  <View
                    style={[
                      styles.currentDot,
                      { backgroundColor: colors.copper },
                      isSelected && { backgroundColor: colors.textPrimary },
                    ]}
                  />
                )}
                {count > 0 && !isSelected && (
                  <View style={[styles.badge, { backgroundColor: 'rgba(196,112,63,0.8)' }]}>
                    <Text style={[styles.badgeText, { color: colors.textPrimary }]}>{count}</Text>
                  </View>
                )}
              </Pressable>
            )
          })}
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  headerLabel: {
    fontFamily: 'Karla-Medium',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  showAllText: {
    fontFamily: 'Karla-Medium',
    fontSize: 12,
  },
  phaseRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  phaseItem: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 6,
    borderBottomWidth: 2,
  },
  phaseText: {
    fontFamily: 'Karla-Medium',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: PILL_GAP,
  },
  pill: {
    width: PILL_WIDTH,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  pillText: {
    fontFamily: 'Karla-Medium',
    fontSize: 14,
  },
  currentDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontFamily: 'Karla-Medium',
    fontSize: 8,
  },
})
