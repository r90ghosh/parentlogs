import { useRef, useEffect } from 'react'
import { Pressable, Text, StyleSheet, ScrollView, type ViewStyle } from 'react-native'
import * as Haptics from 'expo-haptics'

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
            style={[styles.tab, isActive && styles.tabActive]}
          >
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
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
  tabActive: {
    backgroundColor: '#c4703f',
  },
  tabText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 13,
    color: '#7a6f62',
  },
  tabTextActive: {
    color: '#faf6f0',
  },
})
