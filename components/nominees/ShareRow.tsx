'use client'

import { useState } from 'react'
import { Link2, Check } from 'lucide-react'
import type { Nominee } from '@/types'
import { siteConfig } from '@/config/site'
import { WhatsAppIcon, XIcon } from '@/components/ui/SocialIcon'

export function ShareRow({ nominee }: { nominee: Nominee }) {
  const [copied, setCopied] = useState(false)

  const link = `${siteConfig.url}/nominees/${nominee.slug}`
  const message = `Help ${nominee.fullName} win at ${siteConfig.name}! Cast your vote here:`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${message} ${link}`)}`
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(link)}`

  return (
    <div>
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink-faint">
        Share {nominee.fullName.split(' ')[0]}&apos;s link
      </p>
      <div className="mt-3 flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={copyLink}
          data-cursor-hover
          className="inline-flex items-center gap-2 rounded-full border border-hairline px-4 py-2.5 text-xs font-medium text-ink transition-colors duration-300 hover:border-gold hover:text-gold-deep"
        >
          {copied ? (
            <Check className="size-4 text-gold-deep" strokeWidth={2} />
          ) : (
            <Link2 className="size-4" strokeWidth={1.75} />
          )}
          {copied ? 'Link copied' : 'Copy link'}
        </button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer noopener"
          data-cursor-hover
          className="inline-flex items-center gap-2 rounded-full border border-hairline px-4 py-2.5 text-xs font-medium text-ink transition-colors duration-300 hover:border-gold hover:text-gold-deep"
        >
          <WhatsAppIcon className="size-4" />
          WhatsApp
        </a>
        <a
          href={xUrl}
          target="_blank"
          rel="noreferrer noopener"
          data-cursor-hover
          className="inline-flex items-center gap-2 rounded-full border border-hairline px-4 py-2.5 text-xs font-medium text-ink transition-colors duration-300 hover:border-gold hover:text-gold-deep"
        >
          <XIcon className="size-3.5" />
          Post on X
        </a>
      </div>
    </div>
  )
}
