'use client'

import { useState, useMemo } from 'react'
import { useBudgetSummary, useAddToBudget, useMarkAsPurchased, useRemoveBudgetItem, useAddCustomBudgetItem } from '@/hooks/use-budget'
import { useUser } from '@/components/user-provider'
import { useFamily } from '@/hooks/use-family'
import { budgetService } from '@/services/budget-service'
import { BudgetTimelineBar } from '@/components/shared/budget-timeline-bar'
import { BrandToggleFilter } from '@/components/budget/BrandToggleFilter'
import { BrandRecommendationDrawer } from '@/components/budget/BrandRecommendationDrawer'
import {
  BudgetTimelineCategory,
  getBudgetStatsByCategory,
  getCurrentBudgetCategory,
  getBudgetTimelineCategory,
} from '@/lib/budget-timeline'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DollarSign,
  Plus,
  Check,
  Trash2,
  ShoppingCart,
  TrendingUp,
  Wallet,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Lightbulb,
  Stethoscope,
  Crown,
  Lock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { BudgetTemplate, FamilyBudgetItem, BudgetBrandView } from '@/types'
import { RevealOnScroll } from '@/components/ui/animations/RevealOnScroll'
import { Card3DTilt } from '@/components/ui/animations/Card3DTilt'
import { getCategoryStyle, CATEGORY_ICONS } from '@/lib/budget-constants'

type RecurringFilter = 'all' | 'one-time' | 'recurring'

export default function BudgetClient() {
  const { data: summary, isLoading } = useBudgetSummary()
  const { activeBaby } = useUser()
  const { data: family } = useFamily()
  const addToBudget = useAddToBudget()
  const markAsPurchased = useMarkAsPurchased()
  const removeBudgetItem = useRemoveBudgetItem()
  const addCustomItem = useAddCustomBudgetItem()

  const [selectedTemplate, setSelectedTemplate] = useState<BudgetTemplate | null>(null)
  const [purchaseDialogItem, setPurchaseDialogItem] = useState<FamilyBudgetItem | null>(null)
  const [actualPrice, setActualPrice] = useState('')
  const [showAddCustomDialog, setShowAddCustomDialog] = useState(false)
  const [customItem, setCustomItem] = useState({ item: '', category: 'Other', price: '' })
  const [selectedTimelineCategory, setSelectedTimelineCategory] = useState<BudgetTimelineCategory | null>(null)
  const [selectedBrandView, setSelectedBrandView] = useState<BudgetBrandView>('premium')
  const [selectedItemForDetails, setSelectedItemForDetails] = useState<BudgetTemplate | null>(null)
  const [recurringFilter, setRecurringFilter] = useState<RecurringFilter>('all')

  // All templates from summary
  const allTemplates = useMemo(() => {
    if (!summary?.categories) return []
    return summary.categories.flatMap(c => c.items)
  }, [summary])

  // Calculate budget stats by timeline category
  const budgetStats = useMemo(() => {
    return getBudgetStatsByCategory(allTemplates)
  }, [allTemplates])

  // Get current budget category based on activeBaby/family stage
  const budgetSource = activeBaby || family
  const currentBudgetCategory = useMemo(() => {
    if (!budgetSource) return '1st Trimester' as BudgetTimelineCategory
    return getCurrentBudgetCategory(budgetSource)
  }, [budgetSource])


  const addedTemplateIds = new Set(
    summary?.familyItems
      .filter(i => i.budget_template_id)
      .map(i => i.budget_template_id)
  )

  const handleAddTemplate = async (template: BudgetTemplate) => {
    const result = await addToBudget.mutateAsync({
      templateId: template.budget_id,
      estimatedPrice: template.price_min,
    })

    if (result.error) {
      toast.error(result.error.message)
    } else {
      toast.success(`Added "${template.item}" to your budget`)
    }
    setSelectedTemplate(null)
  }

  const handleMarkPurchased = async () => {
    if (!purchaseDialogItem) return

    const priceInCents = actualPrice ? Math.round(parseFloat(actualPrice) * 100) : undefined
    const result = await markAsPurchased.mutateAsync({
      itemId: purchaseDialogItem.id,
      actualPrice: priceInCents,
    })

    if (result.error) {
      toast.error(result.error.message)
    } else {
      toast.success('Marked as purchased!')
    }
    setPurchaseDialogItem(null)
    setActualPrice('')
  }

  const handleRemoveItem = async (itemId: string) => {
    const result = await removeBudgetItem.mutateAsync(itemId)
    if (result.error) {
      toast.error(result.error.message)
    } else {
      toast.success('Item removed from budget')
    }
  }

  const handleAddCustomItem = async () => {
    if (!customItem.item || !customItem.price) return

    const priceInCents = Math.round(parseFloat(customItem.price) * 100)
    const result = await addCustomItem.mutateAsync({
      item: customItem.item,
      category: customItem.category,
      estimatedPrice: priceInCents,
    })

    if (result.error) {
      toast.error(result.error.message)
    } else {
      toast.success('Custom item added!')
      setCustomItem({ item: '', category: 'Other', price: '' })
      setShowAddCustomDialog(false)
    }
  }

  // Filter categories for browse tab
  const filteredCategories = useMemo(() => {
    if (!summary?.categories) return []

    return summary.categories
      .map(category => {
        let items = category.items
        // Filter by timeline category
        if (selectedTimelineCategory) {
          items = items.filter(item => getBudgetTimelineCategory(item) === selectedTimelineCategory)
        }
        // Filter by recurring
        if (recurringFilter === 'one-time') {
          items = items.filter(item => !item.is_recurring)
        } else if (recurringFilter === 'recurring') {
          items = items.filter(item => item.is_recurring)
        }
        return { ...category, items }
      })
      .filter(category => category.items.length > 0)
  }, [summary, selectedTimelineCategory, recurringFilter])

  const pendingItems = summary?.familyItems.filter(i => !i.is_purchased) || []
  const purchasedItems = summary?.familyItems.filter(i => i.is_purchased) || []

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-[--cream]">Budget Planner</h1>
          <p className="text-[--muted] mt-1 font-body">
            Plan and track your baby expenses
          </p>
        </div>
        <Button onClick={() => setShowAddCustomDialog(true)} className="font-ui">
          <Plus className="h-4 w-4 mr-2" />
          Add Custom
        </Button>
      </div>

      {/* Brand Toggle Filter */}
      {allTemplates.length > 0 && (
        <BrandToggleFilter
          selectedView={selectedBrandView}
          onViewChange={setSelectedBrandView}
        />
      )}

      {/* Budget Timeline Bar */}
      {summary && summary.categories.length > 0 && (
        <BudgetTimelineBar
          stats={budgetStats}
          currentCategory={currentBudgetCategory}
          selectedCategory={selectedTimelineCategory}
          onCategoryClick={setSelectedTimelineCategory}
        />
      )}

      {/* Summary Cards */}
      <RevealOnScroll delay={0}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Estimate */}
          <Card3DTilt maxTilt={3} gloss>
            <Card className="bg-[--surface] border-[--border] card-gold-top">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-sky/20">
                    <TrendingUp className="h-5 w-5 text-sky" />
                  </div>
                  <div>
                    <p className="text-xs text-[--muted] font-ui">Estimated Range</p>
                    <p className="text-xl font-bold text-[--cream] tabular-nums">
                      {budgetService.formatPriceRange(
                        summary?.grandTotalMin || 0,
                        summary?.grandTotalMax || 0
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Card3DTilt>

          {/* Purchased */}
          <Card3DTilt maxTilt={3} gloss>
            <Card className="bg-[--surface] border-[--border] card-gold-top">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-sage/20">
                    <ShoppingCart className="h-5 w-5 text-sage" />
                  </div>
                  <div>
                    <p className="text-xs text-[--muted] font-ui">Purchased</p>
                    <p className="text-xl font-bold text-[--cream] tabular-nums">
                      {budgetService.formatPrice(summary?.purchasedTotal || 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Card3DTilt>

          {/* Remaining */}
          <Card3DTilt maxTilt={3} gloss>
            <Card className="bg-[--surface] border-[--border] card-gold-top">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-gold/20">
                    <Wallet className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-[--muted] font-ui">Remaining</p>
                    <p className="text-xl font-bold text-[--cream] tabular-nums">
                      {budgetService.formatPrice(summary?.remainingTotal || 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Card3DTilt>
        </div>
      </RevealOnScroll>

      {/* Monthly Recurring Costs Card */}
      {(summary?.monthlyRecurringMin || 0) > 0 && (
        <RevealOnScroll delay={40}>
          <Card3DTilt maxTilt={3} gloss>
            <Card className="bg-[--surface] border-[--border] card-sky-top">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-sky/20">
                    <RefreshCw className="h-5 w-5 text-sky" />
                  </div>
                  <div>
                    <p className="text-xs text-[--muted] font-ui">Monthly Recurring</p>
                    <p className="text-xl font-bold text-[--cream] tabular-nums">
                      {budgetService.formatPriceRange(
                        summary?.monthlyRecurringMin || 0,
                        summary?.monthlyRecurringMax || 0
                      )}
                      <span className="text-sm text-[--muted] font-normal ml-1">/mo</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Card3DTilt>
        </RevealOnScroll>
      )}

      {/* Progress */}
      {summary && summary.familyItems.length > 0 && (
        <RevealOnScroll delay={80}>
          <Card3DTilt maxTilt={3} gloss>
            <Card className="bg-[--surface] border-[--border]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[--muted] font-body">Shopping Progress</span>
                  <span className="text-sm font-medium text-[--cream] tabular-nums font-ui">
                    {purchasedItems.length} of {summary.familyItems.length} items
                  </span>
                </div>
                <Progress
                  value={(purchasedItems.length / summary.familyItems.length) * 100}
                  className="h-2 bg-[--dim]"
                />
              </CardContent>
            </Card>
          </Card3DTilt>
        </RevealOnScroll>
      )}

      {/* Main Content Tabs */}
      <RevealOnScroll delay={160}>
        <Tabs defaultValue="browse" className="space-y-4">
          <TabsList className="bg-[--surface] border border-[--border]">
            <TabsTrigger value="my-budget" className="font-ui">My Budget ({summary?.familyItems.length || 0})</TabsTrigger>
            <TabsTrigger value="browse" className="font-ui">Browse Items</TabsTrigger>
          </TabsList>

          {/* My Budget Tab */}
          <TabsContent value="my-budget" className="space-y-4">
            {summary?.familyItems.length === 0 ? (
              <Card className="bg-[--surface] border-[--border]">
                <CardContent className="py-12 text-center">
                  <DollarSign className="h-12 w-12 text-[--dim] mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-[--cream] mb-2 font-display">No items yet</h3>
                  <p className="text-[--muted] mb-4 font-body">
                    Browse our curated list to add items to your budget
                  </p>
                  <Button variant="outline" className="font-ui" onClick={() => {
                    const tabsList = document.querySelector('[value="browse"]') as HTMLElement
                    tabsList?.click()
                  }}>
                    Browse Items
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Pending Items */}
                {pendingItems.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-[--muted] font-ui flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      To Buy ({pendingItems.length})
                    </h3>
                    {pendingItems.map((item) => (
                      <BudgetItemCard
                        key={item.id}
                        item={item}
                        onMarkPurchased={() => setPurchaseDialogItem(item)}
                        onRemove={() => handleRemoveItem(item.id)}
                      />
                    ))}
                  </div>
                )}

                {/* Purchased Items */}
                {purchasedItems.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-[--muted] font-ui flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      Purchased ({purchasedItems.length})
                    </h3>
                    {purchasedItems.map((item) => (
                      <BudgetItemCard
                        key={item.id}
                        item={item}
                        isPurchased
                        onRemove={() => handleRemoveItem(item.id)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Browse Items Tab */}
          <TabsContent value="browse" className="space-y-4">
            <div className="relative">
              {/* Recurring Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-[--muted] font-ui">Show:</span>
                <Select value={recurringFilter} onValueChange={(v) => setRecurringFilter(v as RecurringFilter)}>
                  <SelectTrigger className="w-40 bg-[--surface] border-[--border-hover]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Items</SelectItem>
                    <SelectItem value="one-time">One-time</SelectItem>
                    <SelectItem value="recurring">Recurring</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Accordion
                type="multiple"
                key={`accordion-${selectedTimelineCategory || 'all'}-${recurringFilter}`}
                defaultValue={filteredCategories?.map(c => c.name)}
                className="space-y-2 mt-4"
              >
                {filteredCategories?.map((category) => {
                  const { Icon, colors } = getCategoryStyle(category.name)
                  const categoryTotalMin = category.items
                    .filter(i => i.priority !== 'tip')
                    .reduce((sum, item) => sum + (item.price_min || 0), 0)
                  const categoryTotalMax = category.items
                    .filter(i => i.priority !== 'tip')
                    .reduce((sum, item) => sum + (item.price_max || 0), 0)

                  return (
                    <AccordionItem
                      key={category.name}
                      value={category.name}
                      className="bg-[--surface] border border-[--border] rounded-lg overflow-hidden"
                    >
                      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-[--card]/50">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={cn("p-2 rounded-lg", colors.bg)}>
                            <Icon className={cn("h-5 w-5", colors.text)} />
                          </div>
                          <div className="flex-1 text-left">
                            <span className="font-medium text-[--cream] font-body">{category.name}</span>
                            <span className="text-xs text-[--muted] ml-2 font-ui">
                              ({category.items.length} items)
                            </span>
                          </div>
                          <span className="text-sm text-[--muted] mr-4 tabular-nums font-ui">
                            {budgetService.formatPriceRange(categoryTotalMin, categoryTotalMax)}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="space-y-2 pt-2">
                          {category.items.map((template) => (
                            <BrowseItemRow
                              key={template.budget_id}
                              template={template}
                              isAdded={addedTemplateIds.has(template.budget_id)}
                              brandView={selectedBrandView}
                              onSelect={() => setSelectedItemForDetails(template)}
                              onAdd={() => setSelectedTemplate(template)}
                              isAddPending={addToBudget.isPending}
                            />
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>

            </div>
          </TabsContent>
        </Tabs>
      </RevealOnScroll>

      {/* Add Template Dialog */}
      <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
        <DialogContent className="bg-[--surface] border-[--border]">
          <DialogHeader>
            <DialogTitle className="font-display text-[--cream]">Add to Budget</DialogTitle>
            <DialogDescription className="font-body text-[--muted]">
              Add &ldquo;{selectedTemplate?.item}&rdquo; to your budget tracker
            </DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <div className="p-4 bg-[--card] rounded-lg">
                <h4 className="font-medium text-[--cream] mb-2 font-body">{selectedTemplate.item}</h4>
                <p className="text-sm text-[--muted] mb-3 font-body">{selectedTemplate.description}</p>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-[--cream] tabular-nums">
                    {selectedTemplate.price_display}
                  </span>
                  {selectedTemplate.is_recurring && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-sky/20 text-sky font-ui flex items-center gap-1">
                      <RefreshCw className="h-3 w-3" />
                      {selectedTemplate.recurring_frequency === 'monthly' ? 'Monthly' :
                       selectedTemplate.recurring_frequency === 'quarterly' ? 'Quarterly' : 'As needed'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" className="font-ui" onClick={() => setSelectedTemplate(null)}>
              Cancel
            </Button>
            <Button
              className="font-ui"
              onClick={() => selectedTemplate && handleAddTemplate(selectedTemplate)}
              disabled={addToBudget.isPending}
            >
              Add to Budget
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark as Purchased Dialog */}
      <Dialog open={!!purchaseDialogItem} onOpenChange={() => setPurchaseDialogItem(null)}>
        <DialogContent className="bg-[--surface] border-[--border]">
          <DialogHeader>
            <DialogTitle className="font-display text-[--cream]">Mark as Purchased</DialogTitle>
            <DialogDescription className="font-body text-[--muted]">
              Enter the actual price you paid (optional)
            </DialogDescription>
          </DialogHeader>
          {purchaseDialogItem && (
            <div className="space-y-4">
              <div className="p-4 bg-[--card] rounded-lg">
                <h4 className="font-medium text-[--cream] font-body">{purchaseDialogItem.item}</h4>
                <p className="text-sm text-[--muted] font-body">
                  Estimated: {budgetService.formatPrice(purchaseDialogItem.estimated_price)}
                </p>
              </div>
              <div>
                <label className="text-sm text-[--muted] mb-2 block font-ui">
                  Actual Price (optional)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[--dim]" />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={actualPrice}
                    onChange={(e) => setActualPrice(e.target.value)}
                    className="pl-9 bg-[--card] border-[--border-hover]"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" className="font-ui" onClick={() => setPurchaseDialogItem(null)}>
              Cancel
            </Button>
            <Button className="font-ui" onClick={handleMarkPurchased} disabled={markAsPurchased.isPending}>
              <Check className="h-4 w-4 mr-2" />
              Mark Purchased
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Custom Item Dialog */}
      <Dialog open={showAddCustomDialog} onOpenChange={setShowAddCustomDialog}>
        <DialogContent className="bg-[--surface] border-[--border]">
          <DialogHeader>
            <DialogTitle className="font-display text-[--cream]">Add Custom Item</DialogTitle>
            <DialogDescription className="font-body text-[--muted]">
              Add your own item to track in your budget
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-[--muted] mb-2 block font-ui">Item Name</label>
              <Input
                placeholder="e.g., Baby monitor"
                value={customItem.item}
                onChange={(e) => setCustomItem(prev => ({ ...prev, item: e.target.value }))}
                className="bg-[--card] border-[--border-hover]"
              />
            </div>
            <div>
              <label className="text-sm text-[--muted] mb-2 block font-ui">Category</label>
              <Select
                value={customItem.category}
                onValueChange={(v) => setCustomItem(prev => ({ ...prev, category: v }))}
              >
                <SelectTrigger className="bg-[--card] border-[--border-hover]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(CATEGORY_ICONS).map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-[--muted] mb-2 block font-ui">Estimated Price</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[--dim]" />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={customItem.price}
                  onChange={(e) => setCustomItem(prev => ({ ...prev, price: e.target.value }))}
                  className="pl-9 bg-[--card] border-[--border-hover]"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="font-ui" onClick={() => setShowAddCustomDialog(false)}>
              Cancel
            </Button>
            <Button
              className="font-ui"
              onClick={handleAddCustomItem}
              disabled={!customItem.item || !customItem.price || addCustomItem.isPending}
            >
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Brand Recommendation Drawer */}
      <BrandRecommendationDrawer
        template={selectedItemForDetails}
        isOpen={!!selectedItemForDetails}
        onClose={() => setSelectedItemForDetails(null)}
      />

    </div>
  )
}

// Browse item row component
function BrowseItemRow({
  template,
  isAdded,
  brandView,
  onSelect,
  onAdd,
  isAddPending,
  isLocked = false,
}: {
  template: BudgetTemplate
  isAdded: boolean
  brandView: BudgetBrandView
  onSelect: () => void
  onAdd: () => void
  isAddPending: boolean
  isLocked?: boolean
}) {
  const isTip = template.priority === 'tip'
  const brandName = brandView === 'premium' ? template.brand_premium : template.brand_value

  return (
    <div
      className={cn(
        "flex items-start justify-between p-3 rounded-lg border transition-colors relative cursor-pointer",
        isAdded
          ? "bg-copper/10 border-copper/30"
          : "bg-[--card]/50 border-[--border-hover] hover:border-[--border-hover]"
      )}
      onClick={onSelect}
    >
      <div className="flex-1 min-w-0 pr-4">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-medium text-sm text-[--cream] font-body">
            {template.item}
          </span>
          {template.priority === 'must-have' && (
            <Badge variant="outline" className="text-xs border-coral/50 text-coral font-ui">
              Must-have
            </Badge>
          )}
          {template.priority === 'tip' && (
            <Badge variant="outline" className="text-xs border-gold/50 text-gold font-ui flex items-center gap-1">
              <Lightbulb className="h-3 w-3" /> Tip
            </Badge>
          )}
          {template.priority === 'doctor' && (
            <Badge variant="outline" className="text-xs border-coral/50 text-coral font-ui flex items-center gap-1">
              <Stethoscope className="h-3 w-3" /> Doctor
            </Badge>
          )}
          {template.is_recurring && (
            <Badge variant="outline" className="text-xs border-sky/50 text-sky font-ui flex items-center gap-1">
              <RefreshCw className="h-3 w-3" />
              {template.recurring_frequency === 'monthly' ? 'Monthly' :
               template.recurring_frequency === 'quarterly' ? 'Quarterly' : 'As needed'}
            </Badge>
          )}
          {isAdded && (
            <Badge className="text-xs bg-copper/20 text-copper border-0 font-ui">
              Added
            </Badge>
          )}
        </div>
        {template.description && (
          <p className="text-xs text-[--muted] line-clamp-2 mb-1 font-body">
            {template.description}
          </p>
        )}
        <div className="flex items-center gap-3 text-xs text-[--dim] font-ui flex-wrap">
          <span className={cn("tabular-nums", isTip ? 'text-gold' : 'text-[--cream]')}>
            {isTip ? '$0' : template.price_display}
          </span>
          {brandName && (
            <span className={cn(
              "flex items-center gap-1",
              brandView === 'premium' ? 'text-gold' : 'text-sage'
            )}>
              {brandView === 'premium' ? <Crown className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
              {brandName}
            </span>
          )}
        </div>
        {template.notes && (
          <p className="text-xs text-gold/80 mt-1 italic font-body line-clamp-2">
            {template.notes}
          </p>
        )}
      </div>
      {!isTip && (
        <Button
          size="sm"
          variant={isAdded ? "ghost" : "outline"}
          disabled={isAdded || isAddPending}
          onClick={(e) => {
            e.stopPropagation()
            onAdd()
          }}
        >
          {isAdded ? (
            <Check className="h-4 w-4 text-copper" />
          ) : isLocked ? (
            <Lock className="h-4 w-4 text-[--dim]" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  )
}

// Budget item card for "My Budget" tab
function BudgetItemCard({
  item,
  isPurchased = false,
  onMarkPurchased,
  onRemove,
  isLocked = false,
}: {
  item: FamilyBudgetItem
  isPurchased?: boolean
  onMarkPurchased?: () => void
  onRemove: () => void
  isLocked?: boolean
}) {
  const { Icon, colors } = getCategoryStyle(item.category)

  return (
    <Card className={cn(
      "bg-[--surface] border-[--border]",
      isPurchased && "opacity-70"
    )}>
      <CardContent className="py-4">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg shrink-0", colors.bg)}>
            <Icon className={cn("h-5 w-5", colors.text)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={cn(
                "font-medium text-sm font-body",
                isPurchased ? "text-[--muted] line-through" : "text-[--cream]"
              )}>
                {item.item}
              </span>
              {item.is_custom && (
                <Badge variant="outline" className="text-xs font-ui">Custom</Badge>
              )}
              {item.is_recurring && (
                <Badge variant="outline" className="text-xs border-sky/50 text-sky font-ui flex items-center gap-1">
                  <RefreshCw className="h-3 w-3" /> Recurring
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-[--muted] font-ui">
              <span>{item.category}</span>
              <span>|</span>
              <span className="tabular-nums">
                {isPurchased && item.actual_price
                  ? `Paid: ${budgetService.formatPrice(item.actual_price)}`
                  : `Est: ${budgetService.formatPrice(item.estimated_price)}`
                }
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {!isPurchased && onMarkPurchased && (
              <Button size="icon" variant="ghost" onClick={onMarkPurchased}>
                {isLocked ? (
                  <Lock className="h-4 w-4 text-[--dim]" />
                ) : (
                  <Check className="h-4 w-4 text-sage" />
                )}
              </Button>
            )}
            <Button size="icon" variant="ghost" onClick={onRemove}>
              {isLocked ? (
                <Lock className="h-4 w-4 text-[--dim]" />
              ) : (
                <Trash2 className="h-4 w-4 text-coral" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
