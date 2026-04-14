import { useEffect, useState, createContext, useContext } from 'react'
import { Alert } from 'react-native'
import { supabase } from '@/lib/supabase'
import { useRouter, useSegments } from 'expo-router'
import { pushNotificationService } from '@/services/push-notification-service'
import { initRevenueCat } from './RevenueCatProvider'
import { queryClient } from './QueryProvider'
import { isInGracePeriod } from '@tdc/shared/utils/subscription-utils'
import { queryKeys } from '@tdc/shared/constants'
import { taskService, briefingService, babyService } from '@/lib/services'
import { markAuthReady, resetAuthReady } from '@/lib/notification-intent'
import { Sentry, setSentryUser, clearSentryUser } from '@/lib/sentry'
import { identifyUser, resetUser } from '@/lib/analytics'
import type { Session, User } from '@supabase/supabase-js'

interface Profile {
  id: string
  full_name: string | null
  role: 'mom' | 'dad' | 'other' | null
  family_id: string | null
  subscription_tier: string | null
  subscription_expires_at: string | null
  onboarding_completed: boolean
  has_seen_welcome: boolean
  active_baby_id: string | null
  signup_week: number | null
  created_at: string
}

interface Family {
  id: string
  due_date: string | null
  stage: string | null
  invite_code: string | null
  current_week: number | null
}

interface AuthContextType {
  session: Session | null
  user: User | null
  profile: Profile | null
  family: Family | null
  isLoading: boolean
  isGuest: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  enterGuestMode: () => void
  exitGuestMode: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [family, setFamily] = useState<Family | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [profileLoaded, setProfileLoaded] = useState(false)
  const [isGuest, setIsGuest] = useState(false)
  const router = useRouter()
  const segments = useSegments()

  const enterGuestMode = () => setIsGuest(true)
  const exitGuestMode = () => setIsGuest(false)

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        Sentry.captureException(error, { extra: { context: 'fetch_profile' } })
        Alert.alert('Error', 'Failed to load profile. Please try again.', [
          { text: 'Retry', onPress: () => fetchProfile(userId) },
        ])
        return
      }

      // Normalize tier: if subscription expired past grace period, treat as free
      if (data && data.subscription_tier === 'premium' && data.subscription_expires_at) {
        const expired = new Date(data.subscription_expires_at) < new Date()
        const inGrace = isInGracePeriod(data.subscription_expires_at)
        if (expired && !inGrace) {
          data.subscription_tier = 'free'
        }
      }

      setProfile(data)

      if (data?.family_id) {
        const { data: familyData, error: familyError } = await supabase
          .from('families')
          .select('*')
          .eq('id', data.family_id)
          .single()
        if (familyError && familyError.code !== 'PGRST116') {
          Sentry.captureException(familyError, { extra: { context: 'fetch_family' } })
        }
        setFamily(familyData)
        // Prefetch dashboard queries with keys that match the consuming hooks.
        // Must run AFTER family is known so keys include family.id.
        if (data && familyData) {
          prefetchTabData(userId, familyData, data).catch(() => {})
        }
      } else {
        setFamily(null)
      }
    } finally {
      setProfileLoaded(true)
    }
  }

  useEffect(() => {
    let mounted = true

    // 1. Get initial session immediately (fast — reads from local storage)
    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      if (!mounted) return
      setSession(initialSession)
      if (initialSession?.user) {
        // Fire non-blocking side effects
        initRevenueCat(initialSession.user.id)
        identifyUser(initialSession.user.id)
        setSentryUser(initialSession.user.id, initialSession.user.email)
        pushNotificationService.register(initialSession.user.id).catch(() => {})
        // Fetch profile (awaited so route protection works).
        // Prefetch happens inside fetchProfile once family.id is known.
        await fetchProfile(initialSession.user.id)
      }
      if (mounted) setIsLoading(false)
    }).catch(() => {
      if (mounted) setIsLoading(false)
    })

    // 2. Listen for auth state changes (sign in / sign out / token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return
      setSession(newSession)
      if (newSession?.user) {
        await fetchProfile(newSession.user.id)
        initRevenueCat(newSession.user.id)
        identifyUser(newSession.user.id)
        setSentryUser(newSession.user.id, newSession.user.email)
        pushNotificationService.register(newSession.user.id).catch(() => {})

        // Handle password recovery deep-link — navigate to change password screen
        if (event === 'PASSWORD_RECOVERY') {
          router.push('/(tabs)/more/change-password?recovery=1')
        }
      } else {
        setProfile(null)
        setFamily(null)
        setProfileLoaded(false)
        resetUser()
        clearSentryUser()
        // Clear query cache on sign out
        queryClient.clear()
      }
      setIsLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  // Prefetch dashboard queries with keys that match the consuming hooks EXACTLY.
  // Key mismatches = silent cache miss on every mount. If you add a new prefetch,
  // verify the key is identical to the hook reading it.
  async function prefetchTabData(
    userId: string,
    familyData: Family,
    profileData: Profile,
  ) {
    if (!familyData.id) return

    const ctx = {
      userId,
      familyId: familyData.id,
      subscriptionTier: profileData.subscription_tier ?? undefined,
      babyId: profileData.active_baby_id ?? undefined,
    }

    const prefetches: Promise<unknown>[] = [
      // useDashboardData → use-dashboard.ts:25
      queryClient.prefetchQuery({
        queryKey: ['tasks-due', familyData.id],
        queryFn: () => taskService.getTasks({ status: 'pending', limit: 5 }, ctx),
        staleTime: 1000 * 60 * 2,
      }),
      // useBabies → use-babies.ts:19 (shared factory)
      queryClient.prefetchQuery({
        queryKey: queryKeys.babies.list(familyData.id),
        queryFn: () => babyService.getBabies(ctx),
        staleTime: 1000 * 60 * 5,
      }),
      // useSubscriptionStatus → use-subscription.ts:53
      queryClient.prefetchQuery({
        queryKey: ['subscription-status', userId],
        queryFn: async () => {
          const { data, error } = await supabase
            .from('subscriptions')
            .select('status, cancel_at_period_end, current_period_end')
            .eq('user_id', userId)
            .single()
          if (error && error.code !== 'PGRST116') throw error
          return data ?? null
        },
        staleTime: 1000 * 60 * 5,
      }),
      // useBacklogCount → use-triage.ts:21
      queryClient.prefetchQuery({
        queryKey: ['backlog-count', familyData.id],
        queryFn: () => taskService.getBacklogCount(ctx),
        staleTime: 1000 * 60 * 2,
      }),
    ]

    // Briefing needs stage + currentWeek; skip if family hasn't reached that stage
    if (familyData.stage && familyData.current_week != null) {
      const briefingCtx = {
        ...ctx,
        stage: familyData.stage,
        currentWeek: familyData.current_week,
      }
      prefetches.push(
        // useDashboardData → use-dashboard.ts:31
        queryClient.prefetchQuery({
          queryKey: ['current-briefing', familyData.id],
          queryFn: () => briefingService.getCurrentBriefing(briefingCtx),
          staleTime: 1000 * 60 * 10,
        })
      )
    }

    await Promise.allSettled(prefetches)
  }

  // Route protection
  useEffect(() => {
    if (isLoading) return
    const inAuthGroup = segments[0] === '(auth)'
    const inOnboarding = segments[0] === '(onboarding)'
    const inApp = segments[0] === '(tabs)' || segments[0] === '(screens)'
    const inGuest = segments[0] === '(guest)'
    const inScreens = segments[0] === '(screens)'
    const atRoot = !segments[0]

    if (!session && !inAuthGroup && !inGuest) {
      // Allow guests to browse content screens (modals pushed from guest tabs)
      if (isGuest && inScreens) {
        // Allow — guest can browse read-only content
      } else if (isGuest) {
        router.replace('/(guest)')
      } else {
        router.replace('/(auth)/landing')
      }
    } else if (session && (inGuest || inAuthGroup || atRoot) && profileLoaded) {
      // Authenticated user landed in guest/auth/root — send to app
      setIsGuest(false)
      if (!profile?.onboarding_completed) {
        router.replace('/(onboarding)/role')
      } else {
        router.replace('/(tabs)')
      }
    } else if (session && profileLoaded && inApp && profile && !profile.onboarding_completed) {
      router.replace('/(onboarding)/role')
    }

    // Signal to the notification intent queue that the route is now safe to
    // push to. Any pending deep-link from a cold-start notification will
    // drain now instead of racing this redirect logic.
    if (session && profileLoaded && profile?.onboarding_completed) {
      markAuthReady()
    }
  }, [session, profile, profileLoaded, isLoading, segments, isGuest])

  const signOut = async () => {
    // Deactivate device token before signing out
    const token = pushNotificationService.getCurrentToken()
    if (token && session?.user) {
      await pushNotificationService.unregister(session.user.id, token).catch(() => {})
    }
    resetUser()
    resetAuthReady()
    await supabase.auth.signOut()
    setProfile(null)
    setFamily(null)
    router.replace('/(auth)/landing')
  }

  const refreshProfile = async () => {
    if (session?.user) {
      await fetchProfile(session.user.id)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        family,
        isLoading,
        isGuest,
        signOut,
        refreshProfile,
        enterGuestMode,
        exitGuestMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
