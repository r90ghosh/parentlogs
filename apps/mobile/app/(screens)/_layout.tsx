import { Stack } from 'expo-router'
import { useTheme } from '@/components/providers/ThemeProvider'

export default function ScreensLayout() {
  const { isDark } = useTheme()
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: isDark ? '#12100e' : '#f5f7fa' },
        presentation: 'modal',
        animation: 'slide_from_bottom',
      }}
    >
      <Stack.Screen name="budget" />
      <Stack.Screen name="checklists" />
      <Stack.Screen name="journey" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="notification-inbox" />
      <Stack.Screen name="upgrade" />
      <Stack.Screen name="change-password" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="family" />
      <Stack.Screen name="create-task" />
      <Stack.Screen name="help" />
      <Stack.Screen name="triage" />
      <Stack.Screen name="briefing-archive" />
      <Stack.Screen name="tracker-summary" />
      <Stack.Screen name="content" />
      <Stack.Screen name="article" />
      <Stack.Screen name="about" />
      <Stack.Screen name="faq" />
      <Stack.Screen name="appearance" />
      <Stack.Screen name="upgrade-success" />
      <Stack.Screen name="feedback" />
      <Stack.Screen name="personalize" />
    </Stack>
  )
}
