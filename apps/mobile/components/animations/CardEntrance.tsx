import Animated, { FadeInDown } from 'react-native-reanimated'

interface CardEntranceProps {
  delay?: number
  children: React.ReactNode
}

export function CardEntrance({ delay = 0, children }: CardEntranceProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay)
        .springify()
        .damping(15)
        .stiffness(100)}
    >
      {children}
    </Animated.View>
  )
}
