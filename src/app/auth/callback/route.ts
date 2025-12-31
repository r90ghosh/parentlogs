import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  console.log('=== AUTH CALLBACK START ===')
  console.log('[Auth Callback] URL:', request.url)
  console.log('[Auth Callback] Origin:', origin)
  console.log('[Auth Callback] Code present:', !!code)
  console.log('[Auth Callback] Next redirect:', next)
  console.log('[Auth Callback] Error:', error)
  console.log('[Auth Callback] Error description:', errorDescription)

  // Handle OAuth errors
  if (error) {
    console.error('[Auth Callback] OAuth error:', error, errorDescription)
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorDescription || error)}`)
  }

  if (code) {
    console.log('[Auth Callback] Exchanging code for session...')

    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            const all = cookieStore.getAll()
            console.log('[Auth Callback] Getting cookies:', all.map(c => c.name))
            return all
          },
          setAll(cookiesToSet) {
            console.log('[Auth Callback] Setting cookies:', cookiesToSet.map(c => c.name))
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                console.log(`[Auth Callback] Setting cookie: ${name}, options:`, options)
                cookieStore.set(name, value, options)
              })
            } catch (err) {
              console.error('[Auth Callback] Error setting cookies:', err)
            }
          },
        },
      }
    )

    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('[Auth Callback] Exchange error:', exchangeError.message)
      console.error('[Auth Callback] Exchange error details:', exchangeError)
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(exchangeError.message)}`)
    }

    console.log('[Auth Callback] Session exchange successful!')
    console.log('[Auth Callback] User ID:', data.user?.id)
    console.log('[Auth Callback] User email:', data.user?.email)
    console.log('[Auth Callback] Session expires at:', data.session?.expires_at)

    // Check if user has completed onboarding
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('onboarding_completed, family_id')
      .eq('id', data.user!.id)
      .single()

    console.log('[Auth Callback] Profile check:', profile)
    console.log('[Auth Callback] Profile error:', profileError)

    // Determine redirect destination based on user state
    let redirectTo = next

    if (profileError || !profile) {
      // New user or profile not yet created - send to onboarding
      redirectTo = '/onboarding'
      console.log('[Auth Callback] No profile found (new user), redirecting to:', redirectTo)
    } else if (!profile.onboarding_completed) {
      // User hasn't completed onboarding
      redirectTo = '/onboarding'
      console.log('[Auth Callback] Onboarding not completed, redirecting to:', redirectTo)
    } else if (!profile.family_id) {
      // User completed onboarding but has no family (edge case)
      redirectTo = '/onboarding/family'
      console.log('[Auth Callback] No family set up, redirecting to:', redirectTo)
    } else {
      // Existing user with completed setup - go to dashboard
      console.log('[Auth Callback] Existing user, redirecting to:', redirectTo)
    }

    console.log('=== AUTH CALLBACK END - SUCCESS ===')

    const response = NextResponse.redirect(`${origin}${redirectTo}`)

    // Log response headers
    console.log('[Auth Callback] Response status:', response.status)
    console.log('[Auth Callback] Response headers:', Object.fromEntries(response.headers.entries()))

    return response
  }

  console.error('[Auth Callback] No code provided!')
  console.log('=== AUTH CALLBACK END - NO CODE ===')

  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}
