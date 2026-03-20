import React from 'react'
import Animated, { FadeInDown } from 'react-native-reanimated'

interface StaggerListProps {
  staggerMs?: number
  children: React.ReactNode
}

export function StaggerList({ staggerMs = 80, children }: StaggerListProps) {
  return (
    <>
      {React.Children.map(children, (child, index) => (
        <Animated.View
          entering={FadeInDown.delay(index * staggerMs)
            .springify()
            .damping(15)}
        >
          {child}
        </Animated.View>
      ))}
    </>
  )
}
