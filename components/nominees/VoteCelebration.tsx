'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { Check, Link2, X } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { WhatsAppIcon } from '@/components/ui/SocialIcon'

interface VoteCelebrationProps {
  nomineeName: string
  nomineeSlug: string
  voteCount: number
  /** When provided, shows a dismiss button instead of navigation links (inline use). */
  onClose?: () => void
}

const CONFETTI_COLORS = ['#cba94e', '#f1d588', '#9a52b6', '#b9923f', '#ffffff']

export function VoteCelebration({
  nomineeName,
  nomineeSlug,
  voteCount,
  onClose,
}: VoteCelebrationProps) {
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)
  const reduceMotion =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  useEffect(() => setMounted(true), [])

  const link = `${siteConfig.url}/nominees/${nomineeSlug}`
  const firstName = nomineeName.split(' ')[0]

  const confetti = useMemo(
    () =>
      Array.from({ length: 36 }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        delay: Math.random() * 0.35,
        duration: 2.6 + Math.random() * 1.6,
        size: 6 + Math.random() * 8,
        rotate: Math.random() * 360,
        color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
        drift: (Math.random() - 0.5) * 120,
      })),
    []
  )

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `I just voted for ${nomineeName} at ${siteConfig.name}! Add your vote here: ${link}`
  )}`

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Vote confirmed"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden px-4 py-8"
    >
      <div className="absolute inset-0 bg-onyx/80 backdrop-blur-md" onClick={onClose} />

      {mounted && !reduceMotion && (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {confetti.map(piece => (
            <motion.span
              key={piece.id}
              initial={{ y: '-12vh', x: 0, opacity: 0, rotate: 0 }}
              animate={{ y: '112vh', x: piece.drift, opacity: [0, 1, 1, 0], rotate: piece.rotate }}
              transition={{
                duration: piece.duration,
                delay: piece.delay,
                ease: 'easeIn',
                repeat: Infinity,
                repeatDelay: 0.6,
              }}
              style={{
                position: 'absolute',
                left: `${piece.left}%`,
                width: piece.size,
                height: piece.size * 1.4,
                backgroundColor: piece.color,
                borderRadius: 2,
              }}
            />
          ))}
        </div>
      )}

      <motion.div
        initial={{ scale: 0.88, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 240, damping: 22, delay: 0.05 }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-gold/35 bg-surface p-7 text-center shadow-[0_40px_120px_-40px_rgba(0,0,0,0.7)] sm:p-9"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgba(203,169,78,0.28),transparent_70%)]"
        />

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 text-ink-faint transition-colors hover:text-ink"
          >
            <X className="size-5" strokeWidth={1.75} />
          </button>
        )}

        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.2 }}
          className="relative mx-auto flex size-16 items-center justify-center rounded-full bg-gold text-onyx sm:size-20"
        >
          <Check className="size-8 sm:size-10" strokeWidth={2.5} />
        </motion.span>

        <p className="relative mt-6 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold-deep">
          Vote confirmed
        </p>
        <h2 className="relative mt-2 font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">
          Your vote has been cast!
        </h2>
        <p className="relative mt-3 text-base leading-relaxed text-ink-soft">
          {voteCount} vote{voteCount === 1 ? '' : 's'} for{' '}
          <span className="text-ink">{nomineeName}</span> counted. Thank you for backing {firstName}
          .
        </p>

        <div className="relative mt-7 space-y-3">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-ink-faint">
            Help {firstName} win. Share the link
          </p>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-hairline text-xs font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:border-gold hover:text-gold-deep"
            >
              {copied ? (
                <Check className="size-4 text-gold-deep" strokeWidth={2.25} />
              ) : (
                <Link2 className="size-4" strokeWidth={1.75} />
              )}
              {copied ? 'Copied' : 'Copy link'}
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-gold text-xs font-semibold uppercase tracking-[0.12em] text-onyx transition-transform hover:scale-[1.02]"
            >
              <WhatsAppIcon className="size-4" />
              WhatsApp
            </a>
          </div>
        </div>

        <div className="relative mt-6 flex items-center justify-center gap-5 text-[0.72rem] font-semibold uppercase tracking-[0.14em]">
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="text-ink-soft transition-colors hover:text-gold-deep"
            >
              Done
            </button>
          ) : (
            <>
              <Link href={`/nominees/${nomineeSlug}`} className="text-gold-deep hover:text-gold">
                Vote again
              </Link>
              <Link href="/nominees" className="text-ink-soft transition-colors hover:text-ink">
                All nominees
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
