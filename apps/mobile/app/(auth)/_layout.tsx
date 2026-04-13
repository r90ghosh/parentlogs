import { View } from 'react-native'
import { Stack } from 'expo-router'
import { AppBackground } from '@/components/shared/AppBackground'

export default function AuthLayout() {
  return (
    <View style={{ flex: 1 }}>
      <AppBackground /> {/* Landing page keeps particles for visual appeal */}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="landing" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="forgot-password" />
      </Stack>
    </View>
  )
}
