'use client'

import { useMemo, useState } from 'react'
import { Check, Plus, Download, Printer, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import type { BudgetTemplate, FamilyBudgetItem } from '@tdc/shared/types'
import type { BudgetSummary } from '@tdc/services'
import {
  useBudgetSummary,
  useAddToBudget,
  useTogglePurchased,
  useRemoveBudgetItem,
  useAddCustomBudgetItem,
} from '@/hooks/use-budget'
import { budgetService } from '@/lib/services'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Panel, ScopeSwitch, Badge } from '@/components/digest'
import { MedicalDisclaimer } from '@/components/shared/medical-disclaimer'
import { usePageHeader } from '@/components/layouts/topbar-context'
import { cn } from '@/lib/utils'

type Tier = 'value' | 'premium'

const fmt = (cents: number) => budgetService.formatPrice(cents)
const priceForTier = (t: BudgetTemplate, tier: Tier) => (tier === 'premium' ? t.price_max || t.price_min : t.price_min)

export default function BudgetClient() {
  const { data: summary, isLoading } = useBudgetSummary() as {
    data: BudgetSummary | null | undefined
    isLoading: boolean
  }
  const addToBudget = useAddToBudget()
  const togglePurchased = useTogglePurchased()
  const removeItem = useRemoveBudgetItem()
  const addCustom = useAddCustomBudgetItem()

  const [tab, setTab] = useState<'mine' | 'browse'>('mine')
  const [tier, setTier] = useState<Tier>('value')
  const [catFilter, setCatFilter] = useState<string | null>(null)
  const [showCustom, setShowCustom] = useState(false)
  const [custom, setCustom] = useState({ item: '', category: 'Other', price: '' })

  const familyItems = useMemo(() => summary?.familyItems ?? [], [summary])
  const templatesById = useMemo(() => {
    const m = new Map<string, BudgetTemplate>()
    summary?.categories.forEach((c) => c.items.forEach((t) => m.set(t.budget_id, t)))
    return m
  }, [summary])

  const estFor = (item: FamilyBudgetItem) => {
    const t = item.budget_template_id ? templatesById.get(item.budget_template_id) : undefined
    return t ? priceForTier(t, tier) : item.estimated_price
  }

  const planned = familyItems.reduce((s, i) => s + estFor(i), 0)
  const spent = familyItems.filter((i) => i.is_purchased).reduce((s, i) => s + (i.actual_price || estFor(i)), 0)
  const left = Math.max(0, planned - spent)
  const bought = familyItems.filter((i) => i.is_purchased).length
  const total = familyItems.length
  const pct = planned > 0 ? spent / planned : 0

  const addedTemplateIds = new Set(familyItems.map((i) => i.budget_template_id).filter(Boolean))
  const categories = summary?.categories ?? []
  const browseCats = categories.filter((c) => !catFilter || c.name === catFilter)

  usePageHeader(
    {
      title: 'Budget',
      subtitle: 'Plan, track and split the cost of the gear that matters',
      actions: (
        <button
          onClick={() => handleExportCSV()}
          className="inline-flex items-center gap-2 rounded-xl border border-line bg-card px-4 py-2.5 text-[14px] font-bold text-ink2 transition-colors hover:bg-card-hover"
        >
          <Download className="h-4 w-4" /> Export
        </button>
      ),
    },
    []
  )

  function handleExportCSV() {
    if (!familyItems.length) {
      toast.error('Add items before exporting')
      return
    }
    const headers = ['Item', 'Category', 'Status', 'Estimated', 'Actual', 'Recurring']
    const rows = familyItems.map((i) => [
      `"${i.item.replace(/"/g, '""')}"`,
      `"${i.category}"`,
      i.is_purchased ? 'Purchased' : 'To buy',
      (estFor(i) / 100).toFixed(2),
      i.actual_price ? (i.actual_price / 100).toFixed(2) : '',
      i.is_recurring ? 'Yes' : 'No',
    ])
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `budget-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Budget exported to CSV')
  }

  async function handleShare() {
    const text = familyItems
      .map((i) => `${i.is_purchased ? '✓' : '○'} ${i.item} — ${fmt(estFor(i))}`)
      .join('\n')
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Our baby budget', text })
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(text)
      toast.success('Budget copied to clipboard')
    }
  }

  const handleAddCustom = async () => {
    if (!custom.item || !custom.price) return
    const cents = Math.round(parseFloat(custom.price) * 100)
    const res = await addCustom.mutateAsync({ item: custom.item, category: custom.category, estimatedPrice: cents })
    if (res?.error) toast.error(res.error.message)
    else {
      toast.success('Custom item added')
      setCustom({ item: '', category: 'Other', price: '' })
      setShowCustom(false)
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[minmax(0,1fr)_336px]">
        <div className="h-80 animate-pulse rounded-[18px] bg-card2" />
        <div className="h-48 animate-pulse rounded-[18px] bg-card2" />
      </div>
    )
  }

  return (
    <>
      <MedicalDisclaimer className="mb-5" />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <ScopeSwitch
          options={[
            { key: 'mine', label: 'My list' },
            { key: 'browse', label: 'Browse' },
          ]}
          value={tab}
          onChange={(k) => setTab(k as typeof tab)}
        />
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.8px] text-mute">Prices</span>
          <ScopeSwitch
            options={[
              { key: 'value', label: 'Best value' },
              { key: 'premium', label: 'Premium' },
            ]}
            value={tier}
            onChange={(k) => setTier(k as Tier)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[minmax(0,1fr)_336px]">
        {/* Main column */}
        <div className="min-w-0">
          {tab === 'mine' ? (
            familyItems.length === 0 ? (
              <Panel className="p-12 text-center">
                <p className="text-[15px] font-semibold text-ink">Start your budget</p>
                <p className="mt-1 text-[13px] text-mute">Browse curated items or add your own.</p>
                <button
                  onClick={() => setTab('browse')}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-clay px-4 py-2.5 text-[14px] font-bold text-white hover:opacity-90"
                >
                  Browse items
                </button>
              </Panel>
            ) : (
              <>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-faint">Your items</span>
                  <button onClick={() => setShowCustom(true)} className="text-[12.5px] font-bold text-mute hover:text-clay-ink">
                    + Add custom
                  </button>
                </div>
                <Panel>
                  {familyItems.map((item) => {
                    const t = item.budget_template_id ? templatesById.get(item.budget_template_id) : undefined
                    const mustHave = t?.priority === 'must-have'
                    return (
                      <div key={item.id} className="flex items-center gap-3.5 border-b border-line2 px-[18px] py-[15px] last:border-b-0">
                        <button
                          type="button"
                          onClick={() =>
                            togglePurchased.mutate({ itemId: item.id, isPurchased: !item.is_purchased })
                          }
                          aria-label={item.is_purchased ? 'Mark not purchased' : 'Mark purchased'}
                          className={cn(
                            'grid h-[22px] w-[22px] flex-none place-items-center rounded-[7px] border-2 transition-colors',
                            item.is_purchased ? 'border-[--sage] bg-[--sage]' : 'border-line hover:border-clay'
                          )}
                        >
                          {item.is_purchased && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className={cn('text-[15.5px] font-semibold', item.is_purchased ? 'text-mute line-through decoration-faint' : 'text-ink')}>
                            {item.item}
                          </div>
                          <div className="mt-[5px] flex flex-wrap items-center gap-2">
                            <span className="text-[12.5px] font-medium text-mute">{item.category}</span>
                            {mustHave && <Badge tone="clay">Must-have</Badge>}
                            {item.is_recurring && <Badge tone="sage">Monthly</Badge>}
                            {item.is_custom && <Badge tone="neutral">Custom</Badge>}
                          </div>
                        </div>
                        <div className={cn('flex-none whitespace-nowrap text-[15.5px] font-extrabold', item.is_purchased ? 'text-mute' : 'text-ink')}>
                          {fmt(item.actual_price || estFor(item))}
                          {item.is_recurring && <span className="text-[11.5px] font-bold text-mute">/mo</span>}
                        </div>
                        <button
                          onClick={() => removeItem.mutate(item.id)}
                          className="text-[12px] font-bold text-faint hover:text-danger"
                          aria-label="Remove"
                        >
                          ✕
                        </button>
                      </div>
                    )
                  })}
                </Panel>
              </>
            )
          ) : (
            <>
              <div className="mb-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setCatFilter(null)}
                  className={cn(
                    'rounded-full border px-[15px] py-2 text-[13px] font-bold transition-colors',
                    !catFilter ? 'border-clay bg-clay text-white' : 'border-line bg-card text-ink2 hover:border-faint'
                  )}
                >
                  All
                </button>
                {categories.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setCatFilter(catFilter === c.name ? null : c.name)}
                    className={cn(
                      'rounded-full border px-[15px] py-2 text-[13px] font-bold transition-colors',
                      catFilter === c.name ? 'border-clay bg-clay text-white' : 'border-line bg-card text-ink2 hover:border-faint'
                    )}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              {browseCats.map((c) => (
                <div key={c.name} className="mb-5">
                  <div className="mb-3 text-[11px] font-bold uppercase tracking-[1.5px] text-faint">{c.name}</div>
                  <Panel>
                    {c.items
                      .filter((t) => t.priority !== 'tip')
                      .map((t) => {
                        const added = addedTemplateIds.has(t.budget_id)
                        const brand = tier === 'premium' ? t.brand_premium : t.brand_value
                        return (
                          <div key={t.budget_id} className="flex items-center gap-3.5 border-b border-line2 px-[18px] py-[15px] last:border-b-0">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[15.5px] font-semibold text-ink">{t.item}</span>
                                {t.priority === 'must-have' && <Badge tone="clay">Must-have</Badge>}
                                {t.is_recurring && <Badge tone="sage">Monthly</Badge>}
                              </div>
                              <div className="mt-[5px] text-[12.5px] font-medium text-mute">
                                {fmt(priceForTier(t, tier))}
                                {brand && <span className="text-faint"> · {brand}</span>}
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                addToBudget.mutate({ templateId: t.budget_id, estimatedPrice: priceForTier(t, tier) })
                              }
                              disabled={added || addToBudget.isPending}
                              className={cn(
                                'inline-flex flex-none items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] font-bold transition-colors',
                                added ? 'bg-[--sage]/15 text-[--sage]' : 'bg-clay text-white hover:opacity-90'
                              )}
                            >
                              {added ? <><Check className="h-3.5 w-3.5" /> Added</> : <><Plus className="h-3.5 w-3.5" /> Add</>}
                            </button>
                          </div>
                        )
                      })}
                  </Panel>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Right rail */}
        <div className="min-w-0">
          <Panel className="mb-[18px] p-[18px]">
            <div className="mb-3.5 text-[11px] font-bold uppercase tracking-[1.2px] text-faint">Summary</div>
            <div className="flex items-center justify-between border-b border-line2 py-2.5">
              <span className="text-[13.5px] font-semibold text-ink">Planned</span>
              <span className="text-[13.5px] font-extrabold text-ink">{fmt(planned)}</span>
            </div>
            <div className="flex items-center justify-between border-b border-line2 py-2.5">
              <span className="text-[13.5px] font-semibold text-ink">Spent</span>
              <span className="text-[13.5px] font-extrabold text-ink">{fmt(spent)}</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-[13.5px] font-semibold text-ink">Left</span>
              <span className="text-[13.5px] font-extrabold text-clay-ink">{fmt(left)}</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-md bg-line">
              <div className="h-full rounded-md bg-clay" style={{ width: `${Math.round(pct * 100)}%` }} />
            </div>
            <div className="mt-[9px] text-[11.5px] font-semibold text-mute">
              {total > 0 ? `${bought} of ${total} items bought` : 'No items yet'}
            </div>
          </Panel>

          <Panel className="p-[18px]">
            <div className="mb-1 text-[11px] font-bold uppercase tracking-[1.2px] text-faint">Export</div>
            {[
              { icon: Download, t: 'Export as CSV', s: 'Open in Sheets / Excel', fn: handleExportCSV },
              { icon: Printer, t: 'Print / PDF', s: 'Print-ready checklist', fn: () => window.print() },
              { icon: Share2, t: 'Share', s: 'Send the list to your partner', fn: handleShare },
            ].map((r) => (
              <button
                key={r.t}
                onClick={r.fn}
                className="flex w-full items-center gap-3 border-b border-line2 py-3 text-left last:border-b-0"
              >
                <r.icon className="h-[18px] w-[18px] flex-none text-clay-ink" />
                <span className="flex-1">
                  <span className="block text-[14.5px] font-bold text-ink">{r.t}</span>
                  <span className="block text-[12px] text-mute">{r.s}</span>
                </span>
                <span className="text-faint">→</span>
              </button>
            ))}
          </Panel>
        </div>
      </div>

      <Dialog open={showCustom} onOpenChange={setShowCustom}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add custom item</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <input
              placeholder="Item name"
              value={custom.item}
              onChange={(e) => setCustom((p) => ({ ...p, item: e.target.value }))}
              className="w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-[15px] text-ink outline-none focus:border-clay"
            />
            <input
              placeholder="Category"
              value={custom.category}
              onChange={(e) => setCustom((p) => ({ ...p, category: e.target.value }))}
              className="w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-[15px] text-ink outline-none focus:border-clay"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Estimated price"
              value={custom.price}
              onChange={(e) => setCustom((p) => ({ ...p, price: e.target.value }))}
              className="w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-[15px] text-ink outline-none focus:border-clay"
            />
          </div>
          <DialogFooter>
            <button onClick={() => setShowCustom(false)} className="rounded-xl px-4 py-2.5 text-[14px] font-bold text-mute">
              Cancel
            </button>
            <button
              onClick={handleAddCustom}
              disabled={!custom.item || !custom.price || addCustom.isPending}
              className="rounded-xl bg-clay px-4 py-2.5 text-[14px] font-bold text-white hover:opacity-90 disabled:opacity-50"
            >
              Add item
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
