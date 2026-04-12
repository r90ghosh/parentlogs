import { useEffect } from 'react'
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'

interface RevealOnScrollProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  offset?: number
}

export function RevealOnScroll({
  children,
  delay = 0,
  duration = 500,
  offset = 20,
}: RevealOnScrollProps) {
  const reducedMotion = useReducedMotion()
  const opacity = useSharedValue(reducedMotion ? 1 : 0)
  const translateY = useSharedValue(reducedMotion ? 0 : offset)

  useEffect(() => {
    if (reducedMotion) return

    const timingConfig = { duration, easing: Easing.out(Easing.cubic) }

    opacity.value = withDelay(delay, withTiming(1, timingConfig))
    translateY.value = withDelay(delay, withTiming(0, timingConfig))
  }, [delay, duration, offset, reducedMotion])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  )
}
