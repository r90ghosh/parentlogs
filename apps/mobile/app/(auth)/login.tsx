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
import { LinearGradient } from 'expo-linear-gradient'
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import { supabase } from '@/lib/supabase'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleLogin = async () => {
    if (isLoading) return
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Please enter your email and password.')
      return
    }

    setIsLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error) {
      Alert.alert('Sign in failed', error.message)
    }
    setIsLoading(false)
  }

  const handleGoogleSignIn = async () => {
    if (isGoogleLoading) return
    setIsGoogleLoading(true)
    try {
      const redirectUrl = Linking.createURL('auth/callback')
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      })

      if (error) {
        Alert.alert('Google sign in failed', error.message)
        return
      }

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl)
        if (result.type === 'success' && result.url) {
          const parsedUrl = Linking.parse(result.url)
          const accessToken = (parsedUrl.queryParams as Record<string, string>)?.access_token
          const refreshToken = (parsedUrl.queryParams as Record<string, string>)?.refresh_token
          if (accessToken && refreshToken) {
            await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
          }
        }
      }
    } catch (err) {
      Alert.alert('Error', 'Could not sign in with Google. Please try again.')
    } finally {
      setIsGoogleLoading(false)
    }
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
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.brand}>The Dad Center</Text>
            <Text style={styles.subtitle}>
              The operating system for modern fatherhood
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="#4a4239"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#4a4239"
                secureTextEntry
                autoComplete="password"
              />
            </View>

            <Pressable
              onPress={handleLogin}
              disabled={isLoading}
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
                isLoading && styles.buttonDisabled,
              ]}
            >
              {isLoading ? (
                <ActivityIndicator color="#faf6f0" />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </Pressable>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Sign In */}
            <Pressable
              onPress={handleGoogleSignIn}
              disabled={isGoogleLoading}
              style={({ pressed }) => [
                styles.googleButton,
                pressed && styles.buttonPressed,
                isGoogleLoading && styles.buttonDisabled,
              ]}
            >
              {isGoogleLoading ? (
                <ActivityIndicator color="#ede6dc" />
              ) : (
                <Text style={styles.googleButtonText}>Continue with Google</Text>
              )}
            </Pressable>

          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/(auth)/signup" asChild>
              <Pressable>
                <Text style={styles.linkText}>Sign Up</Text>
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
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  brand: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 32,
    color: '#faf6f0',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 16,
    color: '#7a6f62',
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
  button: {
    backgroundColor: '#c4703f',
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
    color: '#faf6f0',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(237,230,220,0.08)',
  },
  dividerText: {
    fontFamily: 'Karla-Regular',
    fontSize: 13,
    color: '#4a4239',
  },
  googleButton: {
    backgroundColor: '#201c18',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(237,230,220,0.12)',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
    color: '#ede6dc',
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
    color: '#7a6f62',
  },
  linkText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 14,
    color: '#c4703f',
  },
})
