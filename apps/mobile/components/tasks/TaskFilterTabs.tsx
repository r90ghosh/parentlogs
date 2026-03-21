import { ScrollView, Text, Pressable, StyleSheet, View } from 'react-native'
import * as Haptics from 'expo-haptics'

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
              isActive && styles.pillActive,
            ]}
          >
            <Text
              style={[
                styles.pillText,
                isActive && styles.pillTextActive,
              ]}
            >
              {tab.label}
            </Text>
            {tab.key === 'catch-up' && catchUpCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{catchUpCount}</Text>
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
    backgroundColor: 'rgba(237,230,220,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(237,230,220,0.06)',
    gap: 6,
  },
  pillActive: {
    backgroundColor: 'rgba(196,112,63,0.15)',
    borderColor: 'rgba(196,112,63,0.4)',
  },
  pillText: {
    fontFamily: 'Karla-Medium',
    fontSize: 13,
    color: '#7a6f62',
  },
  pillTextActive: {
    color: '#c4703f',
  },
  badge: {
    backgroundColor: 'rgba(212,168,83,0.25)',
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
    color: '#d4a853',
  },
})
