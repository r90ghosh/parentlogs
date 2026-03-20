import { useState, useCallback } from 'react'
import {
  View,
  Text,
  ScrollView,
  Pressable,
  RefreshControl,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'
import {
  ChevronLeft,
  Trash2,
  Baby,
  Milk,
  Moon,
  Thermometer,
  Pill,
  Sun,
  Smile,
  Scale,
  Ruler,
  Star,
  Plus,
} from 'lucide-react-native'
import { format, isToday, isYesterday } from 'date-fns'
import * as Haptics from 'expo-haptics'
import { useTrackerLogs, useDeleteLog } from '@/hooks/use-tracker'
import { GlassCard } from '@/components/glass'
import { CardEntrance, StaggerList } from '@/components/animations'
import type { LogType } from '@tdc/shared/types'

interface LogTypeConfig {
  icon: typeof Milk
  color: string
  bgColor: string
  label: string
}

const LOG_TYPE_CONFIG: Record<LogType, LogTypeConfig> = {
  feeding: { icon: Milk, color: '#5b9bd5', bgColor: 'rgba(91,155,213,0.15)', label: 'Feeding' },
  diaper: { icon: Baby, color: '#d4a853', bgColor: 'rgba(212,168,83,0.15)', label: 'Diaper' },
  sleep: { icon: Moon, color: '#c47a8f', bgColor: 'rgba(196,122,143,0.15)', label: 'Sleep' },
  temperature: { icon: Thermometer, color: '#d4836b', bgColor: 'rgba(212,131,107,0.15)', label: 'Temperature' },
  medicine: { icon: Pill, color: '#6b8f71', bgColor: 'rgba(107,143,113,0.15)', label: 'Medicine' },
  vitamin_d: { icon: Sun, color: '#d4a853', bgColor: 'rgba(212,168,83,0.15)', label: 'Vitamin D' },
  mood: { icon: Smile, color: '#c47a8f', bgColor: 'rgba(196,122,143,0.15)', label: 'Mood' },
  weight: { icon: Scale, color: '#5b9bd5', bgColor: 'rgba(91,155,213,0.15)', label: 'Weight' },
  height: { icon: Ruler, color: '#5b9bd5', bgColor: 'rgba(91,155,213,0.15)', label: 'Height' },
  milestone: { icon: Star, color: '#c4703f', bgColor: 'rgba(196,112,63,0.15)', label: 'Milestone' },
  custom: { icon: Plus, color: '#7a6f62', bgColor: 'rgba(237,230,220,0.06)', label: 'Custom' },
}

const ALL_LOG_TYPES: LogType[] = [
  'feeding', 'diaper', 'sleep', 'temperature', 'medicine',
  'vitamin_d', 'mood', 'weight', 'height', 'milestone', 'custom',
]

function formatLogDetails(log: any): string {
  const data = log.log_data || {}
  switch (log.log_type) {
    case 'feeding':
      if (data.type === 'breast') return `${data.side || ''} side, ${data.duration_minutes || 0}min`
      return `${data.amount_oz || 0}oz ${data.type || 'bottle'}`
    case 'diaper':
      return data.type || 'wet'
    case 'sleep':
      return `${data.duration_minutes || 0}min (${data.quality || 'good'})`
    case 'temperature':
      return `${data.value || 0}°${data.unit || 'F'}`
    case 'medicine':
      return `${data.name || ''} - ${data.dosage || ''}`
    case 'mood': {
      const moods = ['😢', '😕', '😐', '😊', '😄']
      return moods[(data.level || 3) - 1] || ''
    }
    case 'weight':
      return `${data.value || 0} ${data.unit || 'lbs'}`
    case 'height':
      return `${data.value || 0} ${data.unit || 'in'}`
    case 'milestone':
      return data.name || ''
    case 'vitamin_d':
      return 'Given'
    default:
      return ''
  }
}

function formatDateHeader(dateStr: string): string {
  const date = new Date(dateStr)
  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  return format(date, 'EEEE, MMMM d')
}

export default function HistoryScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const queryClient = useQueryClient()
  const deleteLog = useDeleteLog()

  const [typeFilter, setTypeFilter] = useState<LogType | 'all'>('all')
  const [refreshing, setRefreshing] = useState(false)

  const { data: logs, isLoading } = useTrackerLogs({
    log_type: typeFilter === 'all' ? undefined : typeFilter,
    limit: 100,
  })

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await queryClient.invalidateQueries({ queryKey: ['tracker-logs'] })
    setRefreshing(false)
  }, [queryClient])

  const handleDelete = (id: string) => {
    Alert.alert('Delete Log?', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
          await deleteLog.mutateAsync(id)
        },
      },
    ])
  }

  // Group logs by date
  const groupedLogs = (logs || []).reduce(
    (groups, log) => {
      const date = new Date(log.logged_at).toDateString()
      if (!groups[date]) groups[date] = []
      groups[date].push(log)
      return groups
    },
    {} as Record<string, typeof logs>
  )

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#12100e', '#1a1714', '#12100e']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={22} color="#faf6f0" />
        </Pressable>
        <Text style={styles.headerTitle}>Log History</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 60,
            paddingBottom: insets.bottom + 90,
          },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#c4703f"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Filter Pills */}
        <CardEntrance delay={0}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            <Pressable
              onPress={() => setTypeFilter('all')}
              style={[
                styles.filterPill,
                typeFilter === 'all' && styles.filterPillSelected,
              ]}
            >
              <Text
                style={[
                  styles.filterPillText,
                  typeFilter === 'all' && styles.filterPillTextSelected,
                ]}
              >
                All
              </Text>
            </Pressable>
            {ALL_LOG_TYPES.map((type) => {
              const config = LOG_TYPE_CONFIG[type]
              return (
                <Pressable
                  key={type}
                  onPress={() => setTypeFilter(type)}
                  style={[
                    styles.filterPill,
                    typeFilter === type && styles.filterPillSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      typeFilter === type && styles.filterPillTextSelected,
                    ]}
                  >
                    {config.label}
                  </Text>
                </Pressable>
              )
            })}
          </ScrollView>
        </CardEntrance>

        {/* Loading */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#c4703f" />
          </View>
        )}

        {/* Empty State */}
        {!isLoading && (!logs || logs.length === 0) && (
          <CardEntrance delay={80}>
            <GlassCard style={styles.emptyCard}>
              <Text style={styles.emptyText}>No logs found</Text>
            </GlassCard>
          </CardEntrance>
        )}

        {/* Grouped Logs */}
        {!isLoading &&
          Object.entries(groupedLogs).map(([date, dateLogs]) => (
            <View key={date} style={styles.dateGroup}>
              <Text style={styles.dateHeader}>{formatDateHeader(date)}</Text>
              <StaggerList staggerMs={50}>
                {(dateLogs || []).map((log) => {
                  const config =
                    LOG_TYPE_CONFIG[log.log_type as LogType] ||
                    LOG_TYPE_CONFIG.custom
                  const Icon = config.icon
                  return (
                    <GlassCard key={log.id} style={styles.logEntry}>
                      <View
                        style={[
                          styles.logEntryIcon,
                          { backgroundColor: config.bgColor },
                        ]}
                      >
                        <Icon size={16} color={config.color} />
                      </View>
                      <View style={styles.logEntryContent}>
                        <View style={styles.logEntryTop}>
                          <Text style={styles.logEntryType}>
                            {config.label}
                          </Text>
                          <Text style={styles.logEntryTime}>
                            {format(new Date(log.logged_at), 'h:mm a')}
                          </Text>
                        </View>
                        <Text style={styles.logEntryDetail} numberOfLines={2}>
                          {formatLogDetails(log)}
                          {log.notes ? ` - ${log.notes}` : ''}
                        </Text>
                      </View>
                      <Pressable
                        onPress={() => handleDelete(log.id)}
                        style={styles.deleteButton}
                        hitSlop={8}
                      >
                        <Trash2 size={16} color="#d4836b" />
                      </Pressable>
                    </GlassCard>
                  )
                })}
              </StaggerList>
            </View>
          ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12100e',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: 'rgba(18,16,14,0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(237,230,220,0.08)',
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
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 18,
    color: '#faf6f0',
  },
  headerSpacer: {
    width: 36,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  filterRow: {
    gap: 8,
    paddingBottom: 16,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(237,230,220,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(237,230,220,0.08)',
  },
  filterPillSelected: {
    backgroundColor: '#c4703f',
    borderColor: '#c4703f',
  },
  filterPillText: {
    fontFamily: 'Karla-Medium',
    fontSize: 12,
    color: '#7a6f62',
  },
  filterPillTextSelected: {
    color: '#faf6f0',
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyCard: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Jost-Regular',
    fontSize: 15,
    color: '#7a6f62',
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 13,
    color: '#7a6f62',
    marginBottom: 8,
  },
  logEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    marginBottom: 6,
  },
  logEntryIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logEntryContent: {
    flex: 1,
  },
  logEntryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logEntryType: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 14,
    color: '#faf6f0',
  },
  logEntryTime: {
    fontFamily: 'Karla-Medium',
    fontSize: 11,
    color: '#4a4239',
  },
  logEntryDetail: {
    fontFamily: 'Jost-Regular',
    fontSize: 12,
    color: '#7a6f62',
    marginTop: 2,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
