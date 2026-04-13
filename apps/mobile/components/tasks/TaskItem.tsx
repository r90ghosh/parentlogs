import { View, Text, Pressable, StyleSheet } from 'react-native'
import Animated, { FadeOutRight, useReducedMotion } from 'react-native-reanimated'
import { useRouter } from 'expo-router'
import {
  Circle,
  CheckCircle2,
  Stethoscope,
  ShoppingBag,
  ClipboardList,
  Wallet,
  Heart,
  Sparkles,
} from 'lucide-react-native'
import { SwipeAction } from '@/components/animations'
import { GlassCard } from '@/components/glass'
import { useColors, type ColorTokens } from '@/hooks/use-colors'
import type { FamilyTask } from '@tdc/shared/types'
import { format, isToday, isTomorrow, isPast } from 'date-fns'

interface TaskItemProps {
  task: FamilyTask
  onComplete: (id: string) => void
  onSnooze: (id: string) => void
}

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

function getAssigneeColor(assignee: string, colors: ColorTokens): string {
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

function getDueLabel(dueDate: string): string {
  const date = new Date(dueDate)
  if (isToday(date)) return 'Today'
  if (isTomorrow(date)) return 'Tomorrow'
  if (isPast(date)) return 'Catch up'
  return format(date, 'MMM d')
}

function getDueLabelColor(dueDate: string, colors: ColorTokens): string {
  const date = new Date(dueDate)
  if (isPast(date) && !isToday(date)) return colors.gold // Yellow, not red
  if (isToday(date)) return colors.copper
  return colors.textMuted
}

export function TaskItem({ task, onComplete, onSnooze }: TaskItemProps) {
  const router = useRouter()
  const colors = useColors()
  const reducedMotion = useReducedMotion()
  const CategoryIcon = getCategoryIcon(task.category)
  const isCompleted = task.status === 'completed'
  const assigneeColor = getAssigneeColor(task.assigned_to, colors)

  const exitAnimation = reducedMotion
    ? undefined
    : FadeOutRight.springify().damping(15)

  return (
    <Animated.View exiting={isCompleted ? exitAnimation : undefined}>
      <SwipeAction
        onComplete={() => onComplete(task.id)}
        onSnooze={() => onSnooze(task.id)}
      >
        <Pressable
          onPress={() => router.push(`/(tabs)/tasks/${task.id}`)}
          style={({ pressed }) => [pressed && { opacity: 0.8 }]}
        >
          <GlassCard style={styles.card}>
            <View style={styles.row}>
              {isCompleted ? (
                <CheckCircle2 size={20} color={colors.sage} />
              ) : (
                <Circle size={20} color={colors.textDim} />
              )}
              <View style={styles.content}>
                <Text
                  style={[
                    styles.title,
                    { color: colors.textSecondary },
                    isCompleted && { color: colors.textDim, textDecorationLine: 'line-through' as const },
                  ]}
                  numberOfLines={1}
                >
                  {task.title}
                </Text>
                <View style={styles.metaRow}>
                  <CategoryIcon size={12} color={colors.textMuted} />
                  <View
                    style={[
                      styles.assigneeBadge,
                      { backgroundColor: assigneeColor + '20' },
                    ]}
                  >
                    <Text style={[styles.assigneeText, { color: assigneeColor }]}>
                      {task.assigned_to}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.dueLabel,
                      { color: getDueLabelColor(task.due_date, colors) },
                    ]}
                  >
                    {getDueLabel(task.due_date)}
                  </Text>
                </View>
              </View>
            </View>
          </GlassCard>
        </Pressable>
      </SwipeAction>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: 'Jost-Regular',
    fontSize: 15,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  assigneeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
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
  },
})
