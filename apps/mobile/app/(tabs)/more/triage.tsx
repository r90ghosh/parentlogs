import { useState, useCallback } from 'react'
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  ArrowLeft,
  CheckCircle,
  Plus,
  SkipForward,
  PartyPopper,
} from 'lucide-react-native'
import { useBacklogTasks, useTriageTask } from '@/hooks/use-triage'
import { useColors } from '@/hooks/use-colors'
import * as Haptics from 'expo-haptics'
import { format } from 'date-fns'

export default function TriageScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const colors = useColors()
  const { data, isLoading } = useBacklogTasks()
  const triageMutation = useTriageTask()
  const [triagedIds, setTriagedIds] = useState<Set<string>>(new Set())

  const backlogTasks = data?.filter((t) => !triagedIds.has(t.id)) ?? []
  const currentTask = backlogTasks[0]
  const progress = data ? data.length - backlogTasks.length : 0
  const total = data?.length ?? 0

  const handleTriage = useCallback(
    async (action: 'completed' | 'added' | 'skipped') => {
      if (!currentTask) return
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      setTriagedIds((prev) => new Set(prev).add(currentTask.id))
      triageMutation.mutate({ id: currentTask.id, action })
    },
    [currentTask, triageMutation]
  )

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: colors.line }]}>
        <Pressable onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.card, borderColor: colors.line }]}>
          <ArrowLeft size={20} color={colors.ink2} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.ink }]}>Task Triage</Text>
        <View style={styles.headerSpacer} />
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator color={colors.accent} size="large" />
        </View>
      ) : total === 0 ? (
        <View style={styles.centerContainer}>
          <CheckCircle size={40} color={colors.sage} />
          <Text style={[styles.celebrationTitle, { color: colors.ink }]}>No Backlog</Text>
          <Text style={[styles.celebrationSubtitle, { color: colors.muted }]}>
            You're all caught up — no tasks need triage.
          </Text>
          <Pressable
            style={[styles.backToTasksButton, { backgroundColor: colors.accent }]}
            onPress={() => router.back()}
          >
            <Text style={styles.backToTasksText}>Go Back</Text>
          </Pressable>
        </View>
      ) : backlogTasks.length === 0 ? (
        <View style={styles.centerContainer}>
          <PartyPopper size={44} color={colors.gold} />
          <Text style={[styles.celebrationTitle, { color: colors.ink }]}>All Caught Up!</Text>
          <Text style={[styles.celebrationSubtitle, { color: colors.muted }]}>
            You've triaged all {total} task{total !== 1 ? 's' : ''}
          </Text>
          <Pressable
            style={[styles.backToTasksButton, { backgroundColor: colors.accent }]}
            onPress={() => router.back()}
          >
            <Text style={styles.backToTasksText}>Back to Tasks</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.content}>
          {/* Progress */}
          <View style={styles.progressSection}>
            <Text style={[styles.progressText, { color: colors.muted }]}>
              {progress} of {total}
            </Text>
            <View style={[styles.progressBarBg, { backgroundColor: colors.line }]}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: total > 0 ? `${(progress / total) * 100}%` : '0%', backgroundColor: colors.accent },
                ]}
              />
            </View>
          </View>

          {/* Task card */}
          <View style={[styles.taskCard, { backgroundColor: colors.card, borderColor: colors.line }]}>
            <Text style={[styles.taskTitle, { color: colors.ink }]}>{currentTask.title}</Text>
            {currentTask.description ? (
              <Text style={[styles.taskDescription, { color: colors.ink2 }]}>
                {currentTask.description}
              </Text>
            ) : null}
            <View style={styles.badgeRow}>
              {currentTask.due_date ? (
                <View style={[styles.dueBadge, { backgroundColor: colors.goldDim }]}>
                  <Text style={[styles.dueBadgeText, { color: colors.gold }]}>
                    Due: {format(new Date(currentTask.due_date), 'MMM d, yyyy')}
                  </Text>
                </View>
              ) : null}
              {currentTask.category ? (
                <View style={[styles.categoryBadge, { backgroundColor: colors.card, borderColor: colors.line, borderWidth: 1 }]}>
                  <Text style={[styles.categoryBadgeText, { color: colors.muted }]}>
                    {currentTask.category?.replace('_', ' ')}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          {/* Action buttons */}
          <View style={styles.actionRow}>
            <Pressable
              style={[styles.actionButton, { backgroundColor: colors.sageDim }]}
              onPress={() => handleTriage('completed')}
            >
              <CheckCircle size={22} color={colors.sage} />
              <Text style={[styles.actionText, { color: colors.sage }]}>
                Already Did
              </Text>
            </Pressable>
            <Pressable
              style={[styles.actionButton, { backgroundColor: colors.accentSoft }]}
              onPress={() => handleTriage('added')}
            >
              <Plus size={22} color={colors.accent} />
              <Text style={[styles.actionText, { color: colors.accent }]}>
                Add to List
              </Text>
            </Pressable>
            <Pressable
              style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.line, borderWidth: 1 }]}
              onPress={() => handleTriage('skipped')}
            >
              <SkipForward size={22} color={colors.muted} />
              <Text style={[styles.actionText, { color: colors.muted }]}>
                Skip
              </Text>
            </Pressable>
          </View>
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
  headerTitle: { fontFamily: 'Jakarta-SemiBold', fontSize: 16 },
  headerSpacer: { width: 38 },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },

  // Progress
  progressSection: { marginBottom: 24 },
  progressText: { fontFamily: 'Jakarta-Medium', fontSize: 13, marginBottom: 8 },
  progressBarBg: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: 6, borderRadius: 3 },

  // Task card
  taskCard: { padding: 20, borderRadius: 16, borderWidth: 1, marginBottom: 20 },
  taskTitle: { fontFamily: 'Jakarta-Bold', fontSize: 20, letterSpacing: -0.2, lineHeight: 28 },
  taskDescription: { fontFamily: 'Jakarta-Regular', fontSize: 14, marginTop: 8, lineHeight: 21, color: '#a0a0a6' },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  dueBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  dueBadgeText: { fontFamily: 'Jakarta-Medium', fontSize: 12 },
  categoryBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  categoryBadgeText: { fontFamily: 'Jakarta-Medium', fontSize: 11, textTransform: 'capitalize' },

  // Action buttons
  actionRow: { flexDirection: 'row', gap: 10 },
  actionButton: { flex: 1, alignItems: 'center', paddingVertical: 16, borderRadius: 14, gap: 7 },
  actionText: { fontFamily: 'Jakarta-SemiBold', fontSize: 12 },

  // Center states
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  celebrationTitle: { fontFamily: 'Jakarta-Bold', fontSize: 22, textAlign: 'center', letterSpacing: -0.3 },
  celebrationSubtitle: { fontFamily: 'Jakarta-Regular', fontSize: 14, textAlign: 'center', lineHeight: 21 },
  backToTasksButton: { marginTop: 12, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 12 },
  backToTasksText: { fontFamily: 'Jakarta-Bold', fontSize: 14, color: '#fff' },
})
