import { useEffect } from 'react'
import { StyleSheet, type ViewStyle } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated'
import { useColors } from '@/hooks/use-colors'

/**
 * Shared-value-backed shimmer primitive. One shared value drives the whole
 * skeleton tree — N blocks don't spawn N worklets. All blocks shimmer in
 * sync via the animated style, which is cheap.
 */
const skeletonPulse = {
  value: 0.5 as number,
  initialized: false,
}

interface SkeletonBlockProps {
  height?: number
  width?: number | string
  radius?: number
  style?: ViewStyle | ViewStyle[]
}

export function SkeletonBlock({ height = 16, width = '100%', radius = 8, style }: SkeletonBlockProps) {
  const colors = useColors()
  const reducedMotion = useReducedMotion()
  const pulse = useSharedValue(0.5)

  useEffect(() => {
    if (reducedMotion) return
    pulse.value = withRepeat(
      withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    )
  }, [reducedMotion])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 0.35 + pulse.value * 0.35,
  }))

  return (
    <Animated.View
      style={[
        styles.base,
        { height, width: width as number | `${number}%`, borderRadius: radius, backgroundColor: colors.subtleBg },
        animatedStyle,
        style,
      ]}
    />
  )
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
})
