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
            <Pressable onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.subtleBg }]}>
              <ArrowLeft size={20} color={colors.textSecondary} />
            </Pressable>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Edit Profile</Text>
            <View style={styles.headerSpacer} />
          </View>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <View style={[styles.iconCircle, { backgroundColor: colors.copperDim }]}>
              <User size={28} color={colors.copper} />
            </View>
            <Text style={[styles.description, { color: colors.textMuted }]}>
              Update your name and role so your partner sees the right info.
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
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.textSecondary }]}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor={colors.textDim}
                autoCapitalize="words"
                autoComplete="name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Role</Text>
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
                          ? { backgroundColor: colors.copper }
                          : { backgroundColor: colors.subtleBg, borderWidth: 1, borderColor: colors.border },
                      ]}
                    >
                      <Text
                        style={[
                          styles.pillText,
                          { color: isSelected ? colors.textPrimary : colors.textMuted },
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
                { backgroundColor: colors.copper },
                pressed && styles.buttonPressed,
                isDisabled && styles.buttonDisabled,
              ]}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.textPrimary} />
              ) : (
                <Text style={[styles.buttonText, { color: colors.textPrimary }]}>Save Changes</Text>
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
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Jost-Regular',
    fontSize: 16,
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
    fontFamily: 'Karla-SemiBold',
    fontSize: 14,
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
