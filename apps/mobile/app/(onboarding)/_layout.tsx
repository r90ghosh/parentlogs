import { Stack } from 'expo-router'
import { useColors } from '@/hooks/use-colors'

export default function OnboardingLayout() {
  const colors = useColors()

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="role" />
      <Stack.Screen name="family" />
      <Stack.Screen name="invite" />
      <Stack.Screen name="ready" />
    </Stack>
  )
}
