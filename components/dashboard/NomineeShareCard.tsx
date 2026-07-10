'use client'

import { useState } from 'react'
import { Check, Copy, MessageCircle } from 'lucide-react'

interface NomineeShareCardProps {
  fullName: string
  categoryShortName: string
  shareUrl: string
  totalVotes: number
  isPublished: boolean
}

const buildText = (name: string, url: string, category: string) =>
  `Vote for ${name} in the ${category} category at the Lagos Young Entrepreneurs Awards. Every vote moves us up the leaderboard. Cast yours: ${url}`

export function NomineeShareCard({
  fullName,
  categoryShortName,
  shareUrl,
  totalVotes,
  isPublished,
}: NomineeShareCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {}
  }

  const message = buildText(fullName, shareUrl, categoryShortName)
  const encoded = encodeURIComponent(message)
  const encodedUrl = encodeURIComponent(shareUrl)

  const channels = [
    {
      label: 'WhatsApp',
      Icon: MessageCircle,
      href: `https://wa.me/?text=${encoded}`,
    },
    {
      label: 'X (Twitter)',
      Icon: XIcon,
      href: `https://twitter.com/intent/tweet?text=${encoded}`,
    },
    {
      label: 'Facebook',
      Icon: FacebookIcon,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encoded}`,
    },
  ]

  return (
    <section className="relative overflow-hidden rounded-2xl border border-gold/35 bg-gradient-to-b from-gold/[0.07] to-transparent p-5 sm:p-7 lg:p-9">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[140%] bg-[radial-gradient(ellipse_55%_60%_at_50%_0%,rgba(201,168,76,0.12),transparent_70%)]"
      />

      <div className="relative grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-gold-deep">
            Your voting link
          </span>
          <h3 className="mt-3 font-display text-2xl font-medium leading-tight text-ink sm:text-3xl lg:text-4xl">
            Share this with everyone who&apos;ll back you.
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base">
            {isPublished
              ? 'Anyone who opens this link lands directly on your profile with the voting widget ready. The more it travels, the more votes you collect.'
              : 'Your nominee profile is currently hidden by the admin. As soon as it goes live, share this link freely.'}
          </p>
        </div>

        <div className="lg:col-span-5">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-ink-faint">
            Confirmed votes
          </p>
          <p className="mt-2 font-display text-5xl text-gilded sm:text-6xl">
            {totalVotes.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="relative mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-3 overflow-hidden rounded-xl border border-hairline bg-canvas px-4 py-3">
          <span className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-ink-faint">
            URL
          </span>
          <span className="truncate text-sm text-ink">{shareUrl}</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gold px-5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ink transition-transform duration-300 hover:scale-[1.02]"
        >
          {copied ? (
            <>
              <Check className="size-3.5" strokeWidth={2.25} />
              Copied
            </>
          ) : (
            <>
              <Copy className="size-3.5" strokeWidth={2.25} />
              Copy link
            </>
          )}
        </button>
      </div>

      <div className="relative mt-6 flex flex-wrap items-center gap-3 border-t border-gold/20 pt-5">
        <span className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-ink-faint">
          Share via
        </span>
        {channels.map(channel => (
          <a
            key={channel.label}
            href={channel.href}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full border border-hairline px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft transition-colors duration-200 hover:border-gold hover:text-gold-deep"
          >
            <channel.Icon className="size-3.5" strokeWidth={1.75} />
            {channel.label}
          </a>
        ))}
      </div>
    </section>
  )
}

function FacebookIcon({ className }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M13.5 21v-7.5h2.5l.4-3H13.5V8.7c0-.9.25-1.5 1.55-1.5H16.5V4.6c-.3 0-1.25-.1-2.35-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.5v3h2.75V21h3.25Z" />
    </svg>
  )
}

function XIcon({ className }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.9 3H21l-7.4 8.45L22.5 21h-6.9l-5.4-7-6.2 7H1l8-9.1L1.5 3h7.05l4.9 6.45L17.9 3Zm-1.2 16.2h1.9L7.45 4.65H5.45L16.7 19.2Z" />
    </svg>
  )
}
