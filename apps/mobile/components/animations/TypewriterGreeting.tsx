import { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import { useColors } from '@/hooks/use-colors'

interface TypewriterGreetingProps {
  text: string
  delay?: number
  speed?: number
  onComplete?: () => void
}

export function TypewriterGreeting({
  text,
  delay = 0,
  speed = 45,
  onComplete,
}: TypewriterGreetingProps) {
  const reducedMotion = useReducedMotion()
  const colors = useColors()
  const [charCount, setCharCount] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [showCursor, setShowCursor] = useState(true)
  const cursorOpacity = useSharedValue(1)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    if (reducedMotion) {
      setCharCount(text.length)
      setIsComplete(true)
      setShowCursor(false)
      onCompleteRef.current?.()
      return
    }

    const delayTimer = setTimeout(() => {
      let i = 0
      const interval = setInterval(() => {
        if (i < text.length) {
          i++
          setCharCount(i)
        } else {
          clearInterval(interval)
          setIsComplete(true)
          setTimeout(() => {
            setShowCursor(false)
            onCompleteRef.current?.()
          }, 800)
        }
      }, speed)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(delayTimer)
  }, [text, delay, speed, reducedMotion])

  useEffect(() => {
    if (isComplete && showCursor) {
      cursorOpacity.value = withRepeat(
        withTiming(0, { duration: 500 }),
        -1,
        true
      )
    }
  }, [isComplete, showCursor])

  const cursorAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cursorOpacity.value,
  }))

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: colors.textPrimary }]}>
        {text.slice(0, charCount)}
      </Text>
      {showCursor && (
        <Animated.View style={[styles.cursor, { backgroundColor: colors.copper }, cursorAnimatedStyle]} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
  },
  cursor: {
    width: 2,
    height: 28,
    marginLeft: 2,
    borderRadius: 1,
  },
})
