'use client'

import { useEffect } from 'react'
import { X, ExternalLink, ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BudgetTemplate, BudgetTier, ProductExample } from '@/types'

interface ProductExamplesDrawerProps {
  template: BudgetTemplate | null
  selectedTier: BudgetTier
  isOpen: boolean
  onClose: () => void
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

function getPriceForTier(template: BudgetTemplate, tier: BudgetTier): number {
  if (tier === 'budget') return template.price_low
  return template.price_high // premium
}

export function ProductExamplesDrawer({
  template,
  selectedTier,
  isOpen,
  onClose,
}: ProductExamplesDrawerProps) {
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

  const examples = template.product_examples || []
  const tierPrice = getPriceForTier(template, selectedTier)

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
              <h2 className="text-lg font-semibold text-[--cream] font-display">Product Examples</h2>
              <p className="text-xs text-[--dim] font-ui">Compare options & prices</p>
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
          <div className="flex items-center gap-2">
            <span className="text-xs text-[--dim] font-ui">Estimated price:</span>
            <span className="text-lg font-bold text-[--cream] tabular-nums">{formatPrice(tierPrice)}</span>
            <span className={cn(
              'text-xs px-2 py-0.5 rounded-full font-ui',
              selectedTier === 'budget' ? 'bg-sage/20 text-sage' : 'bg-gold/20 text-gold'
            )}>
              {selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)}
            </span>
          </div>
        </div>

        {/* Examples List */}
        <div className="flex-1 overflow-y-auto p-5">
          {examples.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs text-[--dim] mb-4 font-body">
                Here are some popular options at different price points:
              </p>
              {examples.map((example, index) => (
                <ExampleCard key={index} example={example} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="p-4 rounded-full bg-[--card] mb-4">
                <ShoppingBag className="h-8 w-8 text-[--dim]" />
              </div>
              <p className="text-[--muted] mb-2 font-body">No examples available yet</p>
              <p className="text-xs text-[--dim] max-w-[240px] font-body">
                We're adding product examples to help you compare options. Check back soon!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[--border] bg-white/[0.02]">
          <p className="text-[10px] text-[--dim] text-center font-ui">
            Prices are approximate and may vary. Last updated January 2025.
          </p>
        </div>
      </div>
    </>
  )
}

function ExampleCard({ example }: { example: ProductExample }) {
  return (
    <div className="p-4 rounded-xl bg-[--card] border border-[--border] hover:border-[--border-hover] transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[--cream] font-body">{example.brand}</p>
          <p className="text-xs text-[--muted] truncate font-body">{example.product}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg font-bold text-gold tabular-nums">{formatPrice(example.price)}</p>
        </div>
      </div>
      {example.url && (
        <a
          href={example.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-2 text-xs text-copper hover:text-copper/80 transition-colors font-ui"
        >
          View product
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  )
}
