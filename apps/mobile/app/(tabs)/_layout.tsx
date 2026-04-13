import React, { useCallback } from 'react'
import { Tabs, useRouter, useSegments } from 'expo-router'
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
import { useColors } from '@/hooks/use-colors'
import { AnimatedTabBar } from '@/components/animations/TabIndicator'

const NotificationBell = React.memo(function NotificationBell() {
  const router = useRouter()
  const { data: unreadCount } = useUnreadNotificationCount()
  const colors = useColors()
  const count = unreadCount ?? 0

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        router.push('/(tabs)/more/notification-inbox')
      }}
      style={styles.bellButton}
      accessibilityLabel={count > 0 ? `Notifications, ${count} unread` : 'Notifications'}
      accessibilityRole="button"
    >
      <Bell size={20} color={colors.textMuted} />
      {count > 0 && (
        <View style={[styles.badge, { backgroundColor: colors.copper, borderColor: colors.bg }]}>
          <Text style={[styles.badgeText, { color: colors.textPrimary }]}>
            {count > 99 ? '99+' : count}
          </Text>
        </View>
      )}
    </Pressable>
  )
})

function TabHeader() {
  const insets = useSafeAreaInsets()
  const colors = useColors()
  const segments = useSegments()

  // On More sub-screens: show compact header with just the notification bell
  const isMoreSubScreen =
    segments.length >= 3 &&
    segments[1] === 'more' &&
    segments[2] !== undefined &&
    (segments[2] as string) !== 'index'

  const compactStyle = [
    styles.headerCompact,
    { paddingTop: insets.top + 4, borderBottomColor: colors.subtleBg },
  ]

  const fullStyle = [
    styles.header,
    { paddingTop: insets.top + 8, borderBottomColor: colors.subtleBg },
  ]

  const headerStyle = isMoreSubScreen ? compactStyle : fullStyle

  // Render bell OUTSIDE BlurView to prevent iOS clipping
  if (Platform.OS === 'ios') {
    return (
      <View style={{ position: 'relative' }}>
        <BlurView
          tint={colors.blurTint}
          intensity={colors.headerBlurIntensity}
          style={headerStyle}
        >
          {isMoreSubScreen ? <View style={{ flex: 1 }} /> : <BabySwitcher />}
          {/* Spacer for the bell area */}
          <View style={styles.bellButton} />
        </BlurView>
        {/* Bell rendered outside BlurView so badge isn't clipped */}
        <View style={[styles.bellOverlay, { top: (isMoreSubScreen ? insets.top + 4 : insets.top + 8) }]}>
          <NotificationBell />
        </View>
      </View>
    )
  }

  return (
    <View style={[headerStyle, { backgroundColor: colors.surface }]}>
      {isMoreSubScreen ? <View style={{ flex: 1 }} /> : <BabySwitcher />}
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  headerCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  headerSpacer: {
    flex: 1,
  },
  bellButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellOverlay: {
    position: 'absolute',
    right: 16,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
  },
  badgeText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 10,
    lineHeight: 12,
  },
})
