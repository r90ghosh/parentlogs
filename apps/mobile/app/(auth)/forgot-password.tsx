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
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BrandLogo } from '@/components/BrandLogo'
import { supabase } from '@/lib/supabase'
import { useColors } from '@/hooks/use-colors'

export default function ForgotPasswordScreen() {
  const colors = useColors()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const params = useLocalSearchParams<{ email?: string }>()

  const [email, setEmail] = useState(params.email || '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const handleSendReset = async () => {
    if (isLoading) return
    const trimmed = email.trim()
    if (!trimmed) {
      setError('Please enter your email address')
      return
    }

    setIsLoading(true)
    setError(null)

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      trimmed,
      { redirectTo: 'thedadcenter://reset-password' }
    )

    if (resetError) {
      setError(resetError.message)
    } else {
      setSent(true)
    }
    setIsLoading(false)
  }

  if (sent) {
    return (
      <View style={[styles.container, { backgroundColor: 'transparent' }]}>
        <View
          style={[
            styles.centeredContent,
            { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 24 },
          ]}
        >
          <View style={[styles.successIconCircle, { backgroundColor: colors.sageDim }]}>
            <CheckCircle size={32} color={colors.sage} />
          </View>
          <Text style={[styles.successTitle, { color: colors.ink }]}>Check your email</Text>
          <Text style={[styles.successDescription, { color: colors.muted }]}>
            We sent a password reset link to{'\n'}
            <Text style={[styles.successEmail, { color: colors.ink2 }]}>{email.trim()}</Text>
          </Text>
          <Text style={[styles.successHint, { color: colors.faint }]}>
            Click the link to reset your password in your browser. Once done,
            come back here and sign in with your new password.
          </Text>

          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backToLoginButton,
              { backgroundColor: colors.card, borderColor: colors.line },
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={[styles.backToLoginText, { color: colors.accentInk }]}>Back to Login</Text>
          </Pressable>
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.card, borderColor: colors.line }]}>
          <ArrowLeft size={20} color={colors.ink2} />
        </Pressable>
      </View>

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
        >
          {/* Brand + icon + title */}
          <View style={styles.iconContainer}>
            <BrandLogo size={36} textSize={24} />
            <View style={[styles.iconCircle, { backgroundColor: colors.accentSoft }]}>
              <Mail size={28} color={colors.accent} />
            </View>
            <Text style={[styles.title, { color: colors.ink }]}>Forgot Password?</Text>
            <Text style={[styles.description, { color: colors.muted }]}>
              Enter your email and we'll send you a link to reset your password.
            </Text>
          </View>

          {/* Error */}
          {error && (
            <View style={[styles.errorContainer, { backgroundColor: colors.coralDim, borderColor: colors.coral }]}>
              <Text style={[styles.errorText, { color: colors.coral }]}>{error}</Text>
            </View>
          )}

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.muted }]}>Email</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.bg, borderColor: colors.line, color: colors.ink }]}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={colors.faint}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                autoFocus={!params.email}
              />
            </View>

            <Pressable
              onPress={handleSendReset}
              disabled={isLoading}
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: colors.accent },
                pressed && styles.buttonPressed,
                isLoading && styles.buttonDisabled,
              ]}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send Reset Link</Text>
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
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
    gap: 16,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 22,
    letterSpacing: -0.3,
  },
  description: {
    fontFamily: 'Jakarta-Regular',
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
    fontFamily: 'Jakarta-Medium',
    fontSize: 14,
  },
  form: {
    gap: 20,
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
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 15,
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
    fontFamily: 'Jakarta-Bold',
    fontSize: 15,
    color: '#fff',
  },

  // Success state
  centeredContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  successTitle: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 22,
    letterSpacing: -0.3,
  },
  successDescription: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  successEmail: {
    fontFamily: 'Jakarta-Medium',
  },
  successHint: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  backToLoginButton: {
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  backToLoginText: {
    fontFamily: 'Jakarta-SemiBold',
    fontSize: 15,
  },
})
