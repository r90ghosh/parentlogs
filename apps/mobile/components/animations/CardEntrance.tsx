import { memo } from 'react'
import { View } from 'react-native'
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated'

interface CardEntranceProps {
  delay?: number
  /**
   * Skip the entrance animation entirely. Use when data was already in cache
   * pre-mount — animations communicate freshness, warm cache means "already here."
   */
  skipEnter?: boolean
  children: React.ReactNode
}

function CardEntranceComponent({ delay = 0, skipEnter = false, children }: CardEntranceProps) {
  const reducedMotion = useReducedMotion()

  if (skipEnter || reducedMotion) {
    return <View>{children}</View>
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(delay)
        .springify()
        .damping(18)
        .stiffness(140)}
    >
      {children}
    </Animated.View>
  )
}

export const CardEntrance = memo(CardEntranceComponent)
