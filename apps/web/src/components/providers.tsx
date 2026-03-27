'use client'

import { ReactNode, useState, useEffect, Suspense } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { AuthProvider } from '@/lib/auth/auth-context'
import { PartnerActivityProvider } from '@/components/shared/partner-activity'
import { ErrorBoundary } from '@/components/error/error-boundary'
import { PageLoading } from '@/components/error/loading-states'
import { initAnalytics } from '@/lib/analytics'
import { PageEngagementTracker } from '@/hooks/use-page-engagement'

// Analytics initializer — gated on cookie consent
function AnalyticsInitializer() {
  useEffect(() => {
    // Initialize if consent already given
    if (localStorage.getItem('cookie-consent') === 'accepted') {
      initAnalytics()
    }

    // Listen for consent changes (from cookie-consent banner or other tabs)
    function handleStorage(e: StorageEvent) {
      if (e.key === 'cookie-consent' && e.newValue === 'accepted') {
        initAnalytics()
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  return null
}

// Service worker registration component
function ServiceWorkerRegistration() {
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          // Check for updates periodically
          intervalId = setInterval(() => {
            registration.update()
          }, 60 * 60 * 1000) // Every hour
        })
        .catch(() => {
          // Service worker registration failed silently
        })
    }
    return () => { if (intervalId) clearInterval(intervalId) }
  }, [])

  return null
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          // Don't retry on 4xx errors
          if (error && typeof error === 'object' && 'status' in error) {
            const status = (error as { status: number }).status
            if (status >= 400 && status < 500) return false
          }
          return failureCount < 3
        },
      },
      mutations: {
        retry: false,
      },
    },
  }))

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <PartnerActivityProvider>
              <Suspense fallback={<PageLoading />}>
                {children}
              </Suspense>
              <AnalyticsInitializer />
              <PageEngagementTracker />
              <ServiceWorkerRegistration />
            </PartnerActivityProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </ThemeProvider>
  )
}
