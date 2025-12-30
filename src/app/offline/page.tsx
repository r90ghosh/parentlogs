'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { WifiOff, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleRetry = () => {
    window.location.reload()
  }

  // If back online, redirect to home
  useEffect(() => {
    if (isOnline) {
      window.location.href = '/dashboard'
    }
  }, [isOnline])

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-surface-900 border-surface-800">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-surface-800 flex items-center justify-center">
            <WifiOff className="h-10 w-10 text-surface-400" />
          </div>
          <CardTitle className="text-2xl text-white">You&apos;re Offline</CardTitle>
          <CardDescription>
            It looks like you&apos;ve lost your internet connection. Don&apos;t worry, some features are still available.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-surface-800/50 rounded-lg">
            <h3 className="font-medium text-white mb-2">Available offline:</h3>
            <ul className="text-sm text-surface-400 space-y-1">
              <li>• View cached pages</li>
              <li>• Browse previously loaded content</li>
              <li>• Changes will sync when back online</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={handleRetry} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Link>
            </Button>
          </div>

          <p className="text-xs text-center text-surface-500">
            Your data is safe and will automatically sync when you&apos;re back online.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
