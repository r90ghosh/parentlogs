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
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'
import {
  ChevronLeft,
  Trash2,
  Pencil,
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
  X,
} from 'lucide-react-native'
import { format, isToday, isYesterday } from 'date-fns'
import * as Haptics from 'expo-haptics'
import { useTrackerLogs, useDeleteLog, useUpdateLog } from '@/hooks/use-tracker'
import { useColors, type ColorTokens } from '@/hooks/use-colors'
import { GlassCard } from '@/components/glass'
import { CardEntrance, StaggerList } from '@/components/animations'
import type { LogType, BabyLog } from '@tdc/shared/types'

interface LogTypeConfig {
  icon: typeof Milk
  color: string
  bgColor: string
  label: string
}

function getLogTypeConfig(colors: ColorTokens): Record<LogType, LogTypeConfig> {
  return {
    feeding: { icon: Milk, color: colors.sky, bgColor: colors.skyDim, label: 'Feeding' },
    diaper: { icon: Baby, color: colors.gold, bgColor: colors.goldDim, label: 'Diaper' },
    sleep: { icon: Moon, color: colors.rose, bgColor: colors.roseDim, label: 'Sleep' },
    temperature: { icon: Thermometer, color: colors.coral, bgColor: colors.coralDim, label: 'Temperature' },
    medicine: { icon: Pill, color: colors.sage, bgColor: colors.sageDim, label: 'Medicine' },
    vitamin_d: { icon: Sun, color: colors.gold, bgColor: colors.goldDim, label: 'Vitamin D' },
    mood: { icon: Smile, color: colors.rose, bgColor: colors.roseDim, label: 'Mood' },
    weight: { icon: Scale, color: colors.sky, bgColor: colors.skyDim, label: 'Weight' },
    height: { icon: Ruler, color: colors.sky, bgColor: colors.skyDim, label: 'Height' },
    milestone: { icon: Star, color: colors.copper, bgColor: colors.copperDim, label: 'Milestone' },
    custom: { icon: Plus, color: colors.textMuted, bgColor: colors.subtleBg, label: 'Custom' },
  }
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
    case 'sleep': {
      const quality = data.quality || 'good'
      if (data.start_time && data.is_ongoing) {
        return `Started ${format(new Date(data.start_time), 'h:mm a')} · ongoing (${quality})`
      }
      if (data.start_time && data.end_time) {
        const start = format(new Date(data.start_time), 'h:mm a')
        const end = format(new Date(data.end_time), 'h:mm a')
        const mins = data.duration_minutes ?? Math.round(
          (new Date(data.end_time).getTime() - new Date(data.start_time).getTime()) / 60000
        )
        const h = Math.floor(mins / 60)
        const m = mins % 60
        const dur = h === 0 ? `${m}m` : m === 0 ? `${h}h` : `${h}h ${m}m`
        return `${start} → ${end} · ${dur} (${quality})`
      }
      return `${data.duration_minutes || 0}min (${quality})`
    }
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
  const colors = useColors()
  const LOG_TYPE_CONFIG = getLogTypeConfig(colors)
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const queryClient = useQueryClient()
  const deleteLog = useDeleteLog()
  const updateLog = useUpdateLog()

  const [typeFilter, setTypeFilter] = useState<LogType | 'all'>('all')
  const [refreshing, setRefreshing] = useState(false)
  const [editingLog, setEditingLog] = useState<BabyLog | null>(null)
  const [editNotes, setEditNotes] = useState('')

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

  const handleLongPress = (log: BabyLog) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    Alert.alert(
      'Log Options',
      undefined,
      [
        {
          text: 'Edit Notes',
          onPress: () => {
            setEditingLog(log)
            setEditNotes(log.notes ?? '')
          },
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDelete(log.id),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    )
  }

  const handleSaveEdit = () => {
    if (!editingLog) return
    updateLog.mutate(
      { id: editingLog.id, updates: { notes: editNotes } },
      {
        onSuccess: () => setEditingLog(null),
        onError: () => Alert.alert('Error', 'Failed to update log.'),
      }
    )
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
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: 8, backgroundColor: colors.overlay, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.subtleBg }]}>
          <ChevronLeft size={22} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Log History</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: 60,
            paddingBottom: insets.bottom + 90,
          },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.copper}
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
                { backgroundColor: colors.subtleBg, borderColor: colors.border },
                typeFilter === 'all' && { backgroundColor: colors.copper, borderColor: colors.copper },
              ]}
            >
              <Text
                style={[
                  styles.filterPillText,
                  { color: colors.textMuted },
                  typeFilter === 'all' && { color: colors.textPrimary },
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
                    { backgroundColor: colors.subtleBg, borderColor: colors.border },
                    typeFilter === type && { backgroundColor: colors.copper, borderColor: colors.copper },
                  ]}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      { color: colors.textMuted },
                      typeFilter === type && { color: colors.textPrimary },
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
            <ActivityIndicator size="large" color={colors.copper} />
          </View>
        )}

        {/* Empty State */}
        {!isLoading && (!logs || logs.length === 0) && (
          <CardEntrance delay={80}>
            <GlassCard style={styles.emptyCard}>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No logs found</Text>
            </GlassCard>
          </CardEntrance>
        )}

        {/* Grouped Logs */}
        {!isLoading &&
          Object.entries(groupedLogs).map(([date, dateLogs]) => (
            <View key={date} style={styles.dateGroup}>
              <Text style={[styles.dateHeader, { color: colors.textMuted }]}>{formatDateHeader(date)}</Text>
              <StaggerList staggerMs={50}>
                {(dateLogs || []).map((log) => {
                  const config =
                    LOG_TYPE_CONFIG[log.log_type as LogType] ||
                    LOG_TYPE_CONFIG.custom
                  const Icon = config.icon
                  return (
                    <Pressable
                      key={log.id}
                      onLongPress={() => handleLongPress(log as BabyLog)}
                      delayLongPress={400}
                    >
                      <GlassCard style={styles.logEntry}>
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
                            <Text style={[styles.logEntryType, { color: colors.textPrimary }]}>
                              {config.label}
                            </Text>
                            <Text style={[styles.logEntryTime, { color: colors.textDim }]}>
                              {format(new Date(log.logged_at), 'h:mm a')}
                            </Text>
                          </View>
                          <Text style={[styles.logEntryDetail, { color: colors.textMuted }]} numberOfLines={2}>
                            {formatLogDetails(log)}
                            {log.notes ? ` - ${log.notes}` : ''}
                          </Text>
                        </View>
                        <Pressable
                          onPress={() => handleDelete(log.id)}
                          style={styles.deleteButton}
                          hitSlop={8}
                        >
                          <Trash2 size={16} color={colors.coral} />
                        </Pressable>
                      </GlassCard>
                    </Pressable>
                  )
                })}
              </StaggerList>
            </View>
          ))}
      </ScrollView>

      {/* Edit Notes Modal */}
      <Modal
        visible={!!editingLog}
        transparent
        animationType="slide"
        onRequestClose={() => setEditingLog(null)}
      >
        <KeyboardAvoidingView
          style={[historyEditStyles.overlay, { backgroundColor: colors.overlay }]}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={[historyEditStyles.sheet, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
            <View style={historyEditStyles.sheetHeader}>
              <Text style={[historyEditStyles.sheetTitle, { color: colors.textPrimary }]}>Edit Notes</Text>
              <Pressable
                onPress={() => setEditingLog(null)}
                style={[historyEditStyles.closeBtn, { backgroundColor: colors.subtleBg }]}
              >
                <X size={20} color={colors.textMuted} />
              </Pressable>
            </View>
            <TextInput
              style={[historyEditStyles.notesInput, { backgroundColor: colors.subtleBg, borderColor: colors.border, color: colors.textPrimary }]}
              value={editNotes}
              onChangeText={setEditNotes}
              placeholder="Add notes..."
              placeholderTextColor={colors.textDim}
              multiline
              maxLength={500}
              textAlignVertical="top"
            />
            <Pressable
              onPress={handleSaveEdit}
              style={[
                historyEditStyles.saveBtn,
                { backgroundColor: colors.copper },
                updateLog.isPending && historyEditStyles.saveBtnDisabled,
              ]}
              disabled={updateLog.isPending}
            >
              <Text style={[historyEditStyles.saveBtnText, { color: colors.textPrimary }]}>
                {updateLog.isPending ? 'Saving...' : 'Save'}
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  )
}

const historyEditStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sheetTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 18,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notesInput: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: 'Jost-Regular',
    fontSize: 15,
    minHeight: 100,
    marginBottom: 16,
  },
  saveBtn: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
  },
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderBottomWidth: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 18,
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
    borderWidth: 1,
  },
  filterPillText: {
    fontFamily: 'Karla-Medium',
    fontSize: 12,
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
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 13,
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
  },
  logEntryTime: {
    fontFamily: 'Karla-Medium',
    fontSize: 11,
  },
  logEntryDetail: {
    fontFamily: 'Jost-Regular',
    fontSize: 12,
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
