'use client'

import { useEffect, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth/auth-context'
import { useFamily, useFamilyMembers } from '@/hooks/use-family'
import { toast } from 'sonner'
import { RealtimeChannel } from '@supabase/supabase-js'

type RealtimePayload = {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new: Record<string, any>
  old: Record<string, any>
}

export function useRealtimeSync() {
  const supabase = createClient()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const { data: family } = useFamily()
  const { data: members } = useFamilyMembers()

  const getMemberName = useCallback((userId: string) => {
    if (userId === user?.id) return 'You'
    const member = members?.find(m => m.id === userId)
    return member?.full_name?.split(' ')[0] || 'Partner'
  }, [user?.id, members])

  useEffect(() => {
    if (!family?.id) return

    let tasksChannel: RealtimeChannel
    let logsChannel: RealtimeChannel
    let checklistChannel: RealtimeChannel

    const setupSubscriptions = async () => {
      // Subscribe to family_tasks changes
      tasksChannel = supabase
        .channel(`family_tasks:${family.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'family_tasks',
            filter: `family_id=eq.${family.id}`,
          },
          (payload: RealtimePayload) => {
            // Invalidate queries
            queryClient.invalidateQueries({ queryKey: ['tasks'] })

            // Show toast for partner activity
            if (payload.new?.completed_by && payload.new.completed_by !== user?.id) {
              const memberName = getMemberName(payload.new.completed_by)
              if (payload.new.status === 'completed') {
                toast.success(`${memberName} completed a task`, {
                  description: payload.new.title,
                })
              }
            }
          }
        )
        .subscribe()

      // Subscribe to baby_logs changes
      logsChannel = supabase
        .channel(`baby_logs:${family.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'baby_logs',
            filter: `family_id=eq.${family.id}`,
          },
          (payload: RealtimePayload) => {
            // Invalidate queries
            queryClient.invalidateQueries({ queryKey: ['tracker-logs'] })
            queryClient.invalidateQueries({ queryKey: ['shift-briefing'] })

            // Show toast for partner activity
            if (payload.new?.logged_by && payload.new.logged_by !== user?.id) {
              const memberName = getMemberName(payload.new.logged_by)
              const logType = payload.new.log_type?.replace('_', ' ')
              toast.info(`${memberName} logged ${logType}`, {
                description: formatLogDetails(payload.new),
              })
            }
          }
        )
        .subscribe()

      // Subscribe to checklist_progress changes
      checklistChannel = supabase
        .channel(`checklist_progress:${family.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'checklist_progress',
            filter: `family_id=eq.${family.id}`,
          },
          (payload: RealtimePayload) => {
            // Invalidate queries
            queryClient.invalidateQueries({ queryKey: ['checklists'] })
            queryClient.invalidateQueries({ queryKey: ['checklist'] })

            // Show toast for partner activity
            if (payload.new?.completed_by && payload.new.completed_by !== user?.id && payload.new.completed) {
              const memberName = getMemberName(payload.new.completed_by)
              toast.success(`${memberName} checked off an item`, {
                description: `In checklist ${payload.new.checklist_id}`,
              })
            }
          }
        )
        .subscribe()
    }

    setupSubscriptions()

    // Cleanup subscriptions
    return () => {
      if (tasksChannel) supabase.removeChannel(tasksChannel)
      if (logsChannel) supabase.removeChannel(logsChannel)
      if (checklistChannel) supabase.removeChannel(checklistChannel)
    }
  }, [family?.id, user?.id, queryClient, supabase, getMemberName])
}

function formatLogDetails(log: Record<string, any>): string {
  const details = log.log_data || {}
  switch (log.log_type) {
    case 'feeding':
      if (details.type === 'breast') {
        return `${details.side} side, ${details.duration_minutes}min`
      }
      return `${details.amount_oz}oz ${details.type}`
    case 'diaper':
      return details.type
    case 'sleep':
      return `${details.duration_minutes} minutes`
    default:
      return log.notes || ''
  }
}

// Hook to get real-time presence (who's online)
export function usePartnerPresence() {
  const supabase = createClient()
  const { user } = useAuth()
  const { data: family } = useFamily()
  const { data: members } = useFamilyMembers()

  useEffect(() => {
    if (!family?.id || !user?.id) return

    const channel = supabase.channel(`presence:${family.id}`)

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        // Handle presence state changes
        console.log('Presence state:', state)
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        const joiner = newPresences[0]
        if (joiner?.user_id !== user.id) {
          const member = members?.find(m => m.id === joiner?.user_id)
          const name = member?.full_name?.split(' ')[0] || 'Partner'
          toast.info(`${name} is now online`)
        }
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        // Partner went offline
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: user.id,
            online_at: new Date().toISOString(),
          })
        }
      })

    return () => {
      channel.unsubscribe()
    }
  }, [family?.id, user?.id, members, supabase])
}
