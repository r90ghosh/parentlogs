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
          <View style={styles.iconContainer}>
            <View style={[styles.iconCircle, { backgroundColor: colors.goldDim }]}>
              <UserPlus size={28} color={colors.gold} />
            </View>
          </View>

          <View>
            <Text style={[styles.step, { color: colors.accent }]}>STEP 3 OF 4</Text>
            <Text style={[styles.title, { color: colors.ink }]}>Invite your partner</Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>
              One subscription covers both of you. Share access so you can track
              everything together.
            </Text>
          </View>

          {/* Invite code card */}
          {inviteCode && (
            <View style={[styles.codeCard, { backgroundColor: colors.card, borderColor: colors.line }]}>
              <View style={[styles.codeAccent, { backgroundColor: colors.gold }]} />
              <View style={styles.codeInner}>
                <Text style={[styles.codeLabel, { color: colors.muted }]}>Your family invite code</Text>
                <View style={styles.codeRow}>
                  <Text style={[styles.codeText, { color: colors.gold }]}>{inviteCode}</Text>
                  <Pressable onPress={handleCopyCode} style={[styles.copyButton, { backgroundColor: colors.goldDim, borderColor: colors.line }]}>
                    <Copy size={16} color={codeCopied ? colors.sage : colors.gold} />
                    <Text style={[styles.copyText, { color: codeCopied ? colors.sage : colors.gold }]}>
                      {codeCopied ? 'Copied' : 'Copy'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}

          {/* Email input */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.muted }]}>Partner's email (optional)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.bg, borderColor: colors.line, color: colors.ink }]}
                value={email}
                onChangeText={setEmail}
                placeholder="partner@email.com"
                placeholderTextColor={colors.faint}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable
              onPress={handleSendEmail}
              disabled={isSending}
              style={({ pressed }) => [
                styles.sendButton,
                { backgroundColor: colors.accent },
                pressed && styles.buttonPressed,
                isSending && styles.buttonDisabled,
              ]}
            >
              {isSending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Share2 size={18} color="#fff" />
                  <Text style={styles.sendButtonText}>Share Invite</Text>
                </>
              )}
            </Pressable>

            <Pressable
              onPress={handleShareInvite}
              style={({ pressed }) => [
                styles.shareSystemButton,
                { backgroundColor: colors.card, borderColor: colors.line },
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={[styles.shareSystemText, { color: colors.ink }]}>Share via other apps</Text>
            </Pressable>

            <Pressable
              onPress={handleSkip}
              style={({ pressed }) => [
                styles.skipButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={[styles.skipText, { color: colors.muted }]}>Skip for now</Text>
            </Pressable>
          </View>
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
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Invite code card
  codeCard: {
    overflow: 'hidden',
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 28,
  },
  codeAccent: {
    width: 3,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  codeInner: {
    flex: 1,
    padding: 16,
  },
  codeLabel: {
    fontFamily: 'Jakarta-Medium',
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
    fontFamily: 'Jakarta-Bold',
    fontSize: 20,
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
    fontFamily: 'Jakarta-SemiBold',
    fontSize: 13,
  },

  // Form
  form: {
    marginTop: 24,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontFamily: 'Jakarta-Medium',
    fontSize: 13,
  },
  input: {
    fontFamily: 'Jakarta-Medium',
    fontSize: 15,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },

  // Actions
  actions: {
    marginTop: 28,
    gap: 10,
  },
  sendButton: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  sendButtonText: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 15,
    color: '#fff',
  },
  shareSystemButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  shareSystemText: {
    fontFamily: 'Jakarta-SemiBold',
    fontSize: 15,
  },
  skipButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  skipText: {
    fontFamily: 'Jakarta-Medium',
    fontSize: 15,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
})
