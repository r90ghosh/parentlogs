'use client'

import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, LogIn } from 'lucide-react'
import Link from 'next/link'

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md text-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-[--coral] mx-auto" />
        <h2 className="font-display text-xl font-bold text-[--white]">Something went wrong</h2>
        <p className="font-body text-sm text-[--muted]">
          We hit an unexpected error. Please try again.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/login" className="gap-2">
              <LogIn className="h-4 w-4" />
              Sign In
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
