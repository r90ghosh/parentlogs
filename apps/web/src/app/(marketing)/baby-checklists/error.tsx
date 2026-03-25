'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ChecklistsError({
  error,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="min-h-screen bg-[--bg] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="font-display text-2xl font-bold text-white mb-4">
          Something went wrong
        </h1>
        <p className="font-body text-[--muted] mb-8">
          We couldn&apos;t load the checklists. Please try again later.
        </p>
        <Button asChild className="bg-copper hover:bg-copper/80 text-white font-ui">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  )
}
