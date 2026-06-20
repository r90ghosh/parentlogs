import { useState, useCallback, useMemo } from 'react'
import { View, Text, ScrollView, Pressable, RefreshControl, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'
import { Milk, Baby, Moon, Thermometer, Pill, Sun, Smile, Scale, Ruler, Star, Lock, History, ChevronRight, type LucideIcon } from 'lucide-react-native'
import { format, formatDistanceToNow, isSameDay, isToday, addDays } from 'date-fns'
import { useAuth } from '@/components/providers/AuthProvider'
import { useColors, type ColorTokens } from '@/hooks/use-colors'
import { useRecentLogs } from '@/hooks/use-tracker'
import { WeekStepper, SectionLabel } from '@/components/digest'
import { MedicalDisclaimer } from '@/components/shared/MedicalDisclaimer'
import type { BabyLog, LogType } from '@tdc/shared/types'

const CORE: LogType[] = ['feeding', 'diaper', 'sleep']
const MORE: LogType[] = ['temperature', 'medicine', 'vitamin_d', 'mood', 'weight', 'height', 'milestone']

function logMeta(type: LogType, colors: ColorTokens): { icon: LucideIcon; color: string; label: string } {
  switch (type) {
    case 'feeding': return { icon: Milk, color: colors.accent, label: 'Feed' }
    case 'diaper': return { icon: Baby, color: colors.dotNext, label: 'Diaper' }
    case 'sleep': return { icon: Moon, color: colors.dotBaby, label: 'Sleep' }
    case 'temperature': return { icon: Thermometer, color: colors.dotTip, label: 'Temp' }
    case 'medicine': return { icon: Pill, color: colors.dotTip, label: 'Medicine' }
    case 'vitamin_d': return { icon: Sun, color: colors.dotTip, label: 'Vitamin D' }
    case 'mood': return { icon: Smile, color: colors.dotHer, label: 'Mood' }
    case 'weight': return { icon: Scale, color: colors.dotTip, label: 'Weight' }
    case 'height': return { icon: Ruler, color: colors.dotTip, label: 'Height' }
    case 'milestone': return { icon: Star, color: colors.dotTip, label: 'Milestone' }
    default: return { icon: Star, color: colors.muted, label: 'Note' }
  }
}

function formatLogSummary(log: BabyLog): string {
  const data = log.log_data || {}
  switch (log.log_type) {
    case 'feeding':
      if (data.type === 'breast') return `${data.side || ''} side · ${data.duration_minutes || 0}min`
      return `${data.amount_oz || data.amount_ml || 0}${data.amount_oz ? 'oz' : 'ml'} ${data.type || 'bottle'}`
    case 'diaper':
      return data.type || 'wet'
    case 'sleep':
      return `${data.duration_minutes || 0}min`
    case 'temperature':
      return `${data.value || 0}°${data.unit || 'F'}`
    case 'medicine':
      return `${data.name || ''}${data.dosage ? ` · ${data.dosage}` : ''}`
    case 'mood':
      return ['very sad', 'sad', 'neutral', 'happy', 'very happy'][(data.level || 3) - 1] || ''
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

function fmtSleep(mins: number): string {
  if (!mins) return '—'
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return h ? `${h}h${m ? ` ${m}m` : ''}` : `${m}m`
}

export default function TrackerScreen() {
  const colors = useColors()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user, family } = useAuth()

  const stage = family?.stage
  const isPreview = stage === 'pregnancy' || stage === 'first-trimester' || stage === 'second-trimester' || stage === 'third-trimester'

  const { data: recentLogs } = useRecentLogs(60)
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [refreshing, setRefreshing] = useState(false)

  const logs = useMemo(() => (recentLogs ?? []) as BabyLog[], [recentLogs])
  const dayLogs = useMemo(
    () => logs.filter((l) => isSameDay(new Date(l.logged_at), selectedDate)).sort((a, b) => b.logged_at.localeCompare(a.logged_at)),
    [logs, selectedDate]
  )
  const summary = useMemo(() => {
    let feeds = 0, changes = 0, sleepMins = 0
    for (const l of dayLogs) {
      if (l.log_type === 'feeding') feeds++
      else if (l.log_type === 'diaper') changes++
      else if (l.log_type === 'sleep') sleepMins += Number(l.log_data?.duration_minutes ?? 0)
    }
    return { feeds, changes, sleepMins }
  }, [dayLogs])

  const lastOf = useCallback((type: LogType) => logs.find((l) => l.log_type === type), [logs])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await queryClient.invalidateQueries({ queryKey: ['tracker-logs'] })
    setRefreshing(false)
  }, [queryClient])

  const navigateToLog = (type: LogType) => {
    if (isPreview) return
    router.push({ pathname: '/(tabs)/tracker/log', params: { type } })
  }

  const dateLabel = isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEE, MMM d')
  const stepDay = (n: -1 | 1) => setSelectedDate((d) => {
    const next = addDays(d, n)
    return next > new Date() ? d : next
  })

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 90 }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
        showsVerticalScrollIndicator={false}
      >
        <WeekStepper
          title="Tracker"
          label={dateLabel}
          onPrev={() => stepDay(-1)}
          onNext={() => stepDay(1)}
          nextDisabled={isToday(selectedDate)}
          onPressLabel={() => setSelectedDate(new Date())}
        />

        {isPreview && (
          <View style={[styles.lockCard, { backgroundColor: colors.card, borderColor: colors.line }]}>
            <Lock size={18} color={colors.accentInk} />
            <Text style={[styles.lockText, { color: colors.ink2 }]}>
              The tracker unlocks after your baby arrives. Here&apos;s a preview of what you&apos;ll log.
            </Text>
          </View>
        )}

        {/* Log now — 3 core tiles */}
        <SectionLabel>Log now</SectionLabel>
        <View style={styles.tiles}>
          {CORE.map((type) => {
            const m = logMeta(type, colors)
            const last = lastOf(type)
            const Icon = m.icon
            return (
              <Pressable
                key={type}
                onPress={() => navigateToLog(type)}
                disabled={isPreview}
                style={({ pressed }) => [
                  styles.tile,
                  { backgroundColor: colors.card, borderColor: colors.line, opacity: isPreview ? 0.5 : pressed ? 0.8 : 1 },
                ]}
              >
                <Icon size={24} color={m.color} />
                <Text style={[styles.tileLabel, { color: colors.ink }]}>{m.label}</Text>
                <Text style={[styles.tileSub, { color: colors.muted }]} numberOfLines={1}>
                  {last ? formatDistanceToNow(new Date(last.logged_at), { addSuffix: true }) : 'Tap to start'}
                </Text>
              </Pressable>
            )
          })}
        </View>

        {/* More chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {MORE.map((type) => {
            const m = logMeta(type, colors)
            const Icon = m.icon
            return (
              <Pressable
                key={type}
                onPress={() => navigateToLog(type)}
                disabled={isPreview}
                style={[styles.chip, { backgroundColor: colors.card, borderColor: colors.line, opacity: isPreview ? 0.5 : 1 }]}
              >
                <Icon size={15} color={m.color} />
                <Text style={[styles.chipText, { color: colors.ink2 }]}>{m.label}</Text>
              </Pressable>
            )
          })}
        </ScrollView>

        {!isPreview && (
          <>
            {/* Today so far */}
            <SectionLabel>{isToday(selectedDate) ? 'Today so far' : 'That day'}</SectionLabel>
            <View style={styles.stats}>
              <Stat value={String(summary.feeds)} label="Feeds" colors={colors} />
              <Stat value={String(summary.changes)} label="Changes" colors={colors} />
              <Stat value={fmtSleep(summary.sleepMins)} label="Sleep" colors={colors} />
            </View>

            {/* Timeline */}
            <View style={styles.secHead}>
              <SectionLabel style={styles.secHeadLabel}>Timeline</SectionLabel>
              <Pressable onPress={() => router.push('/(tabs)/tracker/history')} hitSlop={8} style={styles.historyLink}>
                <History size={13} color={colors.accentInk} />
                <Text style={[styles.historyText, { color: colors.accentInk }]}>History</Text>
              </Pressable>
            </View>

            {dayLogs.length === 0 ? (
              <Text style={[styles.empty, { color: colors.muted }]}>
                {isToday(selectedDate) ? 'Nothing logged yet today.' : 'Nothing logged that day.'}
              </Text>
            ) : (
              dayLogs.map((log) => {
                const m = logMeta(log.log_type, colors)
                const mine = log.logged_by === user?.id
                return (
                  <View key={log.id} style={[styles.tlRow, { borderBottomColor: colors.line2 }]}>
                    <Text style={[styles.tlTime, { color: colors.muted }]}>{format(new Date(log.logged_at), 'h:mm a')}</Text>
                    <View style={[styles.tlDot, { backgroundColor: m.color }]} />
                    <View style={styles.tlBody}>
                      <Text style={[styles.tlTitle, { color: colors.ink }]}>
                        {m.label}
                        <Text style={[styles.tlDetail, { color: colors.ink2 }]}>{formatLogSummary(log) ? `  ·  ${formatLogSummary(log)}` : ''}</Text>
                      </Text>
                      <Text style={[styles.tlBy, { color: colors.faint }]}>{mine ? 'you' : 'partner'}</Text>
                    </View>
                  </View>
                )
              })
            )}
          </>
        )}

        <MedicalDisclaimer />
      </ScrollView>
    </View>
  )
}

function Stat({ value, label, colors }: { value: string; label: string; colors: ColorTokens }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color: colors.ink }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.muted }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingTop: 4 },
  lockCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 20, marginTop: 12, padding: 16, borderRadius: 16, borderWidth: 1 },
  lockText: { flex: 1, fontFamily: 'Jakarta-Medium', fontSize: 13, lineHeight: 19 },
  tiles: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingTop: 4 },
  tile: { flex: 1, alignItems: 'center', gap: 7, paddingVertical: 18, borderRadius: 16, borderWidth: 1 },
  tileLabel: { fontFamily: 'Jakarta-Bold', fontSize: 14 },
  tileSub: { fontFamily: 'Jakarta-Medium', fontSize: 11 },
  chips: { gap: 8, paddingHorizontal: 20, paddingTop: 12 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 13 },
  chipText: { fontFamily: 'Jakarta-SemiBold', fontSize: 12.5 },
  stats: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 4 },
  stat: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontFamily: 'Jakarta-ExtraBold', fontSize: 24, letterSpacing: -0.5 },
  statLabel: { fontFamily: 'Jakarta-Medium', fontSize: 12 },
  secHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 20 },
  secHeadLabel: { flex: 0 },
  historyLink: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingTop: 18 },
  historyText: { fontFamily: 'Jakarta-Bold', fontSize: 13 },
  empty: { fontFamily: 'Jakarta-Medium', fontSize: 14, textAlign: 'center', paddingVertical: 32, paddingHorizontal: 40 },
  tlRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 14, paddingHorizontal: 22, borderBottomWidth: 1 },
  tlTime: { fontFamily: 'Jakarta-Medium', fontSize: 12, width: 64, marginTop: 1 },
  tlDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  tlBody: { flex: 1 },
  tlTitle: { fontFamily: 'Jakarta-Bold', fontSize: 14.5 },
  tlDetail: { fontFamily: 'Jakarta-Regular', fontSize: 14 },
  tlBy: { fontFamily: 'Jakarta-Medium', fontSize: 11, marginTop: 3, textTransform: 'lowercase' },
})
