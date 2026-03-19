'use client'

import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationService, ServiceContext } from '@/services/notification-service'
import { notificationHistoryService } from '@/services/notification-history-service'
import { NotificationPreferences, Notification } from '@/types'
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
    queryKey: ['notification-preferences'],
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

export function useNotificationFeed(limit = 30) {
  return useQuery({
    queryKey: ['notifications', 'feed', limit],
    queryFn: () => notificationHistoryService.getNotifications(limit),
    staleTime: 1000 * 30, // 30 seconds
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

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationHistoryService.markAsRead(notificationId),
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] })

      const previousFeed = queryClient.getQueriesData<Notification[]>({ queryKey: ['notifications', 'feed'] })
      const previousCount = queryClient.getQueryData<number>(['notifications', 'unread-count'])

      // Optimistic update on feed
      queryClient.setQueriesData<Notification[]>(
        { queryKey: ['notifications', 'feed'] },
        (old) =>
          old?.map((n) =>
            n.id === notificationId
              ? { ...n, is_read: true, read_at: new Date().toISOString() }
              : n
          )
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

      const previousFeed = queryClient.getQueriesData<Notification[]>({ queryKey: ['notifications', 'feed'] })
      const previousCount = queryClient.getQueryData<number>(['notifications', 'unread-count'])

      queryClient.setQueriesData<Notification[]>(
        { queryKey: ['notifications', 'feed'] },
        (old) =>
          old?.map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
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
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
