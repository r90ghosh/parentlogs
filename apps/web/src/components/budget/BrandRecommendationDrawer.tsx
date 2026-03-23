'use client'

import { useEffect } from 'react'
import { X, ShoppingBag, Crown, Sparkles, RefreshCw, Stethoscope, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BudgetTemplate } from '@tdc/shared/types'

interface BrandRecommendationDrawerProps {
  template: BudgetTemplate | null
  isOpen: boolean
  onClose: () => void
}

export function BrandRecommendationDrawer({
  template,
  isOpen,
  onClose,
}: BrandRecommendationDrawerProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen])

  if (!template) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-full sm:w-[400px] z-50',
          'bg-[--surface]/95 backdrop-blur-xl border-l border-[--border]',
          'transform transition-transform duration-300 ease-out',
          'flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[--border]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gold/20">
              <ShoppingBag className="h-5 w-5 text-gold" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[--cream] font-display">Item Details</h2>
              <p className="text-xs text-[--dim] font-ui">Price range & brand picks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5 text-[--muted]" />
          </button>
        </div>

        {/* Item Info */}
        <div className="p-5 border-b border-[--border] bg-white/[0.02]">
          <h3 className="text-[--cream] font-medium mb-1 font-body">{template.item}</h3>
          <p className="text-sm text-[--muted] mb-3 font-body">{template.category}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg font-bold text-[--cream] tabular-nums">
              {template.price_display}
            </span>
            {template.priority === 'must-have' && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-coral/20 text-coral font-ui">
                Must-have
              </span>
            )}
            {template.priority === 'tip' && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gold/20 text-gold font-ui flex items-center gap-1">
                <Lightbulb className="h-3 w-3" /> Tip
              </span>
            )}
            {template.priority === 'doctor' && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-coral/20 text-coral font-ui flex items-center gap-1">
                <Stethoscope className="h-3 w-3" /> Doctor
              </span>
            )}
            {template.is_recurring && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-sky/20 text-sky font-ui flex items-center gap-1">
                <RefreshCw className="h-3 w-3" />
                {template.recurring_frequency === 'monthly' ? 'Monthly' :
                 template.recurring_frequency === 'quarterly' ? 'Quarterly' : 'As needed'}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Description */}
          {template.description && (
            <div>
              <h4 className="text-xs font-semibold text-[--muted] uppercase tracking-wider mb-2 font-ui">
                Description
              </h4>
              <p className="text-sm text-[--cream] font-body leading-relaxed">
                {template.description}
              </p>
            </div>
          )}

          {/* Notes */}
          {template.notes && (
            <div className="p-4 rounded-xl bg-gold/5 border border-gold/15">
              <h4 className="text-xs font-semibold text-gold uppercase tracking-wider mb-2 font-ui">
                Dad Pro Tip
              </h4>
              <p className="text-sm text-[--cream] font-body leading-relaxed">
                {template.notes}
              </p>
            </div>
          )}

          {/* Brand Recommendations */}
          {(template.brand_premium || template.brand_value) && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-[--muted] uppercase tracking-wider font-ui">
                Brand Recommendations
              </h4>

              {template.brand_premium && (
                <div className="p-4 rounded-xl bg-[--card] border border-gold/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="h-4 w-4 text-gold" />
                    <span className="text-xs font-semibold text-gold font-ui">Premium Pick</span>
                  </div>
                  <p className="text-sm font-medium text-[--cream] font-body">
                    {template.brand_premium}
                  </p>
                </div>
              )}

              {template.brand_value && (
                <div className="p-4 rounded-xl bg-[--card] border border-sage/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-sage" />
                    <span className="text-xs font-semibold text-sage font-ui">Best Value</span>
                  </div>
                  <p className="text-sm font-medium text-[--cream] font-body">
                    {template.brand_value}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Period */}
          <div>
            <h4 className="text-xs font-semibold text-[--muted] uppercase tracking-wider mb-2 font-ui">
              When to Buy
            </h4>
            <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-copper-dim text-copper text-sm font-ui">
              {template.period}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[--border] bg-white/[0.02]">
          <p className="text-[10px] text-[--dim] text-center font-ui">
            Prices are approximate and may vary. Last updated March 2026.
          </p>
        </div>
      </div>
    </>
  )
}
