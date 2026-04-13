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
import { GlassCard } from '@/components/glass'
import { CardEntrance } from '@/components/animations'
import { useColors } from '@/hooks/use-colors'
import * as Haptics from 'expo-haptics'
import { format } from 'date-fns'

const CATEGORY_COLOR_KEYS: Record<string, 'coral' | 'sky' | 'gold' | 'sage' | 'rose' | 'copper'> = {
  medical: 'coral',
  shopping: 'sky',
  planning: 'gold',
  financial: 'sage',
  partner: 'rose',
  self_care: 'copper',
}

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

  const categoryColorKey = CATEGORY_COLOR_KEYS[currentTask?.category ?? '']
  const categoryColor = categoryColorKey ? colors[categoryColorKey] : colors.textMuted
  const categoryDimKey = categoryColorKey ? (`${categoryColorKey}Dim` as keyof typeof colors) : null
  const categoryBg = (categoryDimKey ? colors[categoryDimKey] : colors.subtleBg) as string

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.subtleBg }]}>
          <ArrowLeft size={20} color={colors.textSecondary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Task Triage</Text>
        <View style={styles.headerSpacer} />
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator color={colors.copper} size="large" />
        </View>
      ) : total === 0 ? (
        /* Empty state -- no backlog tasks at all */
        <View style={styles.centerContainer}>
          <CheckCircle size={40} color={colors.sage} />
          <Text style={[styles.celebrationTitle, { color: colors.textPrimary }]}>No Backlog</Text>
          <Text style={[styles.celebrationSubtitle, { color: colors.textMuted }]}>
            You're all caught up — no tasks need triage.
          </Text>
          <Pressable
            style={[styles.backToTasksButton, { backgroundColor: colors.copperDim }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.backToTasksText, { color: colors.copper }]}>Go Back</Text>
          </Pressable>
        </View>
      ) : backlogTasks.length === 0 ? (
        /* Completion state -- all tasks triaged */
        <View style={styles.centerContainer}>
          <PartyPopper size={44} color={colors.gold} />
          <Text style={[styles.celebrationTitle, { color: colors.textPrimary }]}>All Caught Up!</Text>
          <Text style={[styles.celebrationSubtitle, { color: colors.textMuted }]}>
            You've triaged all {total} task{total !== 1 ? 's' : ''}
          </Text>
          <Pressable
            style={[styles.backToTasksButton, { backgroundColor: colors.copperDim }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.backToTasksText, { color: colors.copper }]}>Back to Tasks</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.content}>
          {/* Progress */}
          <View style={styles.progressSection}>
            <Text style={[styles.progressText, { color: colors.textMuted }]}>
              {progress} of {total}
            </Text>
            <View style={[styles.progressBarBg, { backgroundColor: colors.subtleBg }]}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: total > 0 ? `${(progress / total) * 100}%` : '0%', backgroundColor: colors.copper },
                ]}
              />
            </View>
          </View>

          {/* Task card */}
          <CardEntrance key={currentTask.id} delay={0}>
            <GlassCard style={styles.taskCard}>
              <Text style={[styles.taskTitle, { color: colors.textPrimary }]}>{currentTask.title}</Text>
              {currentTask.description ? (
                <Text style={[styles.taskDescription, { color: colors.textMuted }]}>
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
                <View
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: categoryBg },
                  ]}
                >
                  <Text style={[styles.categoryBadgeText, { color: categoryColor }]}>
                    {currentTask.category?.replace('_', ' ')}
                  </Text>
                </View>
              </View>
            </GlassCard>
          </CardEntrance>

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
              style={[styles.actionButton, { backgroundColor: colors.copperDim }]}
              onPress={() => handleTriage('added')}
            >
              <Plus size={22} color={colors.copper} />
              <Text style={[styles.actionText, { color: colors.copper }]}>
                Add to List
              </Text>
            </Pressable>
            <Pressable
              style={[styles.actionButton, { backgroundColor: colors.subtleBg }]}
              onPress={() => handleTriage('skipped')}
            >
              <SkipForward size={22} color={colors.textMuted} />
              <Text style={[styles.actionText, { color: colors.textMuted }]}>
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
  container: {
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  // Progress
  progressSection: {
    marginBottom: 24,
  },
  progressText: {
    fontFamily: 'Karla-Medium',
    fontSize: 13,
    marginBottom: 8,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
  },
  progressBarFill: {
    height: 6,
    borderRadius: 3,
  },

  // Task card
  taskCard: {
    padding: 20,
  },
  taskTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 20,
  },
  taskDescription: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  dueBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  dueBadgeText: {
    fontFamily: 'Karla-Medium',
    fontSize: 12,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  categoryBadgeText: {
    fontFamily: 'Karla-Medium',
    fontSize: 11,
    textTransform: 'capitalize',
  },

  // Action buttons
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 6,
  },
  actionText: {
    fontFamily: 'Karla-Medium',
    fontSize: 12,
  },

  // Center states (loading, empty, completion)
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  celebrationTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 24,
    textAlign: 'center',
  },
  celebrationSubtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    textAlign: 'center',
  },
  backToTasksButton: {
    marginTop: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backToTasksText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 14,
  },
})
