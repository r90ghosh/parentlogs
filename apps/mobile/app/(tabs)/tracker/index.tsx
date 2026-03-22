import { useState, useCallback } from 'react'
import {
  View,
  Text,
  ScrollView,
  Pressable,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'
import {
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
  Clock,
  History,
  Lock,
  BarChart3,
} from 'lucide-react-native'
import { formatDistanceToNow, format } from 'date-fns'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRecentLogs, useShiftBriefing } from '@/hooks/use-tracker'
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

const BASIC_LOG_TYPES: LogType[] = ['feeding', 'diaper', 'sleep']
const PREMIUM_LOG_TYPES: LogType[] = [
  'temperature',
  'medicine',
  'vitamin_d',
  'mood',
  'weight',
  'height',
  'milestone',
  'custom',
]

function formatLogSummary(log: any): string {
  const data = log.log_data || {}
  switch (log.log_type) {
    case 'feeding':
      if (data.type === 'breast') return `${data.side || ''} side, ${data.duration_minutes || 0}min`
      return `${data.amount_oz || 0}oz ${data.type || 'bottle'}`
    case 'diaper':
      return data.type || 'wet'
    case 'sleep':
      return `${data.duration_minutes || 0}min`
    case 'temperature':
      return `${data.value || 0}°${data.unit || 'F'}`
    case 'medicine':
      return `${data.name || ''} - ${data.dosage || ''}`
    case 'mood': {
      const moods = ['very sad', 'sad', 'neutral', 'happy', 'very happy']
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

export default function TrackerScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { family } = useAuth()

  const stage = family?.stage
  const isPreview = stage === 'pregnancy' || stage === 'first-trimester' || stage === 'second-trimester' || stage === 'third-trimester'

  const { data: recentLogs, isLoading: logsLoading } = useRecentLogs(10)
  const { data: shiftBriefing, isLoading: briefingLoading } = useShiftBriefing()

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await queryClient.invalidateQueries({ queryKey: ['tracker-logs'] })
    await queryClient.invalidateQueries({ queryKey: ['shift-briefing'] })
    setRefreshing(false)
  }, [queryClient])

  const navigateToLog = (type: LogType) => {
    if (isPreview) return
    router.push({ pathname: '/(tabs)/tracker/log', params: { type } })
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#12100e', '#1a1714', '#12100e']}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 90 },
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
        {/* Header */}
        <CardEntrance delay={0}>
          <View style={styles.headerRow}>
            <Text style={styles.pageTitle}>Baby Tracker</Text>
            {!isPreview && (
              <View style={styles.headerButtons}>
                <Pressable
                  onPress={() => router.push('/(screens)/tracker-summary')}
                  style={styles.historyButton}
                >
                  <BarChart3 size={16} color="#c4703f" />
                  <Text style={styles.historyText}>Summary</Text>
                </Pressable>
                <Pressable
                  onPress={() =>
                    router.push('/(tabs)/tracker/history')
                  }
                  style={styles.historyButton}
                >
                  <History size={16} color="#c4703f" />
                  <Text style={styles.historyText}>History</Text>
                </Pressable>
              </View>
            )}
          </View>
        </CardEntrance>

        {/* Preview Banner */}
        {isPreview && (
          <CardEntrance delay={80}>
            <GlassCard
              style={[styles.previewBanner, { borderColor: 'rgba(196,112,63,0.3)' }]}
            >
              <Lock size={20} color="#c4703f" />
              <View style={styles.previewTextContainer}>
                <Text style={styles.previewTitle}>Preview Mode</Text>
                <Text style={styles.previewDescription}>
                  The baby tracker will unlock after your baby is born. Here's a
                  preview of what you'll be able to track!
                </Text>
              </View>
            </GlassCard>
          </CardEntrance>
        )}

        {/* Shift Briefing */}
        <CardEntrance delay={isPreview ? 160 : 80}>
          <GlassCard style={[styles.shiftCard, isPreview && styles.previewOpacity]}>
            <View style={styles.shiftHeader}>
              <Clock size={18} color="#c4703f" />
              <Text style={styles.shiftTitle}>Shift Briefing</Text>
            </View>
            {isPreview ? (
              <View style={styles.shiftGrid}>
                <ShiftStat
                  Icon={Milk}
                  color="#5b9bd5"
                  label="Last Feed"
                  value="2h ago"
                  sub="6 today"
                />
                <ShiftStat
                  Icon={Baby}
                  color="#d4a853"
                  label="Last Diaper"
                  value="45m ago"
                  sub="4 today"
                />
                <ShiftStat
                  Icon={Moon}
                  color="#c47a8f"
                  label="Sleep"
                  value="12h"
                  sub="2h ago"
                />
              </View>
            ) : briefingLoading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color="#c4703f" />
              </View>
            ) : shiftBriefing ? (
              <View style={styles.shiftGrid}>
                <ShiftStat
                  Icon={Milk}
                  color="#5b9bd5"
                  label="Last Feed"
                  value={
                    shiftBriefing.last_feeding
                      ? formatDistanceToNow(
                          new Date(shiftBriefing.last_feeding.logged_at),
                          { addSuffix: true }
                        )
                      : 'No logs'
                  }
                  sub={`${shiftBriefing.total_feedings_today} today`}
                />
                <ShiftStat
                  Icon={Baby}
                  color="#d4a853"
                  label="Last Diaper"
                  value={
                    shiftBriefing.last_diaper
                      ? formatDistanceToNow(
                          new Date(shiftBriefing.last_diaper.logged_at),
                          { addSuffix: true }
                        )
                      : 'No logs'
                  }
                  sub={`${shiftBriefing.total_diapers_today} today`}
                />
                <ShiftStat
                  Icon={Moon}
                  color="#c47a8f"
                  label="Sleep"
                  value={`${shiftBriefing.total_sleep_hours_today}h`}
                  sub={
                    shiftBriefing.last_sleep
                      ? formatDistanceToNow(
                          new Date(shiftBriefing.last_sleep.logged_at),
                          { addSuffix: true }
                        )
                      : 'No logs'
                  }
                />
              </View>
            ) : (
              <Text style={styles.noDataText}>No data available</Text>
            )}
          </GlassCard>
        </CardEntrance>

        {/* Quick Log - Basic Types */}
        <CardEntrance delay={isPreview ? 240 : 160}>
          <View style={isPreview ? styles.previewOpacity : undefined}>
            <Text style={styles.sectionTitle}>Quick Log</Text>
            <View style={styles.logGrid3}>
              {BASIC_LOG_TYPES.map((type) => {
                const config = LOG_TYPE_CONFIG[type]
                const Icon = config.icon
                return (
                  <Pressable
                    key={type}
                    onPress={() => navigateToLog(type)}
                    style={[
                      styles.logButton,
                      { backgroundColor: config.bgColor },
                    ]}
                    disabled={isPreview}
                  >
                    <Icon size={28} color={config.color} />
                    <Text style={styles.logButtonLabel}>{config.label}</Text>
                  </Pressable>
                )
              })}
            </View>
          </View>
        </CardEntrance>

        {/* More Log Types */}
        <CardEntrance delay={isPreview ? 320 : 240}>
          <View style={isPreview ? styles.previewOpacity : undefined}>
            <Text style={styles.sectionTitle}>More Logs</Text>
            <View style={styles.logGrid4}>
              {PREMIUM_LOG_TYPES.map((type) => {
                const config = LOG_TYPE_CONFIG[type]
                const Icon = config.icon
                return (
                  <Pressable
                    key={type}
                    onPress={() => navigateToLog(type)}
                    style={[
                      styles.logButtonSmall,
                      { backgroundColor: config.bgColor },
                    ]}
                    disabled={isPreview}
                  >
                    <Icon size={22} color={config.color} />
                    <Text style={styles.logButtonLabelSmall}>
                      {config.label}
                    </Text>
                  </Pressable>
                )
              })}
            </View>
          </View>
        </CardEntrance>

        {/* Recent Activity */}
        <CardEntrance delay={isPreview ? 400 : 320}>
          <View style={isPreview ? styles.previewOpacity : undefined}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              {!isPreview && recentLogs && recentLogs.length > 0 && (
                <Pressable
                  onPress={() =>
                    router.push('/(tabs)/tracker/history')
                  }
                >
                  <Text style={styles.viewAllLink}>View All</Text>
                </Pressable>
              )}
            </View>

            {isPreview ? (
              <StaggerList staggerMs={60}>
                {[
                  { type: 'feeding' as LogType, time: '2:30 PM', detail: 'Bottle - 4oz' },
                  { type: 'diaper' as LogType, time: '1:15 PM', detail: 'Wet' },
                  { type: 'sleep' as LogType, time: '12:00 PM', detail: 'Nap - 45 mins' },
                ].map((log, idx) => {
                  const config = LOG_TYPE_CONFIG[log.type]
                  const Icon = config.icon
                  return (
                    <GlassCard key={idx} style={styles.logEntry}>
                      <View
                        style={[
                          styles.logEntryIcon,
                          { backgroundColor: config.bgColor },
                        ]}
                      >
                        <Icon size={16} color={config.color} />
                      </View>
                      <View style={styles.logEntryContent}>
                        <Text style={styles.logEntryType}>
                          {config.label}
                        </Text>
                        <Text style={styles.logEntryDetail}>
                          {log.time} - {log.detail}
                        </Text>
                      </View>
                    </GlassCard>
                  )
                })}
              </StaggerList>
            ) : logsLoading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color="#c4703f" />
              </View>
            ) : recentLogs && recentLogs.length > 0 ? (
              <StaggerList staggerMs={60}>
                {recentLogs.map((log) => {
                  const config = LOG_TYPE_CONFIG[log.log_type as LogType] || LOG_TYPE_CONFIG.custom
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
                        <Text style={styles.logEntryType}>
                          {config.label}
                        </Text>
                        <Text style={styles.logEntryDetail}>
                          {format(new Date(log.logged_at), 'h:mm a')}
                          {' - '}
                          {formatLogSummary(log)}
                          {log.notes ? ` - ${log.notes}` : ''}
                        </Text>
                      </View>
                    </GlassCard>
                  )
                })}
              </StaggerList>
            ) : (
              <GlassCard style={styles.emptyCard}>
                <Text style={styles.noDataText}>
                  No logs yet. Start tracking!
                </Text>
              </GlassCard>
            )}
          </View>
        </CardEntrance>
      </ScrollView>
    </View>
  )
}

function ShiftStat({
  Icon,
  color,
  label,
  value,
  sub,
}: {
  Icon: typeof Milk
  color: string
  label: string
  value: string
  sub: string
}) {
  return (
    <View style={styles.shiftStat}>
      <Icon size={18} color={color} />
      <Text style={styles.shiftStatLabel}>{label}</Text>
      <Text style={styles.shiftStatValue} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.shiftStatSub} numberOfLines={1}>
        {sub}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12100e',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  pageTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
    color: '#faf6f0',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(237,230,220,0.08)',
    backgroundColor: 'rgba(237,230,220,0.04)',
  },
  historyText: {
    fontFamily: 'Karla-Medium',
    fontSize: 13,
    color: '#c4703f',
  },
  previewBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    gap: 12,
    marginBottom: 16,
  },
  previewTextContainer: {
    flex: 1,
  },
  previewTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 14,
    color: '#c4703f',
    marginBottom: 4,
  },
  previewDescription: {
    fontFamily: 'Jost-Regular',
    fontSize: 13,
    color: 'rgba(196,112,63,0.7)',
    lineHeight: 18,
  },
  previewOpacity: {
    opacity: 0.6,
  },
  shiftCard: {
    padding: 16,
    marginBottom: 20,
  },
  shiftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  shiftTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 16,
    color: '#faf6f0',
  },
  shiftGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  shiftStat: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  shiftStatLabel: {
    fontFamily: 'Karla-Medium',
    fontSize: 11,
    color: '#7a6f62',
  },
  shiftStatValue: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 13,
    color: '#faf6f0',
    textAlign: 'center',
  },
  shiftStatSub: {
    fontFamily: 'Jost-Regular',
    fontSize: 11,
    color: '#4a4239',
    textAlign: 'center',
  },
  sectionTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 18,
    color: '#faf6f0',
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  viewAllLink: {
    fontFamily: 'Karla-Medium',
    fontSize: 13,
    color: '#c4703f',
  },
  logGrid3: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  logButton: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(237,230,220,0.08)',
  },
  logButtonLabel: {
    fontFamily: 'Karla-Medium',
    fontSize: 13,
    color: '#faf6f0',
  },
  logGrid4: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  logButtonSmall: {
    width: (Dimensions.get('window').width - 32 - 24) / 4,
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(237,230,220,0.08)',
  },
  logButtonLabelSmall: {
    fontFamily: 'Karla-Medium',
    fontSize: 11,
    color: '#faf6f0',
    textAlign: 'center',
  },
  logEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    marginBottom: 8,
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
  logEntryType: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 14,
    color: '#faf6f0',
    textTransform: 'capitalize',
  },
  logEntryDetail: {
    fontFamily: 'Jost-Regular',
    fontSize: 12,
    color: '#7a6f62',
    marginTop: 2,
  },
  emptyCard: {
    padding: 32,
    alignItems: 'center',
  },
  noDataText: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    color: '#7a6f62',
    textAlign: 'center',
  },
  loadingRow: {
    paddingVertical: 24,
    alignItems: 'center',
  },
})
