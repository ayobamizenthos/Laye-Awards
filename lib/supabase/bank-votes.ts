'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server'
import { sendBankTransferPendingEmail, sendBankTransferConfirmedEmail } from '@/lib/email'
import { siteConfig } from '@/config/site'

interface BankTransferPayload {
  nomineeId: string
  voteCount: number
  name: string
  email: string
  phone: string
  bankReference: string
  proofImageUrl: string
}

type SubmitResult = { ok: true; voteId: string } | { ok: false; error: string }

export async function submitBankTransferVoteAction(
  payload: BankTransferPayload
): Promise<SubmitResult> {
  const voteCount = Math.max(1, Math.min(500, Math.floor(Number(payload.voteCount) || 0)))
  const name = payload.name.trim()
  const email = payload.email.trim().toLowerCase()
  const phone = payload.phone.trim()
  const bankReference = payload.bankReference.trim()
  const proofImageUrl = payload.proofImageUrl.trim()
  const nomineeId = payload.nomineeId.trim()

  if (!nomineeId) return { ok: false, error: 'Nominee missing.' }
  if (!name) return { ok: false, error: 'Enter your full name.' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Enter a valid email.' }
  }
  if (phone.replace(/\D/g, '').length < 10) {
    return { ok: false, error: 'Enter a valid phone number.' }
  }
  if (!bankReference && !proofImageUrl) {
    return {
      ok: false,
      error: 'Add either the transfer reference or a screenshot of your payment.',
    }
  }

  const supabase = createSupabaseServiceClient()
  const { data: nominee } = await supabase
    .from('nominees')
    .select('id, slug, full_name')
    .eq('id', nomineeId)
    .maybeSingle()
  if (!nominee) return { ok: false, error: 'Nominee not found.' }

  const { data: settings } = await supabase
    .from('voting_settings')
    .select('is_open, price_per_vote_kobo')
    .eq('id', 1)
    .maybeSingle()
  if (!settings?.is_open) return { ok: false, error: 'Voting is not currently open.' }

  const amountKobo = settings.price_per_vote_kobo * voteCount

  const { data, error } = await supabase
    .from('votes')
    .insert({
      nominee_id: nominee.id,
      voter_name: name,
      voter_email: email,
      voter_phone: phone,
      vote_count: voteCount,
      amount_kobo: amountKobo,
      payment_method: 'bank_transfer',
      paystack_status: 'pending',
      bank_reference: bankReference || null,
      proof_image_url: proofImageUrl || null,
    })
    .select('id')
    .single()

  if (error) return { ok: false, error: error.message }

  try {
    await sendBankTransferPendingEmail({
      to: email,
      voterName: name,
      voteCount,
      nomineeName: nominee.full_name,
      amountNaira: amountKobo / 100,
      bankReference: bankReference || '(screenshot uploaded)',
    })
  } catch (mailError) {
    console.error('[email] bank pending failed:', mailError)
  }

  revalidatePath('/admin/votes')
  return { ok: true, voteId: data.id }
}

async function requireAdmin() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false as const, error: 'Not signed in.' }
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') return { ok: false as const, error: 'Admin only.' }
  return { ok: true as const, userId: user.id }
}

export async function confirmBankTransferVoteAction(voteId: string) {
  const guard = await requireAdmin()
  if (!guard.ok) return { ok: false as const, error: guard.error }

  const service = createSupabaseServiceClient()
  const { data: vote } = await service
    .from('votes')
    .select(
      'id, vote_count, amount_kobo, voter_name, voter_email, voter_phone, bank_reference, nominee_id, paystack_status'
    )
    .eq('id', voteId)
    .maybeSingle()
  if (!vote) return { ok: false as const, error: 'Vote not found.' }
  if (vote.paystack_status === 'success') {
    return { ok: false as const, error: 'Already confirmed.' }
  }

  const { error } = await service
    .from('votes')
    .update({
      paystack_status: 'success',
      confirmed_at: new Date().toISOString(),
      confirmed_by: guard.userId,
    })
    .eq('id', voteId)
  if (error) return { ok: false as const, error: error.message }

  const { data: nominee } = await service
    .from('nominees')
    .select('full_name, slug')
    .eq('id', vote.nominee_id)
    .maybeSingle()

  try {
    await sendBankTransferConfirmedEmail({
      to: vote.voter_email,
      voterName: vote.voter_name ?? 'Friend',
      voteCount: vote.vote_count,
      nomineeName: nominee?.full_name ?? 'the nominee',
      nomineeUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? siteConfig.url}/nominees/${nominee?.slug ?? ''}`,
    })
  } catch (mailError) {
    console.error('[email] bank confirmed failed:', mailError)
  }

  revalidatePath('/admin/votes')
  revalidatePath('/admin')
  return { ok: true as const }
}

export async function rejectBankTransferVoteAction(voteId: string) {
  const guard = await requireAdmin()
  if (!guard.ok) return { ok: false as const, error: guard.error }

  const service = createSupabaseServiceClient()
  const { error } = await service
    .from('votes')
    .update({
      paystack_status: 'failed',
      confirmed_at: new Date().toISOString(),
      confirmed_by: guard.userId,
    })
    .eq('id', voteId)
  if (error) return { ok: false as const, error: error.message }

  revalidatePath('/admin/votes')
  return { ok: true as const }
}
