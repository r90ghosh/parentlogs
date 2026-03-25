import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationHistoryService } from '@/lib/services'
import type { Notification } from '@tdc/shared/types'

export function useNotificationFeed(limit = 30) {
  return useQuery({
    queryKey: ['notifications', 'feed', limit],
    queryFn: () => notificationHistoryService.getNotifications(limit),
    staleTime: 1000 * 30,
  })
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationHistoryService.getUnreadCount(),
    staleTime: 1000 * 60 * 2,
    refetchInterval: 5 * 60 * 1000,
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationHistoryService.markAsRead(notificationId),
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] })

      const previousFeed = queryClient.getQueriesData<Notification[]>({
        queryKey: ['notifications', 'feed'],
      })
      const previousCount = queryClient.getQueryData<number>([
        'notifications',
        'unread-count',
      ])

      queryClient.setQueriesData<Notification[]>(
        { queryKey: ['notifications', 'feed'] },
        (old) =>
          old?.map((n) =>
            n.id === notificationId
              ? { ...n, is_read: true, read_at: new Date().toISOString() }
              : n
          )
      )

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
        queryClient.setQueryData(
          ['notifications', 'unread-count'],
          context.previousCount
        )
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

      const previousFeed = queryClient.getQueriesData<Notification[]>({
        queryKey: ['notifications', 'feed'],
      })
      const previousCount = queryClient.getQueryData<number>([
        'notifications',
        'unread-count',
      ])

      queryClient.setQueriesData<Notification[]>(
        { queryKey: ['notifications', 'feed'] },
        (old) =>
          old?.map((n) => ({
            ...n,
            is_read: true,
            read_at: new Date().toISOString(),
          }))
      )

      queryClient.setQueryData<number>(['notifications', 'unread-count'], 0)

      return { previousFeed, previousCount }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousFeed) {
        context.previousFeed.forEach(([key, data]) => {
          queryClient.setQueryData(key, data)
        })
      }
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(
          ['notifications', 'unread-count'],
          context.previousCount
        )
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
