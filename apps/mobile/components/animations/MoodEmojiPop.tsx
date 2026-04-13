import { Pressable, Text, StyleSheet } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { useColors } from '@/hooks/use-colors'

interface MoodEmojiPopProps {
  emoji: string
  label: string
  isSelected: boolean
  onPress: () => void
}

export function MoodEmojiPop({
  emoji,
  label,
  isSelected,
  onPress,
}: MoodEmojiPopProps) {
  const reducedMotion = useReducedMotion()
  const colors = useColors()
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePress = () => {
    if (!reducedMotion) {
      scale.value = withSpring(1.3, { damping: 8, stiffness: 300 }, () => {
        scale.value = withSpring(1, { damping: 10 })
      })
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    onPress()
  }

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <Animated.View
        style={[
          styles.emojiContainer,
          { backgroundColor: colors.subtleBg },
          isSelected && {
            backgroundColor: colors.copperGlow,
            borderWidth: 2,
            borderColor: colors.copper,
          },
          animatedStyle,
        ]}
      >
        <Text style={styles.emoji}>{emoji}</Text>
      </Animated.View>
      <Text style={[styles.label, { color: colors.textMuted }, isSelected && { color: colors.copper }]}>
        {label}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 6,
  },
  emojiContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 28,
  },
  label: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
  },
})
