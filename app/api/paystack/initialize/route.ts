import { NextResponse, type NextRequest } from 'next/server'
import { createSupabasePublicClient } from '@/lib/supabase/server'
import { initializePaystackTransaction } from '@/lib/paystack'
import { siteConfig } from '@/config/site'

export async function POST(request: NextRequest) {
  let body: {
    nomineeId?: string
    voteCount?: number
    email?: string
    phone?: string
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const nomineeId = String(body.nomineeId ?? '').trim()
  const voteCount = Math.max(1, Math.min(500, Math.floor(Number(body.voteCount) || 0)))
  const email = String(body.email ?? '')
    .trim()
    .toLowerCase()
  const phone = String(body.phone ?? '').trim()

  if (!nomineeId) return NextResponse.json({ error: 'Nominee id missing.' }, { status: 400 })
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email.' }, { status: 400 })
  }
  if (!phone || phone.replace(/\D/g, '').length < 10) {
    return NextResponse.json({ error: 'Enter a valid phone number.' }, { status: 400 })
  }
  if (voteCount < 1)
    return NextResponse.json({ error: 'Vote count must be at least 1.' }, { status: 400 })

  const supabase = createSupabasePublicClient()
  const [{ data: nominee }, { data: settings }] = await Promise.all([
    supabase.from('nominees').select('id, slug, full_name').eq('id', nomineeId).maybeSingle(),
    supabase
      .from('voting_settings')
      .select('is_open, price_per_vote_kobo')
      .eq('id', 1)
      .maybeSingle(),
  ])

  if (!nominee) return NextResponse.json({ error: 'Nominee not found.' }, { status: 404 })
  if (!settings?.is_open) {
    return NextResponse.json({ error: 'Voting is not currently open.' }, { status: 409 })
  }

  const amountKobo = settings.price_per_vote_kobo * voteCount
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? siteConfig.url

  try {
    const result = await initializePaystackTransaction({
      email,
      amountKobo,
      callbackUrl: `${appUrl}/vote/result?nominee=${nominee.slug}`,
      metadata: {
        nominee_id: nominee.id,
        nominee_slug: nominee.slug,
        nominee_name: nominee.full_name,
        vote_count: voteCount,
        phone,
        purpose: 'layeawards_vote',
      },
    })
    return NextResponse.json({
      authorization_url: result.authorization_url,
      access_code: result.access_code,
      reference: result.reference,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Payment initialization failed.' },
      { status: 502 }
    )
  }
}
