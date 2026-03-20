import { useRef, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  type LayoutChangeEvent,
} from 'react-native'

interface WeekNavPillsProps {
  currentWeek: number
  selectedWeek: number
  maxWeek: number
  onSelect: (week: number) => void
}

const PILL_WIDTH = 48
const PILL_GAP = 8
const PILL_TOTAL = PILL_WIDTH + PILL_GAP

export function WeekNavPills({
  currentWeek,
  selectedWeek,
  maxWeek,
  onSelect,
}: WeekNavPillsProps) {
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

  useEffect(() => {
    // Auto-scroll to selected week on mount and when it changes
    const timer = setTimeout(() => scrollToWeek(selectedWeek), 100)
    return () => clearTimeout(timer)
  }, [selectedWeek, scrollToWeek])

  const handleLayout = (e: LayoutChangeEvent) => {
    containerWidth.current = e.nativeEvent.layout.width
  }

  const weeks = Array.from({ length: maxWeek }, (_, i) => i + 1)

  return (
    <View onLayout={handleLayout}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {weeks.map((week) => {
          const isSelected = week === selectedWeek
          const isCurrent = week === currentWeek

          return (
            <Pressable
              key={week}
              onPress={() => onSelect(week)}
              style={[
                styles.pill,
                isSelected && styles.pillSelected,
                isCurrent && !isSelected && styles.pillCurrent,
              ]}
            >
              <Text
                style={[
                  styles.pillText,
                  isSelected && styles.pillTextSelected,
                  isCurrent && !isSelected && styles.pillTextCurrent,
                ]}
              >
                {week}
              </Text>
              {isCurrent && (
                <View
                  style={[
                    styles.currentDot,
                    isSelected && styles.currentDotSelected,
                  ]}
                />
              )}
            </Pressable>
          )
        })}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
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
    backgroundColor: 'rgba(237,230,220,0.06)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  pillSelected: {
    backgroundColor: '#c4703f',
    borderColor: '#c4703f',
  },
  pillCurrent: {
    borderColor: 'rgba(196,112,63,0.4)',
  },
  pillText: {
    fontFamily: 'Karla-Medium',
    fontSize: 14,
    color: '#7a6f62',
  },
  pillTextSelected: {
    color: '#faf6f0',
  },
  pillTextCurrent: {
    color: '#c4703f',
  },
  currentDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#c4703f',
  },
  currentDotSelected: {
    backgroundColor: '#faf6f0',
  },
})
