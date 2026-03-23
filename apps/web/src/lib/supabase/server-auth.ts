import { createServerSupabaseClient } from './server'
import { User as AppUser, Family, Baby } from '@/types'

const isDev = process.env.NODE_ENV === 'development'

/**
 * Server-side authentication utility
 *
 * Use this in Server Components and Route Handlers to get the current
 * authenticated user and their profile data without client-side loading states.
 *
 * Benefits:
 * - Data is fetched server-side (faster initial load)
 * - Can be cached at edge (Vercel CDN)
 * - No loading spinners - data is already there when page renders
 * - Connection pooling via Supabase (scales to millions of users)
 */
export interface ServerAuthResult {
  user: {
    id: string
    email: string
    identities?: { provider: string }[]
  } | null
  profile: AppUser | null
  family: Family | null
  activeBaby: Baby | null
}

/**
 * Get authenticated user, profile, and family data server-side
 *
 * @returns {ServerAuthResult} User auth data or nulls if not authenticated
 *
 * @example
 * // In a Server Component or layout.tsx
 * const { user, profile, family } = await getServerAuth()
 *
 * if (!user) redirect('/login')
 * if (!profile?.onboarding_completed) redirect('/onboarding')
 */
export async function getServerAuth(): Promise<ServerAuthResult> {
  if (isDev) console.log('[ServerAuth] getServerAuth START')

  const supabase = await createServerSupabaseClient()

  // Get authenticated user from session cookies
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError) {
    if (isDev) console.error('[ServerAuth] Auth error:', authError.message)
    return { user: null, profile: null, family: null, activeBaby: null }
  }

  if (!user) {
    if (isDev) console.log('[ServerAuth] No user found')
    return { user: null, profile: null, family: null, activeBaby: null }
  }

  if (isDev) console.log('[ServerAuth] User found:', user.id)

  // Fetch profile data
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError) {
    if (isDev) console.error('[ServerAuth] Profile fetch error:', profileError.message, profileError.code)
  }

  if (profileError || !profile) {
    // User exists but no profile (edge case - trigger may have failed)
    if (isDev) console.warn('[ServerAuth] User exists but profile not found:', user.id)
    return {
      user: { id: user.id, email: user.email!, identities: user.identities?.map(i => ({ provider: i.provider })) },
      profile: null,
      family: null,
      activeBaby: null
    }
  }

  // Fetch family data if user has a family
  let family: Family | null = null
  if (profile.family_id) {
    const { data: familyData, error: familyError } = await supabase
      .from('families')
      .select('*')
      .eq('id', profile.family_id)
      .single()

    if (familyError) {
      if (isDev) console.error('[ServerAuth] Family fetch error:', familyError.message)
    } else if (familyData) {
      family = familyData as Family
    }
  }

  // Fetch active baby
  let activeBaby: Baby | null = null
  if (profile.active_baby_id) {
    const { data: babyData, error: babyError } = await supabase
      .from('babies')
      .select('*')
      .eq('id', profile.active_baby_id)
      .single()

    if (babyError) {
      if (isDev) console.error('[ServerAuth] Baby fetch error:', babyError.message)
    } else if (babyData) {
      activeBaby = babyData as Baby
    }
  }

  if (isDev) console.log('[ServerAuth] getServerAuth END (success)')
  return {
    user: { id: user.id, email: user.email!, identities: user.identities?.map(i => ({ provider: i.provider })) },
    profile: profile as AppUser,
    family,
    activeBaby
  }
}

/**
 * Get just the authenticated user (minimal query)
 * Use this when you only need to check if user is logged in
 */
export async function getServerUser() {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return { id: user.id, email: user.email! }
}

/**
 * Check if user has completed onboarding
 * Use this in middleware or layouts to protect routes
 */
export async function checkOnboardingStatus(): Promise<{
  isAuthenticated: boolean
  hasCompletedOnboarding: boolean
  hasFamilySetup: boolean
}> {
  const { user, profile, family } = await getServerAuth()

  return {
    isAuthenticated: !!user,
    hasCompletedOnboarding: !!profile?.onboarding_completed,
    hasFamilySetup: !!family
  }
}
