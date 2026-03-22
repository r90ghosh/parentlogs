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
import { LinearGradient } from 'expo-linear-gradient'
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

export default function TrackerSummaryScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { profile } = useAuth()
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

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#12100e', '#1a1714', '#12100e']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={20} color="#ede6dc" />
        </Pressable>
        <Text style={styles.headerTitle}>Tracker Summary</Text>
        <View style={styles.headerSpacer} />
      </View>

      {!isPremium ? (
        <View style={styles.upgradeContainer}>
          <CardEntrance delay={0}>
            <GlassCard style={styles.upgradeCard}>
              <Crown size={32} color="#d4a853" />
              <Text style={styles.upgradeTitle}>Premium Feature</Text>
              <Text style={styles.upgradeDesc}>
                Tracker analytics require a Premium subscription. See trends,
                averages, and insights about your baby's patterns.
              </Text>
              <Pressable
                onPress={() => router.push('/(screens)/upgrade')}
                style={styles.upgradeButton}
              >
                <Text style={styles.upgradeButtonText}>
                  Upgrade to Premium
                </Text>
              </Pressable>
            </GlassCard>
          </CardEntrance>
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
          {/* Period toggle */}
          <View style={styles.periodRow}>
            <Pressable
              onPress={() => setPeriod(7)}
              style={[
                styles.periodPill,
                period === 7 && styles.periodPillActive,
              ]}
            >
              <Text
                style={[
                  styles.periodPillText,
                  period === 7 && styles.periodPillTextActive,
                ]}
              >
                7 Days
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setPeriod(30)}
              style={[
                styles.periodPill,
                period === 30 && styles.periodPillActive,
              ]}
            >
              <Text
                style={[
                  styles.periodPillText,
                  period === 30 && styles.periodPillTextActive,
                ]}
              >
                30 Days
              </Text>
            </Pressable>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#c4703f" size="large" />
            </View>
          ) : !stats ? (
            <View style={styles.emptyContainer}>
              <BarChart3 size={40} color="#4a4239" />
              <Text style={styles.emptyTitle}>No tracking data</Text>
              <Text style={styles.emptySubtitle}>
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
                        { backgroundColor: 'rgba(91,155,213,0.15)' },
                      ]}
                    >
                      <Milk size={22} color="#5b9bd5" />
                    </View>
                    <Text style={styles.statValue}>{stats.avgFeedings}</Text>
                    <Text style={styles.statLabel}>Avg Feedings</Text>
                    <Text style={styles.statSubtitle}>per day</Text>
                  </GlassCard>
                </CardEntrance>

                <CardEntrance delay={100}>
                  <GlassCard style={styles.statCard}>
                    <View
                      style={[
                        styles.statIconCircle,
                        { backgroundColor: 'rgba(212,168,83,0.15)' },
                      ]}
                    >
                      <Baby size={22} color="#d4a853" />
                    </View>
                    <Text style={styles.statValue}>{stats.avgDiapers}</Text>
                    <Text style={styles.statLabel}>Avg Diapers</Text>
                    <Text style={styles.statSubtitle}>per day</Text>
                  </GlassCard>
                </CardEntrance>

                <CardEntrance delay={200}>
                  <GlassCard style={styles.statCard}>
                    <View
                      style={[
                        styles.statIconCircle,
                        { backgroundColor: 'rgba(196,122,143,0.15)' },
                      ]}
                    >
                      <Moon size={22} color="#c47a8f" />
                    </View>
                    <Text style={styles.statValue}>{stats.avgSleepHrs}</Text>
                    <Text style={styles.statLabel}>Avg Sleep</Text>
                    <Text style={styles.statSubtitle}>hrs per day</Text>
                  </GlassCard>
                </CardEntrance>
              </View>

              {/* Summary section */}
              <CardEntrance delay={300}>
                <Text style={styles.sectionTitle}>Summary</Text>
                <GlassCard style={styles.summaryCard}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Total Logs</Text>
                    <Text style={styles.summaryValue}>{stats.totalLogs}</Text>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Days Tracked</Text>
                    <Text style={styles.summaryValue}>
                      {stats.daysWithData}
                    </Text>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Period</Text>
                    <Text style={styles.summaryValue}>
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
    backgroundColor: '#12100e',
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
    backgroundColor: 'rgba(237,230,220,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
    color: '#faf6f0',
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
    color: '#faf6f0',
    marginTop: 4,
  },
  upgradeDesc: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    color: '#7a6f62',
    textAlign: 'center',
    lineHeight: 20,
  },
  upgradeButton: {
    marginTop: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    backgroundColor: '#c4703f',
  },
  upgradeButtonText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 15,
    color: '#faf6f0',
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
    backgroundColor: 'rgba(237,230,220,0.06)',
  },
  periodPillActive: {
    backgroundColor: '#c4703f',
  },
  periodPillText: {
    fontFamily: 'Karla-Medium',
    fontSize: 14,
    color: '#7a6f62',
  },
  periodPillTextActive: {
    color: '#faf6f0',
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
    color: '#faf6f0',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: 'Jost-Regular',
    fontSize: 14,
    color: '#7a6f62',
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
    color: '#faf6f0',
    marginTop: 12,
  },
  statLabel: {
    fontFamily: 'Karla-Medium',
    fontSize: 14,
    color: '#ede6dc',
    marginTop: 8,
  },
  statSubtitle: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    color: '#7a6f62',
    marginTop: 2,
  },

  // Summary
  sectionTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 18,
    color: '#faf6f0',
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
    backgroundColor: 'rgba(237,230,220,0.06)',
  },
  summaryLabel: {
    fontFamily: 'Karla-Regular',
    fontSize: 14,
    color: '#7a6f62',
  },
  summaryValue: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 14,
    color: '#ede6dc',
  },
})
