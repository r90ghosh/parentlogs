import { Stack } from 'expo-router'

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#12100e' },
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
