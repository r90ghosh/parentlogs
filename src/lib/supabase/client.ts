import { createBrowserClient } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// Singleton instance for browser client
let browserClient: SupabaseClient<Database> | null = null

/**
 * Get the singleton Supabase browser client.
 * This ensures all components share the same auth state and avoids race conditions.
 */
export function createClient(): SupabaseClient<Database> {
  if (!browserClient) {
    console.log('[SupabaseClient] Creating singleton browser client')
    browserClient = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return browserClient
}

/**
 * Alias for createClient() - provides clearer naming for singleton usage.
 */
export const getSupabaseClient = createClient
