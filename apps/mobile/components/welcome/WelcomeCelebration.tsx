import { useEffect, useMemo, useCallback } from 'react'
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import * as Haptics from 'expo-haptics'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
  useReducedMotion,
  FadeIn,
  runOnJS,
} from 'react-native-reanimated'
import { useColors } from '@/hooks/use-colors'

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window')

// ─── Colors ──────────────────────────────────────────────────
const CONFETTI_COLORS = ['#c4703f', '#d4a853', '#ede6dc', '#c47a8f', '#6b8f71']
const EXPLOSION_COLORS = ['#c4703f', '#d4a853', '#ede6dc']

const EMOJIS = ['\u{1F476}', '\u{1F37C}', '\u2B50', '\u{1F49B}', '\u{1F389}', '\u{1F476}', '\u2B50', '\u{1F37C}']

// ─── Config generators (stable via useMemo) ──────────────────

interface ExplosionConfig {
  angle: number
  speed: number
  color: string
  size: number
}

interface ConfettiConfig {
  startX: number
  width: number
  height: number
  isCircle: boolean
  color: string
  fallSpeed: number
  wobbleAmp: number
  wobbleSpeed: number
  delay: number
  opacity: number
}

interface BalloonConfig {
  left: number
  width: number
  height: number
  color: string
  duration: number
  delay: number
  rotation: number
}

interface EmojiConfig {
  emoji: string
  left: number
  duration: number
  delay: number
  rotation: number
}

function generateExplosionConfigs(count: number): ExplosionConfig[] {
  return Array.from({ length: count }, () => ({
    angle: Math.random() * Math.PI * 2,
    speed: 2 + Math.random() * 6,
    color: EXPLOSION_COLORS[Math.floor(Math.random() * EXPLOSION_COLORS.length)],
    size: 3 + Math.random() * 4,
  }))
}

function generateConfettiConfigs(count: number): ConfettiConfig[] {
  return Array.from({ length: count }, () => ({
    startX: Math.random() * SCREEN_W,
    width: 3 + Math.random() * 5,
    height: 3 + Math.random() * 5,
    isCircle: Math.random() < 0.5,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    fallSpeed: 4000 + Math.random() * 6000,
    wobbleAmp: 10 + Math.random() * 30,
    wobbleSpeed: 1500 + Math.random() * 2000,
    delay: Math.random() * 2000,
    opacity: 0.5 + Math.random() * 0.5,
  }))
}

function generateBalloonConfigs(): BalloonConfig[] {
  const configs: BalloonConfig[] = [
    { left: 0.05, width: 50, height: 60, color: '#c4703f', duration: 8000, delay: 300, rotation: 10 },
    { left: 0.15, width: 42, height: 50, color: '#d4a853', duration: 9000, delay: 800, rotation: -6 },
    { left: 0.55, width: 55, height: 66, color: '#b8623a', duration: 7500, delay: 100, rotation: 12 },
    { left: 0.72, width: 45, height: 54, color: '#c99a45', duration: 8500, delay: 1200, rotation: -9 },
    { left: 0.35, width: 52, height: 62, color: '#c4703f', duration: 9500, delay: 500, rotation: 7 },
    { left: 0.88, width: 48, height: 58, color: '#d4a853', duration: 8200, delay: 1500, rotation: -11 },
  ]
  return configs
}

function generateEmojiConfigs(): EmojiConfig[] {
  return EMOJIS.map((emoji, i) => ({
    emoji,
    left: 0.08 + (i * 0.12),
    duration: 6500 + Math.random() * 3000,
    delay: 200 + Math.random() * 1800,
    rotation: (Math.random() - 0.5) * 50,
  }))
}

// ─── Individual animated elements ────────────────────────────

function ExplosionParticle({ config }: { config: ExplosionConfig }) {
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const opacity = useSharedValue(1)
  const scale = useSharedValue(1)

  useEffect(() => {
    const targetX = Math.cos(config.angle) * config.speed * 60
    const targetY = Math.sin(config.angle) * config.speed * 60

    translateX.value = withTiming(targetX, { duration: 1200, easing: Easing.out(Easing.quad) })
    translateY.value = withTiming(targetY + 40, { duration: 1200, easing: Easing.out(Easing.quad) })
    opacity.value = withTiming(0, { duration: 1200, easing: Easing.in(Easing.quad) })
    scale.value = withTiming(0, { duration: 1200, easing: Easing.in(Easing.quad) })
  }, [])

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }))

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: SCREEN_W / 2,
          top: SCREEN_H / 2,
          width: config.size,
          height: config.size,
          borderRadius: config.size / 2,
          backgroundColor: config.color,
        },
        style,
      ]}
    />
  )
}

function ConfettiPiece({ config }: { config: ConfettiConfig }) {
  const translateY = useSharedValue(-20)
  const translateX = useSharedValue(0)
  const rotate = useSharedValue(0)

  useEffect(() => {
    translateY.value = withDelay(
      config.delay,
      withRepeat(
        withTiming(SCREEN_H + 40, { duration: config.fallSpeed, easing: Easing.linear }),
        -1,
        false
      )
    )
    translateX.value = withDelay(
      config.delay,
      withRepeat(
        withSequence(
          withTiming(config.wobbleAmp, { duration: config.wobbleSpeed, easing: Easing.inOut(Easing.sin) }),
          withTiming(-config.wobbleAmp, { duration: config.wobbleSpeed, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      )
    )
    rotate.value = withDelay(
      config.delay,
      withRepeat(
        withTiming(360, { duration: config.fallSpeed * 0.8, easing: Easing.linear }),
        -1,
        false
      )
    )
  }, [])

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
  }))

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: config.startX,
          top: -20,
          width: config.width,
          height: config.isCircle ? config.width : config.height,
          borderRadius: config.isCircle ? config.width / 2 : 1,
          backgroundColor: config.color,
          opacity: config.opacity,
        },
        style,
      ]}
    />
  )
}

function BalloonView({ config }: { config: BalloonConfig }) {
  const translateY = useSharedValue(0)
  const opacity = useSharedValue(0)
  const rotate = useSharedValue(0)

  useEffect(() => {
    opacity.value = withDelay(config.delay, withTiming(0.85, { duration: 400 }))
    translateY.value = withDelay(
      config.delay,
      withTiming(-(SCREEN_H + 200), { duration: config.duration, easing: Easing.linear })
    )
    rotate.value = withDelay(
      config.delay,
      withTiming(config.rotation, { duration: config.duration, easing: Easing.linear })
    )
  }, [])

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }))

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          bottom: -120,
          left: config.left * SCREEN_W,
          width: config.width,
          height: config.height,
          borderTopLeftRadius: config.width * 0.5,
          borderTopRightRadius: config.width * 0.5,
          borderBottomLeftRadius: config.width * 0.4,
          borderBottomRightRadius: config.width * 0.4,
          backgroundColor: config.color,
        },
        style,
      ]}
    >
      {/* Balloon shine */}
      <View
        style={{
          position: 'absolute',
          top: '15%',
          left: '25%',
          width: '30%',
          height: '30%',
          borderRadius: 100,
          backgroundColor: 'rgba(255,255,255,0.2)',
        }}
      />
      {/* Balloon string */}
      <View
        style={{
          position: 'absolute',
          bottom: -40,
          left: config.width / 2 - 0.5,
          width: 1,
          height: 40,
          backgroundColor: 'rgba(237,230,220,0.15)',
        }}
      />
    </Animated.View>
  )
}

function FloatingEmoji({ config }: { config: EmojiConfig }) {
  const translateY = useSharedValue(0)
  const opacity = useSharedValue(0)
  const rotate = useSharedValue(0)
  const scale = useSharedValue(0.8)

  useEffect(() => {
    opacity.value = withDelay(config.delay, withTiming(0.9, { duration: 600 }))
    scale.value = withDelay(config.delay, withTiming(1, { duration: 600 }))
    translateY.value = withDelay(
      config.delay,
      withTiming(-(SCREEN_H + 80), { duration: config.duration, easing: Easing.linear })
    )
    rotate.value = withDelay(
      config.delay,
      withTiming(config.rotation, { duration: config.duration, easing: Easing.linear })
    )
  }, [])

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }))

  return (
    <Animated.Text
      style={[
        {
          position: 'absolute',
          bottom: -60,
          left: config.left * SCREEN_W,
          fontSize: 28,
        },
        style,
      ]}
    >
      {config.emoji}
    </Animated.Text>
  )
}

// ─── Main component ──────────────────────────────────────────

interface WelcomeCelebrationProps {
  onDismiss: () => void
}

export function WelcomeCelebration({ onDismiss }: WelcomeCelebrationProps) {
  const reducedMotion = useReducedMotion()
  const colors = useColors()
  const modalOpacity = useSharedValue(1)

  // Memoize all particle configs so they're created once
  const explosionConfigs = useMemo(() => generateExplosionConfigs(60), [])
  const confettiConfigs = useMemo(() => generateConfettiConfigs(80), [])
  const balloonConfigs = useMemo(() => generateBalloonConfigs(), [])
  const emojiConfigs = useMemo(() => generateEmojiConfigs(), [])

  // Content entrance animation values
  const headlineScale = useSharedValue(0.5)
  const headlineOpacity = useSharedValue(0)
  const bodyOpacity = useSharedValue(0)
  const bodyTranslateY = useSharedValue(10)
  const ctaOpacity = useSharedValue(0)
  const ctaTranslateY = useSharedValue(10)

  // Animate content in sequence
  useEffect(() => {
    // Headline at 200ms
    headlineScale.value = withDelay(200, withTiming(1, { duration: 800, easing: Easing.out(Easing.back(1.5)) }))
    headlineOpacity.value = withDelay(200, withTiming(1, { duration: 800 }))
    // Body at 600ms
    bodyOpacity.value = withDelay(600, withTiming(1, { duration: 500 }))
    bodyTranslateY.value = withDelay(600, withTiming(0, { duration: 500 }))
    // CTA at 1200ms
    ctaOpacity.value = withDelay(1200, withTiming(1, { duration: 500 }))
    ctaTranslateY.value = withDelay(1200, withTiming(0, { duration: 500 }))
  }, [])

  // Auto-dismiss at 5s
  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss()
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = useCallback(() => {
    modalOpacity.value = withTiming(0, { duration: 400 }, (finished) => {
      if (finished) {
        runOnJS(onDismiss)()
      }
    })
  }, [onDismiss, modalOpacity])

  const handleCTAPress = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    handleDismiss()
  }, [handleDismiss])

  // Animated styles
  const modalStyle = useAnimatedStyle(() => ({
    opacity: modalOpacity.value,
  }))

  const headlineStyle = useAnimatedStyle(() => ({
    opacity: headlineOpacity.value,
    transform: [{ scale: headlineScale.value }],
  }))

  const bodyStyle = useAnimatedStyle(() => ({
    opacity: bodyOpacity.value,
    transform: [{ translateY: bodyTranslateY.value }],
  }))

  const ctaStyle = useAnimatedStyle(() => ({
    opacity: ctaOpacity.value,
    transform: [{ translateY: ctaTranslateY.value }],
  }))

  // Reduced motion: simple fade-in, no particles
  if (reducedMotion) {
    return (
      <Modal transparent visible statusBarTranslucent animationType="fade">
        <Animated.View style={[styles.fullScreen, { backgroundColor: colors.bg }]} entering={FadeIn.duration(400)}>
          <LinearGradient
            colors={colors.bgGradient as unknown as [string, string, ...string[]]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.contentContainer}>
            <Text style={[styles.headline, { color: colors.copper }]}>Welcome to{'\n'}Fatherhood</Text>
            <Text style={[styles.body, { color: colors.textSecondary }]}>
              The greatest adventure of your life just started. We're here for every step, every sleepless night, and every first smile.
            </Text>
            <Pressable
              onPress={() => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
                onDismiss()
              }}
              style={({ pressed }) => [styles.ctaButton, { backgroundColor: colors.copper, shadowColor: colors.copper }, pressed && styles.ctaPressed]}
            >
              <Text style={[styles.ctaText, { color: colors.textPrimary }]}>LET'S GO</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Modal>
    )
  }

  return (
    <Modal transparent visible statusBarTranslucent>
      <Animated.View style={[styles.fullScreen, { backgroundColor: colors.bg }, modalStyle]}>
        {/* Layer 1: Background gradient */}
        <LinearGradient
          colors={colors.bgGradient as unknown as [string, string, ...string[]]}
          style={StyleSheet.absoluteFill}
        />

        {/* Layer 2: Explosion particles */}
        <View style={styles.particleLayer} pointerEvents="none">
          {explosionConfigs.map((config, i) => (
            <ExplosionParticle key={`exp-${i}`} config={config} />
          ))}
        </View>

        {/* Layer 3: Confetti */}
        <View style={styles.particleLayer} pointerEvents="none">
          {confettiConfigs.map((config, i) => (
            <ConfettiPiece key={`conf-${i}`} config={config} />
          ))}
        </View>

        {/* Layer 4: Balloons */}
        <View style={styles.particleLayer} pointerEvents="none">
          {balloonConfigs.map((config, i) => (
            <BalloonView key={`bal-${i}`} config={config} />
          ))}
        </View>

        {/* Layer 5: Floating emoji */}
        <View style={styles.particleLayer} pointerEvents="none">
          {emojiConfigs.map((config, i) => (
            <FloatingEmoji key={`emo-${i}`} config={config} />
          ))}
        </View>

        {/* Layer 6: Content */}
        <View style={styles.contentContainer}>
          <Animated.Text style={[styles.headline, { color: colors.copper }, headlineStyle]}>
            Welcome to{'\n'}Fatherhood
          </Animated.Text>

          <Animated.Text style={[styles.body, { color: colors.textSecondary }, bodyStyle]}>
            The greatest adventure of your life just started. We're here for every step, every sleepless night, and every first smile.
          </Animated.Text>

          <Animated.View style={ctaStyle}>
            <Pressable
              onPress={handleCTAPress}
              style={({ pressed }) => [styles.ctaButton, { backgroundColor: colors.copper, shadowColor: colors.copper }, pressed && styles.ctaPressed]}
            >
              <Text style={[styles.ctaText, { color: colors.textPrimary }]}>LET'S GO</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Animated.View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  particleLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  contentContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  headline: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 52,
    lineHeight: 58,
    textAlign: 'center',
    marginBottom: 24,
  },
  body: {
    fontFamily: 'Jost-Regular',
    fontSize: 17,
    lineHeight: 28,
    textAlign: 'center',
    maxWidth: 340,
    marginBottom: 40,
  },
  ctaButton: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 48,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  ctaPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  ctaText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
    letterSpacing: 1.5,
  },
})
