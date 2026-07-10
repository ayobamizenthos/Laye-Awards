import { NextResponse, type NextRequest } from 'next/server'
import { verifyPaystackSignature } from '@/lib/paystack'
import { recordVote } from '@/lib/supabase/record-vote'

interface PaystackEvent {
  event: string
  data: {
    status: string
    reference: string
    amount: number
    customer: { email: string }
    metadata: {
      nominee_id?: string
      vote_count?: number | string
      phone?: string
      purpose?: string
    } | null
  }
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const signature = request.headers.get('x-paystack-signature')

  if (!verifyPaystackSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 })
  }

  let event: PaystackEvent
  try {
    event = JSON.parse(rawBody) as PaystackEvent
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  if (event.event !== 'charge.success' || event.data.status !== 'success') {
    return NextResponse.json({ received: true, ignored: event.event })
  }

  const metadata = event.data.metadata ?? null
  if (metadata?.purpose !== 'layeawards_vote' || !metadata.nominee_id) {
    return NextResponse.json({ received: true, ignored: 'non-vote charge' })
  }

  const voteCount = Math.max(1, Math.floor(Number(metadata.vote_count) || 1))

  try {
    await recordVote({
      nomineeId: metadata.nominee_id,
      voterEmail: event.data.customer.email,
      voterPhone: metadata.phone ?? null,
      voteCount,
      amountKobo: event.data.amount,
      reference: event.data.reference,
    })
  } catch (error) {
    console.error('[paystack-webhook] record failed:', error)
    return NextResponse.json({ error: 'Database error.' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
