'use client'

import { useState, useTransition } from 'react'
import { Minus, Plus, ShieldCheck } from 'lucide-react'
import type { Nominee } from '@/types'
import { formatNaira } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface VotingWidgetProps {
  nominee: Nominee
  isOpen: boolean
  pricePerVoteKobo: number
}

const PRESETS = [5, 10, 25, 50]

export function VotingWidget({ nominee, isOpen, pricePerVoteKobo }: VotingWidgetProps) {
  const [votes, setVotes] = useState(1)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const total = votes * pricePerVoteKobo

  const adjust = (delta: number) => {
    setVotes(current => Math.max(1, Math.min(500, current + delta)))
    setError(null)
  }

  const handlePaystack = () => {
    setError(null)
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Enter a valid email so we can send your receipt.')
      return
    }
    if (phone.replace(/\D/g, '').length < 10) {
      setError('Enter a valid phone number.')
      return
    }
    startTransition(async () => {
      try {
        const response = await fetch('/api/paystack/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nomineeId: nominee.id,
            voteCount: votes,
            email: email.trim(),
            phone: phone.trim(),
          }),
        })
        const data = (await response.json()) as {
          authorization_url?: string
          access_code?: string
          reference?: string
          error?: string
        }
        if (!response.ok || !data.access_code) {
          if (data.authorization_url) {
            window.location.assign(data.authorization_url)
            return
          }
          setError(data.error ?? 'Could not start the payment. Try again.')
          return
        }

        const resultUrl = (reference: string) =>
          `/vote/result?reference=${encodeURIComponent(reference)}&nominee=${nominee.slug}`

        try {
          const { default: PaystackPop } = await import('@paystack/inline-js')
          const popup = new PaystackPop()
          popup.resumeTransaction(data.access_code, {
            onSuccess: (transaction: { reference: string }) => {
              window.location.assign(resultUrl(transaction.reference || data.reference || ''))
            },
            // Transfer / USSD confirm asynchronously: the voter can be debited yet
            // close the popup before onSuccess fires. Send them to the result page
            // (which verifies with Paystack) instead of falsely saying "cancelled",
            // so a real payment shows as confirming and never looks lost.
            onCancel: () => {
              if (data.reference) window.location.assign(resultUrl(data.reference))
              else setError('Payment cancelled. You can try again whenever you’re ready.')
            },
            onError: () => {
              if (data.reference) window.location.assign(resultUrl(data.reference))
              else if (data.authorization_url) window.location.assign(data.authorization_url)
              else setError('Could not open the payment window. Try again.')
            },
          })
        } catch {
          if (data.authorization_url) window.location.assign(data.authorization_url)
          else setError('Could not open the payment window. Try again.')
        }
      } catch {
        setError('Network error. Check your connection and try again.')
      }
    })
  }

  return (
    <div className="rounded-2xl border border-hairline bg-surface p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-medium text-ink">Cast Your Vote</h2>
        <span
          className={`text-[0.68rem] font-semibold uppercase tracking-[0.14em] ${
            isOpen ? 'text-gold-deep' : 'text-ink-faint'
          }`}
        >
          {isOpen ? 'Voting Live' : 'Opening Soon'}
        </span>
      </div>

      <p className="mt-2 text-sm text-ink-soft">
        Every vote moves {nominee.fullName.split(' ')[0]} up the leaderboard.
      </p>

      <div className="mt-7">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink-faint">
          Number of Votes
        </p>
        <div className="mt-3 flex items-center justify-between rounded-full border border-hairline p-1.5">
          <button
            type="button"
            aria-label="Remove a vote"
            onClick={() => adjust(-1)}
            disabled={votes <= 1}
            data-cursor-hover
            className="flex size-11 items-center justify-center rounded-full bg-canvas text-ink transition-colors duration-300 hover:bg-ink hover:text-canvas disabled:pointer-events-none disabled:opacity-35"
          >
            <Minus className="size-4" strokeWidth={2} />
          </button>
          <span className="font-display text-3xl font-medium tabular-nums text-ink">{votes}</span>
          <button
            type="button"
            aria-label="Add a vote"
            onClick={() => adjust(1)}
            data-cursor-hover
            className="flex size-11 items-center justify-center rounded-full bg-canvas text-ink transition-colors duration-300 hover:bg-ink hover:text-canvas"
          >
            <Plus className="size-4" strokeWidth={2} />
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRESETS.map(preset => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setVotes(preset)
                setError(null)
              }}
              data-cursor-hover
              className="rounded-full border border-hairline px-3.5 py-1.5 text-xs font-medium text-ink-soft transition-colors duration-300 hover:border-gold hover:text-gold-deep"
            >
              +{preset}
            </button>
          ))}
        </div>
      </div>

      <dl className="mt-6 space-y-2.5 text-sm">
        <div className="flex justify-between text-ink-soft">
          <dt>Price per vote</dt>
          <dd>{formatNaira(pricePerVoteKobo)}</dd>
        </div>
        <div className="flex items-baseline justify-between">
          <dt className="font-medium text-ink">Total</dt>
          <dd className="font-display text-3xl font-medium text-ink">{formatNaira(total)}</dd>
        </div>
      </dl>

      <div className="mt-6 space-y-3">
        <LabeledInput
          label="Your email (for receipt)"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          placeholder="you@email.com"
        />
        <LabeledInput
          label="Phone number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={setPhone}
          placeholder="080 0000 0000"
        />
        <div className="pt-3">
          <Button
            onClick={handlePaystack}
            disabled={!isOpen || isPending}
            magnetic={false}
            className="w-full"
          >
            {!isOpen
              ? 'Voting Opens Soon'
              : isPending
                ? 'Starting payment…'
                : `Pay & Vote · ${formatNaira(total)}`}
          </Button>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-3 rounded-lg border border-red-500/30 bg-red-500/[0.07] px-3.5 py-2.5 text-xs leading-relaxed text-red-200"
        >
          {error}
        </p>
      )}

      <p className="mt-4 flex items-center justify-center gap-1.5 text-[0.7rem] text-ink-faint">
        <ShieldCheck className="size-3.5" strokeWidth={1.75} />
        Secured by Paystack · card &amp; bank transfer · verified instantly
      </p>
    </div>
  )
}

interface LabeledInputProps {
  label: string
  type: 'email' | 'tel'
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoComplete?: string
  inputMode?: 'email' | 'tel'
}

function LabeledInput({
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  inputMode,
}: LabeledInputProps) {
  return (
    <label className="block">
      <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-faint">
        {label}
      </span>
      <input
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 h-12 w-full rounded-xl border border-hairline bg-canvas px-4 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-gold"
      />
    </label>
  )
}
