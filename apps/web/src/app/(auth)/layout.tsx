import { ReactNode } from 'react'
import Link from 'next/link'
import { BrandLogo } from '@/components/digest'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="digest-app flex min-h-screen flex-col">
      <header className="p-6 md:px-10">
        <Link href="/">
          <BrandLogo size={30} />
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  )
}
