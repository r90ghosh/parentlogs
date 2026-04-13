import { View } from 'react-native'
import { Stack } from 'expo-router'
import { AppBackground } from '@/components/shared/AppBackground'

export default function ScreensLayout() {
  return (
    <View style={{ flex: 1 }}>
      <AppBackground />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
          presentation: 'fullScreenModal',
          animation: 'slide_from_bottom',
        }}
      >
        <Stack.Screen name="upgrade" />
        <Stack.Screen name="upgrade-success" />
        <Stack.Screen name="create-task" />
        <Stack.Screen name="appearance" />
      </Stack>
    </View>
  )
}
