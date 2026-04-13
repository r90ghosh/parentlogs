import { memo } from 'react'
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated'

interface CardEntranceProps {
  delay?: number
  children: React.ReactNode
}

function CardEntranceComponent({ delay = 0, children }: CardEntranceProps) {
  const reducedMotion = useReducedMotion()

  return (
    <Animated.View
      entering={reducedMotion ? undefined : FadeInDown.delay(delay)
        .springify()
        .damping(18)
        .stiffness(140)}
    >
      {children}
    </Animated.View>
  )
}

export const CardEntrance = memo(CardEntranceComponent)
