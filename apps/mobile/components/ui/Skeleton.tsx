import { useEffect } from 'react'
import { View, type ViewStyle, type LayoutChangeEvent } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import { useColors } from '@/hooks/use-colors'

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient)

interface SkeletonProps {
  width?: number | string
  height?: number
  borderRadius?: number
  style?: ViewStyle
}

export function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  const colors = useColors()
  const reducedMotion = useReducedMotion()
  const translateX = useSharedValue(0)
  const measuredWidth = useSharedValue(200)

  useEffect(() => {
    if (reducedMotion) return

    // Start off-screen left, sweep to off-screen right
    translateX.value = -measuredWidth.value
    translateX.value = withRepeat(
      withTiming(measuredWidth.value, {
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      false
    )
  }, [reducedMotion, translateX, measuredWidth])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  const handleLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width
    if (w > 0) {
      measuredWidth.value = w
      if (!reducedMotion) {
        translateX.value = -w
        translateX.value = withRepeat(
          withTiming(w, {
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
          }),
          -1,
          false
        )
      }
    }
  }

  if (reducedMotion) {
    return (
      <View
        style={[
          {
            width: width as number,
            height,
            borderRadius,
            backgroundColor: colors.cardHover,
            opacity: 0.5,
          },
          style,
        ]}
      />
    )
  }

  return (
    <View
      onLayout={handleLayout}
      style={[
        {
          width: width as number,
          height,
          borderRadius,
          backgroundColor: colors.card,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <AnimatedLinearGradient
        colors={[colors.card, colors.cardHover, colors.card]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[
          {
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '100%',
          },
          animatedStyle,
        ]}
      />
    </View>
  )
}
