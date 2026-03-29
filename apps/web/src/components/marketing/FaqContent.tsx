'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Mail, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/animations/Reveal'
import { Card3DTilt } from '@/components/ui/animations/Card3DTilt'
import { MagneticButton } from '@/components/ui/animations/MagneticButton'

interface FaqItem {
  q: string
  a: string
}

interface FaqCategory {
  title: string
  items: FaqItem[]
}

const faqCategories: FaqCategory[] = [
  {
    title: 'General',
    items: [
      {
        q: 'What is The Dad Center?',
        a: 'The Dad Center is a pregnancy and parenting companion app designed to keep dads informed, prepared, and connected. Think of it as the operating system for modern fatherhood — week-by-week briefings, structured tasks, budget planning, and partner sync all in one place.',
      },
      {
        q: 'Who is this app for?',
        a: 'Primarily for expectant and new dads, but it works for the whole family. Moms get tailored content and the same tools. Whether you\'re 8 weeks in or 8 months postpartum, the app meets you where you are.',
      },
      {
        q: 'Can moms use The Dad Center?',
        a: 'Absolutely. While we lead with a dad-first voice, the app is fully role-aware. Moms see content tailored to their perspective and have access to all the same features — tasks, briefings, budget, tracker, and more.',
      },
      {
        q: 'Is this a medical app?',
        a: 'No. The Dad Center provides general pregnancy and parenting information for educational purposes only. Our briefings cite sources like ACOG and AAP guidelines, but this is not a substitute for professional medical advice. Always consult your healthcare provider.',
      },
    ],
  },
  {
    title: 'Subscription & Billing',
    items: [
      {
        q: 'How does the family subscription work?',
        a: 'One subscription covers your whole family. Both you and your partner share full Premium access with a single plan — no need for separate subscriptions.',
      },
      {
        q: 'How much does it cost?',
        a: 'Monthly: $4.99/mo. Yearly: $39.99/yr ($3.33/mo — save 33%). Lifetime: $99.99 one-time. All plans include full access for both partners.',
      },
      {
        q: 'What do I get for free?',
        a: 'Free accounts get a 30-day task window, 4 weeks of briefings from signup, core tracker features, and access to the dashboard. It\'s designed to feel complete, not crippled.',
      },
      {
        q: 'Can I cancel anytime?',
        a: 'Yes. Cancel your subscription at any time — no questions asked. You keep access through the end of your billing period, and your data stays safe on the free tier.',
      },
      {
        q: 'Do you offer refunds?',
        a: 'Yes. If you\'re not satisfied within the first 7 days of a new subscription, contact us for a full refund.',
      },
    ],
  },
  {
    title: 'Features',
    items: [
      {
        q: 'What are weekly briefings?',
        a: 'Each week you get a concise briefing covering baby\'s development, what your partner may be experiencing, things to do this week, and practical dad-specific guidance. Think of it as your weekly shift briefing for fatherhood.',
      },
      {
        q: 'How does partner sync work?',
        a: 'Invite your partner with a family code. You both see shared tasks, can assign items to each other, and stay in sync on the journey. One person completing a task updates it for both.',
      },
      {
        q: 'What is the Budget Planner?',
        a: 'A phase-by-phase breakdown of what things actually cost — from prenatal vitamins to daycare. Each item includes best-value and premium options with real pricing so you can plan ahead.',
      },
      {
        q: 'What is the Dad Journey?',
        a: 'Seven challenge pillars — Knowledge, Planning, Finances, Anxiety, Baby Bonding, Relationship, and Extended Family — with guided content to help you grow in each area. It turns anxiety into action.',
      },
      {
        q: 'Do I get push notifications?',
        a: 'Premium users get push notifications for task reminders, new briefings, and partner activity. Free users get notifications for 30 days from signup.',
      },
    ],
  },
  {
    title: 'Privacy & Data',
    items: [
      {
        q: 'How is my data handled?',
        a: 'Your data is stored securely with industry-standard encryption. We never sell your data to third parties. See our Privacy Policy for full details.',
      },
      {
        q: 'Can I delete my account?',
        a: 'Yes. Go to Settings and scroll to "Delete Account." This permanently removes all your data and cannot be undone. Active subscriptions are cancelled automatically.',
      },
      {
        q: 'What happens to my data if I cancel Premium?',
        a: 'Your data stays safe. Cancelling Premium reverts you to the free tier — you keep access to your data within the free window. Re-subscribe anytime to unlock everything again.',
      },
    ],
  },
]

function FaqAccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-[--border] last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 px-5 sm:px-6 text-left cursor-pointer bg-transparent appearance-none border-0 hover:bg-[--card-hover] transition-colors"
      >
        <span className="font-ui text-[15px] font-medium text-[--cream] pr-4">
          {item.q}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="shrink-0"
        >
          <ChevronDown className="h-4 w-4 text-[--muted]" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="px-5 sm:px-6 pb-5 font-body text-sm sm:text-[15px] text-[--muted] leading-relaxed">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FaqContent() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  function toggleItem(key: string) {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="pt-32 pb-16 sm:py-24 md:py-32">
      {/* Hero */}
      <section className="max-w-[1100px] mx-auto px-4 sm:px-6 text-center mb-16 sm:mb-24">
        <Reveal>
          <span className="section-pre mb-5 justify-center">
            Help Center
          </span>
        </Reveal>
        <Reveal delay={120}>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[--cream] leading-tight mb-6">
            Frequently Asked Questions
          </h1>
        </Reveal>
        <Reveal delay={240}>
          <p className="font-body text-base sm:text-lg text-[--muted] max-w-2xl mx-auto">
            Everything you need to know about The Dad Center. Can&apos;t find
            your answer? Reach out — we&apos;re real people, and we respond fast.
          </p>
        </Reveal>
      </section>

      {/* FAQ Categories */}
      <section className="max-w-[800px] mx-auto px-4 sm:px-6 mb-20 sm:mb-28">
        <div className="space-y-8">
          {faqCategories.map((category, catIndex) => (
            <Reveal key={category.title} delay={80 + catIndex * 100}>
              <Card3DTilt maxTilt={2} gloss>
                <div className="rounded-2xl bg-[--card] border border-[--border] overflow-hidden">
                  <div className="px-5 sm:px-6 py-4 border-b border-[--border] bg-[--surface]">
                    <h2 className="font-display text-lg font-bold text-[--cream]">
                      {category.title}
                    </h2>
                  </div>
                  {category.items.map((item, itemIndex) => {
                    const key = `${catIndex}-${itemIndex}`
                    return (
                      <FaqAccordionItem
                        key={key}
                        item={item}
                        isOpen={!!openItems[key]}
                        onToggle={() => toggleItem(key)}
                      />
                    )
                  })}
                </div>
              </Card3DTilt>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="max-w-[800px] mx-auto px-4 sm:px-6 text-center">
        <Reveal>
          <div className="rounded-2xl border border-[--border] bg-[--card] p-10 sm:p-14">
            <div className="w-12 h-12 rounded-xl bg-copper/10 border border-copper/20 flex items-center justify-center mx-auto mb-5">
              <Mail className="h-6 w-6 text-copper" />
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[--cream] mb-3">
              Still have questions?
            </h2>
            <p className="font-body text-[--muted] mb-8 max-w-md mx-auto">
              We typically respond within 24 hours. No bots, no ticket numbers
              — just a real person who wants to help.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <MagneticButton maxOffset={4}>
                <Button
                  asChild
                  className="bg-copper hover:bg-copper-hover text-[--bg] font-ui font-semibold shadow-copper"
                >
                  <a href="mailto:info@thedadcenter.com">
                    <Mail className="mr-2 h-4 w-4" />
                    Email Us
                  </a>
                </Button>
              </MagneticButton>
              <MagneticButton maxOffset={4}>
                <Button
                  asChild
                  variant="outline"
                  className="border-[--border] text-[--cream] hover:bg-[--card-hover] font-ui"
                >
                  <Link href="/signup">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </MagneticButton>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
