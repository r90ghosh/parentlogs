import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { CheckCircle2 } from 'lucide-react-native'
import { CardEntrance } from '@/components/animations'
import * as Haptics from 'expo-haptics'
import { useColors } from '@/hooks/use-colors'

const PREMIUM_FEATURES = [
  'Full pregnancy & postpartum timeline',
  'Unlimited task management',
  'Partner sync & activity',
  'All 11 tracker types',
  'Priority email support',
]

export default function UpgradeSuccessScreen() {
  const router = useRouter()
  const colors = useColors()

  const handleExplore = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    router.replace('/(tabs)')
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Celebration emoji */}
        <CardEntrance delay={0}>
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>🎉</Text>
          </View>
        </CardEntrance>

        {/* Title */}
        <CardEntrance delay={120}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Welcome to Premium!</Text>
        </CardEntrance>

        {/* Subtitle */}
        <CardEntrance delay={240}>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            You now have full access to everything
          </Text>
        </CardEntrance>

        {/* Feature list */}
        <View style={styles.featureList}>
          {PREMIUM_FEATURES.map((feature, index) => (
            <CardEntrance key={feature} delay={360 + index * 80}>
              <View style={[styles.featureRow, { backgroundColor: colors.sageDim, borderColor: 'rgba(107,143,113,0.12)' }]}>
                <CheckCircle2 size={20} color={colors.sage} />
                <Text style={[styles.featureText, { color: colors.textSecondary }]}>{feature}</Text>
              </View>
            </CardEntrance>
          ))}
        </View>

        {/* CTA button */}
        <CardEntrance delay={800}>
          <Pressable
            onPress={handleExplore}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <LinearGradient
              colors={[colors.copper, colors.coral]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={[styles.buttonText, { color: colors.textPrimary }]}>Start Exploring</Text>
            </LinearGradient>
          </Pressable>
        </CardEntrance>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emojiContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  emoji: {
    fontSize: 72,
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 36,
  },
  featureList: {
    gap: 12,
    marginBottom: 40,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  featureText: {
    fontFamily: 'Jost-Regular',
    fontSize: 15,
    flex: 1,
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
  },
})
