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
import { LinearGradient } from 'expo-linear-gradient'
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
import * as Haptics from 'expo-haptics'
import { format } from 'date-fns'

const CATEGORY_COLORS: Record<string, string> = {
  medical: '#d4836b',
  shopping: '#5b9bd5',
  planning: '#d4a853',
  financial: '#6b8f71',
  partner: '#c47a8f',
  self_care: '#c4703f',
}

export default function TriageScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
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

  const categoryColor =
    CATEGORY_COLORS[currentTask?.category ?? ''] ?? '#7a6f62'

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#12100e', '#1a1714', '#12100e']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={20} color="#ede6dc" />
        </Pressable>
        <Text style={styles.headerTitle}>Task Triage</Text>
        <View style={styles.headerSpacer} />
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator color="#c4703f" size="large" />
        </View>
      ) : total === 0 ? (
        /* Empty state — no backlog tasks at all */
        <View style={styles.centerContainer}>
          <CheckCircle size={40} color="#6b8f71" />
          <Text style={styles.celebrationTitle}>No Backlog</Text>
          <Text style={styles.celebrationSubtitle}>
            You're all caught up — no tasks need triage.
          </Text>
          <Pressable
            style={styles.backToTasksButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backToTasksText}>Go Back</Text>
          </Pressable>
        </View>
      ) : backlogTasks.length === 0 ? (
        /* Completion state — all tasks triaged */
        <View style={styles.centerContainer}>
          <PartyPopper size={44} color="#d4a853" />
          <Text style={styles.celebrationTitle}>All Caught Up!</Text>
          <Text style={styles.celebrationSubtitle}>
            You've triaged all {total} task{total !== 1 ? 's' : ''}
          </Text>
          <Pressable
            style={styles.backToTasksButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backToTasksText}>Back to Tasks</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.content}>
          {/* Progress */}
          <View style={styles.progressSection}>
            <Text style={styles.progressText}>
              {progress} of {total}
            </Text>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: total > 0 ? `${(progress / total) * 100}%` : '0%' },
                ]}
              />
            </View>
          </View>

          {/* Task card */}
          <CardEntrance key={currentTask.id} delay={0}>
            <GlassCard style={styles.taskCard}>
              <Text style={styles.taskTitle}>{currentTask.title}</Text>
              {currentTask.description ? (
                <Text style={styles.taskDescription}>
                  {currentTask.description}
                </Text>
              ) : null}
              <View style={styles.badgeRow}>
                {currentTask.due_date ? (
                  <View style={styles.dueBadge}>
                    <Text style={styles.dueBadgeText}>
                      Due: {format(new Date(currentTask.due_date), 'MMM d, yyyy')}
                    </Text>
                  </View>
                ) : null}
                <View
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: `${categoryColor}20` },
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
              style={[styles.actionButton, styles.actionCompleted]}
              onPress={() => handleTriage('completed')}
            >
              <CheckCircle size={22} color="#6b8f71" />
              <Text style={[styles.actionText, { color: '#6b8f71' }]}>
                Already Did
              </Text>
            </Pressable>
            <Pressable
              style={[styles.actionButton, styles.actionAdd]}
              onPress={() => handleTriage('added')}
            >
              <Plus size={22} color="#c4703f" />
              <Text style={[styles.actionText, { color: '#c4703f' }]}>
                Add to List
              </Text>
            </Pressable>
            <Pressable
              style={[styles.actionButton, styles.actionSkip]}
              onPress={() => handleTriage('skipped')}
            >
              <SkipForward size={22} color="#7a6f62" />
              <Text style={[styles.actionText, { color: '#7a6f62' }]}>
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
    backgroundColor: '#12100e',
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
    backgroundColor: 'rgba(237,230,220,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
    color: '#faf6f0',
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
    color: '#7a6f62',
    marginBottom: 8,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(237,230,220,0.06)',
  },
  progressBarFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#c4703f',
  },

  // Task card
  taskCard: {
    padding: 20,
  },
  taskTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 20,
    color: '#faf6f0',
  },
  taskDescription: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    color: '#7a6f62',
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
    backgroundColor: 'rgba(212,168,83,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  dueBadgeText: {
    fontFamily: 'Karla-Medium',
    fontSize: 12,
    color: '#d4a853',
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
  actionCompleted: {
    backgroundColor: 'rgba(107,143,113,0.12)',
  },
  actionAdd: {
    backgroundColor: 'rgba(196,112,63,0.12)',
  },
  actionSkip: {
    backgroundColor: 'rgba(237,230,220,0.06)',
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
    color: '#faf6f0',
    textAlign: 'center',
  },
  celebrationSubtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    color: '#7a6f62',
    textAlign: 'center',
  },
  backToTasksButton: {
    marginTop: 12,
    backgroundColor: 'rgba(196,112,63,0.15)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backToTasksText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 14,
    color: '#c4703f',
  },
})
