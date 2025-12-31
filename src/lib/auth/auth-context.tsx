'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

/**
 * Simplified Auth Context
 *
 * This context ONLY handles authentication operations:
 * - signIn, signUp, signOut, signInWithGoogle
 * - User state from onAuthStateChange listener
 *
 * Profile and family data are handled separately:
 * - Server-side: getServerAuth() in layouts
 * - Client-side: useUser() from UserProvider (receives server data)
 * - Updates: React Query hooks (useProfile, useFamily)
 *
 * This separation ensures:
 * - No blocking loading states
 * - No race conditions between profile fetch and auth
 * - Faster initial page loads (server-rendered data)
 */

interface AuthContextType {
  user: User | null
  session: Session | null
  signUp: (email: string, password: string, metadata?: { full_name?: string; role?: string }) => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signInWithGoogle: () => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  updatePassword: (password: string) => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)

  console.log('[AuthProvider] ========== RENDER ==========')
  console.log('[AuthProvider] Current user state:', user?.id || 'null')
  console.log('[AuthProvider] Current session state:', session ? 'exists' : 'null')

  useEffect(() => {
    console.log('[AuthProvider] useEffect - Setting up auth listener')

    // Listen for auth changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('[AuthProvider] onAuthStateChange fired:', {
          event,
          userId: session?.user?.id || 'null',
          expiresAt: session?.expires_at
        })

        setSession(session)
        setUser(session?.user ?? null)

        // Handle sign out - redirect to login
        if (event === 'SIGNED_OUT') {
          console.log('[AuthProvider] SIGNED_OUT event - redirecting to /login')
          window.location.href = '/login'
        }
      }
    )

    // Get initial session
    console.log('[AuthProvider] Calling getSession()...')
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('[AuthProvider] getSession() returned:', {
        hasSession: !!session,
        userId: session?.user?.id || 'null'
      })
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => {
      console.log('[AuthProvider] Cleanup - unsubscribing from auth listener')
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const signUp = async (email: string, password: string, metadata?: { full_name?: string; role?: string }) => {
    console.log('[AuthProvider] signUp called:', { email, metadata })
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      console.error('[AuthProvider] signUp error:', error.message)
    } else {
      console.log('[AuthProvider] signUp success - verification email sent')
    }
    return { error: error as Error | null }
  }

  const signIn = async (email: string, password: string) => {
    console.log('[AuthProvider] signIn called:', { email })
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error('[AuthProvider] signIn error:', error.message)
    } else {
      console.log('[AuthProvider] signIn success')
    }
    return { error: error as Error | null }
  }

  const signInWithGoogle = async () => {
    console.log('[AuthProvider] signInWithGoogle called')
    const redirectTo = `${window.location.origin}/auth/callback`
    console.log('[AuthProvider] OAuth redirect URL:', redirectTo)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    })
    if (error) {
      console.error('[AuthProvider] signInWithGoogle error:', error.message)
    } else {
      console.log('[AuthProvider] signInWithGoogle - redirecting to Google...')
    }
    return { error: error as Error | null }
  }

  const signOut = async () => {
    console.log('[AuthProvider] signOut called')
    await supabase.auth.signOut()
    console.log('[AuthProvider] signOut completed')
  }

  const resetPassword = async (email: string) => {
    console.log('[AuthProvider] resetPassword called:', { email })
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    if (error) {
      console.error('[AuthProvider] resetPassword error:', error.message)
    } else {
      console.log('[AuthProvider] resetPassword success - email sent')
    }
    return { error: error as Error | null }
  }

  const updatePassword = async (password: string) => {
    console.log('[AuthProvider] updatePassword called')
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      console.error('[AuthProvider] updatePassword error:', error.message)
    } else {
      console.log('[AuthProvider] updatePassword success')
    }
    return { error: error as Error | null }
  }

  return (
    <AuthContext.Provider value={{
      user,
      session,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
      resetPassword,
      updatePassword,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
