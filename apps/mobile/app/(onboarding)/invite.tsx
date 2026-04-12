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
import { LinearGradient } from 'expo-linear-gradient'
import { useAuth } from '@/components/providers/AuthProvider'
import { UserPlus, Share2, Copy } from 'lucide-react-native'
import * as Clipboard from 'expo-clipboard'
import * as Haptics from 'expo-haptics'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { GlassCard } from '@/components/glass'

export default function InviteScreen() {
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
    <View style={styles.container}>
      <LinearGradient
        colors={['#12100e', '#1a1714', '#12100e']}
        style={StyleSheet.absoluteFill}
      />
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
            <View style={styles.iconCircle}>
              <UserPlus size={28} color="#d4a853" />
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(400).springify().damping(12)}
          >
            <Text style={styles.step}>Step 3 of 4</Text>
            <Text style={styles.title}>Invite your partner</Text>
            <Text style={styles.subtitle}>
              One subscription covers both of you. Share access so you can track
              everything together.
            </Text>
          </Animated.View>

          {/* Invite code card */}
          {inviteCode && (
            <Animated.View
              entering={FadeInDown.delay(550).springify().damping(12)}
            >
              <GlassCard style={styles.codeCard}>
                <View style={styles.codeAccent} />
                <View style={styles.codeInner}>
                  <Text style={styles.codeLabel}>Your family invite code</Text>
                  <View style={styles.codeRow}>
                    <Text style={styles.codeText}>{inviteCode}</Text>
                    <Pressable onPress={handleCopyCode} style={styles.copyButton}>
                      <Copy size={16} color={codeCopied ? '#6b8f71' : '#d4a853'} />
                      <Text style={[styles.copyText, codeCopied && styles.copyTextCopied]}>
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
              <Text style={styles.label}>Partner's email (optional)</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="partner@email.com"
                placeholderTextColor="#4a4239"
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
                pressed && styles.buttonPressed,
                isSending && styles.buttonDisabled,
              ]}
            >
              {isSending ? (
                <ActivityIndicator color="#faf6f0" />
              ) : (
                <>
                  <Share2 size={18} color="#faf6f0" />
                  <Text style={styles.sendButtonText}>Share Invite</Text>
                </>
              )}
            </Pressable>

            <Pressable
              onPress={handleShareInvite}
              style={({ pressed }) => [
                styles.shareSystemButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.shareSystemText}>Share via other apps</Text>
            </Pressable>

            <Pressable
              onPress={handleSkip}
              style={({ pressed }) => [
                styles.skipButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.skipText}>Skip for now</Text>
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
    backgroundColor: '#12100e',
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
    backgroundColor: 'rgba(212,168,83,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 28,
    color: '#faf6f0',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 16,
    color: '#7a6f62',
    textAlign: 'center',
    lineHeight: 24,
  },

  // Invite code card
  codeCard: {
    overflow: 'hidden',
    flexDirection: 'row',
    padding: 0,
    marginTop: 28,
    borderColor: 'rgba(212,168,83,0.2)',
  },
  codeAccent: {
    width: 3,
    backgroundColor: '#d4a853',
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
    color: '#7a6f62',
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
    color: '#d4a853',
    letterSpacing: 2,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(212,168,83,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.2)',
  },
  copyText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 13,
    color: '#d4a853',
  },
  copyTextCopied: {
    color: '#6b8f71',
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
    color: '#ede6dc',
  },
  input: {
    backgroundColor: '#201c18',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(237,230,220,0.08)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Jost-Regular',
    fontSize: 16,
    color: '#ede6dc',
  },

  // Actions
  actions: {
    marginTop: 32,
    gap: 12,
  },
  sendButton: {
    backgroundColor: '#c4703f',
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
    color: '#faf6f0',
  },
  shareSystemButton: {
    backgroundColor: 'rgba(212,168,83,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212,168,83,0.25)',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  shareSystemText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 15,
    color: '#d4a853',
  },
  skipButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  skipText: {
    fontFamily: 'Karla-Medium',
    fontSize: 15,
    color: '#7a6f62',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
})
