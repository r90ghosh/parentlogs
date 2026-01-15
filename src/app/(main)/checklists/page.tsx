'use client'

import { useChecklists } from '@/hooks/use-checklists'
import { useRequirePremium } from '@/hooks/use-require-auth'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import {
  Baby,
  Briefcase,
  Home,
  Heart,
  ShoppingBag,
  Plane,
  Camera,
  FileText,
  Shield,
  Stethoscope,
  Car,
  Gift,
  Users,
  Sparkles,
  Lock,
  CheckCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const CHECKLIST_ICONS: Record<string, any> = {
  'CL-01': Baby,        // Hospital Bag
  'CL-02': Home,        // Nursery Setup
  'CL-03': ShoppingBag, // Baby Essentials
  'CL-04': FileText,    // Documents & Legal
  'CL-05': Shield,      // Baby Proofing (Premium)
  'CL-06': Stethoscope, // Pediatrician Prep (Premium)
  'CL-07': Car,         // Car Safety (Premium)
  'CL-08': Gift,        // Baby Shower (Premium)
  'CL-09': Plane,       // Travel with Baby (Premium)
  'CL-10': Camera,      // Photo Milestones (Premium)
  'CL-11': Users,       // Partner Prep (Premium)
  'CL-12': Heart,       // Self-Care
  'CL-13': Briefcase,   // Return to Work
  'CL-14': Home,        // Postpartum Home
  'CL-15': Sparkles,    // First Year Firsts
}

const CHECKLIST_COLORS: Record<string, { bg: string; text: string; progress: string }> = {
  'CL-01': { bg: 'bg-blue-500/20', text: 'text-blue-400', progress: 'bg-blue-500' },
  'CL-02': { bg: 'bg-purple-500/20', text: 'text-purple-400', progress: 'bg-purple-500' },
  'CL-03': { bg: 'bg-amber-500/20', text: 'text-amber-400', progress: 'bg-amber-500' },
  'CL-04': { bg: 'bg-green-500/20', text: 'text-green-400', progress: 'bg-green-500' },
  'CL-05': { bg: 'bg-red-500/20', text: 'text-red-400', progress: 'bg-red-500' },
  'CL-06': { bg: 'bg-cyan-500/20', text: 'text-cyan-400', progress: 'bg-cyan-500' },
  'CL-07': { bg: 'bg-orange-500/20', text: 'text-orange-400', progress: 'bg-orange-500' },
  'CL-08': { bg: 'bg-pink-500/20', text: 'text-pink-400', progress: 'bg-pink-500' },
  'CL-09': { bg: 'bg-indigo-500/20', text: 'text-indigo-400', progress: 'bg-indigo-500' },
  'CL-10': { bg: 'bg-rose-500/20', text: 'text-rose-400', progress: 'bg-rose-500' },
  'CL-11': { bg: 'bg-teal-500/20', text: 'text-teal-400', progress: 'bg-teal-500' },
  'CL-12': { bg: 'bg-violet-500/20', text: 'text-violet-400', progress: 'bg-violet-500' },
  'CL-13': { bg: 'bg-slate-500/20', text: 'text-slate-400', progress: 'bg-slate-500' },
  'CL-14': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', progress: 'bg-emerald-500' },
  'CL-15': { bg: 'bg-accent-500/20', text: 'text-accent-400', progress: 'bg-accent-500' },
}

export default function ChecklistsPage() {
  const { data: checklists, isLoading } = useChecklists()
  const { isPremium } = useRequirePremium()

  return (
    <div className="p-4 space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Checklists</h1>
        <p className="text-surface-400 mt-1">
          Stay organized with our curated preparation checklists
        </p>
      </div>

      {/* Checklists Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : checklists && checklists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {checklists.map((checklist) => {
            const Icon = CHECKLIST_ICONS[checklist.checklist_id] || FileText
            const colors = CHECKLIST_COLORS[checklist.checklist_id] || CHECKLIST_COLORS['CL-15']
            const isLocked = (checklist as any).is_locked

            return (
              <Link
                key={checklist.checklist_id}
                href={isLocked ? '/settings/subscription' : `/checklists/${checklist.checklist_id}`}
                className="block"
              >
                <Card className={cn(
                  "bg-surface-900 border-surface-800 h-full transition-all hover:border-surface-700",
                  isLocked && "opacity-70"
                )}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={cn("p-3 rounded-lg", colors.bg)}>
                        <Icon className={cn("h-6 w-6", colors.text)} />
                      </div>
                      {isLocked ? (
                        <Lock className="h-5 w-5 text-surface-500" />
                      ) : checklist.progress.percentage === 100 ? (
                        <CheckCircle className="h-5 w-5 text-accent-500" />
                      ) : null}
                    </div>

                    <h3 className="font-medium text-white mb-1">{checklist.name}</h3>
                    <p className="text-xs text-surface-400 mb-4 line-clamp-2">
                      {checklist.description}
                    </p>

                    {!isLocked && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-surface-400">
                            {checklist.progress.completed} of {checklist.progress.total} items
                          </span>
                          <span className={colors.text}>
                            {checklist.progress.percentage}%
                          </span>
                        </div>
                        <Progress
                          value={checklist.progress.percentage}
                          className="h-1.5 bg-surface-800"
                        />
                      </div>
                    )}

                    {isLocked && (
                      <p className="text-xs text-surface-500">
                        Premium checklist
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      ) : (
        <Card className="bg-surface-900 border-surface-800">
          <CardContent className="py-12 text-center">
            <p className="text-surface-400">No checklists available</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
