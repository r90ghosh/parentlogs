import { useState, useMemo } from 'react'
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  ArrowLeft,
  BarChart3,
  Milk,
  Baby,
  Moon,
  Crown,
} from 'lucide-react-native'
import { useAuth } from '@/components/providers/AuthProvider'
import { useTrackerSummary } from '@/hooks/use-tracker-summary'
import { format } from 'date-fns'
import { useColors, type ColorTokens } from '@/hooks/use-colors'

export default function TrackerSummaryScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { profile } = useAuth()
  const colors = useColors()
  const [period, setPeriod] = useState<7 | 30>(7)

  const isPremium =
    profile?.subscription_tier === 'premium' ||
    profile?.subscription_tier === 'lifetime'

  const { data, isLoading } = useTrackerSummary(period)

  const stats = useMemo(() => {
    if (!data || data.length === 0) return null

    const feedingLogs = data.filter((l) => l.log_type === 'feeding')
    const diaperLogs = data.filter((l) => l.log_type === 'diaper')
    const sleepLogs = data.filter((l) => l.log_type === 'sleep')

    const daysWithData =
      new Set(data.map((l) => format(new Date(l.logged_at), 'yyyy-MM-dd'))).size || 1

    const avgFeedings = Math.round((feedingLogs.length / daysWithData) * 10) / 10
    const avgDiapers = Math.round((diaperLogs.length / daysWithData) * 10) / 10

    const totalSleepMins = sleepLogs.reduce((sum, l) => {
      const mins = (l.log_data as Record<string, any>)?.duration_minutes || 0
      return sum + mins
    }, 0)
    const avgSleepHrs = Math.round((totalSleepMins / daysWithData / 60) * 10) / 10

    return { avgFeedings, avgDiapers, avgSleepHrs, totalLogs: data.length, daysWithData }
  }, [data, period])

  const trackerHeader = (
    <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: colors.line }]}>
      <Pressable onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.card, borderColor: colors.line }]}>
        <ArrowLeft size={20} color={colors.ink2} />
      </Pressable>
      <Text style={[styles.headerTitle, { color: colors.ink }]}>Tracker Summary</Text>
      <View style={styles.headerSpacer} />
    </View>
  )

  return (
    <View style={styles.container}>
      {!isPremium ? (
        <View style={styles.upgradeContainer}>
          {trackerHeader}
          <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
            <View style={[styles.upgradeCard, { backgroundColor: colors.card, borderColor: colors.line }]}>
              <Crown size={32} color={colors.gold} />
              <Text style={[styles.upgradeTitle, { color: colors.ink }]}>Premium Feature</Text>
              <Text style={[styles.upgradeDesc, { color: colors.muted }]}>
                Tracker analytics require a Premium subscription. See trends,
                averages, and insights about your baby's patterns.
              </Text>
              <Pressable
                onPress={() => router.push('/(screens)/upgrade')}
                style={[styles.upgradeButton, { backgroundColor: colors.accent }]}
              >
                <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
              </Pressable>
            </View>
          </View>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
        >
          {trackerHeader}

          {/* Period toggle */}
          <View style={styles.periodRow}>
            {([7, 30] as const).map((p) => (
              <Pressable
                key={p}
                onPress={() => setPeriod(p)}
                style={[
                  styles.periodPill,
                  { borderColor: period === p ? colors.accent : colors.line, borderWidth: 1 },
                  period === p && { backgroundColor: colors.accent },
                ]}
              >
                <Text style={[styles.periodPillText, { color: period === p ? '#fff' : colors.ink2 }]}>
                  {p} Days
                </Text>
              </Pressable>
            ))}
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={colors.accent} size="large" />
            </View>
          ) : !stats ? (
            <View style={styles.emptyContainer}>
              <BarChart3 size={40} color={colors.faint} />
              <Text style={[styles.emptyTitle, { color: colors.ink }]}>No tracking data</Text>
              <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
                No tracking data for this period
              </Text>
            </View>
          ) : (
            <>
              {/* Stat blocks */}
              <View style={styles.statsRow}>
                <StatBlock
                  icon={<Milk size={20} color={colors.accent} />}
                  value={String(stats.avgFeedings)}
                  label="Avg Feedings"
                  sub="per day"
                  colors={colors}
                />
                <StatBlock
                  icon={<Baby size={20} color={colors.dotNext} />}
                  value={String(stats.avgDiapers)}
                  label="Avg Diapers"
                  sub="per day"
                  colors={colors}
                />
                <StatBlock
                  icon={<Moon size={20} color={colors.dotBaby} />}
                  value={String(stats.avgSleepHrs)}
                  label="Avg Sleep"
                  sub="hrs/day"
                  colors={colors}
                />
              </View>

              {/* Summary section */}
              <Text style={[styles.sectionTitle, { color: colors.faint }]}>SUMMARY</Text>
              <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.line }]}>
                <SummaryRow label="Total Logs" value={String(stats.totalLogs)} colors={colors} />
                <View style={[styles.summaryDivider, { backgroundColor: colors.line2 }]} />
                <SummaryRow label="Days Tracked" value={String(stats.daysWithData)} colors={colors} />
                <View style={[styles.summaryDivider, { backgroundColor: colors.line2 }]} />
                <SummaryRow label="Period" value={`Last ${period} days`} colors={colors} />
              </View>
            </>
          )}
        </ScrollView>
      )}
    </View>
  )
}

function StatBlock({ icon, value, label, sub, colors }: { icon: React.ReactNode; value: string; label: string; sub: string; colors: ColorTokens }) {
  return (
    <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.line }]}>
      {icon}
      <Text style={[styles.statValue, { color: colors.ink }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.ink2 }]}>{label}</Text>
      <Text style={[styles.statSub, { color: colors.muted }]}>{sub}</Text>
    </View>
  )
}

function SummaryRow({ label, value, colors }: { label: string; value: string; colors: ColorTokens }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, { color: colors.muted }]}>{label}</Text>
      <Text style={[styles.summaryValue, { color: colors.ink }]}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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

  // Upgrade gate
  upgradeContainer: { flex: 1 },
  upgradeCard: {
    padding: 28,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    gap: 12,
  },
  upgradeTitle: { fontFamily: 'Jakarta-Bold', fontSize: 20, letterSpacing: -0.2 },
  upgradeDesc: { fontFamily: 'Jakarta-Regular', fontSize: 14, textAlign: 'center', lineHeight: 21 },
  upgradeButton: { marginTop: 8, paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12 },
  upgradeButtonText: { fontFamily: 'Jakarta-Bold', fontSize: 15, color: '#fff' },

  // Scroll
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 4 },

  // Period toggle
  periodRow: { flexDirection: 'row', gap: 8, marginTop: 16, marginBottom: 20 },
  periodPill: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 999 },
  periodPillText: { fontFamily: 'Jakarta-Medium', fontSize: 14 },

  // Loading / Empty
  loadingContainer: { paddingVertical: 80, alignItems: 'center' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 80, paddingHorizontal: 40, gap: 12 },
  emptyTitle: { fontFamily: 'Jakarta-Bold', fontSize: 18, textAlign: 'center' },
  emptySubtitle: { fontFamily: 'Jakarta-Regular', fontSize: 14, textAlign: 'center', lineHeight: 21 },

  // Stat blocks
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    gap: 5,
  },
  statValue: { fontFamily: 'Jakarta-ExtraBold', fontSize: 24, letterSpacing: -0.5 },
  statLabel: { fontFamily: 'Jakarta-Medium', fontSize: 12 },
  statSub: { fontFamily: 'Jakarta-Medium', fontSize: 11 },

  // Summary
  sectionTitle: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 11,
    letterSpacing: 1.4,
    marginBottom: 8,
  },
  summaryCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16 },
  summaryDivider: { height: 1 },
  summaryLabel: { fontFamily: 'Jakarta-Regular', fontSize: 14 },
  summaryValue: { fontFamily: 'Jakarta-SemiBold', fontSize: 14 },
})
