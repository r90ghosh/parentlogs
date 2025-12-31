'use client'

import Link from 'next/link'
import { ArrowRight, Play, Shield, Users, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  const scrollToHowItWorks = () => {
    const element = document.querySelector('#how-it-works')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/10 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 mb-8 backdrop-blur-sm">
            <Shield className="h-4 w-4 text-amber-500" />
            <span className="text-sm text-slate-300">Built by dads, for dads</span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            The Operating System for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              Modern Fatherhood
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Finally, a parenting app that respects your intelligence. Week-by-week guidance,
            actionable tasks, and zero fluff.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold text-lg px-8 py-6 h-auto">
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white text-lg px-8 py-6 h-auto"
              onClick={scrollToHowItWorks}
            >
              <Play className="mr-2 h-5 w-5" />
              See How It Works
            </Button>
          </div>

          {/* Dashboard mockup */}
          <div className="relative mx-auto max-w-5xl">
            {/* Glow behind mockup */}
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 rounded-2xl blur-2xl opacity-50" />

            {/* Mockup container */}
            <div className="relative rounded-xl overflow-hidden border border-slate-700/50 bg-slate-900/80 backdrop-blur-sm shadow-2xl">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border-b border-slate-700/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-md bg-slate-700/50 text-xs text-slate-400">
                    app.parentlogs.com/dashboard
                  </div>
                </div>
              </div>

              {/* Dashboard preview content */}
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Stat cards */}
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/30">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/20">
                        <Calendar className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Current Week</p>
                        <p className="text-lg font-bold text-white">Week 24</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/30">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-500/20">
                        <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Tasks Completed</p>
                        <p className="text-lg font-bold text-white">12 / 15</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/30">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-500/20">
                        <Users className="h-5 w-5 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Partner Sync</p>
                        <p className="text-lg font-bold text-green-400">Active</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Task preview */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-slate-400 mb-3">This Week's Tasks</h3>
                  {[
                    { task: 'Schedule glucose screening test', priority: 'high', done: true },
                    { task: 'Research pediatricians in your area', priority: 'medium', done: true },
                    { task: 'Start baby registry', priority: 'medium', done: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/20">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${item.done ? 'bg-green-500 border-green-500' : 'border-slate-600'}`}>
                        {item.done && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`flex-1 text-sm ${item.done ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                        {item.task}
                      </span>
                      {item.priority === 'high' && !item.done && (
                        <span className="px-2 py-0.5 text-xs rounded bg-red-500/20 text-red-400">High</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {[
              { value: '47', label: 'Weekly Briefings' },
              { value: '200+', label: 'Pre-loaded Tasks' },
              { value: '83', label: 'Expert Videos' },
              { value: '15', label: 'Curated Checklists' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
    </section>
  )
}
