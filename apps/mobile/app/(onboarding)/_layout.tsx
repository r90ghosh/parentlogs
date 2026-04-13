import { View } from 'react-native'
import { Stack } from 'expo-router'
import { AppBackground } from '@/components/shared/AppBackground'

export default function OnboardingLayout() {
  return (
    <View style={{ flex: 1 }}>
      <AppBackground particles={false} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="welcome" />
        <Stack.Screen name="role" />
        <Stack.Screen name="family" />
        <Stack.Screen name="invite" />
        <Stack.Screen name="ready" />
      </Stack>
    </View>
  )
}
