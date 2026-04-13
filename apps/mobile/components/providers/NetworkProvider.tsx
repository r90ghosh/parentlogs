import { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import Animated, { FadeInUp, FadeOutUp, useReducedMotion } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useColors } from '@/hooks/use-colors'

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion()
  const colors = useColors()
  const [isConnected, setIsConnected] = useState(true)
  const insets = useSafeAreaInsets()

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? true)
    })
    return () => unsubscribe()
  }, [])

  return (
    <View style={styles.container}>
      {!isConnected && (
        <Animated.View
          entering={reducedMotion ? undefined : FadeInUp.duration(300)}
          exiting={reducedMotion ? undefined : FadeOutUp.duration(300)}
          style={[styles.banner, { backgroundColor: colors.coral, paddingTop: insets.top + 4 }]}
        >
          <Text style={[styles.bannerText, { color: colors.textPrimary }]}>No internet connection</Text>
        </Animated.View>
      )}
      <View style={styles.content}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  banner: {
    paddingBottom: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    zIndex: 999,
  },
  bannerText: {
    fontFamily: 'Karla-Medium',
    fontSize: 13,
  },
})
