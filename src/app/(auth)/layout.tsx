import { ReactNode } from 'react'
import { Logo } from '@/components/ui/logo'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[--bg]">
      <header className="p-6">
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
