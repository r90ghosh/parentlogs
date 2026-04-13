import { Tabs } from 'expo-router'
import { Platform, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Compass, CreditCard, Home } from 'lucide-react-native'

export default function GuestLayout() {
  const insets = useSafeAreaInsets()

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: 'transparent' },
          tabBarStyle: {
            backgroundColor: Platform.OS === 'ios' ? 'rgba(26,23,20,0.85)' : 'rgba(26,23,20,0.97)',
            borderTopColor: 'rgba(237,230,220,0.08)',
            borderTopWidth: 1,
            paddingBottom: insets.bottom || 8,
            height: 56 + (insets.bottom || 8),
          },
          tabBarActiveTintColor: '#c4703f',
          tabBarInactiveTintColor: '#4a4239',
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
    backgroundColor: '#12100e',
  },
})
