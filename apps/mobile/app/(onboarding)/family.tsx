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
  Alert,
  ActivityIndicator,
} from 'react-native'
import { useRouter } from 'expo-router'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useAuth } from '@/components/providers/AuthProvider'
import { supabase } from '@/lib/supabase'
import * as Haptics from 'expo-haptics'
import { useColors } from '@/hooks/use-colors'

export default function FamilyScreen() {
  const colors = useColors()
  const [dueDate, setDueDate] = useState<Date | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [babyName, setBabyName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  const handleContinue = async () => {
    if (!user) return

    if (!dueDate) {
      Alert.alert('Missing date', 'Please select a due date.')
      return
    }

    setIsLoading(true)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

    const formattedDate = dueDate.toISOString().split('T')[0]

    // Create or update family
    const { data: family, error: familyError } = await supabase
      .from('families')
      .insert({ due_date: formattedDate })
      .select()
      .single()

    if (familyError) {
      Alert.alert('Error', familyError.message)
      setIsLoading(false)
      return
    }

    // Link profile to family and complete onboarding
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        family_id: family.id,
        onboarding_completed: true,
      })
      .eq('id', user.id)

    if (profileError) {
      Alert.alert('Error', profileError.message)
      setIsLoading(false)
      return
    }

    // Optionally create a baby record
    if (babyName.trim()) {
      const { error: babyError } = await supabase.from('babies').insert({
        family_id: family.id,
        name: babyName.trim(),
      })

      if (babyError) {
        Alert.alert('Error', babyError.message)
        setIsLoading(false)
        return
      }
    }

    setIsLoading(false)
    router.push('/(onboarding)/invite')
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
          <View style={styles.header}>
            <Text style={[styles.step, { color: colors.accent }]}>STEP 2 OF 4</Text>
            <Text style={[styles.title, { color: colors.ink }]}>Your family</Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>
              When is the baby expected? This helps us personalize your timeline.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.muted }]}>Due Date</Text>
              <Pressable
                onPress={() => setShowDatePicker(true)}
                style={[styles.datePicker, { backgroundColor: colors.bg, borderColor: colors.line }]}
              >
                <Text style={dueDate ? [styles.inputText, { color: colors.ink }] : [styles.placeholderText, { color: colors.faint }]}>
                  {dueDate
                    ? dueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                    : 'Select your due date'}
                </Text>
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  value={dueDate || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  minimumDate={new Date(Date.now() - 18 * 30 * 24 * 60 * 60 * 1000)}
                  maximumDate={new Date(Date.now() + 10 * 30 * 24 * 60 * 60 * 1000)}
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(Platform.OS === 'ios')
                    if (selectedDate) {
                      setDueDate(selectedDate)
                    }
                  }}
                  themeVariant="dark"
                />
              )}
              <Text style={[styles.hint, { color: colors.faint }]}>
                Select the expected or actual due date
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.muted }]}>Baby's Name (optional)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.bg, borderColor: colors.line, color: colors.ink }]}
                value={babyName}
                onChangeText={setBabyName}
                placeholder="Baby's name or nickname"
                placeholderTextColor={colors.faint}
                autoCapitalize="words"
              />
            </View>
          </View>

          <Pressable
            onPress={handleContinue}
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
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </Pressable>
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
  form: {
    gap: 20,
    marginBottom: 40,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontFamily: 'Jakarta-Medium',
    fontSize: 13,
  },
  datePicker: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  input: {
    fontFamily: 'Jakarta-Medium',
    fontSize: 15,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  inputText: {
    fontFamily: 'Jakarta-Medium',
    fontSize: 15,
  },
  placeholderText: {
    fontFamily: 'Jakarta-Medium',
    fontSize: 15,
  },
  hint: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 12,
    marginTop: 4,
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
    opacity: 0.6,
  },
  buttonText: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 15,
    color: '#fff',
  },
})
