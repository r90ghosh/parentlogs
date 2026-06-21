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
  Check,
} from 'lucide-react-native'
import { format, isToday, isYesterday } from 'date-fns'
import * as Haptics from 'expo-haptics'
import { useTrackerLogs, useDeleteLog, useUpdateLog } from '@/hooks/use-tracker'
import { useColors, type ColorTokens } from '@/hooks/use-colors'
import type { LogType, BabyLog } from '@tdc/shared/types'

interface LogTypeConfig {
  icon: typeof Milk
  color: string
  label: string
}

function getLogTypeConfig(colors: ColorTokens): Record<LogType, LogTypeConfig> {
  return {
    feeding: { icon: Milk, color: colors.accent, label: 'Feeding' },
    diaper: { icon: Baby, color: colors.dotNext, label: 'Diaper' },
    sleep: { icon: Moon, color: colors.dotBaby, label: 'Sleep' },
    temperature: { icon: Thermometer, color: colors.dotTip, label: 'Temperature' },
    medicine: { icon: Pill, color: colors.dotTip, label: 'Medicine' },
    vitamin_d: { icon: Sun, color: colors.dotTip, label: 'Vitamin D' },
    mood: { icon: Smile, color: colors.dotHer, label: 'Mood' },
    weight: { icon: Scale, color: colors.dotTip, label: 'Weight' },
    height: { icon: Ruler, color: colors.dotTip, label: 'Height' },
    milestone: { icon: Star, color: colors.gold, label: 'Milestone' },
    custom: { icon: Plus, color: colors.muted, label: 'Custom' },
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
      <View style={[styles.header, { paddingTop: 8, borderBottomColor: colors.line }]}>
        <Pressable onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.card, borderColor: colors.line }]}>
          <ChevronLeft size={22} color={colors.ink2} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.ink }]}>Log History</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: 60, paddingBottom: insets.bottom + 90 }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          <Pressable
            onPress={() => setTypeFilter('all')}
            style={[
              styles.filterPill,
              { borderColor: typeFilter === 'all' ? colors.accent : colors.line },
              typeFilter === 'all' && { backgroundColor: colors.accent },
            ]}
          >
            <Text style={[styles.filterPillText, { color: typeFilter === 'all' ? '#fff' : colors.ink2 }]}>
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
                  { borderColor: typeFilter === type ? colors.accent : colors.line },
                  typeFilter === type && { backgroundColor: colors.accent },
                ]}
              >
                <Text style={[styles.filterPillText, { color: typeFilter === type ? '#fff' : colors.ink2 }]}>
                  {config.label}
                </Text>
              </Pressable>
            )
          })}
        </ScrollView>

        {/* Loading */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
        )}

        {/* Empty State */}
        {!isLoading && (!logs || logs.length === 0) && (
          <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.line }]}>
            <Text style={[styles.emptyText, { color: colors.muted }]}>No logs found</Text>
          </View>
        )}

        {/* Grouped Logs */}
        {!isLoading &&
          Object.entries(groupedLogs).map(([date, dateLogs]) => (
            <View key={date} style={styles.dateGroup}>
              <Text style={[styles.dateHeader, { color: colors.faint }]}>{formatDateHeader(date)}</Text>
              {(dateLogs || []).map((log) => {
                const config = LOG_TYPE_CONFIG[log.log_type as LogType] || LOG_TYPE_CONFIG.custom
                const Icon = config.icon
                return (
                  <Pressable
                    key={log.id}
                    onLongPress={() => handleLongPress(log as BabyLog)}
                    delayLongPress={400}
                    style={[styles.logEntry, { borderBottomColor: colors.line2 }]}
                  >
                    <View style={[styles.logEntryDot, { backgroundColor: config.color }]} />
                    <Icon size={16} color={config.color} style={{ flexShrink: 0 }} />
                    <View style={styles.logEntryContent}>
                      <View style={styles.logEntryTop}>
                        <Text style={[styles.logEntryType, { color: colors.ink }]}>
                          {config.label}
                        </Text>
                        <Text style={[styles.logEntryTime, { color: colors.muted }]}>
                          {format(new Date(log.logged_at), 'h:mm a')}
                        </Text>
                      </View>
                      <Text style={[styles.logEntryDetail, { color: colors.ink2 }]} numberOfLines={2}>
                        {formatLogDetails(log)}
                        {log.notes ? ` · ${log.notes}` : ''}
                      </Text>
                    </View>
                    <Pressable onPress={() => handleDelete(log.id)} hitSlop={8}>
                      <Trash2 size={15} color={colors.faint} />
                    </Pressable>
                  </Pressable>
                )
              })}
            </View>
          ))}
      </ScrollView>

      {/* Edit Notes Modal */}
      <Modal visible={!!editingLog} transparent animationType="slide" onRequestClose={() => setEditingLog(null)}>
        <KeyboardAvoidingView
          style={[editStyles.overlay, { backgroundColor: colors.overlay }]}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={[editStyles.sheet, { backgroundColor: colors.card, borderTopColor: colors.line }]}>
            <View style={editStyles.sheetHeader}>
              <Text style={[editStyles.sheetTitle, { color: colors.ink }]}>Edit Notes</Text>
              <Pressable
                onPress={() => setEditingLog(null)}
                style={[editStyles.closeBtn, { backgroundColor: colors.cardHover }]}
              >
                <X size={18} color={colors.ink2} />
              </Pressable>
            </View>
            <TextInput
              style={[editStyles.notesInput, { backgroundColor: colors.bg, borderColor: colors.line, color: colors.ink, fontFamily: 'Jakarta-Medium', fontSize: 15 }]}
              value={editNotes}
              onChangeText={setEditNotes}
              placeholder="Add notes..."
              placeholderTextColor={colors.faint}
              multiline
              maxLength={500}
              textAlignVertical="top"
            />
            <Pressable
              onPress={handleSaveEdit}
              style={[editStyles.saveBtn, { backgroundColor: colors.accent }, updateLog.isPending && editStyles.saveBtnDisabled]}
              disabled={updateLog.isPending}
            >
              <Check size={16} color="#fff" strokeWidth={2.5} />
              <Text style={editStyles.saveBtnText}>
                {updateLog.isPending ? 'Saving...' : 'Save'}
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  )
}

const editStyles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
  },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  sheetTitle: { fontFamily: 'Jakarta-Bold', fontSize: 17 },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notesInput: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 100,
    marginBottom: 16,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 14,
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { fontFamily: 'Jakarta-Bold', fontSize: 15, color: '#fff' },
})

const styles = StyleSheet.create({
  container: { flex: 1 },
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
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontFamily: 'Jakarta-SemiBold', fontSize: 16 },
  headerSpacer: { width: 38 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16 },
  filterRow: { gap: 8, paddingBottom: 16 },
  filterPill: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  filterPillText: { fontFamily: 'Jakarta-Medium', fontSize: 12 },
  loadingContainer: { paddingVertical: 60, alignItems: 'center' },
  emptyCard: { padding: 40, alignItems: 'center', borderRadius: 16, borderWidth: 1 },
  emptyText: { fontFamily: 'Jakarta-Regular', fontSize: 15 },
  dateGroup: { marginBottom: 20 },
  dateHeader: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 4,
    paddingTop: 4,
  },
  logEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    borderBottomWidth: 1,
  },
  logEntryDot: { width: 6, height: 6, borderRadius: 3, flexShrink: 0 },
  logEntryContent: { flex: 1, minWidth: 0 },
  logEntryTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logEntryType: { fontFamily: 'Jakarta-SemiBold', fontSize: 14 },
  logEntryTime: { fontFamily: 'Jakarta-Medium', fontSize: 11 },
  logEntryDetail: { fontFamily: 'Jakarta-Regular', fontSize: 12.5, marginTop: 2, lineHeight: 18 },
})
