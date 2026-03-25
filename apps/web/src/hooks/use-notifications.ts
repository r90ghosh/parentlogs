'use client'

import { useState, useEffect, useCallback } from 'react'
import { useQuery, useInfiniteQuery, useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query'
import { notificationService } from '@/services/notification-service'
import type { ServiceContext } from '@tdc/services'
import { notificationHistoryService } from '@/lib/services'
import { NotificationPreferences, Notification } from '@tdc/shared/types'
import { useOptionalUser } from '@/components/user-provider'

function useServiceContext(): Partial<ServiceContext> | undefined {
  const userData = useOptionalUser()
  if (!userData?.user) return undefined
  return {
    userId: userData.user.id,
    familyId: userData.profile?.family_id ?? undefined,
    subscriptionTier: userData.profile?.subscription_tier ?? undefined,
  } as Partial<ServiceContext>
}

export function useNotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    setIsSupported(notificationService.isSupported())
    setPermission(notificationService.getPermissionStatus())
  }, [])

  const requestPermission = async () => {
    const result = await notificationService.requestPermission()
    setPermission(result)
    return result
  }

  return {
    permission,
    isSupported,
    requestPermission,
    isGranted: permission === 'granted',
    isDenied: permission === 'denied',
  }
}

export function usePushSubscription() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const checkSubscription = useCallback(async () => {
    if (!('serviceWorker' in navigator)) return

    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    setIsSubscribed(!!subscription)
  }, [])

  useEffect(() => {
    checkSubscription()
  }, [checkSubscription])

  const subscribe = async () => {
    setIsLoading(true)
    try {
      const subscription = await notificationService.subscribeToPush()
      setIsSubscribed(!!subscription)
      return subscription
    } finally {
      setIsLoading(false)
    }
  }

  const unsubscribe = async () => {
    setIsLoading(true)
    try {
      const result = await notificationService.unsubscribeFromPush()
      if (result) setIsSubscribed(false)
      return result
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isSubscribed,
    isLoading,
    subscribe,
    unsubscribe,
  }
}

export function useNotificationPreferences() {
  const ctx = useServiceContext()

  return useQuery({
    queryKey: ['notification-preferences', ctx?.userId],
    queryFn: () => notificationService.getPreferences(ctx),
    enabled: !!ctx,
  })
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient()
  const ctx = useServiceContext()

  return useMutation({
    mutationFn: (preferences: Partial<NotificationPreferences>) =>
      notificationService.updatePreferences(preferences, ctx),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-preferences'] })
    },
  })
}

export function useLocalNotification() {
  const show = async (title: string, options?: NotificationOptions) => {
    await notificationService.showLocalNotification(title, options)
  }

  return { show }
}

export function usePushWindowStatus() {
  const ctx = useServiceContext()

  return useQuery({
    queryKey: ['push-window-status'],
    queryFn: () => notificationService.getPushWindowStatus(ctx),
    enabled: !!ctx,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// --- Notification Inbox Hooks ---

const PAGE_SIZE = 20

export function useNotificationFeed(types?: string[]) {
  return useInfiniteQuery({
    queryKey: ['notifications', 'feed', types],
    queryFn: ({ pageParam = 0 }) =>
      notificationHistoryService.getNotifications(PAGE_SIZE, pageParam, types),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.length === PAGE_SIZE ? lastPageParam + PAGE_SIZE : undefined,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
  })
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationHistoryService.getUnreadCount(),
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  })
}

type InfiniteFeed = InfiniteData<Notification[], number>

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationHistoryService.markAsRead(notificationId),
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] })

      const previousFeed = queryClient.getQueriesData<InfiniteFeed>({ queryKey: ['notifications', 'feed'] })
      const previousCount = queryClient.getQueryData<number>(['notifications', 'unread-count'])

      // Optimistic update on feed (infinite query pages)
      queryClient.setQueriesData<InfiniteFeed>(
        { queryKey: ['notifications', 'feed'] },
        (old) => {
          if (!old) return old
          return {
            ...old,
            pages: old.pages.map((page) =>
              page.map((n) =>
                n.id === notificationId
                  ? { ...n, is_read: true, read_at: new Date().toISOString() }
                  : n
              )
            ),
          }
        }
      )

      // Optimistic update on count
      queryClient.setQueryData<number>(
        ['notifications', 'unread-count'],
        (old) => Math.max(0, (old ?? 1) - 1)
      )

      return { previousFeed, previousCount }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousFeed) {
        context.previousFeed.forEach(([key, data]) => {
          queryClient.setQueryData(key, data)
        })
      }
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(['notifications', 'unread-count'], context.previousCount)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => notificationHistoryService.markAllAsRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] })

      const previousFeed = queryClient.getQueriesData<InfiniteFeed>({ queryKey: ['notifications', 'feed'] })
      const previousCount = queryClient.getQueryData<number>(['notifications', 'unread-count'])

      queryClient.setQueriesData<InfiniteFeed>(
        { queryKey: ['notifications', 'feed'] },
        (old) => {
          if (!old) return old
          return {
            ...old,
            pages: old.pages.map((page) =>
              page.map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
            ),
          }
        }
      )

      queryClient.setQueryData<number>(
        ['notifications', 'unread-count'],
        0
      )

      return { previousFeed, previousCount }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousFeed) {
        context.previousFeed.forEach(([key, data]) => {
          queryClient.setQueryData(key, data)
        })
      }
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(['notifications', 'unread-count'], context.previousCount)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useDeleteNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationHistoryService.deleteNotification(notificationId),
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] })

      const previousFeed = queryClient.getQueriesData<InfiniteFeed>({ queryKey: ['notifications', 'feed'] })
      const previousCount = queryClient.getQueryData<number>(['notifications', 'unread-count'])

      let wasUnread = false
      queryClient.setQueriesData<InfiniteFeed>(
        { queryKey: ['notifications', 'feed'] },
        (old) => {
          if (!old) return old
          return {
            ...old,
            pages: old.pages.map((page) => {
              const target = page.find((n) => n.id === notificationId)
              if (target && !target.is_read) wasUnread = true
              return page.filter((n) => n.id !== notificationId)
            }),
          }
        }
      )

      if (wasUnread) {
        queryClient.setQueryData<number>(
          ['notifications', 'unread-count'],
          (old) => Math.max(0, (old ?? 1) - 1)
        )
      }

      return { previousFeed, previousCount }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousFeed) {
        context.previousFeed.forEach(([key, data]) => {
          queryClient.setQueryData(key, data)
        })
      }
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(['notifications', 'unread-count'], context.previousCount)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useDeleteReadNotifications() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => notificationHistoryService.deleteReadNotifications(),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
