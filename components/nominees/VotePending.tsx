'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

/**
 * Bank transfer, USSD and "pay with transfer" charges confirm asynchronously:
 * the voter is debited, then Paystack fires charge.success a beat later. This
 * re-checks the server every few seconds so the page flips to the success
 * celebration on its own once the webhook records the vote.
 */
export function VotePending({ reference }: { reference: string }) {
  const router = useRouter()
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const poll = setInterval(() => router.refresh(), 5000)
    const tick = setInterval(() => setElapsed(value => value + 1), 1000)
    const stop = setTimeout(() => clearInterval(poll), 150000)
    return () => {
      clearInterval(poll)
      clearInterval(tick)
      clearTimeout(stop)
    }
  }, [router])

  return (
    <div className="flex min-h-dvh items-center justify-center px-5 py-32">
      <div className="max-w-lg rounded-2xl border border-hairline bg-surface p-10 text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-gold/15 text-gold">
          <Loader2 className="size-8 animate-spin" strokeWidth={1.8} />
        </span>
        <h1 className="mt-7 font-display text-3xl font-medium text-ink sm:text-4xl">
          Confirming your vote
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          We&apos;ve received your payment and are confirming it with the bank. This can take up to
          a minute for transfers and USSD. This page updates on its own, and we&apos;ll email your
          receipt the moment it&apos;s counted.
        </p>
        <p className="mt-6 text-xs text-ink-faint">
          Reference: {reference}
          {elapsed > 0 ? ` · checking… ${elapsed}s` : ''}
        </p>
      </div>
    </div>
  )
}
