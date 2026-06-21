import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Check } from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { useColors } from '@/hooks/use-colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

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
  const insets = useSafeAreaInsets()

  const handleExplore = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    router.replace('/(tabs)')
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        {/* Brandmark */}
        <View style={[styles.brandmark, { backgroundColor: colors.accentSoft, borderColor: colors.accent + '40', borderWidth: 1 }]}>
          <Text style={[styles.brandmarkText, { color: colors.accent }]}>TDC</Text>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.ink }]}>You're in.</Text>

        {/* Subtitle */}
        <Text style={[styles.subtitle, { color: colors.ink2 }]}>
          Full access unlocked. Everything you need for the journey ahead.
        </Text>

        {/* Feature list */}
        <View style={[styles.featureList, { backgroundColor: colors.card, borderColor: colors.line }]}>
          {PREMIUM_FEATURES.map((feature, index) => (
            <View
              key={feature}
              style={[
                styles.featureRow,
                index < PREMIUM_FEATURES.length - 1 && { borderBottomColor: colors.line2, borderBottomWidth: 1 },
              ]}
            >
              <View style={[styles.checkCircle, { backgroundColor: colors.sageDim }]}>
                <Check size={12} color={colors.sage} strokeWidth={3} />
              </View>
              <Text style={[styles.featureText, { color: colors.ink2 }]}>{feature}</Text>
            </View>
          ))}
        </View>

        {/* CTA button */}
        <Pressable
          onPress={handleExplore}
          style={({ pressed }) => [styles.button, { backgroundColor: colors.accent, opacity: pressed ? 0.88 : 1 }]}
        >
          <Text style={styles.buttonText}>Start Exploring</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 28 },
  brandmark: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    alignSelf: 'center',
  },
  brandmarkText: { fontFamily: 'Jakarta-ExtraBold', fontSize: 18, letterSpacing: -0.5 },
  title: { fontFamily: 'Jakarta-ExtraBold', fontSize: 32, textAlign: 'center', letterSpacing: -0.8, marginBottom: 10 },
  subtitle: { fontFamily: 'Jakarta-Regular', fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  featureList: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 32,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  featureText: { fontFamily: 'Jakarta-Regular', fontSize: 15, flex: 1 },
  button: { borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  buttonText: { fontFamily: 'Jakarta-Bold', fontSize: 15, color: '#fff' },
})
