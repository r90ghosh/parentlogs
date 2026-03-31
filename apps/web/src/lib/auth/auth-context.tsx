'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import * as Sentry from '@sentry/nextjs'

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
  signUp: (email: string, password: string, metadata?: { full_name?: string; role?: string }, inviteCode?: string) => Promise<{ data: { user: User | null } | null; error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signInWithGoogle: (inviteCode?: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  updatePassword: (password: string) => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    // Listen for auth changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)

        // Set Sentry user context for error tracking
        if (session?.user) {
          Sentry.setUser({ id: session.user.id, email: session.user.email })
        } else {
          Sentry.setUser(null)
        }

        // Handle sign out - redirect to landing page
        if (event === 'SIGNED_OUT') {
          window.location.href = '/'
        }
      }
    )

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        Sentry.setUser({ id: session.user.id, email: session.user.email })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const signUp = async (email: string, password: string, metadata?: { full_name?: string; role?: string }, inviteCode?: string) => {
    const redirectUrl = new URL(`${window.location.origin}/auth/callback`)
    if (inviteCode) redirectUrl.searchParams.set('invite', inviteCode)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { ...metadata, ...(inviteCode && { invite_code: inviteCode }) },
        emailRedirectTo: redirectUrl.toString(),
      },
    })
    return { data, error: error as Error | null }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error as Error | null }
  }

  const signInWithGoogle = async (inviteCode?: string) => {
    const redirectUrl = new URL(`${window.location.origin}/auth/callback`)
    if (inviteCode) redirectUrl.searchParams.set('invite', inviteCode)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl.toString(),
      },
    })
    return { error: error as Error | null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error: error as Error | null }
  }

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password })
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
    // During SSR, return safe defaults instead of throwing
    if (typeof window === 'undefined') {
      return {
        user: null,
        session: null,
        signUp: async () => ({ data: null, error: new Error('Not available during SSR') }),
        signIn: async () => ({ error: new Error('Not available during SSR') }),
        signInWithGoogle: async () => ({ error: new Error('Not available during SSR') }),
        signOut: async () => {},
        resetPassword: async () => ({ error: new Error('Not available during SSR') }),
        updatePassword: async () => ({ error: new Error('Not available during SSR') }),
      }
    }
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
