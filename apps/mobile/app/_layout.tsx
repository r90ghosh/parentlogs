import { useEffect, useState } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'
import { useFonts } from 'expo-font'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { RevenueCatProvider } from '@/components/providers/RevenueCatProvider'
import { NetworkProvider } from '@/components/providers/NetworkProvider'
import { ThemeProvider, useTheme } from '@/components/providers/ThemeProvider'
import { AppBackground } from '@/components/shared/AppBackground'
import { NotificationListener } from '@/components/providers/NotificationListener'
import { initSentry, Sentry } from '@/lib/sentry'
import { initAnalytics } from '@/lib/analytics'
import { ScreenEngagementTracker } from '@/hooks/use-screen-engagement'
import '../global.css'

export {
  ErrorBoundary,
} from 'expo-router'

// Initialize Sentry before anything else
initSentry()

SplashScreen.preventAutoHideAsync().catch(() => {})

function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    'PlayfairDisplay-Bold': require('../assets/fonts/PlayfairDisplay-Bold.ttf'),
    'Jost-Regular': require('../assets/fonts/Jost-Regular.ttf'),
    'Jost-Medium': require('../assets/fonts/Jost-Medium.ttf'),
    'Karla-Regular': require('../assets/fonts/Karla-Regular.ttf'),
    'Karla-Medium': require('../assets/fonts/Karla-Medium.ttf'),
    'Karla-SemiBold': require('../assets/fonts/Karla-SemiBold.ttf'),
  })

  const [fontsTimedOut, setFontsTimedOut] = useState(false)

  // Fallback: if fonts don't load in 4s, proceed anyway (system font will render)
  useEffect(() => {
    const timer = setTimeout(() => setFontsTimedOut(true), 4000)
    return () => clearTimeout(timer)
  }, [])

  const ready = fontsLoaded || !!fontsError || fontsTimedOut

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync().catch(() => {})
      const cleanup = initAnalytics()
      return cleanup
    }
  }, [ready])

  if (!ready) return null

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryProvider>
        <AuthProvider>
          <RevenueCatProvider>
            <NetworkProvider>
              <ThemeProvider>
                <RootContent />
              </ThemeProvider>
            </NetworkProvider>
          </RevenueCatProvider>
        </AuthProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  )
}

function RootContent() {
  const { isDark } = useTheme()

  return (
    <>
      <AppBackground />
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScreenEngagementTracker />
      <NotificationListener />
      <Stack screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
      }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(guest)" />
        <Stack.Screen name="(screens)" options={{ presentation: 'modal' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  )
}

// Wrap with Sentry for automatic error boundary
export default Sentry.wrap(RootLayout)
