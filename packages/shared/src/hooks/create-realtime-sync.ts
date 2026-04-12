/**
 * Shared realtime sync configuration for The Dad Center.
 *
 * Defines WHICH Supabase tables to subscribe to, WHICH events to listen for,
 * and WHICH query keys to invalidate when changes arrive. Both the web and
 * mobile apps consume this configuration to keep their realtime hooks aligned.
 *
 * This module intentionally does NOT create Supabase channels or React hooks.
 * The Supabase client differs between web (SSR-aware) and mobile (bare), and
 * each app layers on platform-specific behaviour (toasts on web, skip-own-
 * changes on mobile). The hooks themselves stay in their respective apps.
 */

import { queryKeys } from '../constants/query-keys'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*'

export interface RealtimeTableConfig {
  /** Supabase table name */
  table: string
  /** Postgres change event(s) to listen for */
  event: RealtimeEvent
  /** Column used in the `filter` clause (value is interpolated at runtime) */
  filterColumn: string
  /**
   * Query keys to invalidate when this table changes.
   * Each inner array is one `queryKey` passed to `queryClient.invalidateQueries`.
   */
  invalidateKeys: readonly (readonly unknown[])[]
  /**
   * Column that identifies the user who made the change.
   * Used by consumers that want to skip own-user changes or show partner toasts.
   * `null` when the table has no user-attribution column.
   */
  actorColumn: string | null
}

// ---------------------------------------------------------------------------
// Configuration factory
// ---------------------------------------------------------------------------

/**
 * Returns the canonical list of Supabase realtime subscriptions for a family.
 *
 * Usage in each app:
 * ```ts
 * import { getRealtimeChannels } from '@tdc/shared/hooks/create-realtime-sync'
 *
 * const channels = getRealtimeChannels(familyId)
 * channels.forEach(ch => {
 *   supabase.channel(...).on('postgres_changes', {
 *     event: ch.event,
 *     schema: 'public',
 *     table: ch.table,
 *     filter: `${ch.filterColumn}=eq.${familyId}`,
 *   }, handler).subscribe()
 * })
 * ```
 */
export function getRealtimeChannels(familyId: string): RealtimeTableConfig[] {
  return [
    // ----- family_tasks -----
    {
      table: 'family_tasks',
      event: '*',
      filterColumn: 'family_id',
      invalidateKeys: [
        queryKeys.tasks.all,
        queryKeys.tasks.due(familyId),
        queryKeys.dashboard.all,
      ],
      actorColumn: 'completed_by',
    },

    // ----- baby_logs -----
    {
      table: 'baby_logs',
      event: '*',
      filterColumn: 'family_id',
      invalidateKeys: [
        queryKeys.tracker.logs(familyId),
        queryKeys.tracker.shiftBriefing(familyId),
      ],
      actorColumn: 'logged_by',
    },

    // ----- checklist_progress -----
    {
      table: 'checklist_progress',
      event: '*',
      filterColumn: 'family_id',
      invalidateKeys: [
        queryKeys.checklists.all,
      ],
      actorColumn: 'completed_by',
    },
  ]
}

/**
 * Builds the Supabase realtime filter string for a channel config.
 *
 * @example
 * buildFilter(channel, familyId) // => 'family_id=eq.abc-123'
 */
export function buildRealtimeFilter(
  config: RealtimeTableConfig,
  familyId: string,
): string {
  return `${config.filterColumn}=eq.${familyId}`
}
