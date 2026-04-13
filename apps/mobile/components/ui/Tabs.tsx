import { useRef, useEffect } from 'react'
import { Pressable, Text, StyleSheet, ScrollView, type ViewStyle } from 'react-native'
import * as Haptics from 'expo-haptics'
import { useColors } from '@/hooks/use-colors'

interface Tab {
  key: string
  label: string
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (key: string) => void
  style?: ViewStyle
}

export function Tabs({ tabs, activeTab, onTabChange, style }: TabsProps) {
  const colors = useColors()
  const scrollRef = useRef<ScrollView>(null)

  // Scroll active tab into view on mount
  useEffect(() => {
    const activeIndex = tabs.findIndex((t) => t.key === activeTab)
    if (activeIndex > 0 && scrollRef.current) {
      // Rough estimate: each pill ~90px wide, scroll to center it
      scrollRef.current.scrollTo({ x: Math.max(0, activeIndex * 90 - 60), animated: true })
    }
  }, [activeTab, tabs])

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.container, style]}
    >
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab
        return (
          <Pressable
            key={tab.key}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              onTabChange(tab.key)
            }}
            style={[styles.tab, isActive && { backgroundColor: colors.copper }]}
          >
            <Text style={[styles.tabText, { color: colors.textMuted }, isActive && { color: colors.textPrimary }]}>
              {tab.label}
            </Text>
          </Pressable>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  tabText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 13,
  },
})
