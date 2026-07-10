import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getCategoryBySlug } from '@/lib/content/categories'
import { siteConfig } from '@/config/site'

export const dynamic = 'force-dynamic'

export default async function AdminOverview() {
  const supabase = await createSupabaseServerClient()

  const [
    { count: pendingCount },
    { count: approvedCount },
    { count: nomineeCount },
    { count: votesCount },
    { data: recentApps },
    { data: leaders },
    { data: settings },
  ] = await Promise.all([
    supabase
      .from('applications')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending'),
    supabase
      .from('applications')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'approved'),
    supabase.from('nominees').select('id', { count: 'exact', head: true }),
    supabase
      .from('votes')
      .select('id', { count: 'exact', head: true })
      .eq('paystack_status', 'success'),
    supabase
      .from('applications')
      .select('id, full_name, business_name, category_slug, status, created_at')
      .order('created_at', { ascending: false })
      .limit(50),
    supabase
      .from('nominees')
      .select('id, slug, full_name, business_name, category_slug, total_votes')
      .order('total_votes', { ascending: false })
      .limit(50),
    supabase
      .from('voting_settings')
      .select('is_open, price_per_vote_kobo')
      .eq('id', 1)
      .maybeSingle(),
  ])

  const figures = [
    {
      value: pendingCount ?? 0,
      label: 'Pending applications',
      note: 'Entries awaiting a verdict from the panel.',
      href: '/admin/applications',
    },
    {
      value: approvedCount ?? 0,
      label: 'Approved entries',
      note: 'Founders who have crossed the editorial line.',
      href: '/admin/applications?status=approved',
    },
    {
      value: nomineeCount ?? 0,
      label: 'Published nominees',
      note: 'Profiles live on the public ballot.',
      href: '/admin/nominees',
    },
    {
      value: votesCount ?? 0,
      label: 'Successful votes',
      note: 'Paystack-verified support cast for nominees.',
      href: '/admin/votes',
    },
  ]

  const isVotingOpen = settings?.is_open ?? false
  const priceNaira = ((settings?.price_per_vote_kobo ?? 10000) / 100).toLocaleString()

  return (
    <div className="space-y-12 sm:space-y-16 lg:space-y-24">
      <section>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <span className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-gold-deep sm:text-[0.7rem]">
            By the numbers
          </span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-4 lg:gap-x-10">
          {figures.map(figure => (
            <Link
              key={figure.label}
              href={figure.href}
              className="group/figure relative flex flex-col rounded-2xl border border-hairline bg-surface p-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-gold/45 hover:shadow-[0_28px_60px_-30px_rgba(203,169,78,0.35)] sm:p-7 lg:p-8"
            >
              <p className="font-display text-[2.5rem] font-medium leading-none text-gilded transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:text-6xl lg:text-7xl xl:text-8xl">
                {figure.value.toLocaleString()}
              </p>
              <p className="mt-3 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-ink-soft sm:mt-5 sm:text-[0.72rem]">
                {figure.label}
              </p>
              <p className="mt-1.5 hidden text-sm leading-relaxed text-ink-faint sm:mt-3 sm:block sm:max-w-xs">
                {figure.note}
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-ink-soft transition-colors duration-300 group-hover/figure:text-gold-deep sm:mt-6 sm:text-[0.7rem]">
                View
                <ArrowUpRight
                  className="size-3 transition-transform duration-300 group-hover/figure:translate-x-0.5 group-hover/figure:-translate-y-0.5 sm:size-3.5"
                  strokeWidth={1.75}
                />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-b from-gold/[0.07] via-transparent to-transparent p-5 sm:p-7 lg:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[140%] bg-[radial-gradient(ellipse_55%_55%_at_50%_0%,rgba(201,168,76,0.12),transparent_70%)]"
        />
        <div className="relative grid gap-7 sm:gap-9 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <span className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-gold-deep sm:text-[0.7rem]">
              State of the vote
            </span>
            <h2 className="mt-3 font-display text-2xl font-medium leading-tight text-ink sm:mt-5 sm:text-3xl lg:text-4xl">
              {isVotingOpen ? (
                <>
                  Public voting is <em className="italic text-gilded">live</em>.
                </>
              ) : (
                <>
                  Voting is <em className="italic text-gilded">closed</em>.
                </>
              )}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft sm:mt-5 sm:text-base">
              {isVotingOpen
                ? 'Cast votes are recorded in real time. Open the leaderboard to see who is leading each category.'
                : 'When you are ready to invite the public, flip voting open from the settings page.'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-5">
            <div className="rounded-xl border border-hairline bg-canvas/50 p-4 sm:p-5">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-ink-faint sm:text-[0.68rem] sm:tracking-[0.16em]">
                Price per vote
              </p>
              <p className="mt-2 font-display text-2xl text-gilded sm:mt-3 sm:text-3xl">
                ₦{priceNaira}
              </p>
            </div>
            <div className="rounded-xl border border-hairline bg-canvas/50 p-4 sm:p-5">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-ink-faint sm:text-[0.68rem] sm:tracking-[0.16em]">
                Status
              </p>
              <p className="mt-2 inline-flex items-center gap-2 font-display text-lg text-ink sm:mt-3 sm:text-2xl">
                <span
                  className={`size-2 rounded-full ${isVotingOpen ? 'bg-emerald-300' : 'bg-ink-faint'}`}
                />
                {isVotingOpen ? 'Open' : 'Closed'}
              </p>
            </div>
            <div className="col-span-2">
              <Link
                href="/admin/settings"
                className="inline-flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-ink-soft transition-colors duration-200 hover:text-gold-deep sm:text-[0.72rem]"
              >
                Adjust controls
                <ArrowUpRight className="size-3.5" strokeWidth={1.75} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-2 lg:gap-12">
        <div>
          <div className="flex items-baseline justify-between border-b border-hairline pb-3 sm:pb-4">
            <h2 className="font-display text-xl text-ink sm:text-2xl">Latest applications</h2>
            <Link
              href="/admin/applications"
              className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-gold-deep transition-colors duration-200 hover:text-gold sm:text-[0.7rem]"
            >
              All →
            </Link>
          </div>
          {!recentApps || recentApps.length === 0 ? (
            <p className="mt-6 text-sm text-ink-soft sm:mt-8 sm:text-base">
              No applications submitted yet.
            </p>
          ) : (
            <div
              data-lenis-prevent
              className="dropdown-scroll mt-2 max-h-[420px] overflow-y-auto overscroll-contain pr-2 sm:max-h-[480px] sm:pr-3"
            >
              <ul>
                {recentApps.map((app, index) => {
                  const category = getCategoryBySlug(app.category_slug)
                  const statusStyles =
                    app.status === 'approved'
                      ? 'border-gold/40 text-gold-deep'
                      : app.status === 'rejected'
                        ? 'border-red-500/30 text-red-300'
                        : app.status === 'shortlisted'
                          ? 'border-emerald-400/30 text-emerald-200'
                          : 'border-ink-faint/30 text-ink-faint'
                  return (
                    <li key={app.id} className="border-b border-hairline last:border-b-0">
                      <Link
                        href={`/admin/applications?status=${app.status}#app-${app.id}`}
                        className="group/row flex items-start gap-3 py-3 transition-colors duration-200 hover:bg-gold/[0.04] sm:items-center sm:gap-4 sm:py-4"
                      >
                        <span className="mt-0.5 shrink-0 font-display text-xs tabular-nums text-gold sm:mt-0 sm:text-sm">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-display text-[0.95rem] text-ink transition-colors duration-200 group-hover/row:text-gold sm:text-lg">
                            {app.full_name}
                          </p>
                          <p className="truncate text-[0.7rem] text-ink-faint sm:text-sm">
                            {app.business_name} · {category?.shortName ?? app.category_slug}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full border bg-canvas/60 px-2 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.14em] sm:px-2.5 sm:py-1 sm:text-[0.62rem] ${statusStyles}`}
                        >
                          {app.status}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-baseline justify-between border-b border-hairline pb-3 sm:pb-4">
            <h2 className="font-display text-xl text-ink sm:text-2xl">Leaderboard</h2>
            <Link
              href="/admin/votes"
              className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-gold-deep transition-colors duration-200 hover:text-gold sm:text-[0.7rem]"
            >
              All →
            </Link>
          </div>
          {!leaders || leaders.length === 0 ? (
            <p className="mt-6 text-sm text-ink-soft sm:mt-8 sm:text-base">
              No published nominees yet.
            </p>
          ) : (
            <div
              data-lenis-prevent
              className="dropdown-scroll mt-2 max-h-[420px] overflow-y-auto overscroll-contain pr-2 sm:max-h-[480px] sm:pr-3"
            >
              <ul>
                {leaders.map((nominee, index) => {
                  const category = getCategoryBySlug(nominee.category_slug)
                  return (
                    <li key={nominee.id} className="border-b border-hairline last:border-b-0">
                      <Link
                        href={`/admin/nominees#nominee-${nominee.id}`}
                        className="group/row flex items-start gap-3 py-3 transition-colors duration-200 hover:bg-gold/[0.04] sm:items-center sm:gap-4 sm:py-4"
                      >
                        <span className="mt-0.5 shrink-0 font-display text-xs tabular-nums text-gold sm:mt-0 sm:text-sm">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-display text-[0.95rem] text-ink transition-colors duration-200 group-hover/row:text-gold sm:text-lg">
                            {nominee.full_name}
                          </p>
                          <p className="truncate text-[0.7rem] text-ink-faint sm:text-sm">
                            {category?.shortName ?? nominee.category_slug}
                          </p>
                        </div>
                        <p className="shrink-0 font-display text-base text-gilded tabular-nums sm:text-2xl">
                          {nominee.total_votes.toLocaleString()}
                        </p>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
