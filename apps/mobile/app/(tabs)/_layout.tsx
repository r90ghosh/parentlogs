import React from 'react'
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

const NotificationBell = React.memo(function NotificationBell() {
  const router = useRouter()
  const { data: unreadCount } = useUnreadNotificationCount()
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
      <Bell size={20} color="#7a6f62" />
      {count > 0 && (
        <View style={styles.badge}>
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

  return (
    <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
      <BabySwitcher />
      <NotificationBell />
    </View>
  )
}

export default function TabLayout() {
  useRealtimeSync()

  return (
    <ToastProvider>
    <View style={styles.container}>
      <TabHeader />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#c4703f',
          tabBarInactiveTintColor: '#7a6f62',
          tabBarLabelStyle: {
            fontFamily: 'Karla-Medium',
            fontSize: 11,
          },
          tabBarStyle: {
            position: 'absolute',
            borderTopWidth: 1,
            borderTopColor: 'rgba(237,230,220,0.08)',
            backgroundColor:
              Platform.OS === 'ios' ? 'transparent' : 'rgba(26,23,20,0.95)',
            elevation: 0,
          },
          tabBarBackground: () =>
            Platform.OS === 'ios' ? (
              <BlurView
                tint="dark"
                intensity={80}
                style={StyleSheet.absoluteFill}
              />
            ) : null,
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
            tabBarIcon: ({ color, size }) => (
              <Home size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            title: 'Tasks',
            tabBarIcon: ({ color, size }) => (
              <CheckSquare size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="briefing"
          options={{
            title: 'Briefing',
            tabBarIcon: ({ color, size }) => (
              <BookOpen size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="tracker"
          options={{
            title: 'Tracker',
            tabBarIcon: ({ color, size }) => (
              <Activity size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="more"
          options={{
            title: 'More',
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
