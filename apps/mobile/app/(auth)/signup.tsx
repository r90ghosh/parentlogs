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
import { Link } from 'expo-router'
import { Square, CheckSquare } from 'lucide-react-native'
import { BrandLogo } from '@/components/BrandLogo'
import { supabase } from '@/lib/supabase'
import { signInWithGoogle } from '@/lib/google-auth'
import { signInWithApple } from '@/lib/apple-auth'
import { useColors } from '@/hooks/use-colors'

export default function SignupScreen() {
  const colors = useColors()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isAppleLoading, setIsAppleLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    if (isGoogleLoading) return
    setIsGoogleLoading(true)
    try {
      await signInWithGoogle()
    } catch {
      Alert.alert('Error', 'Could not sign in with Google. Please try again.')
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const handleAppleSignIn = async () => {
    if (isAppleLoading) return
    setIsAppleLoading(true)
    try {
      await signInWithApple()
    } catch (err: unknown) {
      const error = err as { code?: string }
      if (error.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert('Error', 'Could not sign in with Apple. Please try again.')
      }
    } finally {
      setIsAppleLoading(false)
    }
  }

  const handleSignup = async () => {
    if (isLoading) return
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Please fill in all fields.')
      return
    }

    if (password.length < 6) {
      Alert.alert(
        'Weak password',
        'Password must be at least 6 characters long.'
      )
      return
    }

    setIsLoading(true)
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName.trim() },
      },
    })

    if (error) {
      Alert.alert('Sign up failed', error.message)
    }
    setIsLoading(false)
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
          {/* Header */}
          <View style={styles.header}>
            <BrandLogo size={40} textSize={30} />
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              Join thousands of dads who refuse to wing it
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Full Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.textSecondary }]}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Your name"
                placeholderTextColor={colors.textDim}
                autoCapitalize="words"
                autoComplete="name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.textSecondary }]}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={colors.textDim}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Password</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.textSecondary }]}
                value={password}
                onChangeText={setPassword}
                placeholder="At least 6 characters"
                placeholderTextColor={colors.textDim}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>

            <Pressable
              onPress={() => setAgeConfirmed(!ageConfirmed)}
              style={styles.ageRow}
              accessibilityLabel="I confirm I am 18 years or older"
              accessibilityRole="checkbox"
              accessibilityState={{ checked: ageConfirmed }}
            >
              {ageConfirmed ? (
                <CheckSquare size={20} color={colors.copper} />
              ) : (
                <Square size={20} color={colors.textMuted} />
              )}
              <Text style={[styles.ageText, { color: colors.textSecondary }]}>I confirm I am 18 years or older</Text>
            </Pressable>

            <Pressable
              onPress={handleSignup}
              disabled={!ageConfirmed || isLoading}
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: colors.copper },
                pressed && styles.buttonPressed,
                (!ageConfirmed || isLoading) && styles.buttonDisabled,
              ]}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.textPrimary} />
              ) : (
                <Text style={[styles.buttonText, { color: colors.textPrimary }]}>Create Account</Text>
              )}
            </Pressable>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.textDim }]}>or</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            {/* Apple Sign In (iOS only, shown above Google per Apple guidelines) */}
            {Platform.OS === 'ios' && (
              <Pressable
                onPress={handleAppleSignIn}
                disabled={isAppleLoading}
                style={({ pressed }) => [
                  styles.appleButton,
                  pressed && styles.buttonPressed,
                  isAppleLoading && styles.buttonDisabled,
                ]}
              >
                {isAppleLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.appleButtonText}>{'\uF8FF'} Continue with Apple</Text>
                )}
              </Pressable>
            )}

            {/* Google Sign In */}
            <Pressable
              onPress={handleGoogleSignIn}
              disabled={isGoogleLoading}
              style={({ pressed }) => [
                styles.googleButton,
                { backgroundColor: colors.card, borderColor: colors.borderHover },
                pressed && styles.buttonPressed,
                isGoogleLoading && styles.buttonDisabled,
              ]}
            >
              {isGoogleLoading ? (
                <ActivityIndicator color={colors.textSecondary} />
              ) : (
                <Text style={[styles.googleButtonText, { color: colors.textSecondary }]}>Continue with Google</Text>
              )}
            </Pressable>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textMuted }]}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <Pressable>
                <Text style={[styles.linkText, { color: colors.copper }]}>Sign In</Text>
              </Pressable>
            </Link>
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
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  subtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 16,
    textAlign: 'center',
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
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Jost-Regular',
    fontSize: 16,
  },
  ageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
  },
  ageText: {
    fontFamily: 'Karla-Regular',
    fontSize: 14,
    flex: 1,
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontFamily: 'Karla-Regular',
    fontSize: 13,
  },
  appleButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appleButtonText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
  googleButton: {
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  footerText: {
    fontFamily: 'Karla-Regular',
    fontSize: 14,
  },
  linkText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 14,
  },
})
