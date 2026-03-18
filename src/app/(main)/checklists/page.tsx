'use client'

import { useChecklists } from '@/hooks/use-checklists'
import { useRequirePremium } from '@/hooks/use-require-auth'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import {
  FileText,
  Lock,
  CheckCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { RevealOnScroll } from '@/components/ui/animations/RevealOnScroll'
import { Card3DTilt } from '@/components/ui/animations/Card3DTilt'
import { CardEntrance } from '@/components/ui/animations/CardEntrance'
import { CHECKLIST_ICONS, CHECKLIST_COLORS } from '@/lib/checklist-constants'

export default function ChecklistsPage() {
  const { data: checklists, isLoading } = useChecklists()
  const { isPremium } = useRequirePremium()

  return (
    <div className="p-4 space-y-6 max-w-4xl">
      {/* Header */}
      <RevealOnScroll delay={0}>
      <div>
        <h1 className="text-2xl font-display font-bold text-[--cream]">Checklists</h1>
        <p className="text-[--muted] mt-1 font-body">
          Stay organized with our curated preparation checklists
        </p>
      </div>
      </RevealOnScroll>

      {/* Checklists Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : checklists && checklists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {checklists.map((checklist, index) => {
            const Icon = CHECKLIST_ICONS[checklist.checklist_id] || FileText
            const colors = CHECKLIST_COLORS[checklist.checklist_id] || CHECKLIST_COLORS['CL-15']
            const isLocked = (checklist as any).is_locked

            return (
              <CardEntrance key={checklist.checklist_id} delay={index * 80}>
              <Card3DTilt maxTilt={3} gloss>
              <Link
                href={isLocked ? '/settings/subscription' : `/checklists/${checklist.checklist_id}`}
                className="block"
              >
                <Card className={cn(
                  "bg-[--surface] border-[--border] h-full transition-all hover:border-[--border-hover]",
                  isLocked && "opacity-70"
                )}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={cn("p-3 rounded-lg", colors.bg)}>
                        <Icon className={cn("h-6 w-6", colors.text)} />
                      </div>
                      {isLocked ? (
                        <Lock className="h-5 w-5 text-[--dim]" />
                      ) : checklist.progress.percentage === 100 ? (
                        <CheckCircle className="h-5 w-5 text-copper" />
                      ) : null}
                    </div>

                    <h3 className="font-medium text-[--cream] mb-1 font-body">{checklist.name}</h3>
                    <p className="text-xs text-[--muted] mb-4 line-clamp-2 font-body">
                      {checklist.description}
                    </p>

                    {!isLocked && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-ui">
                          <span className="text-[--muted]">
                            {checklist.progress.completed} of {checklist.progress.total} items
                          </span>
                          <span className={colors.text}>
                            {checklist.progress.percentage}%
                          </span>
                        </div>
                        <Progress
                          value={checklist.progress.percentage}
                          className="h-1.5 bg-[--card]"
                        />
                      </div>
                    )}

                    {isLocked && (
                      <p className="text-xs text-[--dim] font-ui">
                        Premium checklist
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
              </Card3DTilt>
              </CardEntrance>
            )
          })}
        </div>
      ) : (
        <Card className="bg-[--surface] border-[--border]">
          <CardContent className="py-12 text-center">
            <p className="text-[--muted] font-body">No checklists available</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
