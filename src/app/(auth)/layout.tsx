import { ReactNode } from 'react'
import { Logo } from '@/components/ui/logo'
import { WarmBackground } from '@/components/ui/animations/WarmBackground'

// Force dynamic rendering — Netlify's Durable Cache doesn't invalidate
// prerendered pages on deploy, causing stale HTML with 404'd chunk references
export const dynamic = 'force-dynamic'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[--bg] relative">
      <WarmBackground />
      <header className="p-6 relative z-10">
        <Logo size="md" variant="dark" />
      </header>
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
    </div>
  )
}
