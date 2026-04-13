import { useCallback, useMemo } from 'react'
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  FadeInDown,
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
      // Only allow swipe left (negative direction)
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
        <Trash2 size={18} color={colors.textPrimary} />
        <Text style={[swipeStyles.deleteText, { color: colors.textPrimary }]}>Delete</Text>
      </Animated.View>
      <GestureDetector gesture={pan}>
        <Animated.View style={animatedStyle}>{children}</Animated.View>
      </GestureDetector>
    </View>
  )
}

const swipeStyles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 12,
  },
  deleteAction: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    gap: 8,
    borderRadius: 12,
  },
  deleteText: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 14,
  },
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
          { borderColor: colors.border },
          isUnread
            ? { backgroundColor: colors.card, borderLeftWidth: 2, borderLeftColor: colors.copper }
            : { backgroundColor: colors.surface },
        ]}
      >
        <View
          style={[
            styles.iconCircle,
            isUnread
              ? { backgroundColor: colors.copperDim }
              : { backgroundColor: 'rgba(74,66,57,0.3)' },
          ]}
        >
          <Icon size={16} color={isUnread ? colors.copper : colors.textDim} />
        </View>
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <Text
              style={[
                styles.itemTitle,
                { color: colors.textSecondary },
                isUnread && { fontFamily: 'Karla-SemiBold', color: colors.textPrimary },
              ]}
              numberOfLines={1}
            >
              {notification.title}
            </Text>
            {isUnread && <View style={[styles.unreadDot, { backgroundColor: colors.copper }]} />}
          </View>
          <Text style={[styles.itemBody, { color: colors.textSecondary }]} numberOfLines={1}>
            {notification.body}
          </Text>
          <Text style={[styles.itemTime, { color: colors.textMuted }]}>
            {formatDistanceToNow(new Date(notification.created_at), {
              addSuffix: true,
            })}
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
      // Only navigate if URL is a relative path (internal navigation)
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

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: 'transparent' }]}>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Notifications</Text>
          <Pressable
            onPress={() => router.back()}
            style={[styles.closeButton, { backgroundColor: colors.subtleBg }]}
            accessibilityLabel="Close"
            accessibilityRole="button"
          >
            <X size={20} color={colors.textMuted} />
          </Pressable>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.copper} size="large" />
        </View>
      </View>
    )
  }

  if (isError) {
    return (
      <View style={[styles.container, { backgroundColor: 'transparent' }]}>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Notifications</Text>
          <Pressable
            onPress={() => router.back()}
            style={[styles.closeButton, { backgroundColor: colors.subtleBg }]}
            accessibilityLabel="Close"
            accessibilityRole="button"
          >
            <X size={20} color={colors.textMuted} />
          </Pressable>
        </View>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <AlertTriangle size={32} color={colors.coral} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>Something went wrong</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
            We couldn't load your notifications.
          </Text>
          <Pressable
            onPress={() => refetch()}
            style={[styles.markAllButton, { backgroundColor: colors.copperDim }]}
            accessibilityLabel="Try again"
            accessibilityRole="button"
          >
            <Text style={[styles.markAllText, { color: colors.copper }]}>Try again</Text>
          </Pressable>
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Notifications</Text>
        <View style={styles.headerRight}>
          {hasRead && (
            <Pressable
              onPress={handleClearRead}
              style={[styles.clearReadButton, { backgroundColor: colors.subtleBg }]}
              disabled={deleteReadNotifications.isPending}
              accessibilityLabel="Clear read notifications"
              accessibilityRole="button"
            >
              <Trash2 size={14} color={colors.textMuted} />
              <Text style={[styles.clearReadText, { color: colors.textMuted }]}>Clear read</Text>
            </Pressable>
          )}
          {hasUnread && (
            <Pressable
              onPress={handleMarkAllRead}
              style={[styles.markAllButton, { backgroundColor: colors.copperDim }]}
              disabled={markAllRead.isPending}
              accessibilityLabel="Mark all as read"
              accessibilityRole="button"
            >
              <Text style={[styles.markAllText, { color: colors.copper }]}>Mark all as read</Text>
            </Pressable>
          )}
          <Pressable
            onPress={() => router.back()}
            style={[styles.closeButton, { backgroundColor: colors.subtleBg }]}
            accessibilityLabel="Close"
            accessibilityRole="button"
          >
            <X size={20} color={colors.textMuted} />
          </Pressable>
        </View>
      </View>

      {/* Content */}
      {groups.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIcon, { backgroundColor: 'rgba(74,66,57,0.2)' }]}>
            <Bell size={32} color={colors.textDim} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No notifications yet</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
            When you receive notifications, they will appear here.
          </Text>
        </View>
      ) : (
        <Animated.ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={colors.copper}
            />
          }
        >
          {groups.map((group, groupIndex) => (
            <Animated.View
              key={group.label}
              entering={FadeInDown.delay(groupIndex * 100)
                .springify()
                .damping(15)
                .stiffness(100)}
            >
              <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>{group.label}</Text>
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
            </Animated.View>
          ))}
        </Animated.ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clearReadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  clearReadText: {
    fontFamily: 'Karla-Medium',
    fontSize: 12,
  },
  markAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  markAllText: {
    fontFamily: 'Karla-Medium',
    fontSize: 12,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Scroll
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  // Section
  sectionLabel: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 10,
    marginTop: 16,
  },
  sectionList: {
    gap: 8,
    marginBottom: 8,
  },

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
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  itemContent: {
    flex: 1,
    gap: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  itemTitle: {
    fontFamily: 'Karla-Regular',
    fontSize: 14,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  itemBody: {
    fontFamily: 'Karla-Regular',
    fontSize: 13,
    lineHeight: 18,
  },
  itemTime: {
    fontFamily: 'Karla-Medium',
    fontSize: 11,
    marginTop: 4,
  },

  // Empty
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: 'Karla-Regular',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
