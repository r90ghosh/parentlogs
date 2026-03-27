'use client'

import Link from 'next/link'
import { ArrowRight, BookOpen, Video, CheckCircle, Clock, Baby, Calendar, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RevealOnScroll } from '@/components/ui/animations/RevealOnScroll'
import { Card3DTilt } from '@/components/ui/animations/Card3DTilt'

// Sample articles representing actual content from the articles folder
const sampleArticles = [
  {
    id: 'week-5',
    title: 'Week 5: The Heartbeat Begins',
    excerpt: 'The test was positive. This week, a cluster of cells smaller than a sesame seed is developing its first primitive heartbeat.',
    category: 'First Trimester',
    readTime: '8 min read',
    icon: Heart,
    color: 'rose',
  },
  {
    id: 'week-8',
    title: 'Week 8: The First Ultrasound',
    excerpt: 'This is often the week when pregnancy becomes visually real. At your first ultrasound, you\'ll see a tiny fluttering heartbeat.',
    category: 'First Trimester',
    readTime: '10 min read',
    icon: Calendar,
    color: 'sky',
  },
  {
    id: 'week-20',
    title: 'Week 20: The Anatomy Scan',
    excerpt: 'The halfway point. This detailed ultrasound examines your baby\'s organs, spine, and limbs. Many parents learn the sex this week.',
    category: 'Second Trimester',
    readTime: '12 min read',
    icon: Baby,
    color: 'copper',
  },
  {
    id: 'week-36',
    title: 'Week 36: Hospital Bag Time',
    excerpt: 'Four weeks to go. Time to pack the hospital bag, finalize the birth plan, and prepare your home for the new arrival.',
    category: 'Third Trimester',
    readTime: '9 min read',
    icon: CheckCircle,
    color: 'sage',
  },
]

const colorClasses = {
  rose: {
    bg: 'bg-rose/10',
    text: 'text-rose',
    border: 'border-rose/20',
  },
  sky: {
    bg: 'bg-sky/10',
    text: 'text-sky',
    border: 'border-sky/20',
  },
  copper: {
    bg: 'bg-copper/10',
    text: 'text-copper',
    border: 'border-copper/20',
  },
  sage: {
    bg: 'bg-sage/10',
    text: 'text-sage',
    border: 'border-sage/20',
  },
}

export function ContentPreview() {
  return (
    <section className="relative py-16 sm:py-24 md:py-32">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        {/* Section header */}
        <RevealOnScroll className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="section-pre">
              Resource Library
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-[--white] mb-4">
              Explore Our Content
            </h2>
            <p className="font-body text-lg text-[--muted] max-w-2xl">
              Comprehensive, source-referenced guides written specifically for dads.
              From first positive test to toddler years.
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 md:gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <BookOpen className="h-5 w-5 text-copper" />
                <span className="font-display font-bold text-2xl text-[--white]">40+</span>
              </div>
              <span className="font-ui text-sm text-[--muted]">Articles</span>
            </div>
            <div className="w-px h-10 bg-[--dim]" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Video className="h-5 w-5 text-copper" />
                <span className="font-display font-bold text-2xl text-[--white]">65+</span>
              </div>
              <span className="font-ui text-sm text-[--muted]">Videos</span>
            </div>
            <div className="w-px h-10 bg-[--dim]" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle className="h-5 w-5 text-sage" />
              </div>
              <span className="font-ui text-sm text-[--muted]">Expert Reviewed</span>
            </div>
          </div>
        </RevealOnScroll>

        {/* Article cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {sampleArticles.map((article, index) => {
            const colors = colorClasses[article.color as keyof typeof colorClasses]
            return (
              <RevealOnScroll key={article.id} delay={80 + index * 80}>
              <Card3DTilt maxTilt={3} gloss>
              <article
                className="group relative p-6 rounded-xl bg-[--card] border border-[--border] shadow-card transition-all duration-300"
              >
                {/* Category & time */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 rounded font-ui text-xs font-medium ${colors.bg} ${colors.text}`}>
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 font-ui text-xs text-[--muted]">
                    <Clock className="h-3 w-3" />
                    {article.readTime}
                  </span>
                </div>

                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl ${colors.bg} mb-4`}>
                  <article.icon className={`h-5 w-5 ${colors.text}`} />
                </div>

                {/* Content */}
                <h3 className="font-display text-lg font-semibold text-[--white] mb-2 group-hover:text-copper transition-colors">
                  {article.title}
                </h3>
                <p className="font-body text-sm text-[--muted] line-clamp-3">
                  {article.excerpt}
                </p>

              </article>
              </Card3DTilt>
              </RevealOnScroll>
            )
          })}
        </div>

        {/* Timeline preview */}
        <div className="relative p-8 rounded-2xl bg-[--card] border border-[--border] overflow-hidden shadow-card">
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-semibold text-[--white]">Coverage Timeline</h3>
              <span className="font-ui text-xs text-[--muted] italic">From pregnancy to toddler</span>
            </div>

            {/* Timeline Bar */}
            <div className="flex h-14 rounded-xl overflow-hidden bg-[--surface] border border-[--border] mb-6">
              {[
                { label: 'Trimester 1', color: 'rgba(196, 122, 143, 0.30)', articles: 9 },
                { label: 'Trimester 2', color: 'rgba(196, 122, 143, 0.38)', articles: 14 },
                { label: 'Trimester 3', color: 'rgba(196, 112, 63, 0.35)', articles: 12 },
                { label: 'Delivery', color: 'rgba(196, 112, 63, 0.45)', articles: 2 },
                { label: '0-3 mo', color: 'rgba(212, 168, 83, 0.30)', articles: 4 },
                { label: '3-24 mo', color: 'rgba(212, 168, 83, 0.38)', articles: 6 },
              ].map((stage, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center justify-center border-r border-[--border] last:border-r-0 transition-all hover:brightness-110"
                  style={{ backgroundColor: stage.color }}
                >
                  <span className="font-ui text-sm font-semibold text-[--white] drop-shadow-sm">{stage.articles}</span>
                  <span className="font-ui text-[9px] text-[--cream]/70">{stage.label}</span>
                </div>
              ))}
            </div>

            {/* Stage cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: 'First Trimester', weeks: 'Weeks 5-13', articles: 9, color: 'rose' },
                { label: 'Second Trimester', weeks: 'Weeks 14-27', articles: 14, color: 'rose' },
                { label: 'Third Trimester', weeks: 'Weeks 28-40', articles: 12, color: 'copper' },
                { label: 'Delivery', weeks: 'Birth', articles: 2, color: 'copper' },
                { label: 'Fourth Trimester', weeks: '0-3 months', articles: 4, color: 'gold' },
                { label: 'Toddler', weeks: '3-24 months', articles: 6, color: 'gold' },
              ].map((stage, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-[--surface] border border-[--border] hover:border-[--border-hover] transition-all"
                >
                  <p className="font-ui text-sm font-medium text-[--cream] mb-1">{stage.label}</p>
                  <p className="font-ui text-xs text-[--muted] mb-2">{stage.weeks}</p>
                  <p className="font-ui text-xs text-copper">{stage.articles} articles</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg" className="border-[--border-hover] text-[--cream] hover:bg-[--card] hover:border-[--border-hover] font-ui">
            <Link href="/content">
              Browse All Resources
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
