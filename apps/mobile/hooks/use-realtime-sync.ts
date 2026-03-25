import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/components/providers/AuthProvider'
import { supabase } from '@/lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

export function useRealtimeSync() {
  const queryClient = useQueryClient()
  const { user, family } = useAuth()
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!family?.id || !user?.id) return

    // Clean up any existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
    }

    const channel = supabase
      .channel(`family-sync:${family.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'family_tasks',
          filter: `family_id=eq.${family.id}`,
        },
        (payload) => {
          // Skip changes made by current user
          if (payload.new && (payload.new as Record<string, unknown>).completed_by === user.id) return
          if (payload.new && (payload.new as Record<string, unknown>).created_by === user.id) return

          queryClient.invalidateQueries({ queryKey: ['tasks', family.id] })
          queryClient.invalidateQueries({ queryKey: ['tasks-due', family.id] })
          queryClient.invalidateQueries({ queryKey: ['dashboard'] })
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'baby_logs',
          filter: `family_id=eq.${family.id}`,
        },
        (payload) => {
          if (payload.new && (payload.new as Record<string, unknown>).logged_by === user.id) return

          queryClient.invalidateQueries({ queryKey: ['tracker-logs', family.id] })
          queryClient.invalidateQueries({ queryKey: ['shift-briefing', family.id] })
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'checklist_progress',
          filter: `family_id=eq.${family.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['checklists', family.id] })
          queryClient.invalidateQueries({ queryKey: ['checklist'] })
        }
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
      channelRef.current = null
    }
  }, [family?.id, user?.id, queryClient])
}
