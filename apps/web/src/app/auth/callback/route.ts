import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const nextParam = searchParams.get('next')
  const next = nextParam && nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/dashboard'
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // Handle OAuth errors
  if (error) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorDescription || error)}`)
  }

  if (code) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            } catch {
              // Cookies can only be set in Server Actions or Route Handlers
            }
          },
        },
      }
    )

    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(exchangeError.message)}`)
    }

    // Check if user has completed onboarding
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('onboarding_completed, family_id')
      .eq('id', data.user!.id)
      .single()

    // Check for invite code from URL param (emailRedirectTo) or user metadata
    const inviteParam = searchParams.get('invite')
    const inviteFromMeta = data.user?.user_metadata?.invite_code as string | undefined
    const inviteCode = inviteParam || inviteFromMeta

    // Determine redirect destination based on user state
    let redirectTo = next

    if (profileError || !profile) {
      redirectTo = '/onboarding'
    } else if (!profile.onboarding_completed) {
      redirectTo = '/onboarding'
    } else if (!profile.family_id) {
      redirectTo = '/onboarding/family'
    }

    // Append invite code to onboarding redirects so it survives cross-browser
    if (inviteCode && redirectTo.startsWith('/onboarding') && !redirectTo.includes('/family')) {
      const redirectUrl = new URL(`${origin}${redirectTo}`)
      redirectUrl.searchParams.set('invite', inviteCode)
      return NextResponse.redirect(redirectUrl)
    }

    return NextResponse.redirect(`${origin}${redirectTo}`)
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}
