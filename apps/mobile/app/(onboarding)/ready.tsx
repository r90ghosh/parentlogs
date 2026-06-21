import { View, Text, Pressable, StyleSheet, Share } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '@/components/providers/AuthProvider'
import * as Haptics from 'expo-haptics'
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
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{'\u{1F389}'}</Text>
        </View>

        <View>
          <Text style={[styles.step, { color: colors.accent }]}>STEP 4 OF 4</Text>
          <Text style={[styles.title, { color: colors.ink }]}>You're all set!</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Your personalized dashboard, weekly briefings, and task timeline are
            ready. Welcome to The Dad Center.
          </Text>
        </View>

        <View style={styles.features}>
          {[
            { icon: '\u{1F4CB}', text: 'Weekly briefings tailored to your timeline' },
            { icon: '✅', text: 'Tasks organized by trimester and phase' },
            { icon: '\u{1F4B0}', text: 'Budget planner with real pricing data' },
            { icon: '\u{1F4CA}', text: 'Baby development tracker' },
          ].map((feature, i) => (
            <View key={i} style={[styles.featureRow, { backgroundColor: colors.card, borderColor: colors.line }]}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={[styles.featureText, { color: colors.ink2 }]}>{feature.text}</Text>
            </View>
          ))}
        </View>

        {/* Partner invite section */}
        <View style={styles.inviteContainer}>
          <View style={[styles.inviteCard, { backgroundColor: colors.card, borderColor: colors.line }]}>
            <View style={[styles.inviteAccent, { backgroundColor: colors.gold }]} />
            <View style={styles.inviteInner}>
              <View style={styles.inviteHeader}>
                <UserPlus size={18} color={colors.gold} />
                <Text style={[styles.inviteTitle, { color: colors.ink }]}>Invite Your Partner</Text>
              </View>
              <Text style={[styles.inviteSubtitle, { color: colors.muted }]}>
                Share access — one subscription covers both of you
              </Text>
              <Pressable
                onPress={handleShareInvite}
                style={({ pressed }) => [
                  styles.shareButton,
                  { backgroundColor: colors.goldDim, borderColor: colors.line },
                  pressed && styles.shareButtonPressed,
                ]}
              >
                <Text style={[styles.shareButtonText, { color: colors.gold }]}>Share Invite</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View>
          <Pressable
            onPress={handleStart}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: colors.accent },
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>I'm Ready</Text>
          </Pressable>
          <Text style={[styles.disclaimerText, { color: colors.faint }]}>
            The Dad Center provides educational information only and is not a substitute for medical advice. Always consult your healthcare provider.
          </Text>
        </View>
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
    fontSize: 56,
  },
  step: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 11,
    marginBottom: 14,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
    textAlign: 'center',
  },
  title: {
    fontFamily: 'Jakarta-ExtraBold',
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  features: {
    marginTop: 28,
    marginBottom: 18,
    gap: 10,
  },
  inviteContainer: {
    marginBottom: 16,
  },
  inviteCard: {
    overflow: 'hidden',
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
  },
  inviteAccent: {
    width: 3,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
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
    fontFamily: 'Jakarta-SemiBold',
    fontSize: 15,
  },
  inviteSubtitle: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 13,
    marginBottom: 14,
    lineHeight: 19,
  },
  shareButton: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: 'center',
  },
  shareButtonPressed: {
    opacity: 0.8,
  },
  shareButtonText: {
    fontFamily: 'Jakarta-SemiBold',
    fontSize: 13,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  featureIcon: {
    fontSize: 18,
  },
  featureText: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 14,
    flex: 1,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 15,
    color: '#fff',
  },
  disclaimerText: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 14,
    paddingHorizontal: 20,
    lineHeight: 16,
  },
})
