import { Metadata } from 'next'
import Link from 'next/link'
import { WarmBackground } from '@/components/ui/animations/WarmBackground'

export const metadata: Metadata = {
  title: 'Page Not Found - The Dad Center',
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[--bg] relative">
      <WarmBackground />
      <div className="max-w-md text-center space-y-6 relative z-10">
        <p className="font-ui text-7xl font-bold text-[--copper]">404</p>
        <h1 className="font-display text-2xl font-bold text-[--white]">
          Page Not Found
        </h1>
        <p className="font-body text-sm text-[--muted]">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[--copper] text-[--white] font-ui text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
