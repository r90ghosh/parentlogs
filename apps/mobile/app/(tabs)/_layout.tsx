import React, { useCallback } from 'react'
import { Tabs, useRouter } from 'expo-router'
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import { BlurView } from 'expo-blur'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  Home,
  CheckSquare,
  BookOpen,
  Activity,
  MoreHorizontal,
  Bell,
} from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { BabySwitcher } from '@/components/BabySwitcher'
import { useUnreadNotificationCount } from '@/hooks/use-notifications'
import { useRealtimeSync } from '@/hooks/use-realtime-sync'
import { ToastProvider } from '@/components/ui/Toast'
import { useTheme } from '@/components/providers/ThemeProvider'
import { AnimatedTabBar } from '@/components/animations/TabIndicator'

const NotificationBell = React.memo(function NotificationBell() {
  const router = useRouter()
  const { data: unreadCount } = useUnreadNotificationCount()
  const { isDark } = useTheme()
  const count = unreadCount ?? 0

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        router.push('/(screens)/notification-inbox')
      }}
      style={styles.bellButton}
      accessibilityLabel={count > 0 ? `Notifications, ${count} unread` : 'Notifications'}
      accessibilityRole="button"
    >
      <Bell size={20} color={isDark ? '#7a6f62' : '#6b7280'} />
      {count > 0 && (
        <View style={[styles.badge, !isDark && { borderColor: '#f5f7fa' }]}>
          <Text style={styles.badgeText}>
            {count > 99 ? '99+' : count}
          </Text>
        </View>
      )}
    </Pressable>
  )
})

function TabHeader() {
  const insets = useSafeAreaInsets()
  const { isDark } = useTheme()

  return (
    <View style={[
      styles.header,
      { paddingTop: insets.top + 8 },
      !isDark && {
        backgroundColor: 'transparent',
        borderBottomColor: 'rgba(0,0,0,0.06)',
      },
    ]}>
      <BabySwitcher />
      <NotificationBell />
    </View>
  )
}

export default function TabLayout() {
  useRealtimeSync()
  const { isDark } = useTheme()

  const renderTabBar = useCallback(
    (props: any) => <AnimatedTabBar {...props} isDark={isDark} />,
    [isDark]
  )

  return (
    <ToastProvider>
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      <TabHeader />
      <Tabs
        tabBar={renderTabBar}
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: 'transparent' },
        }}
        screenListeners={{
          tabPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarAccessibilityLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Home size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            title: 'Tasks',
            tabBarAccessibilityLabel: 'Tasks',
            tabBarIcon: ({ color, size }) => (
              <CheckSquare size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="briefing"
          options={{
            title: 'Briefing',
            tabBarAccessibilityLabel: 'Briefing',
            tabBarIcon: ({ color, size }) => (
              <BookOpen size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="tracker"
          options={{
            title: 'Tracker',
            tabBarAccessibilityLabel: 'Tracker',
            tabBarIcon: ({ color, size }) => (
              <Activity size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="more"
          options={{
            title: 'More',
            tabBarAccessibilityLabel: 'More menu',
            tabBarIcon: ({ color, size }) => (
              <MoreHorizontal size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
    </ToastProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12100e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#12100e',
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(237,230,220,0.06)',
  },
  bellButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 0,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#c4703f',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#12100e',
  },
  badgeText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 10,
    color: '#faf6f0',
    lineHeight: 12,
  },
})
