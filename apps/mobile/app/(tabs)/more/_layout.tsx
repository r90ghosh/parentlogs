import { Stack } from 'expo-router'

export default function MoreLayout() {
  // initialRouteName is critical with lazy: true on parent Tabs.
  // Without it, deep-pushes into this tab (e.g. the notification bell
  // pushing /(tabs)/more/notification-inbox) mount the Stack with the
  // target screen as the ONLY entry, leaving no index to go back to.
  // "GO_BACK was not handled by any navigator" is the symptom.
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
        animation: 'slide_from_right',
      }}
    />
  )
}
