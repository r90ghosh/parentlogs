import { useEffect } from 'react'
import { View, StyleSheet, type ViewStyle } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated'

type ProgressVariant = 'copper' | 'gold' | 'sage'

const VARIANT_COLORS: Record<ProgressVariant, string> = {
  copper: '#c4703f',
  gold: '#d4a853',
  sage: '#6b8f71',
}

interface ProgressProps {
  value: number
  variant?: ProgressVariant
  height?: number
  style?: ViewStyle
}

export function Progress({
  value,
  variant = 'copper',
  height = 6,
  style,
}: ProgressProps) {
  const reducedMotion = useReducedMotion()
  const clampedValue = Math.min(100, Math.max(0, value))
  const progress = useSharedValue(reducedMotion ? clampedValue : 0)

  useEffect(() => {
    progress.value = reducedMotion
      ? clampedValue
      : withTiming(clampedValue, {
          duration: 500,
          easing: Easing.out(Easing.cubic),
        })
  }, [clampedValue, reducedMotion, progress])

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%` as unknown as number,
    backgroundColor: VARIANT_COLORS[variant],
  }))

  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }, style]}>
      <Animated.View style={[styles.fill, { borderRadius: height / 2 }, fillStyle]} />
    </View>
  )
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: 'rgba(237,230,220,0.08)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
})
