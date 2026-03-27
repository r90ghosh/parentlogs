import * as Sentry from '@sentry/react-native'

export function initSentry() {
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.2,
    sampleRate: 1.0,
    environment: __DEV__ ? 'development' : 'production',
    enabled: !__DEV__,

    // Filter noisy errors (matching web config)
    ignoreErrors: [
      'Network request failed',
      'Failed to fetch',
      'Load failed',
      'AbortError',
      'TypeError: cancelled',
      'TypeError: NetworkError',
    ],
  })
}

export function setSentryUser(userId: string, email?: string) {
  Sentry.setUser({ id: userId, email })
}

export function clearSentryUser() {
  Sentry.setUser(null)
}

export { Sentry }
