import { View, Text, Pressable, StyleSheet, Share } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '@/components/providers/AuthProvider'
import * as Haptics from 'expo-haptics'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { GlassCard } from '@/components/glass'
import { UserPlus } from 'lucide-react-native'
import { useColors } from '@/hooks/use-colors'

export default function ReadyScreen() {
  const colors = useColors()
  const router = useRouter()
  const { refreshProfile, family } = useAuth()

  const handleStart = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    await refreshProfile()
    router.replace('/(tabs)')
  }

  const handleShareInvite = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    const message = family?.invite_code
      ? `Join me on The Dad Center! Use invite code: ${family.invite_code}`
      : 'Join me on The Dad Center — the app for modern parents. Download at thedadcenter.com'
    try {
      await Share.share({ message })
    } catch {
      // User dismissed share sheet or share failed — no action needed
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      <View style={styles.content}>
        <Animated.View
          entering={FadeInDown.delay(200).springify().damping(12)}
          style={styles.emojiContainer}
        >
          <Text style={styles.emoji}>{'\u{1F389}'}</Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(400).springify().damping(12)}
        >
          <Text style={[styles.step, { color: colors.copper }]}>Step 4 of 4</Text>
          <Text style={[styles.title, { color: colors.textPrimary }]}>You're all set!</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Your personalized dashboard, weekly briefings, and task timeline are
            ready. Welcome to The Dad Center.
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(600).springify().damping(12)}
          style={styles.features}
        >
          {[
            { icon: '\u{1F4CB}', text: 'Weekly briefings tailored to your timeline' },
            { icon: '\u2705', text: 'Tasks organized by trimester and phase' },
            { icon: '\u{1F4B0}', text: 'Budget planner with real pricing data' },
            { icon: '\u{1F4CA}', text: 'Baby development tracker' },
          ].map((feature, i) => (
            <View key={i} style={[styles.featureRow, { backgroundColor: colors.glassBg, borderColor: colors.subtleBg }]}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={[styles.featureText, { color: colors.textSecondary }]}>{feature.text}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Partner invite section */}
        <Animated.View
          entering={FadeInDown.delay(750).springify().damping(12)}
          style={styles.inviteContainer}
        >
          <GlassCard style={[styles.inviteCard, { borderColor: colors.goldGlow }]}>
            <View style={[styles.inviteAccent, { backgroundColor: colors.gold }]} />
            <View style={styles.inviteInner}>
              <View style={styles.inviteHeader}>
                <UserPlus size={18} color={colors.gold} />
                <Text style={[styles.inviteTitle, { color: colors.textPrimary }]}>Invite Your Partner</Text>
              </View>
              <Text style={[styles.inviteSubtitle, { color: colors.textMuted }]}>
                Share access — one subscription covers both of you
              </Text>
              <Pressable
                onPress={handleShareInvite}
                style={({ pressed }) => [
                  styles.shareButton,
                  { backgroundColor: colors.goldDim, borderColor: colors.goldGlow },
                  pressed && styles.shareButtonPressed,
                ]}
              >
                <Text style={[styles.shareButtonText, { color: colors.gold }]}>Share Invite</Text>
              </Pressable>
            </View>
          </GlassCard>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(900).springify().damping(12)}
        >
          <Pressable
            onPress={handleStart}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: colors.copper },
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={[styles.buttonText, { color: colors.textPrimary }]}>I'm Ready</Text>
          </Pressable>
          <Text style={[styles.disclaimerText, { color: colors.textDim }]}>
            The Dad Center provides educational information only and is not a substitute for medical advice. Always consult your healthcare provider.
          </Text>
        </Animated.View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  step: {
    fontFamily: 'Karla-Medium',
    fontSize: 13,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  features: {
    marginTop: 36,
    marginBottom: 20,
    gap: 16,
  },
  inviteContainer: {
    marginBottom: 16,
  },
  inviteCard: {
    overflow: 'hidden',
    flexDirection: 'row',
    padding: 0,
  },
  inviteAccent: {
    width: 3,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  inviteInner: {
    flex: 1,
    padding: 16,
  },
  inviteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  inviteTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
  },
  inviteSubtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    marginBottom: 14,
    lineHeight: 20,
  },
  shareButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  shareButtonPressed: {
    opacity: 0.8,
  },
  shareButtonText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 14,
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
  featureIcon: {
    fontSize: 20,
  },
  featureText: {
    fontFamily: 'Jost-Regular',
    fontSize: 15,
    flex: 1,
  },
  button: {
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
  },
  disclaimerText: {
    fontFamily: 'Karla-Regular',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
    lineHeight: 16,
  },
})
