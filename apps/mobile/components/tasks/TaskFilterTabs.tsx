import { ScrollView, Text, Pressable, StyleSheet, View } from 'react-native'
import * as Haptics from 'expo-haptics'
import { useColors } from '@/hooks/use-colors'

export type TaskTab = 'active' | 'my-tasks' | 'partner' | 'completed' | 'catch-up'

interface TabConfig {
  key: TaskTab
  label: string
  hideIfZero?: boolean
}

const TABS: TabConfig[] = [
  { key: 'active', label: 'Active' },
  { key: 'my-tasks', label: 'My Tasks' },
  { key: 'partner', label: "Partner's" },
  { key: 'completed', label: 'Completed' },
  { key: 'catch-up', label: 'Catch-Up', hideIfZero: true },
]

interface TaskFilterTabsProps {
  activeTab: TaskTab
  onTabPress: (tab: TaskTab) => void
  catchUpCount: number
}

export function TaskFilterTabs({ activeTab, onTabPress, catchUpCount }: TaskFilterTabsProps) {
  const colors = useColors()

  const visibleTabs = TABS.filter(
    (tab) => !(tab.hideIfZero && catchUpCount === 0)
  )

  const handlePress = (key: TaskTab) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onTabPress(key)
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {visibleTabs.map((tab) => {
        const isActive = activeTab === tab.key

        return (
          <Pressable
            key={tab.key}
            onPress={() => handlePress(tab.key)}
            style={[
              styles.pill,
              { backgroundColor: colors.pressed, borderColor: colors.subtleBg },
              isActive && { backgroundColor: colors.copperDim, borderColor: colors.copperGlow },
            ]}
          >
            <Text
              style={[
                styles.pillText,
                { color: colors.textMuted },
                isActive && { color: colors.copper },
              ]}
            >
              {tab.label}
            </Text>
            {tab.key === 'catch-up' && catchUpCount > 0 && (
              <View style={[styles.badge, { backgroundColor: colors.goldGlow }]}>
                <Text style={[styles.badgeText, { color: colors.gold }]}>{catchUpCount}</Text>
              </View>
            )}
          </Pressable>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 8,
    paddingVertical: 2,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  pillText: {
    fontFamily: 'Karla-Medium',
    fontSize: 13,
  },
  badge: {
    borderRadius: 8,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {
    fontFamily: 'Karla-Bold',
    fontSize: 10,
  },
})
