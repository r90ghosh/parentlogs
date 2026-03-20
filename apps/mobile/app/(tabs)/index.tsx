import { useCallback } from 'react'
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/components/providers/AuthProvider'
import { useDashboardData } from '@/hooks/use-dashboard'
import { CardEntrance } from '@/components/animations'
import {
  MoodCheckinCard,
  BriefingTeaserCard,
  TasksDueCard,
  QuickActionsBar,
  BudgetSnapshotCard,
} from '@/components/dashboard'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function getFirstName(fullName: string | null): string {
  if (!fullName) return 'there'
  return fullName.split(' ')[0]
}

export default function DashboardScreen() {
  const insets = useSafeAreaInsets()
  const queryClient = useQueryClient()
  const { profile, family } = useAuth()
  const { tasksQuery, briefingQuery, moodQuery } = useDashboardData()

  const isLoading = tasksQuery.isLoading && briefingQuery.isLoading
  const isRefreshing =
    tasksQuery.isRefetching || briefingQuery.isRefetching || moodQuery.isRefetching

  const onRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['tasks-due'] })
    queryClient.invalidateQueries({ queryKey: ['current-briefing'] })
    queryClient.invalidateQueries({ queryKey: ['mood-today'] })
  }, [queryClient])

  // Derive current week from family (or baby via profile)
  const currentWeek = (family as { current_week?: number })?.current_week ?? 1

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#12100e', '#1a1714', '#12100e']}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#c4703f"
            colors={['#c4703f']}
          />
        }
      >
        {/* Greeting header */}
        <CardEntrance delay={0}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>
              {getGreeting()}, {getFirstName(profile?.full_name ?? null)}
            </Text>
            <View style={styles.weekBadge}>
              <Text style={styles.weekBadgeText}>Week {currentWeek}</Text>
            </View>
          </View>
        </CardEntrance>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#c4703f" />
          </View>
        ) : (
          <View style={styles.cardsContainer}>
            {/* 1. Mood Check-in */}
            {profile?.role === 'dad' && (
              <CardEntrance delay={80}>
                <MoodCheckinCard todaysCheckin={moodQuery.data} />
              </CardEntrance>
            )}

            {/* 2. Briefing Teaser */}
            <CardEntrance delay={160}>
              <BriefingTeaserCard
                briefing={briefingQuery.data}
                currentWeek={currentWeek}
                stage={family?.stage}
              />
            </CardEntrance>

            {/* 3. Tasks Due */}
            <CardEntrance delay={240}>
              <TasksDueCard tasks={tasksQuery.data} />
            </CardEntrance>

            {/* 4. Quick Actions */}
            <CardEntrance delay={320}>
              <QuickActionsBar />
            </CardEntrance>

            {/* 5. Budget Snapshot */}
            <CardEntrance delay={400}>
              <BudgetSnapshotCard />
            </CardEntrance>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12100e',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  greeting: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 24,
    color: '#faf6f0',
    flex: 1,
  },
  weekBadge: {
    backgroundColor: 'rgba(196,112,63,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(196,112,63,0.3)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  weekBadgeText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 12,
    color: '#c4703f',
  },
  loadingContainer: {
    paddingTop: 80,
    alignItems: 'center',
  },
  cardsContainer: {
    gap: 16,
  },
})
