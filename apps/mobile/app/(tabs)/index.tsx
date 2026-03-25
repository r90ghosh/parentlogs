import { useCallback } from 'react'
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Linking,
  Platform,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { useQueryClient } from '@tanstack/react-query'
import { AlertTriangle, ChevronRight } from 'lucide-react-native'
import { useAuth } from '@/components/providers/AuthProvider'
import { useDashboardData } from '@/hooks/use-dashboard'
import { useSubscriptionStatus } from '@/hooks/use-subscription'
import { useBabies } from '@/hooks/use-babies'
import { CardEntrance } from '@/components/animations'
import {
  MoodCheckinCard,
  BriefingTeaserCard,
  TasksDueCard,
  QuickActionsBar,
  BudgetSnapshotCard,
  ChecklistProgressCard,
  OnYourMindCard,
  PersonalizeCard,
  UpgradePromptCard,
  WelcomeCatchUpCard,
} from '@/components/dashboard'
import { useBacklogCount } from '@/hooks/use-triage'

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
  const { data: subStatus } = useSubscriptionStatus()
  const { data: babies } = useBabies()
  const { data: backlogCount } = useBacklogCount()
  const isPastDue = subStatus?.status === 'past_due'

  const isLoading = tasksQuery.isLoading && briefingQuery.isLoading
  const isRefreshing =
    tasksQuery.isRefetching || briefingQuery.isRefetching || moodQuery.isRefetching

  const onRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['tasks-due'] })
    queryClient.invalidateQueries({ queryKey: ['current-briefing'] })
    queryClient.invalidateQueries({ queryKey: ['mood-today'] })
    queryClient.invalidateQueries({ queryKey: ['subscription-status'] })
    queryClient.invalidateQueries({ queryKey: ['babies'] })
    queryClient.invalidateQueries({ queryKey: ['backlog-count'] })
    queryClient.invalidateQueries({ queryKey: ['checklists'] })
    queryClient.invalidateQueries({ queryKey: ['dad-profile'] })
    queryClient.invalidateQueries({ queryKey: ['dad-challenge-content'] })
  }, [queryClient])

  // Use active baby's current_week if available, fallback to family
  const activeBaby = babies?.find((b) => b.id === profile?.active_baby_id) ?? babies?.[0]
  const currentWeek = activeBaby?.current_week ?? (family as { current_week?: number })?.current_week ?? 1

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
            paddingTop: 16,
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
          </View>
        </CardEntrance>

        {/* Payment Failed Banner */}
        {isPastDue && (
          <CardEntrance delay={40}>
            <Pressable
              onPress={() => {
                const url = Platform.OS === 'ios'
                  ? 'https://apps.apple.com/account/subscriptions'
                  : 'https://play.google.com/store/account/subscriptions'
                Linking.openURL(url)
              }}
              style={styles.pastDueBanner}
            >
              <AlertTriangle size={16} color="#d4836b" />
              <View style={styles.pastDueBannerContent}>
                <Text style={styles.pastDueTitle}>Payment failed</Text>
                <Text style={styles.pastDueDesc}>
                  Update your payment method to keep premium access.
                </Text>
              </View>
              <ChevronRight size={14} color="#d4836b" />
            </Pressable>
          </CardEntrance>
        )}

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#c4703f" />
          </View>
        ) : (
          <View style={styles.cardsContainer}>
            {/* 1. Mood Check-in (dad only) */}
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

            {/* 4. Welcome Catch-Up (if backlog > 0) */}
            {(backlogCount ?? 0) > 0 && (
              <CardEntrance delay={320}>
                <WelcomeCatchUpCard />
              </CardEntrance>
            )}

            {/* 5. On Your Mind (dad only) */}
            {profile?.role === 'dad' && (
              <CardEntrance delay={400}>
                <OnYourMindCard />
              </CardEntrance>
            )}

            {/* 6. Quick Actions */}
            <CardEntrance delay={480}>
              <QuickActionsBar />
            </CardEntrance>

            {/* 7. Personalize Card (dad only, if no profile) */}
            {profile?.role === 'dad' && (
              <CardEntrance delay={560}>
                <PersonalizeCard />
              </CardEntrance>
            )}

            {/* 8. Budget Snapshot */}
            <CardEntrance delay={640}>
              <BudgetSnapshotCard />
            </CardEntrance>

            {/* 9. Checklist Progress */}
            <CardEntrance delay={720}>
              <ChecklistProgressCard />
            </CardEntrance>

            {/* 10. Upgrade Prompt (free tier only) */}
            <CardEntrance delay={800}>
              <UpgradePromptCard />
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
    marginBottom: 24,
  },
  greeting: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 24,
    color: '#faf6f0',
  },
  loadingContainer: {
    paddingTop: 80,
    alignItems: 'center',
  },
  cardsContainer: {
    gap: 16,
  },
  pastDueBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(212,131,107,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212,131,107,0.2)',
  },
  pastDueBannerContent: {
    flex: 1,
  },
  pastDueTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 13,
    color: '#d4836b',
  },
  pastDueDesc: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    color: 'rgba(212,131,107,0.7)',
    marginTop: 2,
  },
})
