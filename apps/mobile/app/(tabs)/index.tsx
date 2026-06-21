import { useCallback, useMemo } from 'react'
import { View, Text, ScrollView, RefreshControl, StyleSheet, Pressable, Linking, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useQueryClient } from '@tanstack/react-query'
import { ChevronRight, ArrowRight, AlertTriangle, Wallet, ClipboardList, Activity, BookOpen } from 'lucide-react-native'
import { useAuth } from '@/components/providers/AuthProvider'
import { useColors } from '@/hooks/use-colors'
import { useDashboardData } from '@/hooks/use-dashboard'
import { useSubscriptionStatus } from '@/hooks/use-subscription'
import { useBabies } from '@/hooks/use-babies'
import { useBacklogCount } from '@/hooks/use-triage'
import { useArticles } from '@/hooks/use-content'
import { useBudgetSummary } from '@/hooks/use-budget'
import { useChecklists } from '@/hooks/use-checklists'
import { useRecentLogs } from '@/hooks/use-tracker'
import { useCompleteTask, useSnoozeTask } from '@/hooks/use-tasks'
import { TaskRow } from '@/components/tasks'
import { SectionLabel } from '@/components/digest'
import { DashboardSkeleton } from '@/components/skeletons'
import { isPregnancyStage } from '@tdc/shared/utils/pregnancy-utils'
import { getBabySize, formatLength, formatWeight } from '@tdc/shared/utils/baby-sizes'
import { firstSentence } from '@/lib/text'
import type { FamilyStage, FamilyTask } from '@tdc/shared/types'
import { isToday } from 'date-fns'

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}
function firstName(full: string | null | undefined): string {
  if (!full) return 'there'
  return full.split(' ')[0]
}
function trimesterLabel(week: number): string {
  if (week <= 13) return 'First trimester'
  if (week <= 27) return 'Second trimester'
  return 'Third trimester'
}
function babyAge(week: number): string {
  if (week < 9) return `${week} week${week === 1 ? '' : 's'} old`
  const m = Math.round(week / 4.345)
  return `${m} month${m === 1 ? '' : 's'} old`
}

export default function DashboardScreen() {
  const colors = useColors()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { profile, family } = useAuth()
  const { tasksQuery, briefingQuery } = useDashboardData()
  const { data: subStatus } = useSubscriptionStatus()
  const { data: babies } = useBabies()
  const { data: backlogCount } = useBacklogCount()
  const completeTask = useCompleteTask()
  const snoozeTask = useSnoozeTask()

  const stage = (family?.stage ?? 'first-trimester') as FamilyStage
  const isPregnancy = isPregnancyStage(stage)
  const activeBaby = babies?.find((b) => b.id === profile?.active_baby_id) ?? babies?.[0]
  const currentWeek = activeBaby?.current_week ?? (family as { current_week?: number })?.current_week ?? 1
  const role = profile?.role ?? 'dad'
  const tier = profile?.subscription_tier ?? 'free'
  const isFree = tier === 'free'
  const isPastDue = subStatus?.status === 'past_due'

  const { data: articles } = useArticles(stage)
  const { data: budget } = useBudgetSummary()
  const { data: checklists } = useChecklists()
  const { data: recentLogs } = useRecentLogs()

  const briefing = briefingQuery.data
  const babySize = isPregnancy ? getBabySize(currentWeek) : undefined

  const isLoading = tasksQuery.isLoading && briefingQuery.isLoading
  const isRefreshing = tasksQuery.isRefetching || briefingQuery.isRefetching

  const onRefresh = useCallback(() => {
    ;['tasks-due', 'current-briefing', 'subscription-status', 'babies', 'backlog-count', 'checklists', 'articles', 'budget-summary', 'recent-logs'].forEach((k) =>
      queryClient.invalidateQueries({ queryKey: [k] })
    )
  }, [queryClient])

  const handleComplete = useCallback((id: string) => completeTask.mutate(id), [completeTask])
  const handleSnooze = useCallback((id: string) => snoozeTask.mutate({ id }), [snoozeTask])

  // Today's pending tasks (top 2)
  const todayTasks = useMemo(() => {
    const list = (tasksQuery.data ?? []) as FamilyTask[]
    return list.filter((t) => t.status === 'pending' && isToday(new Date(t.due_date))).slice(0, 2)
  }, [tasksQuery.data])

  // Recommended read — first free-or-accessible article
  const recommended = articles?.[0]

  // Budget tile data (summary is loosely typed)
  const budgetStat = useMemo(() => {
    const items = (budget as { familyItems?: { is_purchased?: boolean }[] } | null | undefined)?.familyItems ?? []
    if (!items.length) return null
    const bought = items.filter((i) => i.is_purchased).length
    return `${bought} of ${items.length} bought`
  }, [budget])

  // Checklist tile (pregnancy) — most-complete unlocked list
  const checklistStat = useMemo(() => {
    const list = (checklists ?? []).filter((c) => !c.is_locked)
    if (!list.length) return null
    const c = list[0]
    return { name: c.name, value: `${c.progress.completed} of ${c.progress.total} done` }
  }, [checklists])

  // Tracker tile (post-birth) — today's log count
  const trackerStat = useMemo(() => {
    const logs = recentLogs ?? []
    const today = logs.filter((l) => isToday(new Date(l.logged_at))).length
    return today > 0 ? `${today} logged today` : 'Log a feed'
  }, [recentLogs])

  const greetingContext = isPregnancy
    ? `${trimesterLabel(currentWeek)} · Week ${currentWeek}`
    : `${activeBaby?.baby_name ? activeBaby.baby_name + ' · ' : ''}${babyAge(currentWeek)}`

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
      >
        {/* Greeting */}
        <View style={styles.greetWrap}>
          <Text style={[styles.greeting, { color: colors.ink }]}>
            {getGreeting()}, {firstName(profile?.full_name)}
          </Text>
          <Text style={[styles.greetSub, { color: colors.muted }]}>{greetingContext}</Text>
        </View>

        {/* Past-due banner */}
        {isPastDue && (
          <Pressable
            onPress={() => Linking.openURL(Platform.OS === 'ios' ? 'https://apps.apple.com/account/subscriptions' : 'https://play.google.com/store/account/subscriptions')}
            style={[styles.banner, { backgroundColor: colors.coralDim, borderColor: colors.coral }]}
          >
            <AlertTriangle size={16} color={colors.coral} />
            <Text style={[styles.bannerText, { color: colors.coral }]}>Payment failed — update your payment method.</Text>
            <ChevronRight size={14} color={colors.coral} />
          </Pressable>
        )}

        {isLoading ? (
          <DashboardSkeleton />
        ) : (
          <>
            {/* Hero — this week's briefing */}
            <Pressable
              onPress={() => router.push('/(tabs)/briefing')}
              style={({ pressed }) => [styles.hero, { backgroundColor: colors.card, borderColor: colors.line, opacity: pressed ? 0.85 : 1 }]}
            >
              <Text style={[styles.heroEyebrow, { color: colors.accentInk }]}>THIS WEEK · BRIEFING</Text>
              <Text style={[styles.heroTitle, { color: colors.ink }]}>{briefing?.title ?? `Week ${currentWeek}`}</Text>
              <Text style={[styles.heroLine, { color: colors.ink2 }]} numberOfLines={2}>
                {briefing ? firstSentence(briefing.baby_update) : 'Your week-by-week guide to what matters now.'}
              </Text>
              {babySize && (
                <Text style={[styles.heroBaby, { color: colors.muted }]}>
                  {babySize.emoji} Size of a {babySize.fruit} · {formatLength(babySize)} · {formatWeight(babySize)}
                </Text>
              )}
              <View style={styles.heroCta}>
                <Text style={[styles.heroCtaText, { color: colors.accentInk }]}>Open briefing</Text>
                <ArrowRight size={15} color={colors.accentInk} strokeWidth={2} />
              </View>
            </Pressable>

            {/* Today */}
            {todayTasks.length > 0 && (
              <View style={styles.section}>
                <View style={styles.secHead}>
                  <SectionLabel style={styles.secHeadLabel}>{`Today · ${todayTasks.length}`}</SectionLabel>
                  <Pressable onPress={() => router.push('/(tabs)/tasks')} hitSlop={8}>
                    <Text style={[styles.viewAll, { color: colors.accentInk }]}>View all</Text>
                  </Pressable>
                </View>
                {todayTasks.map((t) => (
                  <TaskRow key={t.id} task={t} onComplete={handleComplete} onSnooze={handleSnooze} />
                ))}
              </View>
            )}

            {/* Catch-up — one calm amber line */}
            {(backlogCount ?? 0) > 0 && (
              <Pressable
                onPress={() => router.push('/(tabs)/more/triage')}
                style={({ pressed }) => [styles.catchup, { borderColor: colors.line, opacity: pressed ? 0.8 : 1 }]}
              >
                <View style={[styles.dot, { backgroundColor: colors.gold }]} />
                <Text style={[styles.catchupText, { color: colors.gold }]}>
                  {backlogCount} {backlogCount === 1 ? 'item' : 'items'} to catch up on
                </Text>
                <ChevronRight size={16} color={colors.gold} />
              </Pressable>
            )}

            {/* Recommended read */}
            {recommended && (
              <Pressable
                onPress={() => router.push({ pathname: '/(tabs)/more/article', params: { id: recommended.id } })}
                style={({ pressed }) => [styles.read, { backgroundColor: colors.card, borderColor: colors.line, opacity: pressed ? 0.85 : 1 }]}
              >
                <View style={styles.readHead}>
                  <BookOpen size={14} color={colors.muted} />
                  <Text style={[styles.readEyebrow, { color: colors.muted }]}>Recommended read</Text>
                  {!recommended.is_free && (
                    <View style={[styles.premium, { backgroundColor: colors.accentSoft }]}>
                      <Text style={[styles.premiumText, { color: colors.accentInk }]}>Premium</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.readTitle, { color: colors.ink }]} numberOfLines={2}>
                  {recommended.title}
                </Text>
                {!!recommended.excerpt && (
                  <Text style={[styles.readExcerpt, { color: colors.ink2 }]} numberOfLines={2}>
                    {recommended.excerpt}
                  </Text>
                )}
              </Pressable>
            )}

            {/* Progress duo */}
            <View style={styles.section}>
              <SectionLabel>Progress</SectionLabel>
              <ProgressRow
                icon={<Wallet size={18} color={colors.dotTip} />}
                label="Budget"
                value={budgetStat ?? 'Start your budget'}
                onPress={() => router.push('/(tabs)/more/budget')}
                colors={colors}
              />
              {isPregnancy ? (
                <ProgressRow
                  icon={<ClipboardList size={18} color={colors.dotNext} />}
                  label={checklistStat?.name ?? 'Checklists'}
                  value={checklistStat?.value ?? 'Open checklists'}
                  onPress={() => router.push('/(tabs)/more/checklists')}
                  colors={colors}
                />
              ) : (
                <ProgressRow
                  icon={<Activity size={18} color={colors.dotBaby} />}
                  label="Tracker"
                  value={trackerStat}
                  onPress={() => router.push('/(tabs)/tracker')}
                  colors={colors}
                />
              )}
            </View>

            {/* Upgrade — free tier only, quiet, last */}
            {isFree && (
              <Pressable
                onPress={() => router.push('/(screens)/upgrade')}
                style={({ pressed }) => [styles.upgrade, { backgroundColor: colors.accentSoft, opacity: pressed ? 0.85 : 1 }]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.upgradeTitle, { color: colors.accentInk }]}>Unlock everything</Text>
                  <Text style={[styles.upgradeSub, { color: colors.ink2 }]}>One subscription for the whole family · from $3.33/mo</Text>
                </View>
                <ArrowRight size={18} color={colors.accentInk} strokeWidth={2} />
              </Pressable>
            )}
          </>
        )}
      </ScrollView>
    </View>
  )
}

function ProgressRow({
  icon,
  label,
  value,
  onPress,
  colors,
}: {
  icon: React.ReactNode
  label: string
  value: string
  onPress: () => void
  colors: ReturnType<typeof useColors>
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.progRow, { borderBottomColor: colors.line2, backgroundColor: pressed ? colors.cardHover : 'transparent' }]}
    >
      {icon}
      <Text style={[styles.progLabel, { color: colors.ink }]} numberOfLines={1}>
        {label}
      </Text>
      <Text style={[styles.progValue, { color: colors.muted }]} numberOfLines={1}>
        {value}
      </Text>
      <ChevronRight size={16} color={colors.faint} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingTop: 12 },
  greetWrap: { paddingHorizontal: 22, paddingBottom: 6 },
  greeting: { fontFamily: 'Jakarta-ExtraBold', fontSize: 25, letterSpacing: -0.5 },
  greetSub: { fontFamily: 'Jakarta-Medium', fontSize: 14, marginTop: 5 },
  banner: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 20, marginTop: 12, padding: 13, borderRadius: 14, borderWidth: 1 },
  bannerText: { flex: 1, fontFamily: 'Jakarta-SemiBold', fontSize: 13 },
  hero: { marginHorizontal: 20, marginTop: 14, padding: 20, borderRadius: 18, borderWidth: 1, borderLeftWidth: 3, borderLeftColor: '#d2814e' },
  heroEyebrow: { fontFamily: 'Jakarta-ExtraBold', fontSize: 10.5, letterSpacing: 1.6 },
  heroTitle: { fontFamily: 'Jakarta-Bold', fontSize: 20, lineHeight: 26, marginTop: 9, letterSpacing: -0.3 },
  heroLine: { fontFamily: 'Jakarta-Regular', fontSize: 14.5, lineHeight: 21, marginTop: 7 },
  heroBaby: { fontFamily: 'Jakarta-Medium', fontSize: 13, marginTop: 11 },
  heroCta: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 14 },
  heroCtaText: { fontFamily: 'Jakarta-Bold', fontSize: 14 },
  section: { marginTop: 10 },
  secHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 22 },
  secHeadLabel: { paddingBottom: 4 },
  viewAll: { fontFamily: 'Jakarta-Bold', fontSize: 13 },
  catchup: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 20, marginTop: 14, padding: 14, borderRadius: 14, borderWidth: 1 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  catchupText: { flex: 1, fontFamily: 'Jakarta-Bold', fontSize: 13.5 },
  read: { marginHorizontal: 20, marginTop: 14, padding: 17, borderRadius: 16, borderWidth: 1 },
  readHead: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  readEyebrow: { fontFamily: 'Jakarta-Bold', fontSize: 11, letterSpacing: 0.6, textTransform: 'uppercase', flex: 1 },
  premium: { borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  premiumText: { fontFamily: 'Jakarta-Bold', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  readTitle: { fontFamily: 'Jakarta-Bold', fontSize: 16.5, lineHeight: 22, marginTop: 10, letterSpacing: -0.2 },
  readExcerpt: { fontFamily: 'Jakarta-Regular', fontSize: 14, lineHeight: 20, marginTop: 6 },
  progRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 15, paddingHorizontal: 22, borderBottomWidth: 1 },
  progLabel: { fontFamily: 'Jakarta-SemiBold', fontSize: 15, flexShrink: 0 },
  progValue: { fontFamily: 'Jakarta-Medium', fontSize: 13, marginLeft: 'auto', flexShrink: 1, textAlign: 'right' },
  upgrade: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 20, marginTop: 18, padding: 17, borderRadius: 16 },
  upgradeTitle: { fontFamily: 'Jakarta-Bold', fontSize: 15.5 },
  upgradeSub: { fontFamily: 'Jakarta-Medium', fontSize: 12.5, marginTop: 3 },
})
