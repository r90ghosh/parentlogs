'use client'

import { useState, useMemo } from 'react'
import { useBudgetSummary, useAddToBudget, useMarkAsPurchased, useRemoveBudgetItem, useAddCustomBudgetItem } from '@/hooks/use-budget'
import { useFamily } from '@/hooks/use-family'
import { useRequirePremium } from '@/hooks/use-require-auth'
import Link from 'next/link'
import { budgetService } from '@/services/budget-service'
import { BudgetTimelineBar } from '@/components/shared/budget-timeline-bar'
import { TierFilter } from '@/components/budget/TierFilter'
import { ProductExamplesDrawer } from '@/components/budget/ProductExamplesDrawer'
import {
  BudgetTimelineCategory,
  getBudgetStatsByCategory,
  getCurrentBudgetCategory,
  getBudgetTimelineCategory,
} from '@/lib/budget-timeline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  Baby,
  Home,
  Car,
  Heart,
  Utensils,
  Shield,
  Monitor,
  FileText,
  Shirt,
  Sparkles,
  Users,
  Briefcase,
  Camera,
  BookOpen,
  PersonStanding,
  Lock,
  Crown,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { BudgetTemplate, FamilyBudgetItem, BudgetTier } from '@/types'

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'Admin': FileText,
  'Nursery': Home,
  'Gear': Car,
  'Health': Heart,
  'Feeding': Utensils,
  'Diapering': Baby,
  'Tech': Monitor,
  'Safety': Shield,
  'Clothing': Shirt,
  'Baby Care': Sparkles,
  'Childcare': Users,
  'Travel': Briefcase,
  'Maternity': PersonStanding,
  'Memories': Camera,
  'Books': BookOpen,
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Admin': { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/30' },
  'Nursery': { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
  'Gear': { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  'Health': { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
  'Feeding': { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
  'Diapering': { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  'Tech': { bg: 'bg-indigo-500/20', text: 'text-indigo-400', border: 'border-indigo-500/30' },
  'Safety': { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
  'Clothing': { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500/30' },
  'Baby Care': { bg: 'bg-teal-500/20', text: 'text-teal-400', border: 'border-teal-500/30' },
  'Childcare': { bg: 'bg-violet-500/20', text: 'text-violet-400', border: 'border-violet-500/30' },
  'Travel': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  'Maternity': { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30' },
  'Memories': { bg: 'bg-fuchsia-500/20', text: 'text-fuchsia-400', border: 'border-fuchsia-500/30' },
  'Books': { bg: 'bg-lime-500/20', text: 'text-lime-400', border: 'border-lime-500/30' },
}

// Number of free items to show per category
const FREE_ITEMS_PER_CATEGORY = 2

export default function BudgetPage() {
  const { data: summary, isLoading } = useBudgetSummary()
  const { data: family } = useFamily()
  const { isPremium } = useRequirePremium()
  const addToBudget = useAddToBudget()
  const markAsPurchased = useMarkAsPurchased()
  const removeBudgetItem = useRemoveBudgetItem()
  const addCustomItem = useAddCustomBudgetItem()

  const [selectedTemplate, setSelectedTemplate] = useState<BudgetTemplate | null>(null)
  const [purchaseDialogItem, setPurchaseDialogItem] = useState<FamilyBudgetItem | null>(null)
  const [actualPrice, setActualPrice] = useState('')
  const [showAddCustomDialog, setShowAddCustomDialog] = useState(false)
  const [customItem, setCustomItem] = useState({ item: '', category: 'Other', price: '' })
  const [stageFilter, setStageFilter] = useState<'all' | 'pregnancy' | 'post-birth'>('all')
  const [selectedTimelineCategory, setSelectedTimelineCategory] = useState<BudgetTimelineCategory | null>(null)
  const [selectedTier, setSelectedTier] = useState<BudgetTier>('budget')
  const [selectedItemForDetails, setSelectedItemForDetails] = useState<BudgetTemplate | null>(null)

  // Calculate budget stats by timeline category
  const budgetStats = useMemo(() => {
    if (!summary?.categories) {
      return getBudgetStatsByCategory([], selectedTier)
    }
    const allTemplates = summary.categories.flatMap(c => c.items)
    return getBudgetStatsByCategory(allTemplates, selectedTier)
  }, [summary, selectedTier])

  // Get current budget category based on family stage
  const currentBudgetCategory = useMemo(() => {
    if (!family) return 'pregnancy' as BudgetTimelineCategory
    return getCurrentBudgetCategory(family)
  }, [family])

  // Get all templates for tier filter
  const allTemplates = useMemo(() => {
    if (!summary?.categories) return []
    return summary.categories.flatMap(c => c.items)
  }, [summary])

  // Helper to get price based on tier
  const getPriceForTier = (template: BudgetTemplate, tier: BudgetTier): number => {
    if (tier === 'budget') return template.price_low
    return template.price_high // premium
  }

  // Format single price
  const formatPrice = (cents: number): string => {
    return `$${(cents / 100).toFixed(0)}`
  }

  const addedTemplateIds = new Set(
    summary?.familyItems
      .filter(i => i.budget_template_id)
      .map(i => i.budget_template_id)
  )

  const handleAddTemplate = async (template: BudgetTemplate) => {
    const result = await addToBudget.mutateAsync({
      templateId: template.budget_id,
      estimatedPrice: template.price_mid,
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

  const filteredCategories = summary?.categories.filter(category => {
    // Always filter out Admin items
    let items = category.items.filter(item => item.category !== 'Admin')
    // Then filter by stage
    if (stageFilter !== 'all') {
      items = items.filter(item => item.stage === stageFilter)
    }
    // Then filter by timeline category if selected
    if (selectedTimelineCategory) {
      items = items.filter(item => getBudgetTimelineCategory(item) === selectedTimelineCategory)
    }
    return items.length > 0
  }).map(category => {
    // Always filter out Admin items
    let items = category.items.filter(item => item.category !== 'Admin')
    if (stageFilter !== 'all') {
      items = items.filter(item => item.stage === stageFilter)
    }
    if (selectedTimelineCategory) {
      items = items.filter(item => getBudgetTimelineCategory(item) === selectedTimelineCategory)
    }
    return { ...category, items }
  })

  const pendingItems = summary?.familyItems.filter(i => !i.is_purchased) || []
  const purchasedItems = summary?.familyItems.filter(i => i.is_purchased) || []

  if (isLoading) {
    return (
      <div className="p-4 md:ml-64 space-y-6 max-w-4xl">
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
    <div className="p-4 md:ml-64 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Budget Planner</h1>
          <p className="text-surface-400 mt-1">
            Plan and track your baby expenses
          </p>
        </div>
        <Button onClick={() => setShowAddCustomDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Custom
        </Button>
      </div>

      {/* Tier Filter */}
      {allTemplates.length > 0 && (
        <TierFilter
          templates={allTemplates}
          selectedTier={selectedTier}
          onTierChange={setSelectedTier}
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

      {/* Summary Cards - Now showing single tier price */}
      {(() => {
        // Calculate totals for current tier (always exclude Admin)
        const tierTotal = allTemplates
          .filter(t => t.category !== 'Admin')
          .reduce((sum, t) => sum + getPriceForTier(t, selectedTier), 0)

        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-surface-900 border-surface-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-blue-500/20">
                    <TrendingUp className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-surface-400">
                      {selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)} Estimate
                    </p>
                    <p className="text-xl font-bold text-white">
                      {formatPrice(tierTotal)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-surface-900 border-surface-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-green-500/20">
                    <ShoppingCart className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-surface-400">Purchased</p>
                    <p className="text-xl font-bold text-white">
                      {budgetService.formatPrice(summary?.purchasedTotal || 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-surface-900 border-surface-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-amber-500/20">
                    <Wallet className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-surface-400">Remaining</p>
                    <p className="text-xl font-bold text-white">
                      {formatPrice(Math.max(0, tierTotal - (summary?.purchasedTotal || 0)))}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      })()}

      {/* Progress */}
      {summary && summary.familyItems.length > 0 && (
        <Card className="bg-surface-900 border-surface-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-surface-400">Shopping Progress</span>
              <span className="text-sm font-medium text-white">
                {purchasedItems.length} of {summary.familyItems.length} items
              </span>
            </div>
            <Progress
              value={(purchasedItems.length / summary.familyItems.length) * 100}
              className="h-2 bg-surface-800"
            />
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="my-budget" className="space-y-4">
        <TabsList className="bg-surface-900 border border-surface-800">
          <TabsTrigger value="my-budget">My Budget ({summary?.familyItems.length || 0})</TabsTrigger>
          <TabsTrigger value="browse">Browse Items</TabsTrigger>
        </TabsList>

        {/* My Budget Tab */}
        <TabsContent value="my-budget" className="space-y-4">
          {summary?.familyItems.length === 0 ? (
            <Card className="bg-surface-900 border-surface-800">
              <CardContent className="py-12 text-center">
                <DollarSign className="h-12 w-12 text-surface-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No items yet</h3>
                <p className="text-surface-400 mb-4">
                  Browse our curated list to add items to your budget
                </p>
                <Button variant="outline" onClick={() => {
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
                  <h3 className="text-sm font-medium text-surface-400 flex items-center gap-2">
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
                  <h3 className="text-sm font-medium text-surface-400 flex items-center gap-2">
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
          {/* Premium Upgrade Banner for free users */}
          {!isPremium && (
            <Card className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30">
              <CardContent className="py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/20">
                      <Crown className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Unlock Full Budget Planner</p>
                      <p className="text-sm text-surface-400">
                        See all {summary?.categories.reduce((sum, c) => sum + c.items.length, 0) || 0} items with detailed descriptions, notes, and price ranges
                      </p>
                    </div>
                  </div>
                  <Button asChild className="bg-amber-500 hover:bg-amber-600 text-black shrink-0">
                    <Link href="/settings/subscription">
                      Upgrade
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stage Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-surface-400">Show:</span>
            <Select value={stageFilter} onValueChange={(v) => setStageFilter(v as typeof stageFilter)}>
              <SelectTrigger className="w-40 bg-surface-900 border-surface-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="pregnancy">Pregnancy</SelectItem>
                <SelectItem value="post-birth">Post-Birth</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Accordion type="multiple" defaultValue={filteredCategories?.map(c => c.name)} className="space-y-2">
            {filteredCategories?.map((category) => {
              const Icon = CATEGORY_ICONS[category.name] || DollarSign
              const colors = CATEGORY_COLORS[category.name] || CATEGORY_COLORS['Admin']
              const lockedCount = isPremium ? 0 : Math.max(0, category.items.length - FREE_ITEMS_PER_CATEGORY)
              // Calculate category total based on selected tier
              const categoryTierTotal = category.items.reduce(
                (sum, item) => sum + getPriceForTier(item, selectedTier),
                0
              )

              return (
                <AccordionItem
                  key={category.name}
                  value={category.name}
                  className="bg-surface-900 border border-surface-800 rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-surface-800/50">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={cn("p-2 rounded-lg", colors.bg)}>
                        <Icon className={cn("h-5 w-5", colors.text)} />
                      </div>
                      <div className="flex-1 text-left">
                        <span className="font-medium text-white">{category.name}</span>
                        <span className="text-xs text-surface-400 ml-2">
                          ({category.items.length} items)
                        </span>
                        {lockedCount > 0 && (
                          <span className="text-xs text-amber-400 ml-2">
                            <Lock className="h-3 w-3 inline mr-1" />
                            {lockedCount} locked
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-surface-400 mr-4">
                        {formatPrice(categoryTierTotal)}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-2 pt-2">
                      {category.items.map((template, index) => {
                        const isAdded = addedTemplateIds.has(template.budget_id)
                        const isLocked = !isPremium && index >= FREE_ITEMS_PER_CATEGORY
                        const itemPrice = getPriceForTier(template, selectedTier)
                        const hasProductExamples = template.product_examples && template.product_examples.length > 0

                        // For locked items, truncate item name and hide details
                        const displayName = isLocked
                          ? template.item.slice(0, Math.floor(template.item.length * 0.4)) + '...'
                          : template.item

                        return (
                          <div
                            key={template.budget_id}
                            className={cn(
                              "flex items-start justify-between p-3 rounded-lg border transition-colors relative",
                              isLocked
                                ? "bg-surface-800/30 border-surface-700/50"
                                : isAdded
                                  ? "bg-accent-500/10 border-accent-500/30"
                                  : "bg-surface-800/50 border-surface-700 hover:border-surface-600",
                              !isLocked && "cursor-pointer"
                            )}
                            onClick={!isLocked ? () => setSelectedItemForDetails(template) : undefined}
                          >
                            <div className="flex-1 min-w-0 pr-4">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={cn(
                                  "font-medium text-sm",
                                  isLocked ? "text-surface-500" : "text-white"
                                )}>
                                  {displayName}
                                </span>
                                {isLocked && (
                                  <Lock className="h-3 w-3 text-surface-500" />
                                )}
                                {!isLocked && template.priority === 'must-have' && (
                                  <Badge variant="outline" className="text-xs border-red-500/50 text-red-400">
                                    Must-have
                                  </Badge>
                                )}
                                {!isLocked && isAdded && (
                                  <Badge className="text-xs bg-accent-500/20 text-accent-400 border-0">
                                    Added
                                  </Badge>
                                )}
                                {!isLocked && hasProductExamples && (
                                  <Info className="h-3 w-3 text-amber-400" />
                                )}
                              </div>
                              {isLocked ? (
                                <p className="text-xs text-surface-600 italic">
                                  Upgrade to see details
                                </p>
                              ) : (
                                <>
                                  {template.description && (
                                    <p className="text-xs text-surface-400 line-clamp-2 mb-1">
                                      {template.description}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-3 text-xs text-surface-500">
                                    <span>
                                      Week {template.week_start}-{template.week_end}
                                    </span>
                                    <span className={selectedTier === 'budget' ? 'text-emerald-400' : 'text-amber-400'}>
                                      {formatPrice(itemPrice)}
                                    </span>
                                  </div>
                                  {template.notes && (
                                    <p className="text-xs text-amber-400/80 mt-1 italic">
                                      {template.notes}
                                    </p>
                                  )}
                                </>
                              )}
                            </div>
                            {isLocked ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
                                asChild
                              >
                                <Link href="/settings/subscription">
                                  <Lock className="h-3 w-3 mr-1" />
                                  Unlock
                                </Link>
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant={isAdded ? "ghost" : "outline"}
                                disabled={isAdded || addToBudget.isPending}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedTemplate(template)
                                }}
                              >
                                {isAdded ? (
                                  <Check className="h-4 w-4 text-accent-500" />
                                ) : (
                                  <Plus className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </TabsContent>
      </Tabs>

      {/* Add Template Dialog */}
      <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
        <DialogContent className="bg-surface-900 border-surface-800">
          <DialogHeader>
            <DialogTitle>Add to Budget</DialogTitle>
            <DialogDescription>
              Add "{selectedTemplate?.item}" to your budget tracker
            </DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <div className="p-4 bg-surface-800 rounded-lg">
                <h4 className="font-medium text-white mb-2">{selectedTemplate.item}</h4>
                <p className="text-sm text-surface-400 mb-3">{selectedTemplate.description}</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-surface-700 rounded">
                    <p className="text-xs text-surface-400">Budget</p>
                    <p className="text-sm font-medium text-green-400">
                      {budgetService.formatPrice(selectedTemplate.price_low)}
                    </p>
                  </div>
                  <div className="p-2 bg-surface-700 rounded border-2 border-accent-500">
                    <p className="text-xs text-surface-400">Mid-range</p>
                    <p className="text-sm font-medium text-white">
                      {budgetService.formatPrice(selectedTemplate.price_mid)}
                    </p>
                  </div>
                  <div className="p-2 bg-surface-700 rounded">
                    <p className="text-xs text-surface-400">Premium</p>
                    <p className="text-sm font-medium text-amber-400">
                      {budgetService.formatPrice(selectedTemplate.price_high)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
              Cancel
            </Button>
            <Button
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
        <DialogContent className="bg-surface-900 border-surface-800">
          <DialogHeader>
            <DialogTitle>Mark as Purchased</DialogTitle>
            <DialogDescription>
              Enter the actual price you paid (optional)
            </DialogDescription>
          </DialogHeader>
          {purchaseDialogItem && (
            <div className="space-y-4">
              <div className="p-4 bg-surface-800 rounded-lg">
                <h4 className="font-medium text-white">{purchaseDialogItem.item}</h4>
                <p className="text-sm text-surface-400">
                  Estimated: {budgetService.formatPrice(purchaseDialogItem.estimated_price)}
                </p>
              </div>
              <div>
                <label className="text-sm text-surface-400 mb-2 block">
                  Actual Price (optional)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500" />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={actualPrice}
                    onChange={(e) => setActualPrice(e.target.value)}
                    className="pl-9 bg-surface-800 border-surface-700"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPurchaseDialogItem(null)}>
              Cancel
            </Button>
            <Button onClick={handleMarkPurchased} disabled={markAsPurchased.isPending}>
              <Check className="h-4 w-4 mr-2" />
              Mark Purchased
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Custom Item Dialog */}
      <Dialog open={showAddCustomDialog} onOpenChange={setShowAddCustomDialog}>
        <DialogContent className="bg-surface-900 border-surface-800">
          <DialogHeader>
            <DialogTitle>Add Custom Item</DialogTitle>
            <DialogDescription>
              Add your own item to track in your budget
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-surface-400 mb-2 block">Item Name</label>
              <Input
                placeholder="e.g., Baby monitor"
                value={customItem.item}
                onChange={(e) => setCustomItem(prev => ({ ...prev, item: e.target.value }))}
                className="bg-surface-800 border-surface-700"
              />
            </div>
            <div>
              <label className="text-sm text-surface-400 mb-2 block">Category</label>
              <Select
                value={customItem.category}
                onValueChange={(v) => setCustomItem(prev => ({ ...prev, category: v }))}
              >
                <SelectTrigger className="bg-surface-800 border-surface-700">
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
              <label className="text-sm text-surface-400 mb-2 block">Estimated Price</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500" />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={customItem.price}
                  onChange={(e) => setCustomItem(prev => ({ ...prev, price: e.target.value }))}
                  className="pl-9 bg-surface-800 border-surface-700"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCustomDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddCustomItem}
              disabled={!customItem.item || !customItem.price || addCustomItem.isPending}
            >
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Examples Drawer */}
      <ProductExamplesDrawer
        template={selectedItemForDetails}
        selectedTier={selectedTier}
        isOpen={!!selectedItemForDetails}
        onClose={() => setSelectedItemForDetails(null)}
      />
    </div>
  )
}

function BudgetItemCard({
  item,
  isPurchased = false,
  onMarkPurchased,
  onRemove,
}: {
  item: FamilyBudgetItem
  isPurchased?: boolean
  onMarkPurchased?: () => void
  onRemove: () => void
}) {
  const colors = CATEGORY_COLORS[item.category] || CATEGORY_COLORS['Admin']
  const Icon = CATEGORY_ICONS[item.category] || DollarSign

  return (
    <Card className={cn(
      "bg-surface-900 border-surface-800",
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
                "font-medium text-sm",
                isPurchased ? "text-surface-400 line-through" : "text-white"
              )}>
                {item.item}
              </span>
              {item.is_custom && (
                <Badge variant="outline" className="text-xs">Custom</Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-surface-400">
              <span>{item.category}</span>
              <span>|</span>
              <span>
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
                <Check className="h-4 w-4 text-green-500" />
              </Button>
            )}
            <Button size="icon" variant="ghost" onClick={onRemove}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
