import Image from 'next/image'
import Link from 'next/link'
import { Download } from 'lucide-react'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getCategoryBySlug } from '@/lib/content/categories'
import { ApplicationReviewer } from '@/components/admin/ApplicationReviewer'
import { HashScroller } from '@/components/admin/HashScroller'

export const dynamic = 'force-dynamic'

const STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'rejected', label: 'Rejected' },
] as const

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status = 'pending' } = await searchParams
  const supabase = await createSupabaseServerClient()
  const { data: applications } = await supabase
    .from('applications')
    .select(
      'id, full_name, business_name, category_slug, statement, email, whatsapp_number, age, sex, marital_status, business_address, staff_strength, annual_turnover, social_media_id, alternative_number, status, created_at, admin_notes, headshot_url'
    )
    .eq('status', status)
    .order('created_at', { ascending: false })

  const counts: Record<string, number> = {}
  const { data: countRows } = await supabase
    .from('applications')
    .select('status', { count: 'exact', head: false })
  countRows?.forEach(row => {
    counts[row.status] = (counts[row.status] ?? 0) + 1
  })

  return (
    <div className="space-y-8 sm:space-y-10 lg:space-y-12">
      <HashScroller />
      <section>
        <div className="flex flex-wrap items-baseline justify-between gap-4 sm:gap-6">
          <div>
            <span className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-gold-deep sm:text-[0.7rem]">
              Review queue
            </span>
            <h2 className="mt-2 font-display text-xl font-medium text-ink sm:mt-3 sm:text-2xl lg:text-4xl">
              Every entry, one by one.
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-[0.62rem] uppercase tracking-[0.14em] text-ink-faint sm:text-[0.7rem] sm:tracking-[0.16em]">
              {applications?.length ?? 0} {(applications?.length ?? 0) === 1 ? 'entry' : 'entries'}{' '}
              under <span className="text-ink-soft">{status}</span>
            </p>
            <Link
              href="/admin/applications/export"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full border border-gold/45 bg-gold/[0.06] px-4 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-gold-deep transition-colors duration-300 hover:bg-gold hover:text-onyx sm:text-[0.7rem]"
            >
              <Download className="size-3.5" strokeWidth={1.75} />
              Export report
            </Link>
          </div>
        </div>

        <nav className="-mx-1 mt-5 flex gap-x-5 overflow-x-auto pb-1 [scrollbar-width:none] sm:mt-7 sm:flex-wrap sm:gap-x-7 sm:gap-y-3 sm:overflow-visible [&::-webkit-scrollbar]:hidden">
          {STATUSES.map(option => {
            const active = status === option.value
            const count = counts[option.value] ?? 0
            return (
              <a
                key={option.value}
                href={`/admin/applications?status=${option.value}`}
                className="group/tab relative shrink-0 px-1 pb-2 text-[0.66rem] font-semibold uppercase tracking-[0.16em] sm:text-[0.72rem] sm:tracking-[0.18em]"
              >
                <span
                  className={`transition-colors duration-300 ${
                    active ? 'text-ink' : 'text-ink-faint group-hover/tab:text-ink-soft'
                  }`}
                >
                  {option.label}
                  <span className="ml-2 text-ink-faint">{count}</span>
                </span>
                <span
                  className={`absolute -bottom-px left-0 h-px w-full bg-gold transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    active
                      ? 'origin-left scale-x-100'
                      : 'origin-right scale-x-0 group-hover/tab:origin-left group-hover/tab:scale-x-100'
                  }`}
                />
              </a>
            )
          })}
        </nav>
      </section>

      {!applications || applications.length === 0 ? (
        <p className="rounded-2xl border border-hairline bg-surface px-5 py-10 text-center text-sm text-ink-soft sm:px-7 sm:py-16 sm:text-base">
          No applications under <span className="text-ink">{status}</span> right now.
        </p>
      ) : (
        <ol className="space-y-6 sm:space-y-8 lg:space-y-10">
          {applications.map((application, index) => {
            const category = getCategoryBySlug(application.category_slug)
            return (
              <li
                key={application.id}
                id={`app-${application.id}`}
                className="scroll-mt-28 rounded-2xl border border-hairline bg-surface p-4 transition-colors duration-500 target:border-gold/60 target:shadow-[0_0_0_2px_rgba(203,169,78,0.18)] sm:p-6 sm:scroll-mt-32 lg:p-10"
              >
                <div className="grid gap-5 sm:gap-6 lg:grid-cols-12 lg:gap-8">
                  <div className="lg:col-span-3">
                    {application.headshot_url ? (
                      <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-hairline bg-canvas">
                        <Image
                          src={application.headshot_url}
                          alt={`${application.full_name} headshot`}
                          fill
                          sizes="(max-width: 1024px) 100vw, 22vw"
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-[4/5] items-center justify-center rounded-xl border border-dashed border-hairline bg-canvas/40">
                        <span className="text-[0.6rem] uppercase tracking-[0.18em] text-ink-faint">
                          No photo
                        </span>
                      </div>
                    )}
                    <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1 lg:mt-5 lg:block">
                      <p className="font-display text-xs tabular-nums text-gold sm:text-sm">
                        {String(index + 1).padStart(2, '0')}
                      </p>
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-gold-deep sm:text-[0.7rem] sm:tracking-[0.18em] lg:mt-4">
                        {category?.shortName ?? application.category_slug}
                      </p>
                      <p className="text-[0.62rem] text-ink-faint sm:text-[0.68rem] lg:mt-2">
                        Submitted{' '}
                        {new Date(application.created_at).toLocaleDateString('en-NG', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="min-w-0 lg:col-span-9">
                    <h3 className="font-display text-xl font-medium leading-tight text-ink sm:text-2xl lg:text-4xl">
                      {application.full_name}
                    </h3>
                    <p className="mt-1.5 font-display text-sm italic leading-snug text-ink-soft sm:mt-2 sm:text-base lg:text-xl">
                      {application.business_name}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl bg-canvas/50 p-3.5 text-[0.78rem] sm:mt-6 sm:gap-x-8 sm:gap-y-4 sm:p-5 sm:text-sm sm:grid-cols-3">
                      <Detail label="Email" value={application.email} />
                      <Detail label="WhatsApp" value={application.whatsapp_number} />
                      <Detail label="Alt number" value={application.alternative_number} />
                      <Detail label="Age" value={application.age} />
                      <Detail label="Sex" value={application.sex} />
                      <Detail label="Marital" value={application.marital_status} />
                      <Detail label="Address" value={application.business_address} />
                      <Detail label="Staff" value={application.staff_strength} />
                      <Detail
                        label="Turnover"
                        value={
                          application.annual_turnover
                            ? `₦${Number(application.annual_turnover).toLocaleString('en-NG')}`
                            : null
                        }
                      />
                      <Detail label="Social" value={application.social_media_id} />
                    </div>

                    <div className="mt-5 sm:mt-7">
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-ink-faint sm:text-[0.68rem] sm:tracking-[0.16em]">
                        Their statement
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-ink sm:mt-3 sm:text-base lg:text-lg">
                        {application.statement}
                      </p>
                    </div>

                    {application.admin_notes && (
                      <p className="mt-5 rounded-lg border border-gold/25 bg-gold/[0.05] px-3.5 py-2.5 text-xs text-ink-soft sm:mt-6 sm:px-4 sm:py-3 sm:text-sm">
                        <span className="font-medium text-gold-deep">Admin note: </span>
                        {application.admin_notes}
                      </p>
                    )}

                    <ApplicationReviewer
                      applicationId={application.id}
                      defaultHeadline={`${application.business_name}, ${category?.shortName ?? ''}`.trim()}
                      defaultBio={application.statement}
                      defaultPhotoUrl={application.headshot_url ?? ''}
                    />
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string | number | null }) {
  return (
    <div className="min-w-0">
      <p className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-ink-faint sm:text-[0.66rem]">
        {label}
      </p>
      <p className="mt-1 whitespace-pre-line break-words text-ink sm:mt-1.5">{value ?? '—'}</p>
    </div>
  )
}
