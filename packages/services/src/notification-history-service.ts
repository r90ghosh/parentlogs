import type { Notification } from '@tdc/shared/types'
import type { AppSupabaseClient } from './types'

export function createNotificationHistoryService(supabase: AppSupabaseClient) {
  return {
    async getNotifications(limit = 20, offset = 0, types?: string[]): Promise<Notification[]> {
      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (types?.length) {
        query = query.in('type', types)
      }

      const { data, error } = await query
      if (error) throw error
      return (data || []) as Notification[]
    },

    async getUnreadCount(): Promise<number> {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)

      if (error) throw error
      return count || 0
    },

    async markAsRead(notificationId: string): Promise<void> {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId)

      if (error) throw error
    },

    async markAllAsRead(): Promise<void> {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('is_read', false)

      if (error) throw error
    },

    async deleteNotification(notificationId: string): Promise<void> {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)

      if (error) throw error
    },

    async deleteReadNotifications(): Promise<void> {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('is_read', true)

      if (error) throw error
    },
  }
}

export type NotificationHistoryService = ReturnType<typeof createNotificationHistoryService>
