import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated'

interface CardEntranceProps {
  delay?: number
  children: React.ReactNode
}

export function CardEntrance({ delay = 0, children }: CardEntranceProps) {
  const reducedMotion = useReducedMotion()

  return (
    <Animated.View
      entering={reducedMotion ? undefined : FadeInDown.delay(delay)
        .springify()
        .damping(15)
        .stiffness(100)}
    >
      {children}
    </Animated.View>
  )
}
