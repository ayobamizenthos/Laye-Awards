import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Check, Clock, Sparkles, XCircle } from 'lucide-react'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getCategoryBySlug } from '@/lib/content/categories'
import { siteConfig } from '@/config/site'
import { Button } from '@/components/ui/Button'
import { NomineeShareCard } from '@/components/dashboard/NomineeShareCard'

export const dynamic = 'force-dynamic'

const STATUS_COPY = {
  pending: {
    label: 'Live',
    Icon: Check,
    accent: 'text-emerald-300',
    note: 'Your profile is live on the public voting page. Share your link to gather votes.',
  },
  approved: {
    label: 'Live',
    Icon: Check,
    accent: 'text-emerald-300',
    note: 'You’re live on the public voting page. Share your link to gather votes.',
  },
  shortlisted: {
    label: 'Live',
    Icon: Sparkles,
    accent: 'text-gold',
    note: 'You’re live. Share your voting link to mobilise support.',
  },
  rejected: {
    label: 'Removed',
    Icon: XCircle,
    accent: 'text-red-300',
    note: 'This entry was removed by the LAYEAWARDS team. Contact us if you think this is a mistake.',
  },
} as const

export default async function ApplicantDashboardPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/dashboard')

  const { data: profile } = await supabase
    .from('profiles')
    .select(
      'role, full_name, phone, avatar_url, instagram_handle, twitter_handle, facebook_handle, business_name'
    )
    .eq('id', user.id)
    .single()

  if (profile?.role === 'admin') redirect('/admin')

  const profileMissing = [
    !profile?.full_name,
    !profile?.phone,
    !profile?.avatar_url,
    !profile?.business_name,
    !profile?.instagram_handle && !profile?.twitter_handle && !profile?.facebook_handle,
  ].filter(Boolean).length

  const { data: applications } = await supabase
    .from('applications')
    .select('id, business_name, full_name, category_slug, status, created_at, admin_notes')
    .eq('applicant_id', user.id)
    .order('created_at', { ascending: false })

  interface NomineeRow {
    id: string
    slug: string
    full_name: string
    business_name: string
    category_slug: string
    total_votes: number
    is_published: boolean
    application_id: string | null
  }

  const applicationIds = (applications ?? []).map(application => application.id)
  let nomineeRows: NomineeRow[] = []
  if (applicationIds.length) {
    const { data } = await supabase
      .from('nominees')
      .select(
        'id, slug, full_name, business_name, category_slug, total_votes, is_published, application_id'
      )
      .in('application_id', applicationIds)
    nomineeRows = (data as NomineeRow[] | null) ?? []
  }

  const nomineeByAppId = new Map<string, NomineeRow>()
  nomineeRows.forEach(nominee => {
    if (nominee.application_id) nomineeByAppId.set(nominee.application_id, nominee)
  })

  const hasApplications = (applications?.length ?? 0) > 0
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? siteConfig.url

  return (
    <div className="space-y-10 sm:space-y-12 lg:space-y-14">
      {profileMissing >= 2 && (
        <section className="rounded-2xl border border-gold/40 bg-gradient-to-br from-gold/[0.09] to-transparent p-5 sm:p-6 lg:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-gold-deep sm:text-[0.7rem]">
                Complete your profile
              </p>
              <p className="mt-2 font-display text-lg leading-tight text-ink sm:text-xl lg:text-2xl">
                A few details are missing. Finish your profile so voters can recognise you.
              </p>
            </div>
            <Link
              href="/dashboard/profile"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-onyx transition-transform duration-200 hover:scale-[1.02] sm:px-6 sm:py-3"
            >
              Update profile →
            </Link>
          </div>
        </section>
      )}

      <section>
        <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-gold-deep sm:text-[0.7rem]">
          Your application{(applications?.length ?? 0) > 1 ? 's' : ''}
        </span>
        <h2 className="mt-3 font-display text-2xl font-medium text-ink sm:text-3xl lg:text-4xl">
          {hasApplications ? (
            'Where your entry stands.'
          ) : (
            <>
              Put yourself <em className="italic text-gilded">forward</em>.
            </>
          )}
        </h2>
      </section>

      {!hasApplications ? (
        <section className="space-y-5 sm:space-y-6">
          <article className="rounded-2xl border border-gold/40 bg-gradient-to-br from-gold/[0.09] to-transparent p-6 sm:p-8 lg:p-10">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-gold-deep sm:text-[0.7rem]">
              Apply as a nominee
            </p>
            <p className="mt-3 font-display text-2xl leading-tight text-ink sm:text-3xl lg:text-4xl">
              Put yourself forward.
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base">
              Register your enterprise for one of forty-three award categories. Submission takes a
              few minutes and your profile goes live on the public voting page the moment you
              submit.
            </p>
            <div className="mt-6">
              <Button href="/apply" withArrow>
                Start an Application
              </Button>
            </div>
          </article>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            <article className="rounded-2xl border border-hairline bg-surface p-5 sm:p-6 lg:p-7">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-gold-deep sm:text-[0.7rem]">
                Become a sponsor
              </p>
              <p className="mt-3 font-display text-xl leading-tight text-ink sm:text-2xl">
                Put your brand on Lagos&apos; biggest night.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Six partnership tiers, from a reserved table to exclusive headline billing.
              </p>
              <Link
                href="/sponsorship"
                className="mt-5 inline-flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-gold-deep transition-colors duration-200 hover:text-gold sm:text-[0.7rem]"
              >
                Explore Sponsorship →
              </Link>
            </article>

            <article className="rounded-2xl border border-hairline bg-surface p-5 sm:p-6 lg:p-7">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-gold-deep sm:text-[0.7rem]">
                Advertise with LAYEAWARDS
              </p>
              <p className="mt-3 font-display text-xl leading-tight text-ink sm:text-2xl">
                Reach the room investors are in.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Programme placements, on-screen features and brand activations on awards night.
              </p>
              <Link
                href="/contact"
                className="mt-5 inline-flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-gold-deep transition-colors duration-200 hover:text-gold sm:text-[0.7rem]"
              >
                Talk to the team →
              </Link>
            </article>
          </div>
        </section>
      ) : (
        <ul className="space-y-12">
          {applications!.map((application, index) => {
            const status = STATUS_COPY[application.status as keyof typeof STATUS_COPY]
            const category = getCategoryBySlug(application.category_slug)
            const Icon = status?.Icon ?? Clock
            const nominee = nomineeByAppId.get(application.id)
            return (
              <li
                key={application.id}
                className="rounded-2xl border border-hairline bg-surface p-5 sm:p-7 lg:p-10"
              >
                <div className="grid gap-8 lg:grid-cols-12">
                  <div className="lg:col-span-3">
                    <p className="font-display text-sm tabular-nums text-gold">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <p className="mt-6 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-gold-deep">
                      {category?.shortName ?? application.category_slug}
                    </p>
                    <p className="mt-3 text-[0.68rem] text-ink-faint">
                      Submitted{' '}
                      {new Date(application.created_at).toLocaleDateString('en-NG', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="space-y-8 lg:col-span-9">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <h3 className="font-display text-2xl font-medium leading-tight text-ink sm:text-4xl lg:text-5xl">
                        {application.business_name}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border border-hairline px-4 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] ${status?.accent ?? 'text-ink-soft'}`}
                      >
                        <Icon className="size-4" strokeWidth={1.75} />
                        {status?.label ?? application.status}
                      </span>
                    </div>
                    <p className="max-w-2xl text-lg leading-relaxed text-ink-soft">
                      {status?.note}
                    </p>
                    {application.admin_notes && (
                      <p className="rounded-lg border border-gold/25 bg-gold/[0.06] px-4 py-3 text-sm text-ink">
                        <span className="font-medium text-gold-deep">Note from the panel: </span>
                        {application.admin_notes}
                      </p>
                    )}

                    {nominee && (
                      <NomineeShareCard
                        fullName={nominee.full_name}
                        categoryShortName={category?.shortName ?? application.category_slug}
                        shareUrl={`${baseUrl}/nominees/${nominee.slug}`}
                        totalVotes={nominee.total_votes ?? 0}
                        isPublished={nominee.is_published ?? false}
                      />
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <section className="rounded-2xl border border-hairline bg-canvas p-7 lg:p-9">
        <p className="font-display text-2xl text-ink">Need to update something?</p>
        <p className="mt-2 text-ink-soft">
          Reach the LAYEAWARDS team and we&apos;ll help you update your entry.
        </p>
        <Link
          href="/contact"
          className="mt-5 inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-gold-deep underline-offset-4 hover:underline"
        >
          Contact the team →
        </Link>
      </section>
    </div>
  )
}
