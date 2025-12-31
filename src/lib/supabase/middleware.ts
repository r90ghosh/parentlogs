import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  console.log('[Middleware] Processing request:', pathname)

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const startTime = Date.now()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  console.log('[Middleware] getUser completed in', Date.now() - startTime, 'ms')
  console.log('[Middleware] User:', user ? user.email : 'null')
  if (error) console.error('[Middleware] getUser error:', error.message)

  // Protected routes
  const protectedPaths = ['/dashboard', '/tasks', '/calendar', '/tracker', '/briefing', '/budget', '/checklists', '/settings']
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))

  if (isProtectedPath && !user) {
    console.log('[Middleware] Protected path accessed without user, redirecting to /login')
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Redirect logged-in users away from auth pages (but not onboarding)
  const authPaths = ['/login', '/signup']
  const isAuthPath = authPaths.some(path => pathname.startsWith(path))

  if (isAuthPath && user) {
    console.log('[Middleware] Auth path accessed with user, redirecting to /dashboard')
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  console.log('[Middleware] Allowing request to proceed')
  return supabaseResponse
}
