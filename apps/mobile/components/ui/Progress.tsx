import { useEffect } from 'react'
import { View, type ViewStyle } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated'
import { useColors, type ColorTokens } from '@/hooks/use-colors'

type ProgressVariant = 'copper' | 'gold' | 'sage'

function getVariantColor(variant: ProgressVariant, colors: ColorTokens): string {
  const map: Record<ProgressVariant, string> = {
    copper: colors.copper,
    gold: colors.gold,
    sage: colors.sage,
  }
  return map[variant]
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
  const colors = useColors()
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

  const fillColor = getVariantColor(variant, colors)

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%` as unknown as number,
  }))

  return (
    <View style={[{ height, borderRadius: height / 2, backgroundColor: colors.border, overflow: 'hidden' }, style]}>
      <Animated.View style={[{ height: '100%', borderRadius: height / 2, backgroundColor: fillColor }, fillStyle]} />
    </View>
  )
}
