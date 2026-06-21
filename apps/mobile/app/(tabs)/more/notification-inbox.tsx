import { useCallback, useMemo } from 'react'
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
  ScrollView,
} from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  X,
  Bell,
  CheckSquare,
  AlertTriangle,
  BookOpen,
  Users,
  Star,
  Rocket,
  PartyPopper,
  Heart,
  MailOpen,
  Info,
  Trash2,
} from 'lucide-react-native'
import { isToday, isYesterday, formatDistanceToNow } from 'date-fns'
import * as Notifications from 'expo-notifications'
import * as Haptics from 'expo-haptics'
import type { Notification, NotificationType } from '@tdc/shared/types'
import { useColors } from '@/hooks/use-colors'
import {
  useNotificationFeed,
  useUnreadNotificationCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
  useDeleteReadNotifications,
} from '@/hooks/use-notifications'

const DELETE_THRESHOLD = 80

const TYPE_ICONS: Record<NotificationType, typeof Bell> = {
  daily_digest: Bell,
  task_reminder: CheckSquare,
  overdue_alert: AlertTriangle,
  weekly_briefing: BookOpen,
  partner_activity: Users,
  milestone: Star,
  onboarding: Rocket,
  celebration: PartyPopper,
  mood_reminder: Heart,
  re_engagement: MailOpen,
  system: Info,
}

interface NotificationGroup {
  label: string
  data: Notification[]
}

function groupNotifications(notifications: Notification[]): NotificationGroup[] {
  const today: Notification[] = []
  const yesterday: Notification[] = []
  const earlier: Notification[] = []

  for (const n of notifications) {
    const date = new Date(n.created_at)
    if (isToday(date)) {
      today.push(n)
    } else if (isYesterday(date)) {
      yesterday.push(n)
    } else {
      earlier.push(n)
    }
  }

  const groups: NotificationGroup[] = []
  if (today.length > 0) groups.push({ label: 'Today', data: today })
  if (yesterday.length > 0) groups.push({ label: 'Yesterday', data: yesterday })
  if (earlier.length > 0) groups.push({ label: 'Earlier', data: earlier })

  return groups
}

function SwipeToDelete({
  onDelete,
  children,
}: {
  onDelete: () => void
  children: React.ReactNode
}) {
  const colors = useColors()
  const translateX = useSharedValue(0)
  const opacity = useSharedValue(1)

  const triggerDelete = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    onDelete()
  }, [onDelete])

  const pan = Gesture.Pan()
    .activeOffsetX([-15, 15])
    .onUpdate((event) => {
      translateX.value = Math.min(0, event.translationX)
    })
    .onEnd((event) => {
      if (event.translationX < -DELETE_THRESHOLD) {
        translateX.value = withTiming(-400, { duration: 200 }, (finished) => {
          if (finished) {
            runOnJS(triggerDelete)()
          }
        })
        opacity.value = withTiming(0, { duration: 200 })
      } else {
        translateX.value = withSpring(0, { damping: 20 })
      }
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }))

  const deleteActionStyle = useAnimatedStyle(() => ({
    opacity: Math.min(-translateX.value / DELETE_THRESHOLD, 1),
  }))

  return (
    <View style={swipeStyles.container}>
      <Animated.View
        style={[swipeStyles.deleteAction, { backgroundColor: colors.coral }, deleteActionStyle]}
      >
        <Trash2 size={18} color="#fff" />
        <Text style={swipeStyles.deleteText}>Delete</Text>
      </Animated.View>
      <GestureDetector gesture={pan}>
        <Animated.View style={animatedStyle}>{children}</Animated.View>
      </GestureDetector>
    </View>
  )
}

const swipeStyles = StyleSheet.create({
  container: { position: 'relative', overflow: 'hidden', borderRadius: 12 },
  deleteAction: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    gap: 8,
    borderRadius: 12,
  },
  deleteText: { fontFamily: 'Jakarta-SemiBold', fontSize: 14, color: '#fff' },
})

function NotificationItem({
  notification,
  onPress,
  onDelete,
}: {
  notification: Notification
  onPress: () => void
  onDelete: () => void
}) {
  const colors = useColors()
  const Icon = TYPE_ICONS[notification.type] ?? Bell
  const isUnread = !notification.is_read

  return (
    <SwipeToDelete onDelete={onDelete}>
      <Pressable
        onPress={onPress}
        style={[
          styles.item,
          { borderColor: colors.line, backgroundColor: colors.card },
          isUnread && { borderLeftWidth: 2, borderLeftColor: colors.accent },
        ]}
      >
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: isUnread ? colors.accentSoft : colors.line },
          ]}
        >
          <Icon size={16} color={isUnread ? colors.accent : colors.muted} />
        </View>
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <Text
              style={[
                styles.itemTitle,
                { color: isUnread ? colors.ink : colors.ink2 },
                isUnread && { fontFamily: 'Jakarta-SemiBold' },
              ]}
              numberOfLines={1}
            >
              {notification.title}
            </Text>
            {isUnread && <View style={[styles.unreadDot, { backgroundColor: colors.accent }]} />}
          </View>
          <Text style={[styles.itemBody, { color: colors.ink2 }]} numberOfLines={1}>
            {notification.body}
          </Text>
          <Text style={[styles.itemTime, { color: colors.muted }]}>
            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
          </Text>
        </View>
      </Pressable>
    </SwipeToDelete>
  )
}

export default function NotificationInboxScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const colors = useColors()
  const { data: notifications, isLoading, isError, refetch, isRefetching } = useNotificationFeed()
  const { data: unreadCount } = useUnreadNotificationCount()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()
  const deleteNotification = useDeleteNotification()
  const deleteReadNotifications = useDeleteReadNotifications()

  const groups = useMemo(
    () => groupNotifications(notifications ?? []),
    [notifications]
  )

  const hasUnread = (unreadCount ?? 0) > 0
  const hasRead = (notifications ?? []).some((n) => n.is_read)

  const handleClearRead = useCallback(() => {
    Alert.alert(
      'Clear Read Notifications?',
      'All read notifications will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
            deleteReadNotifications.mutate()
          },
        },
      ]
    )
  }, [deleteReadNotifications])

  const handlePress = useCallback(
    (notification: Notification) => {
      if (!notification.is_read) {
        markRead.mutate(notification.id)
      }
      if (notification.url?.startsWith('/')) {
        router.replace(notification.url as never)
      }
    },
    [markRead, router]
  )

  const handleDelete = useCallback(
    (id: string) => {
      deleteNotification.mutate(id)
    },
    [deleteNotification]
  )

  const handleMarkAllRead = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    markAllRead.mutate(undefined, {
      onSuccess: () => {
        Notifications.setBadgeCountAsync(0)
      },
    })
  }, [markAllRead])

  const inboxHeader = (
    <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: colors.line }]}>
      <Text style={[styles.headerTitle, { color: colors.ink }]}>Notifications</Text>
      <View style={styles.headerRight}>
        {hasRead && (
          <Pressable
            onPress={handleClearRead}
            style={[styles.clearReadButton, { backgroundColor: colors.card, borderColor: colors.line }]}
            disabled={deleteReadNotifications.isPending}
          >
            <Trash2 size={13} color={colors.muted} />
            <Text style={[styles.clearReadText, { color: colors.muted }]}>Clear read</Text>
          </Pressable>
        )}
        {hasUnread && (
          <Pressable
            onPress={handleMarkAllRead}
            style={[styles.markAllButton, { backgroundColor: colors.accentSoft }]}
            disabled={markAllRead.isPending}
          >
            <Text style={[styles.markAllText, { color: colors.accentInk }]}>Mark all read</Text>
          </Pressable>
        )}
        <Pressable
          onPress={() => router.back()}
          style={[styles.closeButton, { backgroundColor: colors.card, borderColor: colors.line }]}
        >
          <X size={20} color={colors.muted} />
        </Pressable>
      </View>
    </View>
  )

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: 'transparent' }]}>
        {inboxHeader}
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.accent} size="large" />
        </View>
      </View>
    )
  }

  if (isError) {
    return (
      <View style={[styles.container, { backgroundColor: 'transparent' }]}>
        {inboxHeader}
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIcon, { backgroundColor: colors.coralDim }]}>
            <AlertTriangle size={28} color={colors.coral} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.ink }]}>Something went wrong</Text>
          <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
            We couldn't load your notifications.
          </Text>
          <Pressable
            onPress={() => refetch()}
            style={[styles.markAllButton, { backgroundColor: colors.accentSoft, marginTop: 8 }]}
          >
            <Text style={[styles.markAllText, { color: colors.accentInk }]}>Try again</Text>
          </Pressable>
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      {groups.length === 0 ? (
        <>
          {inboxHeader}
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.card, borderColor: colors.line, borderWidth: 1 }]}>
              <Bell size={28} color={colors.muted} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.ink }]}>No notifications yet</Text>
            <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
              When you receive notifications, they will appear here.
            </Text>
          </View>
        </>
      ) : (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={colors.accent}
            />
          }
        >
          {inboxHeader}
          {groups.map((group) => (
            <View key={group.label}>
              <Text style={[styles.sectionLabel, { color: colors.faint }]}>{group.label}</Text>
              <View style={styles.sectionList}>
                {group.data.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onPress={() => handlePress(notification)}
                    onDelete={() => handleDelete(notification.id)}
                  />
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: { fontFamily: 'Jakarta-Bold', fontSize: 20, letterSpacing: -0.4 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  clearReadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  clearReadText: { fontFamily: 'Jakarta-Medium', fontSize: 12 },
  markAllButton: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  markAllText: { fontFamily: 'Jakarta-Medium', fontSize: 12 },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Scroll
  scrollContent: { paddingHorizontal: 20, paddingTop: 8 },

  // Section
  sectionLabel: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    marginBottom: 8,
    marginTop: 18,
  },
  sectionList: { gap: 8, marginBottom: 8 },

  // Item
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  itemContent: { flex: 1, gap: 2 },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  itemTitle: { fontFamily: 'Jakarta-Regular', fontSize: 14, flex: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  itemBody: { fontFamily: 'Jakarta-Regular', fontSize: 13, lineHeight: 18 },
  itemTime: { fontFamily: 'Jakarta-Medium', fontSize: 11, marginTop: 4 },

  // Empty / Loading
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 10,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyTitle: { fontFamily: 'Jakarta-Bold', fontSize: 18, textAlign: 'center' },
  emptySubtitle: { fontFamily: 'Jakarta-Regular', fontSize: 14, textAlign: 'center', lineHeight: 21 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
})
