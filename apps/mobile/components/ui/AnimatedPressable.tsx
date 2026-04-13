import { type ReactNode } from 'react'
import { Pressable, type PressableProps } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  useReducedMotion,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'

const AnimatedPressableView = Animated.createAnimatedComponent(Pressable)

interface AnimatedPressableProps extends PressableProps {
  children: ReactNode
  scaleValue?: number
  haptic?: boolean
}

export function AnimatedPressable({
  children,
  scaleValue = 0.98,
  haptic = true,
  onPressIn,
  onPressOut,
  onPress,
  style,
  ...props
}: AnimatedPressableProps) {
  const scale = useSharedValue(1)
  const reducedMotion = useReducedMotion()

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  return (
    <AnimatedPressableView
      onPressIn={(e) => {
        if (!reducedMotion)
          scale.value = withSpring(scaleValue, { damping: 15, stiffness: 300 })
        onPressIn?.(e)
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 })
        onPressOut?.(e)
      }}
      onPress={(e) => {
        if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        onPress?.(e)
      }}
      style={[animatedStyle, style]}
      {...props}
    >
      {children}
    </AnimatedPressableView>
  )
}
