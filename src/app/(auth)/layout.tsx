import { ReactNode } from 'react'
import { Logo } from '@/components/ui/logo'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-surface-950">
      <header className="p-4">
        <Logo size="md" variant="dark" />
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
    </div>
  )
}
