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
import { ArrowLeft, ClipboardList } from 'lucide-react-native'
import { useAuth } from '@/components/providers/AuthProvider'
import { useCreateTask } from '@/hooks/use-tasks'
import { useColors } from '@/hooks/use-colors'

type TaskAssignee = 'mom' | 'dad' | 'both' | 'either'

const ASSIGNEE_OPTIONS = [
  { value: 'dad', label: 'Dad' },
  { value: 'mom', label: 'Mom' },
  { value: 'both', label: 'Both' },
  { value: 'either', label: 'Either' },
]

const PRIORITY_OPTIONS = [
  { value: 'must-do', label: 'Must-Do' },
  { value: 'good-to-do', label: 'Good-to-Do' },
]

const CATEGORY_OPTIONS = [
  { value: 'medical', label: 'Medical' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'preparation', label: 'Preparation' },
  { value: 'research', label: 'Research' },
  { value: 'documents', label: 'Documents' },
  { value: 'self-care', label: 'Self-Care' },
  { value: 'relationship', label: 'Relationship' },
  { value: 'other', label: 'Other' },
]

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function PillSelector({
  options,
  selected,
  onSelect,
  colors,
}: {
  options: { value: string; label: string }[]
  selected: string
  onSelect: (v: string) => void
  colors: ReturnType<typeof useColors>
}) {
  return (
    <View style={styles.pillRow}>
      {options.map((opt) => (
        <Pressable
          key={opt.value}
          onPress={() => onSelect(opt.value)}
          style={[
            styles.pill,
            { backgroundColor: colors.subtleBg },
            selected === opt.value && { backgroundColor: colors.copper },
          ]}
        >
          <Text
            style={[
              styles.pillText,
              { color: colors.textMuted },
              selected === opt.value && { color: colors.textPrimary },
            ]}
          >
            {opt.label}
          </Text>
        </Pressable>
      ))}
    </View>
  )
}

export default function CreateTaskScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { profile } = useAuth()
  const colors = useColors()
  const createTask = useCreateTask()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [assignedTo, setAssignedTo] = useState<string>(
    profile?.role || 'dad'
  )
  const [priority, setPriority] = useState('good-to-do')
  const [category, setCategory] = useState('other')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const isDisabled =
    isLoading || !title.trim() || !dueDate || !assignedTo || !priority

  const handleSubmit = async () => {
    if (isDisabled) return
    setError(null)

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    if (!DATE_PATTERN.test(dueDate)) {
      setError('Due date must be in YYYY-MM-DD format')
      return
    }

    // Basic date validity check
    const parsed = new Date(dueDate + 'T00:00:00')
    if (isNaN(parsed.getTime())) {
      setError('Invalid date')
      return
    }

    setIsLoading(true)

    createTask.mutate(
      {
        title: title.trim(),
        description: description.trim(),
        due_date: dueDate,
        assigned_to: assignedTo as TaskAssignee,
        priority: priority as 'must-do' | 'good-to-do',
        category,
        status: 'pending' as const,
      },
      {
        onSuccess: () => router.back(),
        onError: () => {
          setError('Something went wrong. Please try again.')
          setIsLoading(false)
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
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>New Task</Text>
        <View style={styles.headerSpacer} />
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
          showsVerticalScrollIndicator={false}
        >
          {/* Icon */}
          <View style={styles.iconContainer}>
            <View style={[styles.iconCircle, { backgroundColor: colors.copperDim }]}>
              <ClipboardList size={28} color={colors.copper} />
            </View>
            <Text style={[styles.description, { color: colors.textMuted }]}>
              Add a custom task for your family to track.
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
            {/* Title */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Title</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.textSecondary }]}
                value={title}
                onChangeText={setTitle}
                placeholder="What needs to get done?"
                placeholderTextColor={colors.textDim}
                autoCapitalize="sentences"
              />
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: colors.card, borderColor: colors.border, color: colors.textSecondary }]}
                value={description}
                onChangeText={setDescription}
                placeholder="Add details..."
                placeholderTextColor={colors.textDim}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Due Date */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Due Date</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.textSecondary }]}
                value={dueDate}
                onChangeText={setDueDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textDim}
                keyboardType="numbers-and-punctuation"
                autoCapitalize="none"
                maxLength={10}
              />
            </View>

            {/* Assigned To */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Assigned To</Text>
              <PillSelector
                options={ASSIGNEE_OPTIONS}
                selected={assignedTo}
                onSelect={setAssignedTo}
                colors={colors}
              />
            </View>

            {/* Priority */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Priority</Text>
              <PillSelector
                options={PRIORITY_OPTIONS}
                selected={priority}
                onSelect={setPriority}
                colors={colors}
              />
            </View>

            {/* Category */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Category</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryScroll}
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <Pressable
                    key={opt.value}
                    onPress={() => setCategory(opt.value)}
                    style={[
                      styles.pill,
                      { backgroundColor: colors.subtleBg },
                      category === opt.value && { backgroundColor: colors.copper },
                    ]}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        { color: colors.textMuted },
                        category === opt.value && { color: colors.textPrimary },
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
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
              {isLoading ? (
                <ActivityIndicator color={colors.textPrimary} />
              ) : (
                <Text style={[styles.buttonText, { color: colors.textPrimary }]}>Create Task</Text>
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
  textArea: {
    minHeight: 80,
    paddingTop: 14,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 0,
  },
  pillText: {
    fontFamily: 'Karla-Medium',
    fontSize: 14,
  },
  categoryScroll: {
    gap: 8,
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
