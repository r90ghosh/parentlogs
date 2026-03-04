import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Jost, Karla } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/sonner'
import { FloatingParticles } from '@/components/ui/animations/FloatingParticles'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
})

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600'],
})

const karla = Karla({
  subsets: ['latin'],
  variable: '--font-ui',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'The Dad Center - Your Parenting Command Center',
  description: 'Expert-curated tasks, weekly briefings, and partner sync for pregnancy through early parenthood.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/images/logo.png' },
      { url: '/favicon.ico', sizes: '48x48' },
    ],
    apple: [
      { url: '/images/logo.png', sizes: '180x180' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'The Dad Center',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#12100e',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${playfair.variable} ${jost.variable} ${karla.variable} font-body antialiased`}>
        <Providers>
          <FloatingParticles count={12} />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
