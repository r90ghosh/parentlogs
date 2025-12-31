import { createServerSupabaseClient } from './server'
import { User as AppUser, Family } from '@/types'

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
  } | null
  profile: AppUser | null
  family: Family | null
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
  console.log('[ServerAuth] ========== getServerAuth START ==========')

  const supabase = await createServerSupabaseClient()
  console.log('[ServerAuth] Supabase client created')

  // Get authenticated user from session cookies
  console.log('[ServerAuth] Calling supabase.auth.getUser()...')
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError) {
    console.error('[ServerAuth] Auth error:', authError.message)
    console.log('[ServerAuth] ========== getServerAuth END (auth error) ==========')
    return { user: null, profile: null, family: null }
  }

  if (!user) {
    console.log('[ServerAuth] No user found (not authenticated)')
    console.log('[ServerAuth] ========== getServerAuth END (no user) ==========')
    return { user: null, profile: null, family: null }
  }

  console.log('[ServerAuth] User found:', { id: user.id, email: user.email })

  // Fetch profile data
  console.log('[ServerAuth] Fetching profile...')
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError) {
    console.error('[ServerAuth] Profile fetch error:', profileError.message, profileError.code)
  }

  if (profileError || !profile) {
    // User exists but no profile (edge case - trigger may have failed)
    console.warn('[ServerAuth] User exists but profile not found:', user.id)
    console.log('[ServerAuth] ========== getServerAuth END (no profile) ==========')
    return {
      user: { id: user.id, email: user.email! },
      profile: null,
      family: null
    }
  }

  console.log('[ServerAuth] Profile found:', {
    id: profile.id,
    email: profile.email,
    role: profile.role,
    family_id: profile.family_id,
    onboarding_completed: profile.onboarding_completed
  })

  // Fetch family data if user has a family
  let family: Family | null = null
  if (profile.family_id) {
    console.log('[ServerAuth] Fetching family:', profile.family_id)
    const { data: familyData, error: familyError } = await supabase
      .from('families')
      .select('*')
      .eq('id', profile.family_id)
      .single()

    if (familyError) {
      console.error('[ServerAuth] Family fetch error:', familyError.message)
    } else if (familyData) {
      family = familyData as Family
      console.log('[ServerAuth] Family found:', {
        id: family.id,
        stage: family.stage,
        current_week: family.current_week
      })
    }
  } else {
    console.log('[ServerAuth] No family_id on profile')
  }

  console.log('[ServerAuth] ========== getServerAuth END (success) ==========')
  return {
    user: { id: user.id, email: user.email! },
    profile: profile as AppUser,
    family
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
