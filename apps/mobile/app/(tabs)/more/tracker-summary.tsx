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
import { GlassCard } from '@/components/glass'
import { CardEntrance } from '@/components/animations'
import { format } from 'date-fns'
import { useColors } from '@/hooks/use-colors'

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
      new Set(data.map((l) => format(new Date(l.logged_at), 'yyyy-MM-dd')))
        .size || 1

    const avgFeedings =
      Math.round((feedingLogs.length / daysWithData) * 10) / 10
    const avgDiapers =
      Math.round((diaperLogs.length / daysWithData) * 10) / 10

    const totalSleepMins = sleepLogs.reduce((sum, l) => {
      const mins =
        (l.log_data as Record<string, any>)?.duration_minutes || 0
      return sum + mins
    }, 0)
    const avgSleepHrs =
      Math.round((totalSleepMins / daysWithData / 60) * 10) / 10

    return {
      avgFeedings,
      avgDiapers,
      avgSleepHrs,
      totalLogs: data.length,
      daysWithData,
    }
  }, [data, period])

  const trackerHeader = (
    <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
      <Pressable onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.subtleBg }]}>
        <ArrowLeft size={20} color={colors.textSecondary} />
      </Pressable>
      <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Tracker Summary</Text>
      <View style={styles.headerSpacer} />
    </View>
  )

  return (
    <View style={styles.container}>
      {!isPremium ? (
        <View style={styles.upgradeContainer}>
          {trackerHeader}
          <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
            <CardEntrance delay={0}>
              <GlassCard style={styles.upgradeCard}>
                <Crown size={32} color={colors.gold} />
                <Text style={[styles.upgradeTitle, { color: colors.textPrimary }]}>Premium Feature</Text>
                <Text style={[styles.upgradeDesc, { color: colors.textMuted }]}>
                  Tracker analytics require a Premium subscription. See trends,
                  averages, and insights about your baby's patterns.
                </Text>
                <Pressable
                  onPress={() => router.push('/(screens)/upgrade')}
                  style={[styles.upgradeButton, { backgroundColor: colors.copper }]}
                >
                  <Text style={[styles.upgradeButtonText, { color: colors.textPrimary }]}>
                    Upgrade to Premium
                  </Text>
                </Pressable>
              </GlassCard>
            </CardEntrance>
          </View>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {trackerHeader}
          {/* Period toggle */}
          <View style={styles.periodRow}>
            <Pressable
              onPress={() => setPeriod(7)}
              style={[
                styles.periodPill,
                { backgroundColor: colors.subtleBg },
                period === 7 && { backgroundColor: colors.copper },
              ]}
            >
              <Text
                style={[
                  styles.periodPillText,
                  { color: colors.textMuted },
                  period === 7 && { color: colors.textPrimary },
                ]}
              >
                7 Days
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setPeriod(30)}
              style={[
                styles.periodPill,
                { backgroundColor: colors.subtleBg },
                period === 30 && { backgroundColor: colors.copper },
              ]}
            >
              <Text
                style={[
                  styles.periodPillText,
                  { color: colors.textMuted },
                  period === 30 && { color: colors.textPrimary },
                ]}
              >
                30 Days
              </Text>
            </Pressable>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={colors.copper} size="large" />
            </View>
          ) : !stats ? (
            <View style={styles.emptyContainer}>
              <BarChart3 size={40} color={colors.textDim} />
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No tracking data</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
                No tracking data for this period
              </Text>
            </View>
          ) : (
            <>
              {/* Stat cards */}
              <View style={styles.statsRow}>
                <CardEntrance delay={0}>
                  <GlassCard style={styles.statCard}>
                    <View
                      style={[
                        styles.statIconCircle,
                        { backgroundColor: colors.skyDim },
                      ]}
                    >
                      <Milk size={22} color={colors.sky} />
                    </View>
                    <Text style={[styles.statValue, { color: colors.textPrimary }]}>{stats.avgFeedings}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Avg Feedings</Text>
                    <Text style={[styles.statSubtitle, { color: colors.textMuted }]}>per day</Text>
                  </GlassCard>
                </CardEntrance>

                <CardEntrance delay={100}>
                  <GlassCard style={styles.statCard}>
                    <View
                      style={[
                        styles.statIconCircle,
                        { backgroundColor: colors.goldDim },
                      ]}
                    >
                      <Baby size={22} color={colors.gold} />
                    </View>
                    <Text style={[styles.statValue, { color: colors.textPrimary }]}>{stats.avgDiapers}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Avg Diapers</Text>
                    <Text style={[styles.statSubtitle, { color: colors.textMuted }]}>per day</Text>
                  </GlassCard>
                </CardEntrance>

                <CardEntrance delay={200}>
                  <GlassCard style={styles.statCard}>
                    <View
                      style={[
                        styles.statIconCircle,
                        { backgroundColor: colors.roseDim },
                      ]}
                    >
                      <Moon size={22} color={colors.rose} />
                    </View>
                    <Text style={[styles.statValue, { color: colors.textPrimary }]}>{stats.avgSleepHrs}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Avg Sleep</Text>
                    <Text style={[styles.statSubtitle, { color: colors.textMuted }]}>hrs per day</Text>
                  </GlassCard>
                </CardEntrance>
              </View>

              {/* Summary section */}
              <CardEntrance delay={300}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Summary</Text>
                <GlassCard style={styles.summaryCard}>
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Total Logs</Text>
                    <Text style={[styles.summaryValue, { color: colors.textSecondary }]}>{stats.totalLogs}</Text>
                  </View>
                  <View style={[styles.summaryDivider, { backgroundColor: colors.subtleBg }]} />
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Days Tracked</Text>
                    <Text style={[styles.summaryValue, { color: colors.textSecondary }]}>
                      {stats.daysWithData}
                    </Text>
                  </View>
                  <View style={[styles.summaryDivider, { backgroundColor: colors.subtleBg }]} />
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Period</Text>
                    <Text style={[styles.summaryValue, { color: colors.textSecondary }]}>
                      Last {period} days
                    </Text>
                  </View>
                </GlassCard>
              </CardEntrance>
            </>
          )}
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
  },
  headerSpacer: {
    width: 36,
  },

  // Upgrade gate
  upgradeContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  upgradeCard: {
    padding: 32,
    alignItems: 'center',
    gap: 12,
  },
  upgradeTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 22,
    marginTop: 4,
  },
  upgradeDesc: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  upgradeButton: {
    marginTop: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  upgradeButtonText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 15,
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },

  // Period toggle
  periodRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  periodPill: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  periodPillText: {
    fontFamily: 'Karla-Medium',
    fontSize: 14,
  },

  // Loading / Empty
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 20,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    textAlign: 'center',
  },

  // Stat cards
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  statIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
    marginTop: 12,
  },
  statLabel: {
    fontFamily: 'Karla-Medium',
    fontSize: 14,
    marginTop: 8,
  },
  statSubtitle: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    marginTop: 2,
  },

  // Summary
  sectionTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 18,
    marginBottom: 12,
  },
  summaryCard: {
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  summaryDivider: {
    height: 1,
  },
  summaryLabel: {
    fontFamily: 'Karla-Regular',
    fontSize: 14,
  },
  summaryValue: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 14,
  },
})
