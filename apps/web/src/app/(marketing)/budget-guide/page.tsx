import Link from 'next/link'
import { DollarSign, TrendingUp, ArrowRight } from 'lucide-react'
import { getPublicBudgetTemplates } from '@/lib/public-data'
import { getBudgetStatsByCategory, formatBudgetPrice } from '@tdc/shared/utils'
import { PublicBudgetBrowser } from '@/components/marketing/PublicBudgetBrowser'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Baby Budget Guide — What You\'ll Actually Spend | The Dad Center',
  description:
    'A comprehensive, dad-friendly baby budget guide covering every expense from pregnancy through toddlerhood. See real price ranges and plan ahead.',
  openGraph: {
    title: 'Baby Budget Guide — What You\'ll Actually Spend | The Dad Center',
    description: 'Plan your baby expenses with our comprehensive budget guide. Real price ranges from pregnancy through 12+ months.',
  },
}

export default async function PublicBudgetPage() {
  const templates = await getPublicBudgetTemplates()

  // Calculate stats
  const stats = getBudgetStatsByCategory(templates)
  const totalMin = Object.values(stats).reduce((sum, s) => sum + s.totalMin, 0)
  const totalMax = Object.values(stats).reduce((sum, s) => sum + s.totalMax, 0)
  const totalItems = templates.length
  const categories = new Set(templates.map(t => t.category.split(' - ')[0].trim()))

  return (
    <div className="min-h-screen bg-[--bg]">
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-[--surface] via-[--bg] to-[--bg]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-copper/5 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 text-gold font-ui font-medium text-sm mb-6">
              <DollarSign className="h-4 w-4" />
              Budget Guide
            </span>

            {/* Title */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[--white] mb-6">
              What you&apos;ll{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-copper to-gold">
                actually spend
              </span>
            </h1>

            {/* Description */}
            <p className="font-body text-lg text-[--muted] mb-10 max-w-2xl mx-auto">
              A comprehensive, no-BS breakdown of baby expenses from pregnancy through toddlerhood.
              Real price ranges, not generic advice.
            </p>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-10">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <DollarSign className="h-5 w-5 text-copper" />
                  <span className="font-display text-3xl font-bold text-[--white]">{totalItems}</span>
                </div>
                <span className="font-ui text-sm text-[--dim]">Items Tracked</span>
              </div>

              <div className="hidden sm:block w-px h-12 bg-[--border]" />

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <TrendingUp className="h-5 w-5 text-copper" />
                  <span className="font-display text-3xl font-bold text-[--white]">{categories.size}</span>
                </div>
                <span className="font-ui text-sm text-[--dim]">Categories</span>
              </div>

              <div className="hidden sm:block w-px h-12 bg-[--border]" />

              <div className="text-center">
                <span className="font-display text-2xl font-bold text-[--white]">
                  {formatBudgetPrice(totalMin)}-{formatBudgetPrice(totalMax)}
                </span>
                <span className="font-ui text-sm text-[--dim] block">Est. Total Range</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browser */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PublicBudgetBrowser templates={templates} />
      </div>

      {/* Bottom CTA */}
      <section className="relative py-20 bg-[--surface]">
        <div className="absolute inset-0 bg-gradient-to-b from-[--bg] via-[--surface] to-[--surface]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-8 md:p-12 rounded-2xl bg-gradient-to-br from-copper/10 to-[--surface] border border-copper/20">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[--white] mb-4">
              Track Your Own Baby Budget
            </h2>
            <p className="font-body text-[--muted] mb-8 max-w-xl mx-auto">
              Sign up to add items to your personal budget, track purchases, compare premium vs. value brands,
              and share with your partner.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-copper hover:bg-copper/80 text-white font-ui font-semibold"
              >
                <Link href="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-[--border] text-[--cream] hover:bg-[--card] hover:text-[--white] font-ui font-semibold"
              >
                <Link href="/#pricing">See Pricing</Link>
              </Button>
            </div>

            <p className="font-body mt-6 text-sm text-[--dim]">
              Free for 30 days — no credit card needed.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
