import { useState, useMemo } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { Calendar } from 'react-native-calendars'
import type { DateData } from 'react-native-calendars'
import { CardEntrance } from '@/components/animations'
import { useColors, type ColorTokens } from '@/hooks/use-colors'
import { TaskItem } from './TaskItem'
import type { FamilyTask } from '@tdc/shared/types'
import { format } from 'date-fns'

interface TaskCalendarProps {
  tasks: FamilyTask[]
  onComplete: (id: string) => void
  onSnooze: (id: string) => void
}

type MarkedDates = Record<
  string,
  {
    dots?: { key: string; color: string }[]
    selected?: boolean
    selectedColor?: string
  }
>

function getTaskDotColor(task: FamilyTask, colors: ColorTokens): string {
  if (task.status === 'completed') return colors.sage
  const dueDate = new Date(task.due_date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (dueDate < today) return colors.gold // catch-up: gold, not red
  return colors.copper // pending: copper
}

export function TaskCalendar({ tasks, onComplete, onSnooze }: TaskCalendarProps) {
  const colors = useColors()
  const today = format(new Date(), 'yyyy-MM-dd')
  const [selectedDate, setSelectedDate] = useState<string>(today)

  // Build marked dates from tasks
  const markedDates: MarkedDates = useMemo(() => {
    const marks: MarkedDates = {}

    tasks.forEach((task) => {
      const dateKey = task.due_date.split('T')[0]
      if (!marks[dateKey]) {
        marks[dateKey] = { dots: [] }
      }
      const dots = marks[dateKey].dots ?? []
      // Limit to 3 dots per day to avoid clutter
      if (dots.length < 3) {
        dots.push({ key: task.id, color: getTaskDotColor(task, colors) })
        marks[dateKey] = { ...marks[dateKey], dots }
      }
    })

    // Overlay selected date
    const base = marks[selectedDate] ?? {}
    marks[selectedDate] = {
      ...base,
      selected: true,
      selectedColor: colors.copper,
    }

    return marks
  }, [tasks, selectedDate, colors])

  // Get tasks for selected date
  const selectedDayTasks = useMemo(() => {
    return tasks.filter((task) => {
      const dateKey = task.due_date.split('T')[0]
      return dateKey === selectedDate
    })
  }, [tasks, selectedDate])

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString)
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Calendar
        current={today}
        onDayPress={handleDayPress}
        markedDates={markedDates}
        markingType="multi-dot"
        theme={{
          backgroundColor: colors.bg,
          calendarBackground: colors.bg,
          textSectionTitleColor: colors.textMuted,
          selectedDayBackgroundColor: colors.copper,
          selectedDayTextColor: colors.textPrimary,
          todayTextColor: colors.gold,
          dayTextColor: colors.textSecondary,
          textDisabledColor: colors.textDim,
          dotColor: colors.copper,
          selectedDotColor: colors.textPrimary,
          arrowColor: colors.copper,
          monthTextColor: colors.textPrimary,
          indicatorColor: colors.copper,
          textDayFontFamily: 'Karla-Regular',
          textMonthFontFamily: 'PlayfairDisplay-Bold',
          textDayHeaderFontFamily: 'Karla-SemiBold',
          textDayFontSize: 14,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 12,
        }}
        style={[styles.calendar, { backgroundColor: colors.bg }]}
      />

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: colors.subtleBg }]} />

      {/* Tasks for selected day */}
      <View style={styles.tasksSection}>
        <Text style={[styles.dayLabel, { color: colors.textPrimary }]}>
          {selectedDate === today
            ? 'Today'
            : format(new Date(selectedDate + 'T12:00:00'), 'MMMM d, yyyy')}
        </Text>

        {selectedDayTasks.length === 0 ? (
          <CardEntrance delay={0}>
            <View style={styles.emptyDay}>
              <Text style={[styles.emptyDayText, { color: colors.textMuted }]}>No tasks on this day</Text>
            </View>
          </CardEntrance>
        ) : (
          <View style={styles.taskList}>
            {selectedDayTasks.map((task, index) => (
              <CardEntrance key={task.id} delay={index * 60}>
                <View style={styles.taskItemWrapper}>
                  <TaskItem
                    task={task}
                    onComplete={onComplete}
                    onSnooze={onSnooze}
                  />
                </View>
              </CardEntrance>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendar: {
    paddingBottom: 8,
  },
  divider: {
    height: 1,
    marginHorizontal: 20,
  },
  tasksSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  dayLabel: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 18,
    marginBottom: 16,
  },
  taskList: {
    gap: 0,
  },
  taskItemWrapper: {
    marginBottom: 8,
  },
  emptyDay: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyDayText: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
  },
})
