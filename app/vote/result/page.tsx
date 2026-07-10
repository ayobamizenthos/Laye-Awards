import Link from 'next/link'
import { XCircle } from 'lucide-react'
import { verifyPaystackTransaction } from '@/lib/paystack'
import { createSupabasePublicClient } from '@/lib/supabase/server'
import { recordVote } from '@/lib/supabase/record-vote'
import { Button } from '@/components/ui/Button'
import { VoteCelebration } from '@/components/nominees/VoteCelebration'
import { VotePending } from '@/components/nominees/VotePending'

const PENDING_STATUSES = new Set(['pending', 'ongoing', 'processing', 'queued', 'send_otp'])

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Vote receipt' }

export default async function VoteResultPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; trxref?: string; nominee?: string }>
}) {
  const params = await searchParams
  const reference = params.reference ?? params.trxref
  const nomineeSlug = params.nominee

  if (!reference) {
    return <FailureCard heading="Missing reference" body="We could not match that payment." />
  }

  let status: 'success' | 'pending' | 'failed' = 'failed'
  let voteCount = 0
  let nomineeName = ''
  try {
    const result = await verifyPaystackTransaction(reference)
    if (result.status === 'success') {
      status = 'success'
      const meta = (result.metadata ?? {}) as Record<string, unknown>
      voteCount = Math.max(1, Math.floor(Number(meta.vote_count) || 1))
      nomineeName = typeof meta.nominee_name === 'string' ? meta.nominee_name : ''
      const nomineeId = typeof meta.nominee_id === 'string' ? meta.nominee_id : ''
      // The webhook is the primary recorder, but it can be missed (cold start,
      // timeout). Recording here on the voter's return guarantees the paid vote
      // is saved. Idempotent on the reference, so no double counting.
      if (nomineeId && meta.purpose === 'layeawards_vote') {
        try {
          await recordVote({
            nomineeId,
            voterEmail: result.customer.email,
            voterPhone: typeof meta.phone === 'string' ? meta.phone : null,
            voteCount,
            amountKobo: result.amount,
            reference: result.reference,
          })
        } catch (recordError) {
          console.error('[vote-result] record failed:', recordError)
        }
      }
    } else if (PENDING_STATUSES.has(result.status)) {
      // Debited but not yet confirmed (transfer / USSD). Never show this as a
      // failure — the webhook will finalise it and the page polls to success.
      status = 'pending'
    } else {
      status = 'failed'
    }
  } catch {
    // A verify that throws often means the charge is still initialising. Treat a
    // present reference as pending so a genuinely-debited voter is reassured, not
    // told it failed.
    status = 'pending'
  }

  if (status === 'pending') {
    return <VotePending reference={reference} />
  }

  if (nomineeSlug && !nomineeName) {
    const supabase = createSupabasePublicClient()
    const { data } = await supabase
      .from('nominees')
      .select('full_name')
      .eq('slug', nomineeSlug)
      .maybeSingle()
    nomineeName = data?.full_name ?? nomineeName
  }

  if (status === 'success') {
    return (
      <VoteCelebration
        nomineeName={nomineeName || 'your nominee'}
        nomineeSlug={nomineeSlug ?? ''}
        voteCount={voteCount}
      />
    )
  }

  return (
    <FailureCard
      heading="Payment not completed"
      body="Try again, or contact the team if you were charged."
      reference={reference}
    />
  )
}

function FailureCard({
  heading,
  body,
  reference,
}: {
  heading: string
  body: string
  reference?: string
}) {
  return (
    <div className="flex min-h-dvh items-center justify-center px-5 py-32">
      <div className="max-w-lg rounded-2xl border border-hairline bg-surface p-10 text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-500/15 text-red-300">
          <XCircle className="size-8" strokeWidth={1.6} />
        </span>
        <h1 className="mt-7 font-display text-4xl font-medium text-ink">{heading}</h1>
        <p className="mt-4 text-lg text-ink-soft">{body}</p>
        {reference && <p className="mt-3 text-xs text-ink-faint">Reference: {reference}</p>}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Button href="/nominees" withArrow>
            Back to Nominees
          </Button>
          <Link href="/contact" className="text-sm font-medium text-gold-deep hover:underline">
            Contact support
          </Link>
        </div>
      </div>
    </div>
  )
}
