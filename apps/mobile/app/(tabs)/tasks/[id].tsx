import { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  ArrowLeft,
  CheckCircle2,
  SkipForward,
  Clock,
  Stethoscope,
  ShoppingBag,
  ClipboardList,
  Wallet,
  Heart,
  Sparkles,
  Lightbulb,
  Trash2,
  Check,
} from 'lucide-react-native'
import * as Haptics from 'expo-haptics'
import { useColors } from '@/hooks/use-colors'
import { useTaskById, useCompleteTask, useSnoozeTask, useSkipTask, useUpdateTask, useDeleteTask } from '@/hooks/use-tasks'
import { format } from 'date-fns'

function getCategoryIcon(category: string) {
  switch (category?.toLowerCase()) {
    case 'medical':
    case 'healthcare':
    case 'health':
      return Stethoscope
    case 'shopping':
    case 'gear':
    case 'nursery':
      return ShoppingBag
    case 'planning':
    case 'preparation':
      return ClipboardList
    case 'financial':
    case 'legal':
    case 'insurance':
      return Wallet
    case 'partner':
    case 'relationship':
      return Heart
    default:
      return Sparkles
  }
}

function getCategoryColor(category: string, colors: ReturnType<typeof useColors>): string {
  switch (category?.toLowerCase()) {
    case 'medical':
    case 'healthcare':
    case 'health':
      return colors.rose
    case 'shopping':
    case 'gear':
    case 'nursery':
      return colors.gold
    case 'financial':
    case 'legal':
    case 'insurance':
      return colors.sage
    case 'partner':
    case 'relationship':
      return colors.rose
    default:
      return colors.sky
  }
}

function getAssigneeLabel(assignee: string): string {
  switch (assignee) {
    case 'dad':
      return 'Dad'
    case 'mom':
      return 'Mom'
    case 'both':
      return 'Both parents'
    case 'either':
      return 'Either parent'
    default:
      return assignee
  }
}

function getAssigneeDotColor(assignee: string, colors: ReturnType<typeof useColors>): string {
  switch (assignee) {
    case 'dad':
      return colors.dotBaby
    case 'mom':
      return colors.dotHer
    case 'both':
      return colors.dotTip
    default:
      return colors.muted
  }
}

const SNOOZE_OPTIONS: { label: string; days: number }[] = [
  { label: '1d', days: 1 },
  { label: '3d', days: 3 },
  { label: '7d', days: 7 },
]

const TAB_BAR_CONTENT_HEIGHT = 52

export default function TaskDetailScreen() {
  const colors = useColors()
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { data: task, isLoading } = useTaskById(id)
  const completeTask = useCompleteTask()
  const snoozeTask = useSnoozeTask()
  const skipTask = useSkipTask()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()

  const [notes, setNotes] = useState('')
  const notesDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (task?.notes !== undefined && task.notes !== null) {
      setNotes(task.notes)
    }
  }, [task?.id, task?.notes])

  useEffect(() => {
    return () => {
      if (notesDebounceRef.current) {
        clearTimeout(notesDebounceRef.current)
      }
    }
  }, [])

  const handleNotesChange = (text: string) => {
    setNotes(text)
    if (notesDebounceRef.current) {
      clearTimeout(notesDebounceRef.current)
    }
    notesDebounceRef.current = setTimeout(() => {
      updateTask.mutate({ id, updates: { notes: text } })
    }, 1000)
  }

  const handleComplete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    completeTask.mutate(id, {
      onSuccess: () => router.back(),
    })
  }

  const handleSnooze = (days: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    snoozeTask.mutate({ id, days }, {
      onSuccess: () => router.back(),
    })
  }

  const handleSkip = () => {
    Alert.alert('Skip Task', 'Are you sure you want to skip this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Skip',
        style: 'destructive',
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          skipTask.mutate(id, {
            onSuccess: () => router.back(),
          })
        },
      },
    ])
  }

  const handleDelete = () => {
    Alert.alert('Delete Task', "This can't be undone.", [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
          deleteTask.mutate(id, { onSuccess: () => router.back() })
        },
      },
    ])
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </View>
    )
  }

  if (!task) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { borderBottomColor: colors.line }]}>
          <Pressable onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.card, borderColor: colors.line }]}>
            <ArrowLeft size={20} color={colors.ink2} />
          </Pressable>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={[styles.errorText, { color: colors.muted }]}>Task not found</Text>
        </View>
      </View>
    )
  }

  const CategoryIcon = getCategoryIcon(task.category)
  const categoryColor = getCategoryColor(task.category, colors)
  const assigneeDotColor = getAssigneeDotColor(task.assigned_to, colors)
  const isCompleted = task.status === 'completed'
  const isActionable = task.status === 'pending' || task.status === 'snoozed'

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.line }]}>
        <Pressable onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.card, borderColor: colors.line }]}>
          <ArrowLeft size={20} color={colors.ink2} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.ink }]}>Task Details</Text>
        <Pressable onPress={handleDelete} style={[styles.deleteButton, { backgroundColor: colors.coralDim }]}>
          <Trash2 size={18} color={colors.coral} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: isActionable
              ? insets.bottom + TAB_BAR_CONTENT_HEIGHT + 200
              : insets.bottom + TAB_BAR_CONTENT_HEIGHT + 24,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={[styles.title, { color: colors.ink }]}>{task.title}</Text>

        {/* Meta badges row */}
        <View style={styles.metaRow}>
          {/* Assignee dot + label */}
          <View style={[styles.metaBadge, { backgroundColor: colors.card, borderColor: colors.line }]}>
            <View style={[styles.assigneeDot, { backgroundColor: assigneeDotColor }]} />
            <Text style={[styles.metaBadgeText, { color: colors.ink2 }]}>
              {getAssigneeLabel(task.assigned_to)}
            </Text>
          </View>
          {/* Category */}
          <View style={[styles.metaBadge, { backgroundColor: colors.card, borderColor: colors.line }]}>
            <CategoryIcon size={13} color={categoryColor} />
            <Text style={[styles.metaBadgeText, { color: colors.ink2, textTransform: 'capitalize' }]}>
              {task.category}
            </Text>
          </View>
          {/* Due date */}
          {task.due_date && (
            <View style={[styles.metaBadge, { backgroundColor: colors.card, borderColor: colors.line }]}>
              <Clock size={12} color={colors.muted} />
              <Text style={[styles.metaBadgeText, { color: colors.muted }]}>
                Due {format(new Date(task.due_date), 'MMM d, yyyy')}
              </Text>
            </View>
          )}
        </View>

        {isCompleted && task.completed_at && (
          <View style={[styles.completedBanner, { backgroundColor: colors.sageDim, borderColor: colors.sage + '30' }]}>
            <CheckCircle2 size={16} color={colors.sage} />
            <Text style={[styles.completedText, { color: colors.sage }]}>
              Completed on {format(new Date(task.completed_at), 'MMM d, yyyy')}
            </Text>
          </View>
        )}

        {/* Description */}
        {task.description && (
          <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.line }]}>
            <Text style={[styles.sectionTitle, { color: colors.muted }]}>Description</Text>
            <Text style={[styles.sectionBody, { color: colors.ink2 }]}>{task.description}</Text>
          </View>
        )}

        {/* Why it matters */}
        {task.why_it_matters && (
          <View style={[styles.sectionCard, styles.whyCard, { backgroundColor: colors.card, borderColor: colors.line, borderLeftColor: colors.gold }]}>
            <View style={styles.whyHeader}>
              <Lightbulb size={16} color={colors.gold} />
              <Text style={[styles.whyTitle, { color: colors.gold }]}>Why It Matters</Text>
            </View>
            <Text style={[styles.whyBody, { color: colors.ink2 }]}>{task.why_it_matters}</Text>
          </View>
        )}

        {/* Notes */}
        <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.line }]}>
          <Text style={[styles.sectionTitle, { color: colors.muted }]}>Notes</Text>
          <TextInput
            style={[styles.notesInput, { color: colors.ink2, fontFamily: 'Jakarta-Medium', fontSize: 15 }]}
            multiline
            maxLength={2000}
            placeholder="Add personal notes..."
            placeholderTextColor={colors.faint}
            value={notes}
            onChangeText={handleNotesChange}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {/* Bottom action bar */}
      {isActionable && (
        <View
          style={[
            styles.bottomActions,
            {
              bottom: insets.bottom + TAB_BAR_CONTENT_HEIGHT,
              backgroundColor: colors.card,
              borderTopColor: colors.line,
            },
          ]}
        >
          <View style={styles.secondaryActions}>
            <Pressable onPress={handleSkip} style={styles.secondaryButton}>
              <SkipForward size={17} color={colors.muted} />
              <Text style={[styles.secondaryButtonText, { color: colors.muted }]}>Skip</Text>
            </Pressable>

            {/* Snooze picker */}
            <View style={styles.snoozePickerRow}>
              {SNOOZE_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.days}
                  onPress={() => handleSnooze(opt.days)}
                  style={[styles.snoozeOption, { borderColor: colors.accentSoft, backgroundColor: colors.accentSoft }]}
                >
                  <Clock size={13} color={colors.accent} />
                  <Text style={[styles.snoozeOptionText, { color: colors.accent }]}>{opt.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable
            onPress={handleComplete}
            disabled={completeTask.isPending}
            style={[styles.completeButton, { backgroundColor: colors.accent }]}
          >
            {completeTask.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Check size={18} color="#fff" strokeWidth={2.5} />
                <Text style={styles.completeText}>Mark Complete</Text>
              </>
            )}
          </Pressable>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontFamily: 'Jakarta-SemiBold', fontSize: 16 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 24 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { fontFamily: 'Jakarta-Regular', fontSize: 16 },
  title: { fontFamily: 'Jakarta-Bold', fontSize: 22, lineHeight: 30, letterSpacing: -0.3, marginBottom: 14 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  assigneeDot: { width: 8, height: 8, borderRadius: 4 },
  metaBadgeText: { fontFamily: 'Jakarta-Medium', fontSize: 12 },
  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    marginBottom: 20,
  },
  completedText: { fontFamily: 'Jakarta-Medium', fontSize: 13 },
  sectionCard: {
    padding: 18,
    marginBottom: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    marginBottom: 8,
  },
  sectionBody: { fontFamily: 'Jakarta-Regular', fontSize: 15, lineHeight: 24 },
  whyCard: { borderLeftWidth: 3 },
  whyHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  whyTitle: { fontFamily: 'Jakarta-SemiBold', fontSize: 14 },
  whyBody: { fontFamily: 'Jakarta-Regular', fontSize: 15, lineHeight: 24 },
  notesInput: { minHeight: 80, lineHeight: 22 },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 16,
    borderTopWidth: 1,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6 },
  secondaryButtonText: { fontFamily: 'Jakarta-Medium', fontSize: 14 },
  snoozePickerRow: { flexDirection: 'row', gap: 8 },
  snoozeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  snoozeOptionText: { fontFamily: 'Jakarta-Medium', fontSize: 13 },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 14,
  },
  completeText: { fontFamily: 'Jakarta-Bold', fontSize: 15, color: '#fff' },
})
