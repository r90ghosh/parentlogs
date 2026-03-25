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
import { usePartnerActivity } from '@/hooks/use-family'
import { CardEntrance } from '@/components/animations'
import {
  MoodCheckinCard,
  BriefingTeaserCard,
  TasksDueCard,
  QuickActionsBar,
  BudgetSnapshotCard,
  PartnerActivityCard,
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
  const { data: subStatus } = useSubscriptionStatus()
  const { data: babies } = useBabies()
  const { data: partnerActivity } = usePartnerActivity()
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
    queryClient.invalidateQueries({ queryKey: ['partner-activity'] })
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
            {/* 1. Mood Check-in */}
            {profile?.role === 'dad' && (
              <CardEntrance delay={80}>
                <MoodCheckinCard todaysCheckin={moodQuery.data} />
              </CardEntrance>
            )}

            {/* 2. Partner Activity */}
            {partnerActivity && (
              <CardEntrance delay={160}>
                <PartnerActivityCard data={partnerActivity} />
              </CardEntrance>
            )}

            {/* 3. Briefing Teaser */}
            <CardEntrance delay={240}>
              <BriefingTeaserCard
                briefing={briefingQuery.data}
                currentWeek={currentWeek}
                stage={family?.stage}
              />
            </CardEntrance>

            {/* 4. Tasks Due */}
            <CardEntrance delay={320}>
              <TasksDueCard tasks={tasksQuery.data} />
            </CardEntrance>

            {/* 5. Quick Actions */}
            <CardEntrance delay={400}>
              <QuickActionsBar />
            </CardEntrance>

            {/* 6. Budget Snapshot */}
            <CardEntrance delay={480}>
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
