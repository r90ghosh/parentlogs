'use client'

import { useState } from 'react'
import { Share2, Link2, Check } from 'lucide-react'

interface ShareButtonsProps {
  url: string
  title: string
  description?: string
}

export function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const fullUrl = `https://thedadcenter.com${url}`

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: description, url: fullUrl })
      } catch {
        // User cancelled — no action needed
      }
    } else {
      handleCopy()
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[--surface] border border-[--border] hover:border-[--border-hover] text-[--muted] hover:text-[--white] font-ui text-xs font-medium transition-colors"
      >
        <Share2 className="h-3.5 w-3.5" />
        Share
      </button>
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[--surface] border border-[--border] hover:border-[--border-hover] text-[--muted] hover:text-[--white] font-ui text-xs font-medium transition-colors"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-sage" />
            <span className="text-sage">Copied</span>
          </>
        ) : (
          <>
            <Link2 className="h-3.5 w-3.5" />
            Copy link
          </>
        )}
      </button>
    </div>
  )
}
