import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // 100% error sampling
  sampleRate: 1.0,

  // 20% performance/transaction sampling
  tracesSampleRate: 0.2,

  // Filter noisy errors
  ignoreErrors: [
    'ChunkLoadError',
    'Loading chunk',
    'NetworkError',
    'Failed to fetch',
    'Load failed',
    'AbortError',
    'ResizeObserver loop',
  ],

  // Gate performance transactions on cookie consent
  beforeSendTransaction(event) {
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('cookie-consent')
      if (consent !== 'accepted') return null
    }
    return event
  },

  enabled: process.env.NODE_ENV === 'production',
})
