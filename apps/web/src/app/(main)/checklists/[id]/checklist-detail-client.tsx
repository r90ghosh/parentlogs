'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useChecklist, useToggleChecklistItem, useResetChecklist } from '@/hooks/use-checklists'
import { useToast } from '@/hooks/use-toast'
import { Panel } from '@/components/digest'
import { OpenChecklist } from '@/components/checklists/open-checklist'
import { usePageHeader } from '@/components/layouts/topbar-context'

export default function ChecklistDetailClient() {
  const params = useParams()
  const { toast } = useToast()
  const checklistId = params.id as string

  const { data: checklist, isLoading } = useChecklist(checklistId)
  const toggleItem = useToggleChecklistItem()
  const resetChecklist = useResetChecklist()

  usePageHeader({ title: 'Checklist' }, [])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-card2" />
        <div className="h-96 w-full animate-pulse rounded-[20px] bg-card2" />
      </div>
    )
  }

  if (!checklist) {
    return (
      <div className="mx-auto max-w-2xl">
        <Link href="/checklists" className="mb-5 inline-flex items-center gap-1.5 text-sm font-bold text-clay-ink hover:opacity-80">
          <ArrowLeft className="h-4 w-4" /> Checklists
        </Link>
        <Panel className="p-12 text-center">
          <p className="text-[15px] text-mute">This checklist doesn&apos;t exist or requires premium.</p>
        </Panel>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/checklists" className="mb-5 inline-flex items-center gap-1.5 text-sm font-bold text-clay-ink hover:opacity-80">
        <ArrowLeft className="h-4 w-4" /> Checklists
      </Link>
      <OpenChecklist
        checklist={checklist}
        busy={toggleItem.isPending}
        onToggle={(itemId, completed) => toggleItem.mutate({ checklistId, itemId, completed })}
        onReset={() => {
          resetChecklist.mutate(checklistId)
          toast({ title: 'Checklist reset' })
        }}
      />
    </div>
  )
}
