import { StyleSheet, Text, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { Check, Clock } from 'lucide-react-native'

const SWIPE_THRESHOLD = 100

interface SwipeActionProps {
  onComplete?: () => void
  onSnooze?: () => void
  children: React.ReactNode
}

export function SwipeAction({
  onComplete,
  onSnooze,
  children,
}: SwipeActionProps) {
  const reducedMotion = useReducedMotion()
  const translateX = useSharedValue(0)

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
  }

  const pan = Gesture.Pan()
    .activeOffsetX([-15, 15])
    .onUpdate((event) => {
      translateX.value = event.translationX
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD && onComplete) {
        runOnJS(triggerHaptic)()
        runOnJS(onComplete)()
      } else if (event.translationX < -SWIPE_THRESHOLD && onSnooze) {
        runOnJS(triggerHaptic)()
        runOnJS(onSnooze)()
      }
      translateX.value = reducedMotion
        ? withTiming(0, { duration: 0 })
        : withSpring(0, { damping: 20 })
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  const leftActionStyle = useAnimatedStyle(() => ({
    opacity: Math.min(translateX.value / SWIPE_THRESHOLD, 1),
  }))

  const rightActionStyle = useAnimatedStyle(() => ({
    opacity: Math.min(-translateX.value / SWIPE_THRESHOLD, 1),
  }))

  return (
    <View style={styles.container}>
      {/* Complete action (swipe right) */}
      <Animated.View style={[styles.action, styles.completeAction, leftActionStyle]}>
        <Check size={20} color="#faf6f0" />
        <Text style={styles.actionText}>Done</Text>
      </Animated.View>

      {/* Snooze action (swipe left) */}
      <Animated.View style={[styles.action, styles.snoozeAction, rightActionStyle]}>
        <Text style={styles.actionText}>Snooze</Text>
        <Clock size={20} color="#faf6f0" />
      </Animated.View>

      <GestureDetector gesture={pan}>
        <Animated.View style={animatedStyle}>{children}</Animated.View>
      </GestureDetector>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 12,
  },
  action: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 8,
  },
  completeAction: {
    backgroundColor: '#6b8f71',
    justifyContent: 'flex-start',
  },
  snoozeAction: {
    backgroundColor: '#c4703f',
    justifyContent: 'flex-end',
  },
  actionText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 14,
    color: '#faf6f0',
  },
})
