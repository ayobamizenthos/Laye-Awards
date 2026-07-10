import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getCategoryBySlug } from '@/lib/content/categories'
import { PendingTransfers } from '@/components/admin/PendingTransfers'

export const dynamic = 'force-dynamic'

interface PendingVote {
  id: string
  nominee_id: string
  vote_count: number
  amount_kobo: number
  voter_name: string | null
  voter_email: string
  voter_phone: string | null
  bank_reference: string | null
  proof_image_url: string | null
  created_at: string
  nominees: { full_name: string; slug: string; category_slug: string } | null
}

export default async function AdminVotesPage() {
  const supabase = await createSupabaseServerClient()
  const { data: nominees } = await supabase
    .from('nominees')
    .select('id, full_name, business_name, category_slug, total_votes, slug')
    .order('category_slug', { ascending: true })
    .order('total_votes', { ascending: false })

  const { data: pendingRaw } = await supabase
    .from('votes')
    .select(
      'id, nominee_id, vote_count, amount_kobo, voter_name, voter_email, voter_phone, bank_reference, proof_image_url, created_at, nominees(full_name, slug, category_slug)'
    )
    .eq('payment_method', 'bank_transfer')
    .eq('paystack_status', 'pending')
    .order('created_at', { ascending: false })

  const pendingVotes = ((pendingRaw ?? []) as unknown as PendingVote[]).map(vote => ({
    ...vote,
    nominee: vote.nominees
      ? {
          ...vote.nominees,
          categoryName:
            getCategoryBySlug(vote.nominees.category_slug)?.shortName ??
            vote.nominees.category_slug,
        }
      : null,
  }))

  const grouped = (nominees ?? []).reduce<Record<string, typeof nominees>>((acc, nominee) => {
    const slug = nominee.category_slug
    if (!acc[slug]) acc[slug] = [] as typeof nominees
    acc[slug]!.push(nominee)
    return acc
  }, {})

  const totalVotes = (nominees ?? []).reduce((sum, n) => sum + (n.total_votes ?? 0), 0)
  const { count: txCount } = await supabase
    .from('votes')
    .select('id', { count: 'exact', head: true })
    .eq('paystack_status', 'success')

  return (
    <div className="space-y-12 lg:space-y-16">
      <section className="grid gap-8 sm:gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-gold-deep sm:text-[0.7rem]">
            Live results
          </span>
          <h2 className="mt-4 font-display text-3xl font-medium leading-tight text-ink sm:text-4xl lg:text-5xl">
            The leaderboard, by <em className="italic text-gilded">category</em>.
          </h2>
        </div>
        <dl className="grid grid-cols-2 gap-x-6 sm:gap-x-10 lg:col-span-5">
          <div>
            <dt className="text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-ink-faint sm:text-[0.66rem]">
              Total votes
            </dt>
            <dd className="mt-2 font-display text-4xl text-gilded sm:text-5xl">
              {totalVotes.toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-ink-faint sm:text-[0.66rem]">
              Transactions
            </dt>
            <dd className="mt-2 font-display text-4xl text-gilded sm:text-5xl">
              {(txCount ?? 0).toLocaleString()}
            </dd>
          </div>
        </dl>
      </section>

      {pendingVotes.length > 0 && <PendingTransfers pending={pendingVotes} />}

      {Object.keys(grouped).length === 0 ? (
        <p className="rounded-2xl border border-hairline bg-surface px-7 py-16 text-center text-ink-soft">
          No nominees published yet. Once you approve applications, the leaderboard fills in here.
        </p>
      ) : (
        <div className="space-y-14">
          {Object.entries(grouped).map(([slug, list]) => {
            const category = getCategoryBySlug(slug)
            const winner = list?.[0]
            const leaderGap =
              list && list.length > 1
                ? (winner?.total_votes ?? 0) - (list[1].total_votes ?? 0)
                : null
            return (
              <section key={slug}>
                <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-hairline pb-4">
                  <h3 className="font-display text-2xl text-ink lg:text-3xl">
                    {category?.shortName ?? slug}
                  </h3>
                  {winner && (
                    <p className="text-[0.7rem] uppercase tracking-[0.16em] text-ink-faint">
                      Leading <span className="text-gold-deep">{winner.full_name}</span>
                      {leaderGap !== null && leaderGap > 0 && (
                        <span className="ml-1 text-ink-faint">(+{leaderGap.toLocaleString()})</span>
                      )}
                    </p>
                  )}
                </div>
                <ol className="mt-2">
                  {list?.map((nominee, index) => {
                    const isLeader = index === 0
                    return (
                      <li
                        key={nominee.id}
                        className="flex items-center gap-4 border-b border-hairline py-4 sm:gap-6 sm:py-5"
                      >
                        <span
                          className={`w-8 font-display text-lg tabular-nums sm:w-10 sm:text-2xl ${
                            isLeader ? 'text-gilded' : 'text-ink-faint'
                          }`}
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-display text-lg truncate sm:text-2xl ${
                              isLeader ? 'text-ink' : 'text-ink-soft'
                            }`}
                          >
                            {nominee.full_name}
                          </p>
                          <p className="text-sm text-ink-faint truncate">{nominee.business_name}</p>
                        </div>
                        <p
                          className={`font-display text-2xl tabular-nums sm:text-3xl ${
                            isLeader ? 'text-gilded' : 'text-ink'
                          }`}
                        >
                          {nominee.total_votes.toLocaleString()}
                        </p>
                      </li>
                    )
                  })}
                </ol>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
