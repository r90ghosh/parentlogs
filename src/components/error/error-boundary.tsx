'use client'

import { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import Link from 'next/link'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo })

    // Log to console in development
    console.error('Error caught by boundary:', error, errorInfo)

    // In production, you would send this to an error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Send to analytics/error tracking
      this.logErrorToService(error, errorInfo)
    }
  }

  logErrorToService(error: Error, errorInfo: React.ErrorInfo) {
    // Implementation would send to Sentry, LogRocket, etc.
    console.log('Would log to error service:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-surface-900 border-surface-800">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <CardTitle className="text-xl text-white">Something went wrong</CardTitle>
              <CardDescription>
                An unexpected error occurred. We&apos;ve been notified and are working on it.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="p-3 bg-surface-800 rounded-lg overflow-auto max-h-32">
                  <p className="text-xs font-mono text-red-400">
                    {this.state.error.message}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Button onClick={this.handleReset} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button onClick={this.handleReload} variant="outline" className="w-full">
                  Reload Page
                </Button>
                <Button variant="ghost" asChild className="w-full">
                  <Link href="/dashboard">
                    <Home className="mr-2 h-4 w-4" />
                    Go to Dashboard
                  </Link>
                </Button>
              </div>

              <div className="text-center">
                <a
                  href="mailto:support@parentlogs.com"
                  className="text-xs text-surface-500 hover:text-surface-400 inline-flex items-center gap-1"
                >
                  <Bug className="h-3 w-3" />
                  Report this issue
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook for functional components to trigger error boundary
export function useErrorBoundary() {
  const throwError = (error: Error) => {
    throw error
  }
  return { throwError }
}
