'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="en">
      <body style={{ backgroundColor: '#12100e', color: '#faf6f0', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ maxWidth: '28rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Something went wrong</h2>
            <p style={{ color: '#7a6f62', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              A critical error occurred. Please try reloading the page.
            </p>
            <button
              onClick={reset}
              style={{
                backgroundColor: '#c4703f',
                color: '#faf6f0',
                padding: '0.5rem 1.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
