import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { useAuth } from '@/components/providers/AuthProvider'
import * as Haptics from 'expo-haptics'
import Animated, { FadeInDown } from 'react-native-reanimated'

export default function ReadyScreen() {
  const router = useRouter()
  const { refreshProfile } = useAuth()

  const handleStart = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    await refreshProfile()
    router.replace('/(tabs)')
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#12100e', '#1a1714', '#201c18', '#12100e']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>
        <Animated.View
          entering={FadeInDown.delay(200).springify().damping(12)}
          style={styles.emojiContainer}
        >
          <Text style={styles.emoji}>🎉</Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(400).springify().damping(12)}
        >
          <Text style={styles.step}>Step 3 of 3</Text>
          <Text style={styles.title}>You're all set!</Text>
          <Text style={styles.subtitle}>
            Your personalized dashboard, weekly briefings, and task timeline are
            ready. Welcome to The Dad Center.
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(600).springify().damping(12)}
          style={styles.features}
        >
          {[
            { icon: '📋', text: 'Weekly briefings tailored to your timeline' },
            { icon: '✅', text: 'Tasks organized by trimester and phase' },
            { icon: '💰', text: 'Budget planner with real pricing data' },
            { icon: '📊', text: 'Baby development tracker' },
          ].map((feature, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureText}>{feature.text}</Text>
            </View>
          ))}
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(800).springify().damping(12)}
        >
          <Pressable
            onPress={handleStart}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>Let's Go</Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12100e',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emojiContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  emoji: {
    fontSize: 64,
    fontFamily: 'System',
  },
  step: {
    fontFamily: 'Karla-Medium',
    fontSize: 13,
    color: '#c4703f',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 32,
    color: '#faf6f0',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 16,
    color: '#7a6f62',
    textAlign: 'center',
    lineHeight: 24,
  },
  features: {
    marginTop: 36,
    marginBottom: 40,
    gap: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: 'rgba(32,28,24,0.6)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(237,230,220,0.06)',
  },
  featureIcon: {
    fontSize: 20,
  },
  featureText: {
    fontFamily: 'Jost-Regular',
    fontSize: 15,
    color: '#ede6dc',
    flex: 1,
  },
  button: {
    backgroundColor: '#c4703f',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
    color: '#faf6f0',
  },
})
