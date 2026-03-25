import { useEffect, useState, createContext, useContext } from 'react'
import { Alert } from 'react-native'
import { supabase } from '@/lib/supabase'
import { useRouter, useSegments } from 'expo-router'
import { pushNotificationService } from '@/services/push-notification-service'
import { initRevenueCat } from './RevenueCatProvider'
import { isInGracePeriod } from '@tdc/shared/utils/subscription-utils'
import { Sentry } from '@/lib/sentry'
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
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [family, setFamily] = useState<Family | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [profileLoaded, setProfileLoaded] = useState(false)
  const router = useRouter()
  const segments = useSegments()

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
      } else {
        setFamily(null)
      }
    } finally {
      setProfileLoaded(true)
    }
  }

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      if (session?.user) {
        await fetchProfile(session.user.id)
        // Initialize RevenueCat with user ID
        initRevenueCat(session.user.id)
        // Identify user for analytics
        identifyUser(session.user.id)
        // Register for push notifications (fire and forget)
        pushNotificationService.register(session.user.id).catch(() => {})
      } else {
        setProfile(null)
        setFamily(null)
        setProfileLoaded(false)
        resetUser()
      }
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Route protection
  useEffect(() => {
    if (isLoading) return
    const inAuthGroup = segments[0] === '(auth)'
    const inOnboarding = segments[0] === '(onboarding)'
    const inApp = segments[0] === '(tabs)' || segments[0] === '(screens)'
    const atRoot = !segments[0]

    if (!session && !inAuthGroup) {
      router.replace('/(auth)/landing')
    } else if (session && profileLoaded && (inAuthGroup || atRoot)) {
      if (!profile?.onboarding_completed) {
        router.replace('/(onboarding)/role')
      } else {
        router.replace('/(tabs)')
      }
    } else if (session && profileLoaded && inApp && profile && !profile.onboarding_completed) {
      router.replace('/(onboarding)/role')
    }
  }, [session, profile, profileLoaded, isLoading, segments])

  const signOut = async () => {
    // Deactivate device token before signing out
    const token = pushNotificationService.getCurrentToken()
    if (token && session?.user) {
      await pushNotificationService.unregister(session.user.id, token).catch(() => {})
    }
    resetUser()
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
        signOut,
        refreshProfile,
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
