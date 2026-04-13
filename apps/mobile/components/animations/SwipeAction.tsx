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
import { useColors } from '@/hooks/use-colors'

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
  const colors = useColors()
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

  // Swipe action text is always white for contrast against sage/copper backgrounds
  const actionTextColor = '#faf6f0'

  return (
    <View style={styles.container}>
      {/* Complete action (swipe right) */}
      <Animated.View style={[styles.action, styles.completeAction, { backgroundColor: colors.sage }, leftActionStyle]}>
        <Check size={20} color={actionTextColor} />
        <Text style={[styles.actionText, { color: actionTextColor }]}>Done</Text>
      </Animated.View>

      {/* Snooze action (swipe left) */}
      <Animated.View style={[styles.action, styles.snoozeAction, { backgroundColor: colors.copper }, rightActionStyle]}>
        <Text style={[styles.actionText, { color: actionTextColor }]}>Snooze</Text>
        <Clock size={20} color={actionTextColor} />
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
    justifyContent: 'flex-start',
  },
  snoozeAction: {
    justifyContent: 'flex-end',
  },
  actionText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 14,
  },
})
