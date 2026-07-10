'use client'

import { useState, useTransition } from 'react'
import {
  setVotePriceAction,
  setVotingWindowAction,
  toggleVotingOpenAction,
} from '@/lib/supabase/admin'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface Props {
  initialOpen: boolean
  initialPriceKobo: number
  initialOpensAt: string | null
  initialClosesAt: string | null
}

function toLocalInput(iso: string | null): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.valueOf())) return ''
  const offsetMs = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16)
}

export function AdminSettingsForm({
  initialOpen,
  initialPriceKobo,
  initialOpensAt,
  initialClosesAt,
}: Props) {
  const [open, setOpen] = useState(initialOpen)
  const [priceNaira, setPriceNaira] = useState(String(initialPriceKobo / 100))
  const [opensAt, setOpensAt] = useState(toLocalInput(initialOpensAt))
  const [closesAt, setClosesAt] = useState(toLocalInput(initialClosesAt))
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    setError(null)
    setNotice(null)
    const next = !open
    startTransition(async () => {
      const result = await toggleVotingOpenAction(next)
      if (!result.ok) {
        setError(result.error)
        return
      }
      setOpen(next)
      setNotice(next ? 'Voting is now open.' : 'Voting is now closed.')
    })
  }

  const handlePrice = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setNotice(null)
    const kobo = Math.round(Number.parseFloat(priceNaira) * 100)
    if (!Number.isFinite(kobo) || kobo < 100) {
      setError('Enter a price of at least ₦1.')
      return
    }
    startTransition(async () => {
      const result = await setVotePriceAction(kobo)
      if (!result.ok) {
        setError(result.error)
        return
      }
      setNotice(`Vote price set to ₦${(kobo / 100).toLocaleString()}.`)
    })
  }

  const handleWindow = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setNotice(null)
    startTransition(async () => {
      const opens = opensAt ? new Date(opensAt).toISOString() : null
      const closes = closesAt ? new Date(closesAt).toISOString() : null
      const result = await setVotingWindowAction(opens, closes)
      if (!result.ok) {
        setError(result.error)
        return
      }
      setNotice('Voting window saved.')
    })
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-hairline bg-surface p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-faint">
              Public voting
            </p>
            <p className="mt-2 font-display text-2xl text-ink">
              {open ? 'Currently open' : 'Currently closed'}
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              Controls whether the voting widget on nominee pages accepts new payments.
            </p>
          </div>
          <button
            type="button"
            onClick={handleToggle}
            disabled={isPending}
            aria-pressed={open}
            aria-label={open ? 'Close voting' : 'Open voting'}
            className={cn(
              'relative inline-flex h-9 w-16 items-center rounded-full transition-colors duration-300',
              open ? 'bg-gold' : 'bg-hairline'
            )}
          >
            <span
              className={cn(
                'inline-block size-7 transform rounded-full bg-canvas shadow-sm transition-transform duration-300',
                open ? 'translate-x-8' : 'translate-x-1'
              )}
            />
          </button>
        </div>
      </div>

      <form
        onSubmit={handlePrice}
        className="rounded-2xl border border-hairline bg-surface p-5 sm:p-7"
      >
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-faint">
          Price per vote
        </p>
        <p className="mt-2 font-display text-2xl text-ink">Set the public vote price.</p>
        <div className="mt-4 flex flex-wrap items-end gap-4">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
              Naira per vote
            </span>
            <div className="mt-2 inline-flex items-center rounded-xl border border-hairline bg-canvas px-4">
              <span className="font-display text-lg text-gilded">₦</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={priceNaira}
                onChange={event => setPriceNaira(event.target.value.replace(/\D/g, ''))}
                className="ml-2 h-12 w-28 bg-transparent text-ink outline-none"
              />
            </div>
          </label>
          <Button type="submit" disabled={isPending} magnetic={false}>
            {isPending ? 'Saving…' : 'Update price'}
          </Button>
        </div>
      </form>

      <form
        onSubmit={handleWindow}
        className="rounded-2xl border border-hairline bg-surface p-5 sm:p-7"
      >
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-faint">
          Voting window
        </p>
        <p className="mt-2 font-display text-2xl text-ink">When the public can vote.</p>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">
          The dates shown on the public site and used to gate the voting widget. Leave a field blank
          to remove that bound.
        </p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
              Opens at
            </span>
            <input
              type="datetime-local"
              value={opensAt}
              onChange={event => setOpensAt(event.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-hairline bg-canvas px-4 text-sm text-ink outline-none transition-colors focus:border-gold"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
              Closes at
            </span>
            <input
              type="datetime-local"
              value={closesAt}
              onChange={event => setClosesAt(event.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-hairline bg-canvas px-4 text-sm text-ink outline-none transition-colors focus:border-gold"
            />
          </label>
        </div>
        <div className="mt-5">
          <Button type="submit" disabled={isPending} magnetic={false}>
            {isPending ? 'Saving…' : 'Save window'}
          </Button>
        </div>
      </form>

      {notice && (
        <p className="rounded-xl border border-gold/30 bg-gold/[0.07] px-4 py-3 text-sm text-ink-soft">
          {notice}
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/[0.07] px-4 py-3 text-sm text-red-200"
        >
          {error}
        </p>
      )}
    </div>
  )
}
