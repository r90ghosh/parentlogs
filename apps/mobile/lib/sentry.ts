import * as Sentry from '@sentry/react-native'

export function initSentry() {
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.2,
    sampleRate: 1.0,
    environment: __DEV__ ? 'development' : 'production',
    enabled: !__DEV__,
  })
}

export { Sentry }
