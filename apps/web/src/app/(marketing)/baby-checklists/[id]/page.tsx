import { cache } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Crown, CheckCircle2, FileText } from 'lucide-react'
import { getPublicChecklistById, getPublicChecklists } from '@/lib/public-data'
import { CHECKLIST_ICONS, CHECKLIST_COLORS } from '@/lib/checklist-constants'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const getCachedChecklist = cache(getPublicChecklistById)
const getCachedChecklists = cache(getPublicChecklists)

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const checklist = await getCachedChecklist(id)

  if (!checklist) {
    return { title: 'Checklist Not Found | The Dad Center' }
  }

  return {
    title: `${checklist.name} Checklist — ${checklist.items.length} Items | The Dad Center`,
    description: checklist.description,
    openGraph: {
      title: `${checklist.name} Checklist | The Dad Center`,
      description: checklist.description,
    },
  }
}

export async function generateStaticParams() {
  return Array.from({ length: 15 }, (_, i) => ({
    id: `CL-${String(i + 1).padStart(2, '0')}`,
  }))
}

export default async function ChecklistDetailPage({ params }: PageProps) {
  const { id } = await params
  const [checklist, allChecklists] = await Promise.all([
    getCachedChecklist(id),
    getCachedChecklists(),
  ])

  if (!checklist) {
    notFound()
  }

  const Icon = CHECKLIST_ICONS[checklist.checklist_id] || FileText
  const colors = CHECKLIST_COLORS[checklist.checklist_id] || CHECKLIST_COLORS['CL-15']

  // Related checklists (up to 3, excluding current)
  const related = allChecklists
    .filter(cl => cl.checklist_id !== checklist.checklist_id)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-[--bg]">
      {/* Header */}
      <div className="bg-gradient-to-b from-[--surface] to-[--bg] pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <Link
              href="/baby-checklists"
              className="inline-flex items-center gap-2 font-ui text-[--muted] hover:text-[--white] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Checklists
            </Link>
            <span className="text-[--dim]">/</span>
            <span className="font-ui text-[--cream] text-sm">{checklist.name}</span>
          </div>

          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className={cn("p-4 rounded-xl", colors.bg)}>
              <Icon className={cn("h-8 w-8", colors.text)} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-display text-3xl md:text-4xl font-bold text-[--white]">
                  {checklist.name}
                </h1>
                {checklist.is_premium && (
                  <Badge variant="outline" className="border-gold/50 text-gold font-ui flex items-center gap-1">
                    <Crown className="h-3 w-3" /> Premium
                  </Badge>
                )}
              </div>
              <p className="font-body text-lg text-[--muted]">{checklist.description}</p>
              <p className="font-ui text-sm text-[--dim] mt-2">{checklist.items.length} items</p>
            </div>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Premium CTA banner */}
        {checklist.is_premium && (
          <div className="mb-8 p-4 rounded-xl bg-gold/10 border border-gold/20 flex items-center gap-3">
            <Crown className="h-5 w-5 text-gold shrink-0" />
            <p className="font-body text-sm text-[--cream]">
              This is a premium checklist. Sign up to track your progress and check off items.
            </p>
            <Button asChild size="sm" className="ml-auto shrink-0 bg-copper hover:bg-copper/80 text-white font-ui">
              <Link href="/signup">Sign Up Free</Link>
            </Button>
          </div>
        )}

        <div className="space-y-2">
          {checklist.items.map((item) => (
            <div
              key={item.item_id}
              className="flex items-start gap-3 p-4 rounded-lg bg-[--surface] border border-[--border] hover:border-[--border-hover] transition-colors"
            >
              <div className="mt-0.5">
                <div className="w-5 h-5 rounded border-2 border-[--dim]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-body text-sm font-medium text-[--cream]">{item.item}</span>
                  {item.required && (
                    <Badge variant="outline" className="text-xs border-coral/50 text-coral font-ui">
                      Essential
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs border-[--border] text-[--dim] font-ui">
                    {item.bring_or_do === 'bring' ? 'Bring' : 'Do'}
                  </Badge>
                </div>
                {item.details && (
                  <p className="text-xs text-[--muted] mt-1 font-body">{item.details}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Sign up CTA after items */}
        <div className="mt-12 p-8 rounded-2xl bg-[--surface]/50 border border-[--border] text-center">
          <CheckCircle2 className="h-10 w-10 text-copper mx-auto mb-4" />
          <h3 className="font-display text-xl font-bold text-[--white] mb-3">
            Ready to start checking off items?
          </h3>
          <p className="font-body text-[--muted] mb-6 max-w-lg mx-auto">
            Create a free account to track your progress, check off items as you go,
            and share with your partner.
          </p>
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
        </div>

        {/* Related Checklists */}
        {related.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[--border]">
            <h2 className="font-display text-2xl font-bold text-[--white] mb-6">More Checklists</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((cl) => {
                const RelIcon = CHECKLIST_ICONS[cl.checklist_id] || FileText
                const relColors = CHECKLIST_COLORS[cl.checklist_id] || CHECKLIST_COLORS['CL-15']

                return (
                  <Link key={cl.checklist_id} href={`/baby-checklists/${cl.checklist_id}`} className="block">
                    <Card className="bg-[--surface] border-[--border] h-full hover:border-[--border-hover] transition-all">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                          <div className={cn("p-2 rounded-lg", relColors.bg)}>
                            <RelIcon className={cn("h-5 w-5", relColors.text)} />
                          </div>
                          <div>
                            <h3 className="font-body text-sm font-medium text-[--cream]">{cl.name}</h3>
                            <p className="font-ui text-xs text-[--dim] mt-1">{cl.itemCount} items</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
