import { Stack } from 'expo-router'

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#12100e' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="landing" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  )
}
