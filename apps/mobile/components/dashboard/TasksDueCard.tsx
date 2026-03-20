import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { CheckSquare, ChevronRight, Circle, CheckCircle2 } from 'lucide-react-native'
import { GlassCard } from '@/components/glass'
import type { FamilyTask } from '@tdc/shared/types'
import { format, isToday, isTomorrow, isPast } from 'date-fns'

interface TasksDueCardProps {
  tasks: FamilyTask[] | undefined
}

function getDueLabel(dueDate: string): string {
  const date = new Date(dueDate)
  if (isToday(date)) return 'Today'
  if (isTomorrow(date)) return 'Tomorrow'
  if (isPast(date)) return 'Overdue'
  return format(date, 'MMM d')
}

function getAssigneeBadgeColor(assignee: string): string {
  switch (assignee) {
    case 'dad':
      return '#5b9bd5'
    case 'mom':
      return '#c47a8f'
    case 'both':
      return '#d4a853'
    default:
      return '#7a6f62'
  }
}

export function TasksDueCard({ tasks }: TasksDueCardProps) {
  const router = useRouter()
  const allTasks = tasks ?? []
  const pendingTasks = allTasks.filter((t) => t.status === 'pending')
  const completedCount = allTasks.filter((t) => t.status === 'completed').length
  const totalCount = allTasks.length
  const displayTasks = pendingTasks.slice(0, 3)
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <Pressable onPress={() => router.push('/(tabs)/tasks')}>
      <GlassCard style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconBadge}>
            <CheckSquare size={18} color="#6b8f71" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>Tasks Due</Text>
            <Text style={styles.statsText}>
              {completedCount}/{totalCount} completed
            </Text>
          </View>
          <ChevronRight size={20} color="#7a6f62" />
        </View>

        {/* Progress bar */}
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${progressPercent}%` }]}
          />
        </View>

        {/* Task list */}
        {displayTasks.length > 0 ? (
          <View style={styles.taskList}>
            {displayTasks.map((task) => (
              <View key={task.id} style={styles.taskRow}>
                <Circle size={16} color="#4a4239" />
                <Text style={styles.taskTitle} numberOfLines={1}>
                  {task.title}
                </Text>
                <View
                  style={[
                    styles.assigneeBadge,
                    { backgroundColor: getAssigneeBadgeColor(task.assigned_to) + '20' },
                  ]}
                >
                  <Text
                    style={[
                      styles.assigneeText,
                      { color: getAssigneeBadgeColor(task.assigned_to) },
                    ]}
                  >
                    {task.assigned_to}
                  </Text>
                </View>
                <Text style={styles.dueLabel}>{getDueLabel(task.due_date)}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <CheckCircle2 size={20} color="#6b8f71" />
            <Text style={styles.emptyText}>All caught up!</Text>
          </View>
        )}

        <View style={styles.ctaRow}>
          <Text style={styles.ctaText}>View all tasks</Text>
          <ChevronRight size={14} color="#c4703f" />
        </View>
      </GlassCard>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(107,143,113,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 17,
    color: '#faf6f0',
  },
  statsText: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    color: '#7a6f62',
    marginTop: 2,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(237,230,220,0.08)',
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#6b8f71',
  },
  taskList: {
    gap: 12,
    marginBottom: 16,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  taskTitle: {
    flex: 1,
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    color: '#ede6dc',
  },
  assigneeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  assigneeText: {
    fontFamily: 'Karla-Medium',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dueLabel: {
    fontFamily: 'Karla-Regular',
    fontSize: 11,
    color: '#7a6f62',
    minWidth: 48,
    textAlign: 'right',
  },
  emptyState: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: 'Jost-Regular',
    fontSize: 15,
    color: '#6b8f71',
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ctaText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 13,
    color: '#c4703f',
  },
})
