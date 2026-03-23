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
import { LinearGradient } from 'expo-linear-gradient'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useAuth } from '@/components/providers/AuthProvider'
import { supabase } from '@/lib/supabase'
import * as Haptics from 'expo-haptics'

export default function FamilyScreen() {
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
          <View style={styles.header}>
            <Text style={styles.step}>Step 2 of 3</Text>
            <Text style={styles.title}>Your family</Text>
            <Text style={styles.subtitle}>
              When is the baby expected? This helps us personalize your timeline.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Due Date</Text>
              <Pressable
                onPress={() => setShowDatePicker(true)}
                style={styles.input}
              >
                <Text style={dueDate ? styles.inputText : styles.placeholderText}>
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
              <Text style={styles.hint}>
                Select the expected or actual due date
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Baby's Name (optional)</Text>
              <TextInput
                style={styles.input}
                value={babyName}
                onChangeText={setBabyName}
                placeholder="Baby's name or nickname"
                placeholderTextColor="#4a4239"
                autoCapitalize="words"
              />
            </View>
          </View>

          <Pressable
            onPress={handleContinue}
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
  form: {
    gap: 24,
    marginBottom: 40,
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
  inputText: {
    fontFamily: 'Jost-Regular',
    fontSize: 16,
    color: '#ede6dc',
  },
  placeholderText: {
    fontFamily: 'Jost-Regular',
    fontSize: 16,
    color: '#4a4239',
  },
  hint: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    color: '#4a4239',
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
    opacity: 0.6,
  },
  buttonText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
    color: '#faf6f0',
  },
})
