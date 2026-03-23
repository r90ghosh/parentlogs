import { Pressable, Text, StyleSheet } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'

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
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePress = () => {
    scale.value = withSpring(1.3, { damping: 8, stiffness: 300 }, () => {
      scale.value = withSpring(1, { damping: 10 })
    })
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    onPress()
  }

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <Animated.View
        style={[
          styles.emojiContainer,
          isSelected && styles.selectedContainer,
          animatedStyle,
        ]}
      >
        <Text style={styles.emoji}>{emoji}</Text>
      </Animated.View>
      <Text style={[styles.label, isSelected && styles.selectedLabel]}>
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
    backgroundColor: 'rgba(237,230,220,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedContainer: {
    backgroundColor: 'rgba(196,112,63,0.2)',
    borderWidth: 2,
    borderColor: '#c4703f',
  },
  emoji: {
    fontSize: 28,
    fontFamily: 'System',
  },
  label: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    color: '#7a6f62',
  },
  selectedLabel: {
    color: '#c4703f',
  },
})
