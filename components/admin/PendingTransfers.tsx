'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Check, ExternalLink, X } from 'lucide-react'
import {
  confirmBankTransferVoteAction,
  rejectBankTransferVoteAction,
} from '@/lib/supabase/bank-votes'

interface PendingItem {
  id: string
  vote_count: number
  amount_kobo: number
  voter_name: string | null
  voter_email: string
  voter_phone: string | null
  bank_reference: string | null
  proof_image_url: string | null
  created_at: string
  nominee: { full_name: string; slug: string; categoryName: string } | null
}

export function PendingTransfers({ pending }: { pending: PendingItem[] }) {
  const router = useRouter()
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const handle = (id: string, action: 'confirm' | 'reject') => {
    setError(null)
    setBusyId(id)
    startTransition(async () => {
      const result =
        action === 'confirm'
          ? await confirmBankTransferVoteAction(id)
          : await rejectBankTransferVoteAction(id)
      setBusyId(null)
      if (!result.ok) {
        setError(result.error)
        return
      }
      router.refresh()
    })
  }

  return (
    <section className="rounded-2xl border border-gold/30 bg-gradient-to-b from-gold/[0.06] to-transparent p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-gold-deep">
            Pending bank transfers
          </p>
          <h3 className="mt-3 font-display text-2xl font-medium text-ink sm:text-3xl">
            {pending.length} {pending.length === 1 ? 'transfer' : 'transfers'} awaiting confirmation
          </h3>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-ink-soft">
          Verify the transfer in Zenith (account 1313008097) using the reference. Confirm once it
          lands, the votes are added and the voter is emailed.
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-5 rounded-lg border border-red-500/30 bg-red-500/[0.07] px-4 py-3 text-sm text-red-200"
        >
          {error}
        </p>
      )}

      <ul className="mt-7 space-y-4">
        {pending.map(item => (
          <li key={item.id} className="rounded-xl border border-hairline bg-surface p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-12 sm:items-start">
              <div className="sm:col-span-7">
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-gold-deep">
                  {item.nominee?.categoryName ?? 'Unknown category'}
                </p>
                <p className="mt-2 font-display text-xl text-ink">
                  {item.nominee?.full_name ?? 'Unknown nominee'}
                </p>
                <p className="mt-3 text-sm text-ink-soft">
                  <span className="text-ink">{item.voter_name ?? item.voter_email}</span> wants to
                  cast {item.vote_count} vote{item.vote_count === 1 ? '' : 's'}.
                </p>
                <dl className="mt-4 grid gap-x-6 gap-y-1.5 text-xs sm:grid-cols-2">
                  <Row label="Email" value={item.voter_email} />
                  <Row label="Phone" value={item.voter_phone ?? '—'} />
                  <Row label="Reference" value={item.bank_reference ?? '—'} highlight />
                  <Row
                    label="Amount"
                    value={`₦${(item.amount_kobo / 100).toLocaleString('en-NG')}`}
                    highlight
                  />
                </dl>

                {item.proof_image_url && (
                  <div className="mt-4">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                      Payment proof
                    </p>
                    <a
                      href={item.proof_image_url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-2 inline-flex items-start gap-3 rounded-xl border border-hairline bg-canvas/60 p-2 transition-colors hover:border-gold/40"
                    >
                      <div className="relative size-20 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={item.proof_image_url}
                          alt="Payment screenshot"
                          fill
                          sizes="80px"
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <span className="inline-flex items-center gap-1.5 self-end text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-gold-deep">
                        Open full size
                        <ExternalLink className="size-3" strokeWidth={1.75} />
                      </span>
                    </a>
                  </div>
                )}
                <p className="mt-3 text-[0.65rem] uppercase tracking-[0.14em] text-ink-faint">
                  Submitted{' '}
                  {new Date(item.created_at).toLocaleString('en-NG', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:col-span-5 sm:justify-end">
                <button
                  type="button"
                  onClick={() => handle(item.id, 'confirm')}
                  disabled={busyId === item.id}
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink transition-transform duration-200 hover:scale-[1.02] disabled:cursor-wait disabled:opacity-60"
                >
                  <Check className="size-3.5" strokeWidth={2.25} />
                  {busyId === item.id ? 'Saving…' : 'Confirm'}
                </button>
                <button
                  type="button"
                  onClick={() => handle(item.id, 'reject')}
                  disabled={busyId === item.id}
                  className="inline-flex items-center gap-2 rounded-full border border-hairline px-5 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-soft transition-colors duration-200 hover:border-red-500/40 hover:text-red-300 disabled:opacity-60"
                >
                  <X className="size-3.5" strokeWidth={2.25} />
                  Reject
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-ink-faint">
        {label}
      </dt>
      <dd className={highlight ? 'mt-0.5 font-display text-base text-gilded' : 'mt-0.5 text-ink'}>
        {value}
      </dd>
    </div>
  )
}
