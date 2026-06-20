import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { Check } from 'lucide-react-native'
import { SwipeAction } from '@/components/animations'
import { useColors, type ColorTokens } from '@/hooks/use-colors'
import type { FamilyTask } from '@tdc/shared/types'
import { format, isToday, isTomorrow, isPast } from 'date-fns'

interface TaskRowProps {
  task: FamilyTask
  onComplete: (id: string) => void
  onSnooze: (id: string) => void
}

function assigneeMeta(assignee: string, colors: ColorTokens): { color: string; label: string } | null {
  switch (assignee) {
    case 'dad':
      return { color: colors.dotBaby, label: 'Dad' }
    case 'mom':
      return { color: colors.dotHer, label: 'Mom' }
    case 'both':
      return { color: colors.dotTip, label: 'Both' }
    default:
      return null // 'either' — no dot
  }
}

function dueLabel(dueDate: string): string {
  const d = new Date(dueDate)
  if (isToday(d)) return 'Today'
  if (isTomorrow(d)) return 'Tomorrow'
  if (isPast(d)) return 'Catch up'
  return format(d, 'MMM d')
}

function dueColor(dueDate: string, colors: ColorTokens): string {
  const d = new Date(dueDate)
  if (isPast(d) && !isToday(d)) return colors.gold // yellow, not red
  if (isToday(d)) return colors.accentInk
  return colors.ink2
}

function titleCase(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s
}

/** v2 digest task row: check-circle (completes) · 1-line title · meta (assignee · category · due). (§2.2) */
export function TaskRow({ task, onComplete, onSnooze }: TaskRowProps) {
  const router = useRouter()
  const colors = useColors()
  const completed = task.status === 'completed'
  const who = assigneeMeta(task.assigned_to, colors)

  return (
    <SwipeAction onComplete={() => onComplete(task.id)} onSnooze={() => onSnooze(task.id)}>
      <Pressable
        onPress={() => router.push(`/(tabs)/tasks/${task.id}`)}
        style={({ pressed }) => [
          styles.row,
          { borderBottomColor: colors.line2, backgroundColor: pressed ? colors.cardHover : 'transparent' },
        ]}
      >
        <Pressable
          onPress={() => !completed && onComplete(task.id)}
          hitSlop={10}
          style={[styles.check, { borderColor: completed ? colors.sage : colors.line, backgroundColor: completed ? colors.sage : 'transparent' }]}
        >
          {completed && <Check size={12} color="#fff" strokeWidth={3} />}
        </Pressable>

        <View style={styles.body}>
          <Text
            numberOfLines={1}
            style={[
              styles.title,
              { color: completed ? colors.muted : colors.ink, textDecorationLine: completed ? 'line-through' : 'none', textDecorationColor: colors.faint },
            ]}
          >
            {task.title}
          </Text>
          <View style={styles.meta}>
            {who && (
              <View style={styles.who}>
                <View style={[styles.dot, { backgroundColor: who.color }]} />
                <Text style={[styles.whoText, { color: who.color }]}>{who.label}</Text>
              </View>
            )}
            {who && !!task.category && <Text style={[styles.sep, { color: colors.faint }]}>·</Text>}
            {!!task.category && (
              <Text style={[styles.cat, { color: colors.muted }]} numberOfLines={1}>
                {titleCase(task.category)}
              </Text>
            )}
            {!completed && <Text style={[styles.due, { color: dueColor(task.due_date, colors) }]}>{dueLabel(task.due_date)}</Text>}
          </View>
        </View>
      </Pressable>
    </SwipeAction>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 13, alignItems: 'flex-start', paddingVertical: 14, paddingHorizontal: 24, borderBottomWidth: 1 },
  check: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, flexShrink: 0, marginTop: 1, alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, minWidth: 0 },
  title: { fontFamily: 'Jakarta-SemiBold', fontSize: 15.5, lineHeight: 21, letterSpacing: -0.1 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  who: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  whoText: { fontFamily: 'Jakarta-Bold', fontSize: 11.5, letterSpacing: 0.4, textTransform: 'uppercase' },
  sep: { fontSize: 11 },
  cat: { fontFamily: 'Jakarta-Medium', fontSize: 12, flexShrink: 1 },
  due: { fontFamily: 'Jakarta-Bold', fontSize: 12, marginLeft: 'auto', paddingLeft: 8 },
})
