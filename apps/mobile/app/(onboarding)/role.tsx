import { useState } from 'react'
import { View, Text, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { useAuth } from '@/components/providers/AuthProvider'
import { supabase } from '@/lib/supabase'
import * as Haptics from 'expo-haptics'

const roles = [
  { key: 'dad', emoji: '👨', label: 'Dad', sublabel: 'Father / Father-to-be' },
  { key: 'mom', emoji: '👩', label: 'Mom', sublabel: 'Mother / Mother-to-be' },
  { key: 'other', emoji: '🤝', label: 'Other', sublabel: 'Caregiver / Support' },
] as const

export default function RoleScreen() {
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
    <View style={styles.container}>
      <LinearGradient
        colors={['#12100e', '#1a1714', '#12100e']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.step}>Step 1 of 4</Text>
          <Text style={styles.title}>Who are you?</Text>
          <Text style={styles.subtitle}>
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
                selectedRole === role.key && styles.optionSelected,
              ]}
            >
              <Text style={styles.emoji}>{role.emoji}</Text>
              <View style={styles.optionText}>
                <Text
                  style={[
                    styles.optionLabel,
                    selectedRole === role.key && styles.optionLabelSelected,
                  ]}
                >
                  {role.label}
                </Text>
                <Text style={styles.optionSublabel}>{role.sublabel}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={handleContinue}
          disabled={!selectedRole || isLoading}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            (!selectedRole || isLoading) && styles.buttonDisabled,
          ]}
        >
          {isLoading ? (
            <ActivityIndicator color="#faf6f0" />
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
    backgroundColor: '#12100e',
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
    fontFamily: 'Karla-Medium',
    fontSize: 13,
    color: '#c4703f',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
    color: '#faf6f0',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 16,
    color: '#7a6f62',
  },
  options: {
    gap: 12,
    marginBottom: 40,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#201c18',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(237,230,220,0.08)',
    padding: 20,
    gap: 16,
  },
  optionSelected: {
    borderColor: '#c4703f',
    backgroundColor: 'rgba(196,112,63,0.08)',
  },
  emoji: {
    fontSize: 32,
    fontFamily: 'System',
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 18,
    color: '#ede6dc',
    marginBottom: 2,
  },
  optionLabelSelected: {
    color: '#faf6f0',
  },
  optionSublabel: {
    fontFamily: 'Karla-Regular',
    fontSize: 14,
    color: '#7a6f62',
  },
  button: {
    backgroundColor: '#c4703f',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
    color: '#faf6f0',
  },
})
