'use client'

import { ReactNode, useState, useEffect, Suspense } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { AuthProvider } from '@/lib/auth/auth-context'
import { PartnerActivityProvider } from '@/components/shared/partner-activity'
import { ErrorBoundary } from '@/components/error/error-boundary'
import { PageLoading } from '@/components/error/loading-states'
import { initAnalytics } from '@/lib/analytics'

// Analytics initializer component
function AnalyticsInitializer() {
  useEffect(() => {
    initAnalytics()
  }, [])

  return null
}

// Service worker registration component
function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[SW] Registered:', registration.scope)

          // Check for updates periodically
          setInterval(() => {
            registration.update()
          }, 60 * 60 * 1000) // Every hour
        })
        .catch((error) => {
          console.error('[SW] Registration failed:', error)
        })
    }
  }, [])

  return null
}

// Online/offline status tracker
function OnlineStatusTracker() {
  useEffect(() => {
    const handleOnline = () => {
      console.log('[App] Online')
      // Could show toast notification
    }

    const handleOffline = () => {
      console.log('[App] Offline')
      // Could show toast notification
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
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
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider>
            <PartnerActivityProvider>
              <Suspense fallback={<PageLoading />}>
                {children}
              </Suspense>
              <AnalyticsInitializer />
              <ServiceWorkerRegistration />
              <OnlineStatusTracker />
            </PartnerActivityProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
