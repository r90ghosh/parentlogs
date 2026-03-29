import Link from 'next/link'
import {
  Zap,
  Scale,
  Heart,
  Users,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/animations/Reveal'
import { Card3DTilt } from '@/components/ui/animations/Card3DTilt'
import { MagneticButton } from '@/components/ui/animations/MagneticButton'

const values = [
  {
    icon: Zap,
    title: 'Speed to Value',
    description:
      'Useful content within 60 seconds. No fluff, no filler — just the specific numbers and actionable guidance you need right now.',
    color: 'copper',
  },
  {
    icon: Scale,
    title: 'Neutral Third Party',
    description:
      'The app is the authority, not either partner. When disagreements happen, The Dad Center provides data-backed, judgment-free guidance.',
    color: 'sky',
  },
  {
    icon: Heart,
    title: 'Dad-First, Not Dad-Only',
    description:
      'Designed for dads but built for the whole family. Moms get tailored content and the same powerful tools. One voice, two perspectives.',
    color: 'rose',
  },
  {
    icon: Users,
    title: 'One Family, One Subscription',
    description:
      'Both partners share full access with a single plan. No double billing, no separate accounts — your family moves through this together.',
    color: 'gold',
  },
]

const colorMap: Record<string, { border: string; bg: string; icon: string }> = {
  copper: {
    border: 'border-copper/30',
    bg: 'from-copper/8 to-transparent',
    icon: 'text-copper',
  },
  sky: {
    border: 'border-sky/30',
    bg: 'from-sky/8 to-transparent',
    icon: 'text-sky',
  },
  rose: {
    border: 'border-rose/30',
    bg: 'from-rose/8 to-transparent',
    icon: 'text-rose',
  },
  gold: {
    border: 'border-gold/30',
    bg: 'from-gold/8 to-transparent',
    icon: 'text-gold',
  },
}

export function AboutContent() {
  return (
    <div className="pt-32 pb-16 sm:py-24 md:py-32">
      {/* Hero */}
      <section className="max-w-[1100px] mx-auto px-4 sm:px-6 text-center mb-20 sm:mb-28">
        <Reveal>
          <span className="section-pre mb-5 justify-center">Our Mission</span>
        </Reveal>
        <Reveal delay={120}>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-[--cream] leading-tight mb-6">
            Built by dads, for dads
            <br className="hidden sm:block" />
            <span className="text-gradient-copper"> who refuse to wing it</span>
          </h1>
        </Reveal>
        <Reveal delay={240}>
          <p className="font-body text-base sm:text-lg text-[--muted] max-w-2xl mx-auto leading-relaxed">
            Fatherhood shouldn&apos;t feel like improvisation. The Dad Center gives you
            week-by-week guidance, actionable tasks, and partner sync — so you
            show up prepared, not panicked.
          </p>
        </Reveal>
      </section>

      {/* Values Grid */}
      <section className="max-w-[1100px] mx-auto px-4 sm:px-6 mb-20 sm:mb-28">
        <Reveal>
          <span className="section-pre mb-5">What We Believe</span>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[--cream] mb-12">
            Four principles that shape everything we build
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {values.map((value, index) => {
            const colors = colorMap[value.color]
            return (
              <Reveal key={value.title} delay={120 + index * 100} className="h-full">
                <Card3DTilt maxTilt={3} gloss className="h-full">
                  <div
                    className={`rounded-2xl p-6 sm:p-8 border ${colors.border} bg-gradient-to-br ${colors.bg} bg-[--card] h-full`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl bg-[--surface] flex items-center justify-center mb-4 border border-[--border]`}
                    >
                      <value.icon className={`h-5 w-5 ${colors.icon}`} />
                    </div>
                    <h3 className="font-display text-lg sm:text-xl font-bold text-[--cream] mb-2">
                      {value.title}
                    </h3>
                    <p className="font-body text-sm sm:text-[15px] text-[--muted] leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </Card3DTilt>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* The Story */}
      <section className="max-w-[1100px] mx-auto px-4 sm:px-6 mb-20 sm:mb-28">
        <div className="max-w-3xl">
          <Reveal>
            <span className="section-pre mb-5">The Story</span>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[--cream] mb-8">
              Why The Dad Center exists
            </h2>
          </Reveal>
          <div className="space-y-5">
            <Reveal delay={200}>
              <p className="font-body text-[15px] sm:text-base text-[--muted] leading-relaxed">
                When one dad found out he was going to be a father, he did what
                any engineer would do — he went looking for a system. A week-by-week
                playbook. Something that respected his intelligence and gave him
                specific, actionable guidance instead of vague reassurances.
              </p>
            </Reveal>
            <Reveal delay={280}>
              <p className="font-body text-[15px] sm:text-base text-[--muted] leading-relaxed">
                He found baby trackers designed for moms, forums full of
                conflicting advice, and apps that assumed dads were secondary
                passengers. Nothing felt like it was built for the way he
                thinks, plans, and prepares.
              </p>
            </Reveal>
            <Reveal delay={360}>
              <p className="font-body text-[15px] sm:text-base text-[--cream] leading-relaxed font-medium">
                So he built The Dad Center — the operating system for modern
                fatherhood. Week-by-week briefings, structured tasks, budget
                planning, partner sync, and a dad journey system that turns
                anxiety into action. No fluff. No condescension. Just the tools
                to be the dad you want to be.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1100px] mx-auto px-4 sm:px-6 text-center">
        <Reveal>
          <div className="rounded-2xl border border-copper/20 bg-gradient-to-br from-copper/6 to-gold/4 p-10 sm:p-16">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[--cream] mb-4">
              Ready to stop winging it?
            </h2>
            <p className="font-body text-[--muted] mb-8 max-w-lg mx-auto">
              Join thousands of dads who chose preparation over panic.
              Free to start — no credit card required.
            </p>
            <MagneticButton maxOffset={6}>
              <Button
                asChild
                size="lg"
                className="btn-glow-hover bg-copper hover:bg-copper-hover text-[--bg] font-ui font-semibold text-[13px] uppercase tracking-[0.08em] px-7 py-3.5 h-auto shadow-copper"
              >
                <Link href="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </MagneticButton>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
