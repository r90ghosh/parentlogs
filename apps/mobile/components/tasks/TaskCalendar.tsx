import { useState, useMemo } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { Calendar } from 'react-native-calendars'
import type { DateData } from 'react-native-calendars'
import { CardEntrance } from '@/components/animations'
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
    dots?: Array<{ key: string; color: string }>
    selected?: boolean
    selectedColor?: string
  }
>

function getTaskDotColor(task: FamilyTask): string {
  if (task.status === 'completed') return '#6b8f71'
  const dueDate = new Date(task.due_date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (dueDate < today) return '#d4a853' // catch-up: gold, not red
  return '#c4703f' // pending: copper
}

export function TaskCalendar({ tasks, onComplete, onSnooze }: TaskCalendarProps) {
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
        dots.push({ key: task.id, color: getTaskDotColor(task) })
        marks[dateKey] = { ...marks[dateKey], dots }
      }
    })

    // Overlay selected date
    const base = marks[selectedDate] ?? {}
    marks[selectedDate] = {
      ...base,
      selected: true,
      selectedColor: '#c4703f',
    }

    return marks
  }, [tasks, selectedDate])

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
          backgroundColor: '#12100e',
          calendarBackground: '#12100e',
          textSectionTitleColor: '#7a6f62',
          selectedDayBackgroundColor: '#c4703f',
          selectedDayTextColor: '#faf6f0',
          todayTextColor: '#d4a853',
          dayTextColor: '#ede6dc',
          textDisabledColor: '#4a4239',
          dotColor: '#c4703f',
          selectedDotColor: '#faf6f0',
          arrowColor: '#c4703f',
          monthTextColor: '#faf6f0',
          indicatorColor: '#c4703f',
          textDayFontFamily: 'Karla-Regular',
          textMonthFontFamily: 'PlayfairDisplay-Bold',
          textDayHeaderFontFamily: 'Karla-SemiBold',
          textDayFontSize: 14,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 12,
        }}
        style={styles.calendar}
      />

      {/* Divider */}
      <View style={styles.divider} />

      {/* Tasks for selected day */}
      <View style={styles.tasksSection}>
        <Text style={styles.dayLabel}>
          {selectedDate === today
            ? 'Today'
            : format(new Date(selectedDate + 'T12:00:00'), 'MMMM d, yyyy')}
        </Text>

        {selectedDayTasks.length === 0 ? (
          <CardEntrance delay={0}>
            <View style={styles.emptyDay}>
              <Text style={styles.emptyDayText}>No tasks on this day</Text>
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
    backgroundColor: '#12100e',
    paddingBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(237,230,220,0.06)',
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
    color: '#faf6f0',
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
    color: '#7a6f62',
  },
})
