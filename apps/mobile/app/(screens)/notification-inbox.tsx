import { useCallback, useMemo } from 'react'
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
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
import { LinearGradient } from 'expo-linear-gradient'
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
import {
  useNotificationFeed,
  useUnreadNotificationCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
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
        style={[swipeStyles.deleteAction, deleteActionStyle]}
      >
        <Trash2 size={18} color="#faf6f0" />
        <Text style={swipeStyles.deleteText}>Delete</Text>
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
    backgroundColor: '#d4836b',
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
    color: '#faf6f0',
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
  const Icon = TYPE_ICONS[notification.type] ?? Bell
  const isUnread = !notification.is_read

  return (
    <SwipeToDelete onDelete={onDelete}>
      <Pressable
        onPress={onPress}
        style={[
          styles.item,
          isUnread ? styles.itemUnread : styles.itemRead,
        ]}
      >
        <View
          style={[
            styles.iconCircle,
            isUnread ? styles.iconCircleUnread : styles.iconCircleRead,
          ]}
        >
          <Icon size={16} color={isUnread ? '#c4703f' : '#4a4239'} />
        </View>
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <Text
              style={[styles.itemTitle, isUnread && styles.itemTitleUnread]}
              numberOfLines={1}
            >
              {notification.title}
            </Text>
            {isUnread && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.itemBody} numberOfLines={1}>
            {notification.body}
          </Text>
          <Text style={styles.itemTime}>
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
  const { data: notifications, isLoading, isError, refetch, isRefetching } = useNotificationFeed()
  const { data: unreadCount } = useUnreadNotificationCount()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()
  const deleteNotification = useDeleteNotification()

  const groups = useMemo(
    () => groupNotifications(notifications ?? []),
    [notifications]
  )

  const hasUnread = (unreadCount ?? 0) > 0

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
      <View style={styles.container}>
        <LinearGradient
          colors={['#12100e', '#1a1714', '#12100e']}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <X size={20} color="#7a6f62" />
          </Pressable>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#c4703f" size="large" />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#12100e', '#1a1714', '#12100e']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerRight}>
          {hasUnread && (
            <Pressable
              onPress={handleMarkAllRead}
              style={styles.markAllButton}
              disabled={markAllRead.isPending}
            >
              <Text style={styles.markAllText}>Mark all as read</Text>
            </Pressable>
          )}
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <X size={20} color="#7a6f62" />
          </Pressable>
        </View>
      </View>

      {/* Content */}
      {groups.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Bell size={32} color="#4a4239" />
          </View>
          <Text style={styles.emptyTitle}>No notifications yet</Text>
          <Text style={styles.emptySubtitle}>
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
              tintColor="#c4703f"
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
              <Text style={styles.sectionLabel}>{group.label}</Text>
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
    backgroundColor: '#12100e',
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
    color: '#faf6f0',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  markAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(196,112,63,0.12)',
  },
  markAllText: {
    fontFamily: 'Karla-Medium',
    fontSize: 12,
    color: '#c4703f',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(237,230,220,0.06)',
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
    color: '#7a6f62',
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
    borderColor: 'rgba(237,230,220,0.08)',
    gap: 12,
  },
  itemUnread: {
    backgroundColor: '#201c18',
    borderLeftWidth: 2,
    borderLeftColor: '#c4703f',
  },
  itemRead: {
    backgroundColor: '#1a1714',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  iconCircleUnread: {
    backgroundColor: 'rgba(196,112,63,0.15)',
  },
  iconCircleRead: {
    backgroundColor: 'rgba(74,66,57,0.3)',
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
    color: '#ede6dc',
    flex: 1,
  },
  itemTitleUnread: {
    fontFamily: 'Karla-SemiBold',
    color: '#faf6f0',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#c4703f',
  },
  itemBody: {
    fontFamily: 'Karla-Regular',
    fontSize: 13,
    color: '#ede6dc',
    lineHeight: 18,
  },
  itemTime: {
    fontFamily: 'Karla-Medium',
    fontSize: 11,
    color: '#7a6f62',
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
    backgroundColor: 'rgba(74,66,57,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: 'Karla-SemiBold',
    fontSize: 16,
    color: '#faf6f0',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: 'Karla-Regular',
    fontSize: 13,
    color: '#7a6f62',
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
