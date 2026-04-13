import { Tabs } from 'expo-router'
import { Platform, Pressable, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Compass, CreditCard, Home, Sun, Moon } from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { useColors } from '@/hooks/use-colors'
import { useTheme } from '@/components/providers/ThemeProvider'
import { AppBackground } from '@/components/shared/AppBackground'

export default function GuestLayout() {
  const colors = useColors()
  const { isDark, setTheme } = useTheme()
  const insets = useSafeAreaInsets()

  const toggleTheme = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      <AppBackground />

      {/* Theme toggle for guest users */}
      <Pressable
        onPress={toggleTheme}
        style={[styles.themeToggle, { top: insets.top + 10, backgroundColor: colors.subtleBg }]}
        accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        accessibilityRole="button"
      >
        {isDark ? (
          <Sun size={18} color={colors.gold} />
        ) : (
          <Moon size={18} color={colors.copper} />
        )}
      </Pressable>

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
  themeToggle: {
    position: 'absolute',
    right: 16,
    zIndex: 10,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
