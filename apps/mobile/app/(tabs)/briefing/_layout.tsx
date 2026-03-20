import { Stack } from 'expo-router'

export default function BriefingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#12100e' },
      }}
    />
  )
}
