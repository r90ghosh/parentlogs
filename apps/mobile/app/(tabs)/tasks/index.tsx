import { useState, useCallback, useRef, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { useQueryClient } from '@tanstack/react-query'
import { ListFilter } from 'lucide-react-native'
import { useAuth } from '@/components/providers/AuthProvider'
import { useTasks, useCompleteTask, useSnoozeTask } from '@/hooks/use-tasks'
import { CardEntrance, StaggerList } from '@/components/animations'
import { TaskItem } from '@/components/tasks'
import {
  TIMELINE_CATEGORIES,
  getCurrentTimelineCategory,
  getTaskTimelineCategory,
  groupTasksByTimePeriod,
} from '@tdc/shared/utils/task-timeline'
import type { TimelineCategory } from '@tdc/shared/utils/task-timeline'
import type { TaskAssignee, FamilyTask, FamilyStage } from '@tdc/shared/types'

const ASSIGNEE_FILTERS: { label: string; value: TaskAssignee | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'Dad', value: 'dad' },
  { label: 'Mom', value: 'mom' },
  { label: 'Both', value: 'both' },
]

export default function TasksScreen() {
  const insets = useSafeAreaInsets()
  const queryClient = useQueryClient()
  const { family } = useAuth()
  const timelineScrollRef = useRef<ScrollView>(null)

  const [selectedAssignee, setSelectedAssignee] = useState<TaskAssignee | undefined>(undefined)
  const [selectedCategory, setSelectedCategory] = useState<TimelineCategory | null>(null)

  const { data: tasks, isLoading, isRefetching } = useTasks({
    assignee: selectedAssignee,
  })
  const completeTask = useCompleteTask()
  const snoozeTask = useSnoozeTask()

  // Determine current timeline category
  const timelineSource = family
    ? {
        stage: (family.stage ?? 'pregnancy') as FamilyStage,
        due_date: family.due_date ?? undefined,
        birth_date: undefined,
        current_week: (family as { current_week?: number })?.current_week ?? 1,
      }
    : null

  const currentCategory = timelineSource
    ? getCurrentTimelineCategory(timelineSource)
    : null

  // Auto-select current category on mount
  useEffect(() => {
    if (currentCategory && !selectedCategory) {
      setSelectedCategory(currentCategory)
    }
  }, [currentCategory])

  // Auto-scroll timeline to current category
  useEffect(() => {
    if (currentCategory && timelineScrollRef.current) {
      const idx = TIMELINE_CATEGORIES.findIndex((c) => c.id === currentCategory)
      if (idx >= 0) {
        // Each pill is ~100px wide, scroll to center it
        const offset = Math.max(0, idx * 100 - 60)
        timelineScrollRef.current.scrollTo({ x: offset, animated: true })
      }
    }
  }, [currentCategory])

  const onRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
  }, [queryClient])

  // Filter tasks by selected timeline category
  const filteredTasks = (tasks ?? []).filter((task) => {
    if (!selectedCategory || !timelineSource) return true
    const category = getTaskTimelineCategory(task.due_date, timelineSource)
    return category === selectedCategory
  })

  // Group filtered tasks by time period
  const pendingTasks = filteredTasks.filter(
    (t) => t.status === 'pending' || t.status === 'snoozed'
  )
  const groups = groupTasksByTimePeriod(pendingTasks)

  const handleComplete = useCallback(
    (id: string) => {
      completeTask.mutate(id)
    },
    [completeTask]
  )

  const handleSnooze = useCallback(
    (id: string) => {
      snoozeTask.mutate(id)
    },
    [snoozeTask]
  )

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#12100e', '#1a1714', '#12100e']}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.headerArea, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.pageTitle}>Tasks</Text>

        {/* Timeline bar */}
        <ScrollView
          ref={timelineScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.timelineContent}
          style={styles.timelineScroll}
        >
          {TIMELINE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id
            const isCurrent = currentCategory === cat.id
            return (
              <Pressable
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.timelinePill,
                  isSelected && styles.timelinePillSelected,
                  isCurrent && !isSelected && styles.timelinePillCurrent,
                ]}
              >
                <Text
                  style={[
                    styles.timelinePillText,
                    isSelected && styles.timelinePillTextSelected,
                  ]}
                >
                  {cat.label}
                </Text>
              </Pressable>
            )
          })}
        </ScrollView>

        {/* Assignee filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
          style={styles.filterScroll}
        >
          <ListFilter size={14} color="#7a6f62" style={{ marginRight: 8 }} />
          {ASSIGNEE_FILTERS.map((filter) => {
            const isActive = selectedAssignee === filter.value
            return (
              <Pressable
                key={filter.label}
                onPress={() => setSelectedAssignee(filter.value)}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && styles.filterChipTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </Pressable>
            )
          })}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#c4703f" />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={onRefresh}
              tintColor="#c4703f"
              colors={['#c4703f']}
            />
          }
        >
          {/* Catch Up (previous tasks) */}
          {groups.previous.length > 0 && (
            <TaskSection
              title="Catch Up"
              titleColor="#d4a853"
              tasks={groups.previous}
              onComplete={handleComplete}
              onSnooze={handleSnooze}
            />
          )}

          {/* This Week */}
          {groups.current.length > 0 && (
            <TaskSection
              title="This Week"
              titleColor="#faf6f0"
              tasks={groups.current}
              onComplete={handleComplete}
              onSnooze={handleSnooze}
            />
          )}

          {/* Coming Up */}
          {groups.future.length > 0 && (
            <TaskSection
              title="Coming Up"
              titleColor="#7a6f62"
              tasks={groups.future}
              onComplete={handleComplete}
              onSnooze={handleSnooze}
            />
          )}

          {/* Empty state */}
          {pendingTasks.length === 0 && (
            <CardEntrance delay={100}>
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🎉</Text>
                <Text style={styles.emptyTitle}>No tasks right now</Text>
                <Text style={styles.emptySubtitle}>
                  {selectedCategory
                    ? 'No tasks for this phase. Try another timeline.'
                    : 'All caught up! Check back soon.'}
                </Text>
              </View>
            </CardEntrance>
          )}
        </ScrollView>
      )}
    </View>
  )
}

interface TaskSectionProps {
  title: string
  titleColor: string
  tasks: FamilyTask[]
  onComplete: (id: string) => void
  onSnooze: (id: string) => void
}

function TaskSection({
  title,
  titleColor,
  tasks,
  onComplete,
  onSnooze,
}: TaskSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: titleColor }]}>{title}</Text>
        <Text style={styles.sectionCount}>{tasks.length}</Text>
      </View>
      <StaggerList staggerMs={60}>
        {tasks.map((task) => (
          <View key={task.id} style={styles.taskItemWrapper}>
            <TaskItem
              task={task}
              onComplete={onComplete}
              onSnooze={onSnooze}
            />
          </View>
        ))}
      </StaggerList>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12100e',
  },
  headerArea: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(237,230,220,0.06)',
  },
  pageTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
    color: '#faf6f0',
    marginBottom: 16,
  },
  timelineScroll: {
    marginBottom: 12,
  },
  timelineContent: {
    gap: 8,
    paddingRight: 20,
  },
  timelinePill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(237,230,220,0.06)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  timelinePillSelected: {
    backgroundColor: 'rgba(196,112,63,0.2)',
    borderColor: '#c4703f',
  },
  timelinePillCurrent: {
    borderColor: 'rgba(196,112,63,0.3)',
  },
  timelinePillText: {
    fontFamily: 'Karla-Medium',
    fontSize: 13,
    color: '#7a6f62',
  },
  timelinePillTextSelected: {
    color: '#c4703f',
  },
  filterScroll: {
    marginBottom: 4,
  },
  filterContent: {
    alignItems: 'center',
    gap: 8,
    paddingRight: 20,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(237,230,220,0.06)',
  },
  filterChipActive: {
    backgroundColor: 'rgba(196,112,63,0.15)',
  },
  filterChipText: {
    fontFamily: 'Karla-Medium',
    fontSize: 12,
    color: '#7a6f62',
  },
  filterChipTextActive: {
    color: '#c4703f',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionCount: {
    fontFamily: 'Karla-Regular',
    fontSize: 13,
    color: '#4a4239',
  },
  taskItemWrapper: {
    marginBottom: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 20,
    color: '#faf6f0',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 15,
    color: '#7a6f62',
    textAlign: 'center',
    lineHeight: 22,
  },
})
