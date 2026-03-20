import Link from 'next/link'
import { CheckSquare, ArrowRight, FileText, Crown } from 'lucide-react'
import { getPublicChecklists } from '@/lib/public-data'
import { CHECKLIST_ICONS, CHECKLIST_COLORS } from '@/lib/checklist-constants'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CardEntrance } from '@/components/ui/animations/CardEntrance'
import { cn } from '@/lib/utils'

export const metadata = {
  title: 'Baby Preparation Checklists — 15 Essential Lists | The Dad Center',
  description:
    'Get organized with 15 curated baby preparation checklists covering hospital bag, nursery setup, baby essentials, and more. Made for dads.',
  openGraph: {
    title: 'Baby Preparation Checklists — 15 Essential Lists | The Dad Center',
    description: 'Get organized with 15 curated baby preparation checklists. From hospital bag to first year firsts.',
  },
}

export default async function PublicChecklistsPage() {
  const checklists = await getPublicChecklists()

  const totalItems = checklists.reduce((sum, cl) => sum + cl.itemCount, 0)
  const freeCount = checklists.filter(cl => !cl.is_premium).length

  return (
    <div className="min-h-screen bg-[--bg]">
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-[--surface] via-[--bg] to-[--bg]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-copper/5 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sage/10 text-sage font-ui font-medium text-sm mb-6">
              <CheckSquare className="h-4 w-4" />
              Preparation Checklists
            </span>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Never forget a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-copper to-gold">
                thing
              </span>
            </h1>

            <p className="font-body text-lg text-[--muted] mb-10 max-w-2xl mx-auto">
              {checklists.length} curated checklists with {totalItems}+ items covering everything from
              your hospital bag to baby&apos;s first year milestones.
            </p>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-10">
              <div className="text-center">
                <span className="font-display text-3xl font-bold text-white">{checklists.length}</span>
                <span className="font-ui text-sm text-[--dim] block">Checklists</span>
              </div>

              <div className="hidden sm:block w-px h-12 bg-[--border]" />

              <div className="text-center">
                <span className="font-display text-3xl font-bold text-white">{totalItems}+</span>
                <span className="font-ui text-sm text-[--dim] block">Items</span>
              </div>

              <div className="hidden sm:block w-px h-12 bg-[--border]" />

              <div className="text-center">
                <span className="font-display text-3xl font-bold text-white">{freeCount}</span>
                <span className="font-ui text-sm text-[--dim] block">Free Lists</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Checklists Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {checklists.map((checklist, index) => {
            const Icon = CHECKLIST_ICONS[checklist.checklist_id] || FileText
            const colors = CHECKLIST_COLORS[checklist.checklist_id] || CHECKLIST_COLORS['CL-15']

            return (
              <CardEntrance key={checklist.checklist_id} delay={Math.min(index * 80, 600)}>
                <Link href={`/baby-checklists/${checklist.checklist_id}`} className="block h-full">
                  <Card className="bg-[--surface] border-[--border] h-full transition-all hover:border-[--border-hover] hover:shadow-lg">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={cn("p-3 rounded-lg", colors.bg)}>
                          <Icon className={cn("h-6 w-6", colors.text)} />
                        </div>
                        {checklist.is_premium && (
                          <Badge variant="outline" className="text-xs border-gold/50 text-gold font-ui flex items-center gap-1">
                            <Crown className="h-3 w-3" /> Premium
                          </Badge>
                        )}
                      </div>

                      <h3 className="font-medium text-[--cream] mb-1 font-body text-lg">{checklist.name}</h3>
                      <p className="text-sm text-[--muted] mb-4 line-clamp-2 font-body">
                        {checklist.description}
                      </p>

                      <div className="flex items-center justify-between text-xs font-ui text-[--dim]">
                        <span>{checklist.itemCount} items</span>
                        <span className={colors.text}>View checklist &rarr;</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </CardEntrance>
            )
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <section className="relative py-20 bg-[--surface]">
        <div className="absolute inset-0 bg-gradient-to-b from-[--bg] via-[--surface] to-[--surface]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-8 md:p-12 rounded-2xl bg-gradient-to-br from-copper/10 to-[--surface] border border-copper/20">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
              Track Your Progress
            </h2>
            <p className="font-body text-[--muted] mb-8 max-w-xl mx-auto">
              Sign up to check off items, track your progress across all {checklists.length} checklists,
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
                className="border-[--border] text-[--cream] hover:bg-[--card] hover:text-white font-ui font-semibold"
              >
                <Link href="/#pricing">See Pricing</Link>
              </Button>
            </div>

            <p className="font-body mt-6 text-sm text-[--dim]">
              No credit card required. 30-day money-back guarantee.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
