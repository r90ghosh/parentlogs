import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { CheckSquare, ChevronRight, Circle, CheckCircle2 } from 'lucide-react-native'
import { GlassCard } from '@/components/glass'
import { useColors, type ColorTokens } from '@/hooks/use-colors'
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

function getAssigneeBadgeColor(assignee: string, colors: ColorTokens): string {
  switch (assignee) {
    case 'dad':
      return colors.sky
    case 'mom':
      return colors.rose
    case 'both':
      return colors.gold
    default:
      return colors.textMuted
  }
}

export function TasksDueCard({ tasks }: TasksDueCardProps) {
  const router = useRouter()
  const colors = useColors()
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
          <View style={[styles.iconBadge, { backgroundColor: colors.sageDim }]}>
            <CheckSquare size={18} color={colors.sage} />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Tasks Due</Text>
            <Text style={[styles.statsText, { color: colors.textMuted }]}>
              {completedCount}/{totalCount} completed
            </Text>
          </View>
          <ChevronRight size={20} color={colors.textMuted} />
        </View>

        {/* Progress bar */}
        <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
          <View
            style={[styles.progressFill, { width: `${progressPercent}%`, backgroundColor: colors.sage }]}
          />
        </View>

        {/* Task list */}
        {displayTasks.length > 0 ? (
          <View style={styles.taskList}>
            {displayTasks.map((task) => {
              const badgeColor = getAssigneeBadgeColor(task.assigned_to, colors)
              return (
                <View key={task.id} style={styles.taskRow}>
                  <Circle size={16} color={colors.textDim} />
                  <Text style={[styles.taskTitle, { color: colors.textSecondary }]} numberOfLines={1}>
                    {task.title}
                  </Text>
                  <View
                    style={[
                      styles.assigneeBadge,
                      { backgroundColor: badgeColor + '20' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.assigneeText,
                        { color: badgeColor },
                      ]}
                    >
                      {task.assigned_to}
                    </Text>
                  </View>
                  <Text style={[styles.dueLabel, { color: colors.textMuted }]}>{getDueLabel(task.due_date)}</Text>
                </View>
              )
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <CheckCircle2 size={20} color={colors.sage} />
            <Text style={[styles.emptyText, { color: colors.sage }]}>All caught up!</Text>
          </View>
        )}

        <View style={styles.ctaRow}>
          <Text style={[styles.ctaText, { color: colors.copper }]}>View all tasks</Text>
          <ChevronRight size={14} color={colors.copper} />
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 17,
  },
  statsText: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    marginTop: 2,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
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
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ctaText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 13,
  },
})
