'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/ui/animations/Reveal'
import { MagneticButton } from '@/components/ui/animations/MagneticButton'
import { Card3DTilt } from '@/components/ui/animations/Card3DTilt'

function SplitLetterHeading() {
  const ref = useRef<HTMLHeadingElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      setVisible(true)
      return
    }
    // Double RAF to ensure layout is complete
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true))
    })
  }, [])

  const line1 = 'The operating system'
  const line2 = 'for modern'
  const line3 = 'fatherhood'

  let globalIndex = 0

  const renderChars = (text: string, italic = false) => {
    const words = text.split(' ')
    const result: React.ReactNode[] = []

    words.forEach((word, wordIndex) => {
      if (wordIndex > 0) {
        globalIndex++
        result.push(<span key={`sp-${globalIndex}`} className="inline-block w-[0.28em]" />)
      }
      const wordChars = word.split('').map((char) => {
        const idx = globalIndex++
        return (
          <span
            key={`ch-${idx}`}
            className={italic ? 'italic text-copper' : ''}
            style={{
              display: 'inline-block',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(40px)',
              transition: `opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)`,
              transitionDelay: `${idx * 30}ms`,
            }}
          >
            {char}
          </span>
        )
      })
      result.push(
        <span key={`word-${wordIndex}`} className="inline-flex whitespace-nowrap">
          {wordChars}
        </span>
      )
    })

    return result
  }

  return (
    <h1
      ref={ref}
      className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-[--cream] leading-[1.1] mb-6"
      aria-label="The operating system for modern fatherhood"
    >
      {renderChars(line1)}
      <span className="inline-block w-[0.28em]" />
      {(() => { globalIndex++; return null })()}
      {renderChars(line2, true)}
      <span className="inline-block w-[0.28em]" />
      {(() => { globalIndex++; return null })()}
      {renderChars(line3)}
    </h1>
  )
}

function AnimatedSubtitle() {
  return (
    <p
      className="font-body font-light text-lg sm:text-xl max-w-[560px] mx-auto leading-[1.65] mb-11"
      style={{
        background: 'linear-gradient(135deg, var(--muted) 0%, var(--cream) 40%, var(--muted) 80%, var(--gold) 100%)',
        backgroundSize: '200% 200%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: 'subtitleGradient 8s ease infinite',
      }}
    >
      Finally, a parenting app that respects your intelligence. Week-by-week
      guidance, actionable tasks, and zero fluff.
    </p>
  )
}

function ParallaxOrbs() {
  const orb1Ref = useRef<HTMLDivElement>(null)
  const orb2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) return

    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => {
          const y = window.scrollY
          if (orb1Ref.current) orb1Ref.current.style.transform = `translateY(${y * 0.25}px)`
          if (orb2Ref.current) orb2Ref.current.style.transform = `translateY(${y * 0.18}px)`
          ticking = false
        })
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div
        ref={orb1Ref}
        className="absolute pointer-events-none"
        aria-hidden="true"
        style={{
          width: 500,
          height: 500,
          top: '5%',
          right: -120,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(196,112,63,0.06) 0%, transparent 70%)',
        }}
      />
      <div
        ref={orb2Ref}
        className="absolute pointer-events-none"
        aria-hidden="true"
        style={{
          width: 300,
          height: 300,
          bottom: '15%',
          left: -60,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,168,83,0.05) 0%, transparent 70%)',
        }}
      />
    </>
  )
}

function DashboardPreview() {
  return (
    <Card3DTilt maxTilt={8} gloss>
      <div
        className="rounded-xl overflow-hidden border border-[--border] bg-[--card] shadow-lift"
        style={{ borderTop: '2px solid transparent', borderImage: 'linear-gradient(90deg, var(--copper), var(--gold)) 1' }}
      >
        {/* Dashboard label */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[--border]">
          <span className="font-ui text-[10px] uppercase tracking-[0.1em] text-[--dim]">Your Dashboard</span>
          <span className="font-ui text-[10px] uppercase tracking-[0.1em] text-[--dim]">Week 28</span>
        </div>

        <div className="p-5 space-y-4">
          {/* Mood row */}
          <div className="flex justify-center gap-3">
            {['😟', '😐', '🙂', '😊', '🔥'].map((emoji, i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border ${
                  i === 3
                    ? 'border-copper bg-copper-dim'
                    : 'border-[--border] bg-[--surface]'
                }`}
              >
                {emoji}
              </div>
            ))}
          </div>

          {/* Task items */}
          <div className="space-y-2">
            {[
              { text: 'Schedule glucose screening', done: true },
              { text: 'Research pediatricians', done: true },
              { text: 'Start baby registry', done: false, badge: 'Must-do' },
              { text: 'Pack hospital bag', done: false },
            ].map((task, i) => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[--surface] border border-[--border]">
                <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${task.done ? 'bg-copper border-copper' : 'border-[--dim]'}`}>
                  {task.done && (
                    <svg className="w-2.5 h-2.5 text-[--bg]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`font-ui text-xs flex-1 ${task.done ? 'text-[--muted] line-through' : 'text-[--cream]'}`}>
                  {task.text}
                </span>
                {task.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-ui font-medium rounded bg-copper/15 text-copper border border-copper/25">
                    {task.badge}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-ui text-[--muted] mb-1">
              <span>Progress</span>
              <span className="text-copper">62%</span>
            </div>
            <div className="h-1.5 rounded-full bg-[--surface] overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: '62%',
                  background: 'linear-gradient(90deg, var(--copper), var(--gold))',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card3DTilt>
  )
}

export function Hero() {
  const scrollToHowItWorks = () => {
    const element = document.querySelector('#how-it-works')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden" style={{ padding: '100px 0 80px' }}>
      <ParallaxOrbs />

      <div className="relative max-w-[1100px] mx-auto px-4 sm:px-6 z-[1]">
        <div className="text-center">
          {/* Pre-label */}
          <Reveal>
            <span className="section-pre mb-5 justify-center">For Modern Dads</span>
          </Reveal>

          {/* Split-letter heading */}
          <SplitLetterHeading />

          {/* Animated gradient subtitle */}
          <Reveal delay={160}>
            <AnimatedSubtitle />
          </Reveal>

          {/* CTA buttons */}
          <Reveal delay={240}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <MagneticButton maxOffset={6}>
                <Button asChild size="lg" className="btn-glow-hover bg-copper hover:bg-copper-hover text-[--bg] font-ui font-semibold text-[13px] uppercase tracking-[0.08em] px-7 py-3.5 h-auto shadow-copper">
                  <Link href="/signup">
                    Start Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </MagneticButton>
              <Button
                variant="outline"
                size="lg"
                className="border-copper/50 text-[--cream] hover:bg-copper hover:text-[--bg] font-ui font-semibold text-[13px] uppercase tracking-[0.08em] px-7 py-3.5 h-auto transition-all"
                onClick={scrollToHowItWorks}
              >
                <Play className="mr-2 h-5 w-5" />
                See How It Works
              </Button>
            </div>
          </Reveal>

          {/* Dashboard preview with 3D tilt */}
          <Reveal delay={320}>
            <div className="mx-auto max-w-[640px]" style={{ perspective: '1000px' }}>
              <DashboardPreview />
            </div>
          </Reveal>

          {/* Trust bar stats */}
          <Reveal delay={400}>
            <div className="mt-12 sm:mt-16 flex flex-wrap justify-center gap-4 sm:gap-8 md:gap-12">
              {[
                { value: 'Built for', label: 'First-Time Dads' },
                { value: '200+', label: 'Pre-loaded Tasks' },
                { value: '60+', label: 'Weekly Briefings' },
                { value: 'Evidence-Based', label: 'Source-Referenced' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-[--cream] mb-1">{stat.value}</p>
                  <p className="font-ui text-[11px] uppercase tracking-[0.08em] text-[--muted]">{stat.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
