import { Stack } from 'expo-router'

export default function ScreensLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#12100e' },
        presentation: 'modal',
        animation: 'slide_from_bottom',
      }}
    >
      <Stack.Screen name="budget" />
      <Stack.Screen name="checklists" />
      <Stack.Screen name="journey" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="upgrade" />
    </Stack>
  )
}
