import { Stack } from 'expo-router'

export default function TrackerLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#12100e' },
      }}
    />
  )
}
