import { useRef } from 'react'
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native'
import { Target, CalendarDays, CheckCircle2, Users, Inbox } from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { useColors, type ColorTokens } from '@/hooks/use-colors'
import type { TaskStats } from '@tdc/shared/types'

export type StatFilter = 'due-today' | 'this-week' | 'completed' | 'partner' | 'catch-up'

interface StatCardConfig {
  key: StatFilter
  label: string
  icon: typeof Target
  colorKey: keyof Pick<ColorTokens, 'copper' | 'sky' | 'sage' | 'rose' | 'gold'>
  bgKey: keyof Pick<ColorTokens, 'copperDim' | 'skyDim' | 'sageDim' | 'roseDim' | 'goldDim'>
  getValue: (stats: TaskStats) => number
  hideIfZero?: boolean
}

const STAT_CARDS: StatCardConfig[] = [
  {
    key: 'due-today',
    label: 'Due Today',
    icon: Target,
    colorKey: 'copper',
    bgKey: 'copperDim',
    getValue: (s) => s.dueToday,
  },
  {
    key: 'this-week',
    label: 'This Week',
    icon: CalendarDays,
    colorKey: 'sky',
    bgKey: 'skyDim',
    getValue: (s) => s.thisWeek,
  },
  {
    key: 'completed',
    label: 'Completed',
    icon: CheckCircle2,
    colorKey: 'sage',
    bgKey: 'sageDim',
    getValue: (s) => s.completed,
  },
  {
    key: 'partner',
    label: "Partner's",
    icon: Users,
    colorKey: 'rose',
    bgKey: 'roseDim',
    getValue: (s) => s.partnerTasks,
  },
  {
    key: 'catch-up',
    label: 'Catch-Up',
    icon: Inbox,
    colorKey: 'gold',
    bgKey: 'goldDim',
    getValue: (s) => s.catchUpQueue,
    hideIfZero: true,
  },
]

interface TaskStatsRowProps {
  stats: TaskStats
  activeFilter: StatFilter | null
  onFilterPress: (filter: StatFilter | null) => void
}

export function TaskStatsRow({ stats, activeFilter, onFilterPress }: TaskStatsRowProps) {
  const scrollRef = useRef<ScrollView>(null)
  const colors = useColors()

  // Filter out cards with hideIfZero when value is 0
  const visibleCards = STAT_CARDS.filter(
    (card) => !(card.hideIfZero && card.getValue(stats) === 0)
  )

  const handlePress = (key: StatFilter) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onFilterPress(activeFilter === key ? null : key)
  }

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {visibleCards.map((card) => {
        const isActive = activeFilter === card.key
        const value = card.getValue(stats)
        const Icon = card.icon
        const cardColor = colors[card.colorKey]
        const cardBg = colors[card.bgKey]

        return (
          <Pressable
            key={card.key}
            onPress={() => handlePress(card.key)}
            style={({ pressed }) => [
              styles.card,
              { backgroundColor: cardBg },
              isActive && { borderColor: cardColor, borderWidth: 1.5 },
              !isActive && { borderColor: colors.subtleBg, borderWidth: 1 },
              pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] },
            ]}
          >
            <View style={styles.cardHeader}>
              <Icon size={14} color={isActive ? cardColor : colors.textMuted} />
            </View>
            <Text
              style={[
                styles.cardValue,
                { color: isActive ? cardColor : colors.textPrimary },
              ]}
            >
              {value}
            </Text>
            <Text
              style={[
                styles.cardLabel,
                { color: isActive ? cardColor : colors.textMuted },
              ]}
            >
              {card.label}
            </Text>
          </Pressable>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 10,
    paddingVertical: 4,
  },
  card: {
    width: 88,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 14,
    alignItems: 'center',
    gap: 4,
  },
  cardHeader: {
    marginBottom: 2,
  },
  cardValue: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 22,
  },
  cardLabel: {
    fontFamily: 'Karla-Medium',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
})
