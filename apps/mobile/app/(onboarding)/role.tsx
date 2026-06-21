import { useState } from 'react'
import { View, Text, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '@/components/providers/AuthProvider'
import { supabase } from '@/lib/supabase'
import * as Haptics from 'expo-haptics'
import { useColors } from '@/hooks/use-colors'

const roles = [
  { key: 'dad', emoji: '\u{1F468}', label: 'Dad', sublabel: 'Father / Father-to-be' },
  { key: 'mom', emoji: '\u{1F469}', label: 'Mom', sublabel: 'Mother / Mother-to-be' },
  { key: 'other', emoji: '\u{1F91D}', label: 'Other', sublabel: 'Caregiver / Support' },
] as const

export default function RoleScreen() {
  const colors = useColors()
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  const handleSelect = (role: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setSelectedRole(role)
  }

  const handleContinue = async () => {
    if (!selectedRole || !user || isLoading) return
    setIsLoading(true)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

    const { error } = await supabase
      .from('profiles')
      .update({ role: selectedRole })
      .eq('id', user.id)

    if (error) {
      Alert.alert('Error', error.message)
      setIsLoading(false)
      return
    }

    setIsLoading(false)
    router.push('/(onboarding)/family')
  }

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.step, { color: colors.accent }]}>STEP 1 OF 4</Text>
          <Text style={[styles.title, { color: colors.ink }]}>Who are you?</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            We'll personalize your experience based on your role
          </Text>
        </View>

        <View style={styles.options}>
          {roles.map((role) => (
            <Pressable
              key={role.key}
              onPress={() => handleSelect(role.key)}
              style={[
                styles.option,
                { backgroundColor: colors.card, borderColor: colors.line },
                selectedRole === role.key && { borderColor: colors.accent, backgroundColor: colors.accentSoft },
              ]}
            >
              <Text style={styles.emoji}>{role.emoji}</Text>
              <View style={styles.optionText}>
                <Text
                  style={[
                    styles.optionLabel,
                    { color: colors.ink2 },
                    selectedRole === role.key && { color: colors.ink },
                  ]}
                >
                  {role.label}
                </Text>
                <Text style={[styles.optionSublabel, { color: colors.muted }]}>{role.sublabel}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={handleContinue}
          disabled={!selectedRole || isLoading}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: colors.accent },
            pressed && styles.buttonPressed,
            (!selectedRole || isLoading) && styles.buttonDisabled,
          ]}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </Pressable>
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
  header: {
    marginBottom: 40,
  },
  step: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 11,
    marginBottom: 14,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
  },
  title: {
    fontFamily: 'Jakarta-ExtraBold',
    fontSize: 28,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 15,
    lineHeight: 22,
  },
  options: {
    gap: 10,
    marginBottom: 40,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    gap: 16,
  },
  emoji: {
    fontSize: 30,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontFamily: 'Jakarta-SemiBold',
    fontSize: 16,
    marginBottom: 2,
  },
  optionSublabel: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 13,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 15,
    color: '#fff',
  },
})
