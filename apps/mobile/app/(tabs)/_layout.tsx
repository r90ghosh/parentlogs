import { Tabs } from 'expo-router'
import { Platform, StyleSheet, View } from 'react-native'
import { BlurView } from 'expo-blur'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  Home,
  CheckSquare,
  BookOpen,
  Activity,
  MoreHorizontal,
} from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { BabySwitcher } from '@/components/BabySwitcher'

function TabHeader() {
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
      <BabySwitcher />
    </View>
  )
}

export default function TabLayout() {
  return (
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12100e',
  },
  header: {
    backgroundColor: '#12100e',
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(237,230,220,0.06)',
  },
})
