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
import { ArrowLeft, MessageSquarePlus, CheckCircle } from 'lucide-react-native'
import { useSubmitFeedback } from '@/hooks/use-feedback'
import { useColors } from '@/hooks/use-colors'

type FeedbackType = 'bug' | 'feature' | 'question' | 'other'

const FEEDBACK_TYPES: { value: FeedbackType; label: string }[] = [
  { value: 'bug', label: 'Bug' },
  { value: 'feature', label: 'Feature' },
  { value: 'question', label: 'Question' },
  { value: 'other', label: 'Other' },
]

export default function FeedbackScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const colors = useColors()
  const submitFeedback = useSubmitFeedback()

  const [selectedType, setSelectedType] = useState<FeedbackType | null>(null)
  const [message, setMessage] = useState('')
  const [succeeded, setSucceeded] = useState(false)

  const charCount = message.length
  const isDisabled =
    submitFeedback.isPending ||
    !selectedType ||
    charCount < 10

  const handleSubmit = () => {
    if (isDisabled || !selectedType) return

    submitFeedback.mutate(
      { type: selectedType, message },
      {
        onSuccess: () => {
          setSucceeded(true)
          setTimeout(() => router.back(), 1500)
        },
      }
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.subtleBg }]}>
          <ArrowLeft size={20} color={colors.textSecondary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Send Feedback</Text>
        <View style={styles.headerSpacer} />
      </View>

      {succeeded ? (
        <View style={styles.successContainer}>
          <CheckCircle size={56} color={colors.sage} />
          <Text style={[styles.successTitle, { color: colors.textPrimary }]}>Thanks for your feedback!</Text>
          <Text style={[styles.successSubtitle, { color: colors.textMuted }]}>
            We read every message and use it to make the app better.
          </Text>
        </View>
      ) : (
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
            {/* Icon */}
            <View style={styles.iconContainer}>
              <View style={[styles.iconCircle, { backgroundColor: colors.copperDim }]}>
                <MessageSquarePlus size={28} color={colors.copper} />
              </View>
              <Text style={[styles.iconDescription, { color: colors.textMuted }]}>
                Help us improve The Dad Center. Tell us what's working, what's broken, or what you'd love to see.
              </Text>
            </View>

            {/* Error */}
            {submitFeedback.isError && (
              <View style={[styles.errorContainer, { backgroundColor: colors.coralDim, borderColor: 'rgba(212,131,107,0.2)' }]}>
                <Text style={[styles.errorText, { color: colors.coral }]}>
                  Something went wrong. Please try again.
                </Text>
              </View>
            )}

            {/* Form */}
            <View style={styles.form}>
              {/* Type selector */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Type</Text>
                <View style={styles.typeRow}>
                  {FEEDBACK_TYPES.map((ft) => {
                    const isSelected = selectedType === ft.value
                    return (
                      <Pressable
                        key={ft.value}
                        onPress={() => setSelectedType(ft.value)}
                        style={[
                          styles.typePill,
                          isSelected
                            ? { backgroundColor: colors.copperDim, borderWidth: 1, borderColor: colors.copper }
                            : { backgroundColor: colors.subtleBg, borderWidth: 1, borderColor: colors.border },
                        ]}
                      >
                        <Text
                          style={[
                            styles.typePillText,
                            { color: isSelected ? colors.copper : colors.textMuted },
                          ]}
                        >
                          {ft.label}
                        </Text>
                      </Pressable>
                    )
                  })}
                </View>
              </View>

              {/* Message */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Message</Text>
                <TextInput
                  style={[styles.textArea, { backgroundColor: colors.card, borderColor: colors.border, color: colors.textSecondary }]}
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Tell us what's on your mind..."
                  placeholderTextColor={colors.textDim}
                  multiline
                  maxLength={2000}
                  textAlignVertical="top"
                  autoCapitalize="sentences"
                />
                <Text style={[styles.charCount, { color: colors.textMuted }]}>
                  {charCount} / 2000
                  {charCount > 0 && charCount < 10
                    ? ` (${10 - charCount} more to go)`
                    : ''}
                </Text>
              </View>

              {/* Submit */}
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
                {submitFeedback.isPending ? (
                  <ActivityIndicator color={colors.textPrimary} />
                ) : (
                  <Text style={[styles.buttonText, { color: colors.textPrimary }]}>Submit Feedback</Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
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
  iconDescription: {
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
  typeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typePill: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  typePillText: {
    fontFamily: 'Karla-Medium',
    fontSize: 14,
  },
  textArea: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    fontFamily: 'Jost-Regular',
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    textAlign: 'right',
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
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  successTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 22,
    textAlign: 'center',
  },
  successSubtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
})
