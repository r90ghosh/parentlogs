'use client'

import Link from 'next/link'
import { ArrowRight, BookOpen, Video, CheckCircle, Clock, Baby, Calendar, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Sample articles representing actual content from the articles folder
const sampleArticles = [
  {
    id: 'week-5',
    title: 'Week 5: The Heartbeat Begins',
    excerpt: 'The test was positive. This week, a cluster of cells smaller than a sesame seed is developing its first primitive heartbeat.',
    category: 'First Trimester',
    readTime: '8 min read',
    icon: Heart,
    color: 'pink',
  },
  {
    id: 'week-8',
    title: 'Week 8: The First Ultrasound',
    excerpt: 'This is often the week when pregnancy becomes visually real. At your first ultrasound, you\'ll see a tiny fluttering heartbeat.',
    category: 'First Trimester',
    readTime: '10 min read',
    icon: Calendar,
    color: 'blue',
  },
  {
    id: 'week-20',
    title: 'Week 20: The Anatomy Scan',
    excerpt: 'The halfway point. This detailed ultrasound examines your baby\'s organs, spine, and limbs. Many parents learn the sex this week.',
    category: 'Second Trimester',
    readTime: '12 min read',
    icon: Baby,
    color: 'purple',
  },
  {
    id: 'week-36',
    title: 'Week 36: Hospital Bag Time',
    excerpt: 'Four weeks to go. Time to pack the hospital bag, finalize the birth plan, and prepare your home for the new arrival.',
    category: 'Third Trimester',
    readTime: '9 min read',
    icon: CheckCircle,
    color: 'green',
  },
]

const colorClasses = {
  pink: {
    bg: 'bg-pink-500/10',
    text: 'text-pink-400',
    border: 'border-pink-500/20',
  },
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
  },
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/20',
  },
  green: {
    bg: 'bg-green-500/10',
    text: 'text-green-400',
    border: 'border-green-500/20',
  },
}

export function ContentPreview() {
  return (
    <section className="relative py-24 md:py-32 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-4">
              Resource Library
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Explore Our Content
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl">
              Comprehensive, medically-reviewed guides written specifically for dads.
              From first positive test to toddler years.
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 md:gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <BookOpen className="h-5 w-5 text-amber-400" />
                <span className="text-2xl font-bold text-white">47</span>
              </div>
              <span className="text-sm text-slate-500">Articles</span>
            </div>
            <div className="w-px h-10 bg-slate-700" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Video className="h-5 w-5 text-amber-400" />
                <span className="text-2xl font-bold text-white">83</span>
              </div>
              <span className="text-sm text-slate-500">Videos</span>
            </div>
            <div className="w-px h-10 bg-slate-700" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <span className="text-sm text-slate-500">Expert Reviewed</span>
            </div>
          </div>
        </div>

        {/* Article cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {sampleArticles.map((article) => {
            const colors = colorClasses[article.color as keyof typeof colorClasses]
            return (
              <article
                key={article.id}
                className="group relative p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-300"
              >
                {/* Category & time */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${colors.bg} ${colors.text}`}>
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="h-3 w-3" />
                    {article.readTime}
                  </span>
                </div>

                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl ${colors.bg} mb-4`}>
                  <article.icon className={`h-5 w-5 ${colors.text}`} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-slate-400 line-clamp-3">
                  {article.excerpt}
                </p>

                {/* Hover effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-amber-500/5 to-transparent" />
              </article>
            )
          })}
        </div>

        {/* Timeline preview - Glassmorphism (simplified on mobile) */}
        <div className="relative p-8 rounded-2xl md:backdrop-blur-md bg-slate-900/80 md:bg-white/[0.02] border border-white/10 overflow-hidden shadow-lg">
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Coverage Timeline</h3>
              <span className="text-xs text-slate-500 italic">From pregnancy to toddler</span>
            </div>

            {/* Timeline Bar - matches the actual app style */}
            <div className="flex h-14 rounded-xl overflow-hidden md:backdrop-blur-md bg-slate-800/90 md:bg-white/[0.03] border border-white/10 mb-6">
              {[
                { label: 'Trimester 1', color: 'rgba(244, 163, 177, 0.35)', articles: 9 },
                { label: 'Trimester 2', color: 'rgba(236, 132, 155, 0.4)', articles: 14 },
                { label: 'Trimester 3', color: 'rgba(219, 112, 147, 0.45)', articles: 12 },
                { label: 'Delivery', color: 'rgba(199, 95, 138, 0.5)', articles: 2 },
                { label: '0-3 mo', color: 'rgba(167, 139, 250, 0.4)', articles: 4 },
                { label: '3-24 mo', color: 'rgba(139, 128, 245, 0.42)', articles: 6 },
              ].map((stage, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center justify-center border-r border-white/[0.06] last:border-r-0 transition-all hover:bg-white/[0.05]"
                  style={{ backgroundColor: stage.color }}
                >
                  <span className="text-sm font-semibold text-white drop-shadow-sm">{stage.articles}</span>
                  <span className="text-[9px] text-white/70">{stage.label}</span>
                </div>
              ))}
            </div>

            {/* Stage cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: 'First Trimester', weeks: 'Weeks 5-13', articles: 9, color: 'rose' },
                { label: 'Second Trimester', weeks: 'Weeks 14-27', articles: 14, color: 'rose' },
                { label: 'Third Trimester', weeks: 'Weeks 28-40', articles: 12, color: 'pink' },
                { label: 'Delivery', weeks: 'Birth', articles: 2, color: 'pink' },
                { label: 'Fourth Trimester', weeks: '0-3 months', articles: 4, color: 'violet' },
                { label: 'Toddler', weeks: '3-24 months', articles: 6, color: 'indigo' },
              ].map((stage, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-slate-800/60 md:backdrop-blur-sm md:bg-white/[0.03] border border-white/[0.08] hover:border-white/20 transition-all"
                >
                  <p className="text-sm font-medium text-white mb-1">{stage.label}</p>
                  <p className="text-xs text-slate-500 mb-2">{stage.weeks}</p>
                  <p className="text-xs text-amber-400">{stage.articles} articles</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
            <Link href="/resources">
              Browse All Resources
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
