import { useEffect, useState, createContext, useContext } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSegments } from 'expo-router'
import { pushNotificationService } from '@/services/push-notification-service'
import type { Session, User } from '@supabase/supabase-js'

interface Profile {
  id: string
  full_name: string | null
  role: 'mom' | 'dad' | 'other' | null
  family_id: string | null
  subscription_tier: string | null
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

const AuthContext = createContext<AuthContextType>(null!)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [family, setFamily] = useState<Family | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const segments = useSegments()

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    setProfile(data)

    if (data?.family_id) {
      const { data: familyData } = await supabase
        .from('families')
        .select('*')
        .eq('id', data.family_id)
        .single()
      setFamily(familyData)
    }
  }

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      if (session?.user) {
        await fetchProfile(session.user.id)
        // Register for push notifications (fire and forget)
        pushNotificationService.register(session.user.id).catch(() => {})
      } else {
        setProfile(null)
        setFamily(null)
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

    if (!session && !inAuthGroup) {
      router.replace('/(auth)/login')
    } else if (session && inAuthGroup) {
      if (!profile?.onboarding_completed) {
        router.replace('/(onboarding)/role')
      } else {
        router.replace('/(tabs)')
      }
    }
  }, [session, profile, isLoading, segments])

  const signOut = async () => {
    // Deactivate device token before signing out
    const token = pushNotificationService.getCurrentToken()
    if (token && session?.user) {
      await pushNotificationService.unregister(session.user.id, token).catch(() => {})
    }
    await supabase.auth.signOut()
    setProfile(null)
    setFamily(null)
    router.replace('/(auth)/login')
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

export const useAuth = () => useContext(AuthContext)
