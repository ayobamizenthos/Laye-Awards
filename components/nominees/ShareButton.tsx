'use client'

import { useState } from 'react'
import { Share2, Check } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

interface ShareButtonProps {
  slug: string
  fullName: string
  className?: string
}

export function ShareButton({ slug, fullName, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const link = `${siteConfig.url}/nominees/${slug}`
  const shareText = `Help ${fullName} win at ${siteConfig.name}! Cast your vote here:`

  const handleShare = async (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${fullName} · ${siteConfig.name}`,
          text: shareText,
          url: link,
        })
        return
      } catch {
        return
      }
    }

    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={`Share ${fullName}'s voting link`}
      data-cursor-hover
      className={cn(
        'relative inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-hairline text-ink-soft transition-colors duration-300 hover:border-gold hover:text-gold-deep',
        className
      )}
    >
      {copied ? (
        <Check className="size-4 text-gold-deep" strokeWidth={2.25} />
      ) : (
        <Share2 className="size-4" strokeWidth={1.75} />
      )}
      {copied && (
        <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-canvas">
          Link copied
        </span>
      )}
    </button>
  )
}
