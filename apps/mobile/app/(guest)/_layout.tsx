import { Tabs } from 'expo-router'
import { Platform, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Compass, CreditCard, Home } from 'lucide-react-native'
import { useColors } from '@/hooks/use-colors'
import { AppBackground } from '@/components/shared/AppBackground'

export default function GuestLayout() {
  const colors = useColors()
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      <AppBackground />
      <Tabs
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: 'transparent' },
          tabBarStyle: {
            backgroundColor: Platform.OS === 'ios' ? colors.glassBg : colors.surface,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            paddingBottom: insets.bottom || 8,
            height: 56 + (insets.bottom || 8),
          },
          tabBarActiveTintColor: colors.copper,
          tabBarInactiveTintColor: colors.textDim,
          tabBarLabelStyle: {
            fontFamily: 'Karla-Medium',
            fontSize: 11,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Home size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color, size }) => (
              <Compass size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="pricing"
          options={{
            title: 'Pricing',
            tabBarIcon: ({ color, size }) => (
              <CreditCard size={size} color={color} />
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
  },
})
