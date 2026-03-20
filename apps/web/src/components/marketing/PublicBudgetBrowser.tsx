'use client'

import { useState, useMemo } from 'react'
import { BudgetTimelineBar } from '@/components/shared/budget-timeline-bar'
import { BrandToggleFilter } from '@/components/budget/BrandToggleFilter'
import {
  BudgetTimelineCategory,
  getBudgetStatsByCategory,
  getBudgetTimelineCategory,
} from '@/lib/budget-timeline'
import { getCategoryStyle } from '@/lib/budget-constants'
import { budgetService } from '@/services/budget-service'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  Crown,
  Sparkles,
  RefreshCw,
  Lightbulb,
  Stethoscope,
} from 'lucide-react'
import { BudgetTemplate, BudgetBrandView } from '@/types'

interface PublicBudgetBrowserProps {
  templates: BudgetTemplate[]
}

export function PublicBudgetBrowser({ templates }: PublicBudgetBrowserProps) {
  const [selectedTimelineCategory, setSelectedTimelineCategory] = useState<BudgetTimelineCategory | null>(null)
  const [selectedBrandView, setSelectedBrandView] = useState<BudgetBrandView>('premium')

  const budgetStats = useMemo(() => getBudgetStatsByCategory(templates), [templates])

  // Group by category
  const groupedCategories = useMemo(() => {
    const categoryMap = new Map<string, BudgetTemplate[]>()
    templates.forEach(t => {
      const existing = categoryMap.get(t.category) || []
      existing.push(t)
      categoryMap.set(t.category, existing)
    })

    return Array.from(categoryMap.entries())
      .map(([name, items]) => {
        let filtered = items
        if (selectedTimelineCategory) {
          filtered = items.filter(item => getBudgetTimelineCategory(item) === selectedTimelineCategory)
        }
        return { name, items: filtered }
      })
      .filter(c => c.items.length > 0)
  }, [templates, selectedTimelineCategory])

  return (
    <div className="space-y-6">
      {/* Brand Toggle */}
      <BrandToggleFilter
        selectedView={selectedBrandView}
        onViewChange={setSelectedBrandView}
      />

      {/* Timeline Bar */}
      <BudgetTimelineBar
        stats={budgetStats}
        currentCategory="1st Trimester"
        selectedCategory={selectedTimelineCategory}
        onCategoryClick={setSelectedTimelineCategory}
      />

      {/* Category Accordions */}
      <Accordion
        type="multiple"
        key={`accordion-${selectedTimelineCategory || 'all'}`}
        defaultValue={groupedCategories.map(c => c.name)}
        className="space-y-2"
      >
        {groupedCategories.map((category) => {
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
                  {category.items.map((template) => {
                    const isTip = template.priority === 'tip'
                    const brandName = selectedBrandView === 'premium'
                      ? template.brand_premium
                      : template.brand_value

                    return (
                      <div
                        key={template.budget_id}
                        className="flex items-start justify-between p-3 rounded-lg border bg-[--card]/50 border-[--border-hover]"
                      >
                        <div className="flex-1 min-w-0">
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
                            {template.is_premium && (
                              <Badge variant="outline" className="text-xs border-gold/50 text-gold font-ui flex items-center gap-1">
                                <Crown className="h-3 w-3" /> Premium
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
                                selectedBrandView === 'premium' ? 'text-gold' : 'text-sage'
                              )}>
                                {selectedBrandView === 'premium' ? <Crown className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
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
                      </div>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}
