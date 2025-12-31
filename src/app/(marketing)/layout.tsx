import { Metadata } from 'next'
import { Header } from '@/components/marketing/Header'
import { Footer } from '@/components/marketing/Footer'

export const metadata: Metadata = {
  title: 'ParentLogs - The Operating System for Modern Fatherhood',
  description: 'Finally, a parenting app that respects your intelligence. Week-by-week guidance, actionable tasks, budget planning, and partner sync for tech-savvy dads.',
  keywords: ['parenting app', 'dad app', 'pregnancy tracker', 'new dad', 'father', 'baby planning', 'parenting tasks'],
  openGraph: {
    title: 'ParentLogs - The Operating System for Modern Fatherhood',
    description: 'Finally, a parenting app that respects your intelligence. Week-by-week guidance, actionable tasks, and zero fluff.',
    type: 'website',
    locale: 'en_US',
    siteName: 'ParentLogs',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ParentLogs - The Operating System for Modern Fatherhood',
    description: 'Finally, a parenting app that respects your intelligence. Week-by-week guidance, actionable tasks, and zero fluff.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
