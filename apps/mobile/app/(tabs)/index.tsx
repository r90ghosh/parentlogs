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
import { useQueryClient } from '@tanstack/react-query'
import { AlertTriangle, ChevronRight } from 'lucide-react-native'
import { useAuth } from '@/components/providers/AuthProvider'
import { useColors } from '@/hooks/use-colors'
import { useWelcomeAnimation } from '@/hooks/use-welcome-animation'
import { useDashboardData } from '@/hooks/use-dashboard'
import { useSubscriptionStatus } from '@/hooks/use-subscription'
import { useBabies } from '@/hooks/use-babies'
import { useReducedMotion } from 'react-native-reanimated'
import { CardEntrance } from '@/components/animations'
import {
  BriefingTeaserCard,
  TasksDueCard,
  QuickActionsBar,
  BudgetSnapshotCard,
  ChecklistProgressCard,
  OnYourMindCard,
  UpgradePromptCard,
  WelcomeCatchUpCard,
} from '@/components/dashboard'
import { WelcomeCelebration } from '@/components/welcome/WelcomeCelebration'
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
  const colors = useColors()
  const insets = useSafeAreaInsets()
  const queryClient = useQueryClient()
  const { profile, family } = useAuth()
  const { isVisible: showWelcome, dismiss: dismissWelcome } = useWelcomeAnimation()
  const { tasksQuery, briefingQuery } = useDashboardData()
  const { data: subStatus } = useSubscriptionStatus()
  const { data: babies } = useBabies()
  const { data: backlogCount } = useBacklogCount()
  useReducedMotion() // touch the hook for consistency with Reanimated reactive context
  const isPastDue = subStatus?.status === 'past_due'

  const isLoading = tasksQuery.isLoading && briefingQuery.isLoading
  const isRefreshing =
    tasksQuery.isRefetching || briefingQuery.isRefetching

  // If the primary queries were already cached before this screen mounted,
  // skip entrance animations — warm cache means "already here."
  const tasksKey = family?.id ? ['tasks-due', family.id] : null
  const briefingKey = family?.id ? ['current-briefing', family.id] : null
  const warmOnMount =
    !!tasksKey &&
    !!briefingKey &&
    queryClient.getQueryState(tasksKey)?.status === 'success' &&
    queryClient.getQueryState(briefingKey)?.status === 'success'

  const onRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['tasks-due'] })
    queryClient.invalidateQueries({ queryKey: ['current-briefing'] })
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
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
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
            tintColor={colors.copper}
            colors={[colors.copper]}
          />
        }
      >
        {/* Greeting header */}
        <CardEntrance delay={0} skipEnter={warmOnMount}>
          <View style={styles.greetingContainer}>
            <Text style={[styles.greeting, { color: colors.textPrimary }]}>
              {getGreeting()}, {getFirstName(profile?.full_name ?? null)}
            </Text>
          </View>
        </CardEntrance>

        {/* Payment Failed Banner */}
        {isPastDue && (
          <CardEntrance delay={30} skipEnter={warmOnMount}>
            <Pressable
              onPress={() => {
                const url = Platform.OS === 'ios'
                  ? 'https://apps.apple.com/account/subscriptions'
                  : 'https://play.google.com/store/account/subscriptions'
                Linking.openURL(url)
              }}
              style={[styles.pastDueBanner, { backgroundColor: colors.coralDim, borderColor: 'rgba(212,131,107,0.2)' }]}
            >
              <AlertTriangle size={16} color={colors.coral} />
              <View style={styles.pastDueBannerContent}>
                <Text style={[styles.pastDueTitle, { color: colors.coral }]}>Payment failed</Text>
                <Text style={styles.pastDueDesc}>
                  Update your payment method to keep premium access.
                </Text>
              </View>
              <ChevronRight size={14} color={colors.coral} />
            </Pressable>
          </CardEntrance>
        )}

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.copper} />
          </View>
        ) : (
          <View style={styles.cardsContainer}>
            {/* 1. Briefing Teaser */}
            <CardEntrance delay={30} skipEnter={warmOnMount}>
              <BriefingTeaserCard
                briefing={briefingQuery.data}
                currentWeek={currentWeek}
                stage={family?.stage}
              />
            </CardEntrance>

            {/* 2. Tasks Due */}
            <CardEntrance delay={60} skipEnter={warmOnMount}>
              <TasksDueCard tasks={tasksQuery.data} />
            </CardEntrance>

            {/* 3. Welcome Catch-Up (if backlog > 0) */}
            {(backlogCount ?? 0) > 0 && (
              <CardEntrance delay={90} skipEnter={warmOnMount}>
                <WelcomeCatchUpCard />
              </CardEntrance>
            )}

            {/* 4. On Your Mind (dad only) */}
            {profile?.role === 'dad' && (
              <CardEntrance delay={120} skipEnter={warmOnMount}>
                <OnYourMindCard />
              </CardEntrance>
            )}

            {/* 5. Quick Actions */}
            <CardEntrance delay={150} skipEnter={warmOnMount}>
              <QuickActionsBar />
            </CardEntrance>

            {/* 6. Budget Snapshot */}
            <CardEntrance delay={180} skipEnter={warmOnMount}>
              <BudgetSnapshotCard />
            </CardEntrance>

            {/* 7. Checklist Progress */}
            <CardEntrance delay={200} skipEnter={warmOnMount}>
              <ChecklistProgressCard />
            </CardEntrance>

            {/* 8. Upgrade Prompt (free tier only) */}
            <CardEntrance delay={220} skipEnter={warmOnMount}>
              <UpgradePromptCard />
            </CardEntrance>
          </View>
        )}
      </ScrollView>

      {showWelcome && <WelcomeCelebration onDismiss={dismissWelcome} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderWidth: 1,
  },
  pastDueBannerContent: {
    flex: 1,
  },
  pastDueTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 13,
  },
  pastDueDesc: {
    fontFamily: 'Karla-Regular',
    fontSize: 12,
    color: 'rgba(212,131,107,0.7)',
    marginTop: 2,
  },
})
