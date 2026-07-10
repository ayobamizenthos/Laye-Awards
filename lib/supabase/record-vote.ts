import { createSupabaseServiceClient } from '@/lib/supabase/server'
import { sendVoteConfirmationEmail } from '@/lib/email'
import { siteConfig } from '@/config/site'

export interface RecordVoteInput {
  nomineeId: string
  voterEmail: string
  voterPhone: string | null
  voteCount: number
  amountKobo: number
  reference: string
}

interface RecordVoteOptions {
  notifyVoter?: boolean
}

/**
 * Records a paid vote. Idempotent on paystack_reference, so the webhook, the
 * post-payment callback, and reconciliation can all call it for the same
 * transaction without double counting. The voter receipt only fires on a fresh
 * insert. Admins are notified once a day by the daily-summary cron, not per
 * vote, to stay inside the email free tier. Never let a notification failure
 * surface as a recording failure.
 */
export async function recordVote(
  input: RecordVoteInput,
  options: RecordVoteOptions = {}
): Promise<{ created: boolean }> {
  const service = createSupabaseServiceClient()

  const { error } = await service.from('votes').insert({
    nominee_id: input.nomineeId,
    voter_email: input.voterEmail,
    voter_phone: input.voterPhone,
    vote_count: input.voteCount,
    amount_kobo: input.amountKobo,
    paystack_reference: input.reference,
    paystack_status: 'success',
  })

  if (error) {
    if (error.message.toLowerCase().includes('duplicate')) return { created: false }
    throw new Error(error.message)
  }

  if (options.notifyVoter ?? true) {
    try {
      const { data: nominee } = await service
        .from('nominees')
        .select('full_name, slug')
        .eq('id', input.nomineeId)
        .maybeSingle()
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? siteConfig.url
      await sendVoteConfirmationEmail({
        to: input.voterEmail,
        nomineeName: nominee?.full_name ?? 'your nominee',
        voteCount: input.voteCount,
        amountKobo: input.amountKobo,
        reference: input.reference,
        nomineeUrl: `${baseUrl}/nominees/${nominee?.slug ?? ''}`,
      })
    } catch (notifyError) {
      console.error('[record-vote] voter notification failed:', notifyError)
    }
  }

  return { created: true }
}
