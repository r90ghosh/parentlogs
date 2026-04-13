import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ArrowLeft, KeyRound, Eye, EyeOff } from 'lucide-react-native'
import { useAuth } from '@/components/providers/AuthProvider'
import { supabase } from '@/lib/supabase'
import { useColors } from '@/hooks/use-colors'

export default function ChangePasswordScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { user } = useAuth()
  const colors = useColors()
  const params = useLocalSearchParams<{ recovery?: string }>()

  // In recovery mode (from password reset email), skip current password check
  const isRecovery = params.recovery === '1'

  const hasEmailIdentity =
    user?.identities?.some((i) => i.provider === 'email') ?? false
  const requireCurrentPassword = hasEmailIdentity && !isRecovery

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const isDisabled =
    isLoading ||
    !newPassword ||
    !confirmPassword ||
    (requireCurrentPassword && !currentPassword)

  const handleSubmit = async () => {
    if (isDisabled) return
    setError(null)

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (requireCurrentPassword && newPassword === currentPassword) {
      setError('New password must be different from current password')
      return
    }

    setIsLoading(true)

    try {
      // Verify current password for email users (skip in recovery mode)
      if (requireCurrentPassword) {
        const { error: signInError } =
          await supabase.auth.signInWithPassword({
            email: user!.email!,
            password: currentPassword,
          })
        if (signInError) {
          setError('Current password is incorrect')
          setIsLoading(false)
          return
        }
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) {
        setError(updateError.message)
      } else {
        const message = isRecovery
          ? 'Your password has been reset successfully.'
          : hasEmailIdentity
            ? 'Your password has been changed.'
            : 'Your password has been set. You can now sign in with email.'
        Alert.alert(
          'Success',
          message,
          [{ text: 'OK', onPress: () => router.back() }]
        )
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
            <Pressable onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.subtleBg }]}>
              <ArrowLeft size={20} color={colors.textSecondary} />
            </Pressable>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
              {isRecovery ? 'Reset Password' : hasEmailIdentity ? 'Change Password' : 'Set Password'}
            </Text>
            <View style={styles.headerSpacer} />
          </View>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <View style={[styles.iconCircle, { backgroundColor: colors.copperDim }]}>
              <KeyRound size={28} color={colors.copper} />
            </View>
            <Text style={[styles.description, { color: colors.textMuted }]}>
              {isRecovery
                ? 'Choose a new password for your account.'
                : hasEmailIdentity
                  ? 'Enter your current password and choose a new one.'
                  : 'Set a password so you can also sign in with email and password.'}
            </Text>
          </View>

          {/* Error */}
          {error && (
            <View style={[styles.errorContainer, { backgroundColor: colors.coralDim, borderColor: 'rgba(212,131,107,0.2)' }]}>
              <Text style={[styles.errorText, { color: colors.coral }]}>{error}</Text>
            </View>
          )}

          {/* Form */}
          <View style={styles.form}>
            {requireCurrentPassword && (
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Current Password</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.textSecondary }]}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="Enter current password"
                    placeholderTextColor={colors.textDim}
                    secureTextEntry={!showCurrentPassword}
                    autoComplete="current-password"
                  />
                  <Pressable
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={styles.eyeButton}
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={18} color={colors.textMuted} />
                    ) : (
                      <Eye size={18} color={colors.textMuted} />
                    )}
                  </Pressable>
                </View>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>New Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.textSecondary }]}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="At least 8 characters"
                  placeholderTextColor={colors.textDim}
                  secureTextEntry={!showNewPassword}
                  autoComplete="new-password"
                />
                <Pressable
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  style={styles.eyeButton}
                >
                  {showNewPassword ? (
                    <EyeOff size={18} color={colors.textMuted} />
                  ) : (
                    <Eye size={18} color={colors.textMuted} />
                  )}
                </Pressable>
              </View>
              <Text style={[styles.hint, { color: colors.textDim }]}>Minimum 8 characters</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Confirm New Password</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.textSecondary }]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor={colors.textDim}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>

            <Pressable
              onPress={handleSubmit}
              disabled={isDisabled}
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: colors.copper },
                pressed && styles.buttonPressed,
                isDisabled && styles.buttonDisabled,
              ]}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.textPrimary} />
              ) : (
                <Text style={[styles.buttonText, { color: colors.textPrimary }]}>
                  {isRecovery ? 'Reset Password' : hasEmailIdentity ? 'Change Password' : 'Set Password'}
                </Text>
              )}
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
    backgroundColor: 'transparent',
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
  },
  headerSpacer: {
    width: 36,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  description: {
    fontFamily: 'Jost-Regular',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  errorContainer: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  errorText: {
    fontFamily: 'Karla-Medium',
    fontSize: 14,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontFamily: 'Karla-Medium',
    fontSize: 14,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingRight: 48,
    fontFamily: 'Jost-Regular',
    fontSize: 16,
  },
  eyeButton: {
    position: 'absolute',
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  hint: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
  },
})
