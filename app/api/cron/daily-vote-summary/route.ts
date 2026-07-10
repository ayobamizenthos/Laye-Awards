import { NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase/server'
import { sendDailyVoteSummaryEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WAT_OFFSET_MS = 60 * 60 * 1000

export async function GET(request: Request) {
  const auth = request.headers.get('authorization')
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  // Bound the report to the current day in West Africa Time (UTC+1).
  const nowWat = new Date(Date.now() + WAT_OFFSET_MS)
  const y = nowWat.getUTCFullYear()
  const m = nowWat.getUTCMonth()
  const d = nowWat.getUTCDate()
  const startMs = Date.UTC(y, m, d, 0, 0, 0) - WAT_OFFSET_MS
  const startIso = new Date(startMs).toISOString()
  const endIso = new Date(startMs + 24 * 60 * 60 * 1000).toISOString()
  const dateLabel = `${d} ${MONTHS[m]} ${y}`

  const service = createSupabaseServiceClient()

  const { data: votes } = await service
    .from('votes')
    .select('nominee_id, vote_count, amount_kobo')
    .eq('paystack_status', 'success')
    .gte('created_at', startIso)
    .lt('created_at', endIso)

  const rows = votes ?? []
  const totalVotes = rows.reduce((sum, row) => sum + (row.vote_count ?? 0), 0)
  const totalNaira = rows.reduce((sum, row) => sum + (row.amount_kobo ?? 0), 0) / 100

  const votesByNominee = new Map<string, number>()
  for (const row of rows) {
    votesByNominee.set(
      row.nominee_id,
      (votesByNominee.get(row.nominee_id) ?? 0) + (row.vote_count ?? 0)
    )
  }

  const ids = [...votesByNominee.keys()]
  const nameById = new Map<string, { full_name: string; business_name: string | null }>()
  if (ids.length) {
    const { data: nominees } = await service
      .from('nominees')
      .select('id, full_name, business_name')
      .in('id', ids)
    for (const nominee of nominees ?? []) {
      nameById.set(nominee.id, {
        full_name: nominee.full_name,
        business_name: nominee.business_name,
      })
    }
  }

  const perNominee = [...votesByNominee.entries()]
    .map(([id, count]) => ({
      name: nameById.get(id)?.full_name ?? 'Unknown nominee',
      business: nameById.get(id)?.business_name ?? '',
      votes: count,
    }))
    .sort((a, b) => b.votes - a.votes)

  const { data: admins } = await service.from('profiles').select('id').eq('role', 'admin')
  const {
    data: { users },
  } = await service.auth.admin.listUsers({ perPage: 1000 })
  const emailById = new Map(users.map(user => [user.id, user.email]))
  const adminEmails = (admins ?? [])
    .map(admin => emailById.get(admin.id))
    .filter((address): address is string => Boolean(address))

  await sendDailyVoteSummaryEmail({
    to: adminEmails,
    dateLabel,
    totalVotes,
    totalNaira,
    paymentCount: rows.length,
    perNominee,
  })

  return NextResponse.json({
    sentTo: adminEmails.length,
    dateLabel,
    totalVotes,
    paymentCount: rows.length,
  })
}
