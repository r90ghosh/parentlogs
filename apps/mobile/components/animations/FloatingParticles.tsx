import { useEffect, useMemo } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import Animated, {
  useReducedMotion,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated'
import { useColors } from '@/hooks/use-colors'
import type { ColorTokens } from '@/hooks/use-colors'

function getParticleColors(colors: ColorTokens): string[] {
  // Decorative particles: warm copper/gold tones
  // Dark mode: softer opacity against dark bg
  // Light mode: slightly higher opacity to show against light bg
  const isDark = colors.bg === '#12100e'
  return isDark
    ? [
        'rgba(196,112,63,0.6)',
        'rgba(212,168,83,0.5)',
        'rgba(237,230,220,0.3)',
        'rgba(196,112,63,0.4)',
        'rgba(212,168,83,0.35)',
      ]
    : [
        'rgba(196,112,63,0.35)',
        'rgba(212,168,83,0.3)',
        'rgba(0,0,0,0.08)',
        'rgba(196,112,63,0.25)',
        'rgba(212,168,83,0.2)',
      ]
}

interface Particle {
  id: number
  size: number
  left: number
  duration: number
  delay: number
  drift: number
  colorIndex: number
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 3 + Math.random() * 5,
    left: Math.random() * 100,
    duration: (11 + Math.random() * 9) * 1000,
    delay: Math.random() * 10000,
    drift: (Math.random() - 0.5) * 60,
    colorIndex: i % 5,
  }))
}

function Star({ particle, particleColors }: { particle: Particle; particleColors: string[] }) {
  const { height } = Dimensions.get('window')
  const translateY = useSharedValue(0)
  const translateX = useSharedValue(0)
  const opacity = useSharedValue(0)

  useEffect(() => {
    translateY.value = withDelay(
      particle.delay,
      withRepeat(
        withTiming(-height - 20, { duration: particle.duration, easing: Easing.linear }),
        -1,
        false
      )
    )
    translateX.value = withDelay(
      particle.delay,
      withRepeat(
        withTiming(particle.drift, { duration: particle.duration, easing: Easing.linear }),
        -1,
        false
      )
    )
    opacity.value = withDelay(
      particle.delay,
      withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.out(Easing.quad) }),
        1,
        false
      )
    )
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { translateX: translateX.value }],
    opacity: opacity.value,
  }))

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          bottom: -10,
          left: `${particle.left}%`,
          width: particle.size,
          height: particle.size,
          borderRadius: particle.size / 2,
          backgroundColor: particleColors[particle.colorIndex],
        },
        animatedStyle,
      ]}
    />
  )
}

export function FloatingParticles({ count = 18 }: { count?: number }) {
  const reducedMotion = useReducedMotion()
  const colors = useColors()
  const particles = useMemo(() => generateParticles(count), [count])
  const particleColors = useMemo(() => getParticleColors(colors), [colors])

  if (reducedMotion) return null

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p) => (
        <Star key={p.id} particle={p} particleColors={particleColors} />
      ))}
    </View>
  )
}
