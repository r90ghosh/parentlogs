import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Share,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '@/components/providers/AuthProvider'
import { UserPlus, Share2, Copy } from 'lucide-react-native'
import * as Clipboard from 'expo-clipboard'
import * as Haptics from 'expo-haptics'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { GlassCard } from '@/components/glass'
import { useColors } from '@/hooks/use-colors'

export default function InviteScreen() {
  const colors = useColors()
  const [email, setEmail] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)
  const router = useRouter()
  const { family } = useAuth()

  const inviteCode = family?.invite_code

  const handleShareInvite = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    const message = inviteCode
      ? `Join me on The Dad Center! Use invite code: ${inviteCode}\n\nDownload at thedadcenter.com`
      : 'Join me on The Dad Center — the app for modern parents. Download at thedadcenter.com'
    try {
      await Share.share({ message })
    } catch {
      // User dismissed share sheet
    }
  }

  const handleCopyCode = async () => {
    if (!inviteCode) return
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    await Clipboard.setStringAsync(inviteCode)
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
  }

  const handleSendEmail = async () => {
    if (!email.trim()) {
      Alert.alert('Missing email', 'Please enter your partner\'s email address.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Invalid email', 'Please enter a valid email address.')
      return
    }

    setIsSending(true)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

    // Share via system share sheet with email pre-filled
    const message = inviteCode
      ? `I'm using The Dad Center to track our pregnancy journey. Join our family!\n\nInvite code: ${inviteCode}\n\nDownload at thedadcenter.com`
      : 'I\'m using The Dad Center to track our pregnancy journey. Join me!\n\nDownload at thedadcenter.com'

    try {
      await Share.share({ message })
    } catch {
      // User dismissed
    }

    setIsSending(false)
    router.push('/(onboarding)/ready')
  }

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    router.push('/(onboarding)/ready')
  }

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            entering={FadeInDown.delay(200).springify().damping(12)}
            style={styles.iconContainer}
          >
            <View style={[styles.iconCircle, { backgroundColor: colors.goldDim, borderColor: colors.goldGlow }]}>
              <UserPlus size={28} color={colors.gold} />
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(400).springify().damping(12)}
          >
            <Text style={[styles.step, { color: colors.copper }]}>Step 3 of 4</Text>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Invite your partner</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              One subscription covers both of you. Share access so you can track
              everything together.
            </Text>
          </Animated.View>

          {/* Invite code card */}
          {inviteCode && (
            <Animated.View
              entering={FadeInDown.delay(550).springify().damping(12)}
            >
              <GlassCard style={[styles.codeCard, { borderColor: colors.goldGlow }]}>
                <View style={[styles.codeAccent, { backgroundColor: colors.gold }]} />
                <View style={styles.codeInner}>
                  <Text style={[styles.codeLabel, { color: colors.textMuted }]}>Your family invite code</Text>
                  <View style={styles.codeRow}>
                    <Text style={[styles.codeText, { color: colors.gold }]}>{inviteCode}</Text>
                    <Pressable onPress={handleCopyCode} style={[styles.copyButton, { backgroundColor: colors.goldDim, borderColor: colors.goldGlow }]}>
                      <Copy size={16} color={codeCopied ? colors.sage : colors.gold} />
                      <Text style={[styles.copyText, { color: colors.gold }, codeCopied && { color: colors.sage }]}>
                        {codeCopied ? 'Copied' : 'Copy'}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </GlassCard>
            </Animated.View>
          )}

          {/* Email input */}
          <Animated.View
            entering={FadeInDown.delay(650).springify().damping(12)}
            style={styles.form}
          >
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Partner's email (optional)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.textSecondary }]}
                value={email}
                onChangeText={setEmail}
                placeholder="partner@email.com"
                placeholderTextColor={colors.textDim}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </Animated.View>

          {/* Actions */}
          <Animated.View
            entering={FadeInDown.delay(800).springify().damping(12)}
            style={styles.actions}
          >
            <Pressable
              onPress={handleSendEmail}
              disabled={isSending}
              style={({ pressed }) => [
                styles.sendButton,
                { backgroundColor: colors.copper },
                pressed && styles.buttonPressed,
                isSending && styles.buttonDisabled,
              ]}
            >
              {isSending ? (
                <ActivityIndicator color={colors.textPrimary} />
              ) : (
                <>
                  <Share2 size={18} color={colors.textPrimary} />
                  <Text style={[styles.sendButtonText, { color: colors.textPrimary }]}>Share Invite</Text>
                </>
              )}
            </Pressable>

            <Pressable
              onPress={handleShareInvite}
              style={({ pressed }) => [
                styles.shareSystemButton,
                { backgroundColor: colors.goldDim, borderColor: colors.goldGlow },
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={[styles.shareSystemText, { color: colors.gold }]}>Share via other apps</Text>
            </Pressable>

            <Pressable
              onPress={handleSkip}
              style={({ pressed }) => [
                styles.skipButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={[styles.skipText, { color: colors.textMuted }]}>Skip for now</Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Invite code card
  codeCard: {
    overflow: 'hidden',
    flexDirection: 'row',
    padding: 0,
    marginTop: 28,
  },
  codeAccent: {
    width: 3,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  codeInner: {
    flex: 1,
    padding: 16,
  },
  codeLabel: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  codeText: {
    fontFamily: 'Jost-SemiBold',
    fontSize: 22,
    letterSpacing: 2,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  copyText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 13,
  },

  // Form
  form: {
    marginTop: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontFamily: 'Karla-Medium',
    fontSize: 14,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Jost-Regular',
    fontSize: 16,
  },

  // Actions
  actions: {
    marginTop: 32,
    gap: 12,
  },
  sendButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  sendButtonText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
  },
  shareSystemButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  shareSystemText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 15,
  },
  skipButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  skipText: {
    fontFamily: 'Karla-Medium',
    fontSize: 15,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
})
