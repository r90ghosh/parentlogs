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
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ArrowLeft, User } from 'lucide-react-native'
import { useAuth } from '@/components/providers/AuthProvider'
import { supabase } from '@/lib/supabase'
import { useColors } from '@/hooks/use-colors'

const ROLES = ['dad', 'mom', 'other'] as const
type Role = (typeof ROLES)[number]

const ROLE_LABELS: Record<Role, string> = {
  dad: 'Dad',
  mom: 'Mom',
  other: 'Other',
}

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { user, profile, refreshProfile } = useAuth()
  const colors = useColors()

  const [name, setName] = useState(profile?.full_name ?? '')
  const [selectedRole, setSelectedRole] = useState<Role | null>(
    (profile?.role as Role) ?? null
  )
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const isDisabled = isLoading || !name.trim() || !selectedRole

  const handleSubmit = async () => {
    if (isDisabled) return
    setError(null)

    if (!name.trim()) {
      setError('Name is required')
      return
    }
    if (!selectedRole) {
      setError('Please select a role')
      return
    }

    setIsLoading(true)

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ full_name: name.trim(), role: selectedRole })
        .eq('id', user!.id)

      if (updateError) {
        setError('Failed to update profile')
        return
      }

      await refreshProfile()
      router.back()
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
            <Pressable onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.accentSoft }]}>
              <ArrowLeft size={20} color={colors.ink2} />
            </Pressable>
            <Text style={[styles.headerTitle, { color: colors.ink }]}>Edit Profile</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Icon */}
          <View style={styles.iconContainer}>
            <View style={[styles.iconCircle, { backgroundColor: colors.accentSoft }]}>
              <User size={28} color={colors.accent} />
            </View>
            <Text style={[styles.description, { color: colors.muted }]}>
              Update your name and role so your partner sees the right info.
            </Text>
          </View>

          {/* Error */}
          {error && (
            <View style={[styles.errorContainer, { backgroundColor: colors.accentSoft, borderColor: colors.coral }]}>
              <Text style={[styles.errorText, { color: colors.coral }]}>{error}</Text>
            </View>
          )}

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.muted }]}>Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.bg, borderColor: colors.line, color: colors.ink }]}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor={colors.faint}
                autoCapitalize="words"
                autoComplete="name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.muted }]}>Role</Text>
              <View style={styles.pillRow}>
                {ROLES.map((role) => {
                  const isSelected = selectedRole === role
                  return (
                    <Pressable
                      key={role}
                      onPress={() => setSelectedRole(role)}
                      style={[
                        styles.pill,
                        isSelected
                          ? { backgroundColor: colors.accent }
                          : { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line },
                      ]}
                    >
                      <Text
                        style={[
                          styles.pillText,
                          { color: isSelected ? '#fff' : colors.muted },
                        ]}
                      >
                        {ROLE_LABELS[role]}
                      </Text>
                    </Pressable>
                  )
                })}
              </View>
            </View>

            <Pressable
              onPress={handleSubmit}
              disabled={isDisabled}
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: colors.accent },
                pressed && styles.buttonPressed,
                isDisabled && styles.buttonDisabled,
              ]}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Save Changes</Text>
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
    fontFamily: 'Jakarta-SemiBold',
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
    gap: 8,
  },
  label: {
    fontFamily: 'Jakarta-Medium',
    fontSize: 13,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: 'Jakarta-Medium',
    fontSize: 15,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 12,
  },
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  pillText: {
    fontFamily: 'Jakarta-SemiBold',
    fontSize: 14,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
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
})
