import { useEffect } from 'react'
import { type DimensionValue, StyleSheet, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'
import { useColors } from '@/hooks/use-colors'

interface CopperDividerProps {
  delay?: number
  width?: DimensionValue
}

export function CopperDivider({ delay = 0, width = '100%' }: CopperDividerProps) {
  const reducedMotion = useReducedMotion()
  const colors = useColors()
  const lineProgress = useSharedValue(reducedMotion ? 1 : 0)
  const dotOpacity = useSharedValue(reducedMotion ? 0 : 1)

  useEffect(() => {
    if (reducedMotion) return

    lineProgress.value = withDelay(
      delay,
      withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) })
    )

    dotOpacity.value = withDelay(
      delay + 700,
      withTiming(0, { duration: 300 })
    )
  }, [delay, reducedMotion])

  const lineStyle = useAnimatedStyle(() => ({
    width: `${lineProgress.value * 100}%` as `${number}%`,
  }))

  const dotStyle = useAnimatedStyle(() => ({
    left: `${lineProgress.value * 100}%` as `${number}%`,
    opacity: dotOpacity.value,
  }))

  return (
    <View style={[styles.container, { width }]}>
      <Animated.View style={[styles.line, { backgroundColor: colors.copper }, lineStyle]} />
      <Animated.View style={[styles.dot, { backgroundColor: colors.gold }, dotStyle]} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 6,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  line: {
    height: 1,
  },
  dot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: -3,
  },
})
