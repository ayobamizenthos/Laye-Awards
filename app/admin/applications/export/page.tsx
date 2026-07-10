import { redirect } from 'next/navigation'
import Image from 'next/image'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getCategoryBySlug } from '@/lib/content/categories'
import { ExportToolbar } from '@/components/admin/ExportToolbar'

export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'Applications Report',
  robots: { index: false, follow: false },
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending review',
  approved: 'Approved',
  shortlisted: 'Shortlisted',
  rejected: 'Rejected',
}

export default async function ApplicationsExportPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/admin/applications/export')
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  const { data: applications } = await supabase
    .from('applications')
    .select(
      'id, full_name, age, sex, marital_status, business_name, business_address, staff_strength, annual_turnover, social_media_id, whatsapp_number, alternative_number, email, category_slug, statement, status, admin_notes, headshot_url, created_at'
    )
    .order('created_at', { ascending: false })

  const counts =
    applications?.reduce<Record<string, number>>((acc, app) => {
      acc[app.status] = (acc[app.status] ?? 0) + 1
      return acc
    }, {}) ?? {}

  const generatedOn = new Date().toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div
      data-lenis-prevent
      className="report-root fixed inset-0 z-[100] overflow-y-auto overscroll-contain bg-white text-stone-900 print:static print:overflow-visible"
    >
      <ExportToolbar />

      <article className="mx-auto max-w-5xl px-8 pb-20 pt-16 print:max-w-none print:px-10 print:pt-10">
        <header className="border-b border-stone-300 pb-10">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-amber-700">
            LAYEAWARDS
          </p>
          <h1 className="mt-4 font-display text-5xl font-medium leading-tight text-stone-900">
            Applications report
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-stone-600">
            A complete record of every entry submitted, prepared for the review panel.
          </p>
          <dl className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
            <Stat label="Total entries" value={applications?.length ?? 0} />
            <Stat label="Pending review" value={counts.pending ?? 0} />
            <Stat label="Approved" value={counts.approved ?? 0} />
            <Stat label="Rejected" value={counts.rejected ?? 0} />
          </dl>
          <p className="mt-8 text-xs uppercase tracking-[0.18em] text-stone-500">
            Generated {generatedOn}
          </p>
        </header>

        <ol className="mt-12 space-y-12">
          {applications?.map((app, index) => {
            const category = getCategoryBySlug(app.category_slug)
            return (
              <li
                key={app.id}
                className="break-inside-avoid border-b border-stone-200 pb-12 print:break-after-page print:border-b-0 print:pb-0"
              >
                <div className="grid gap-8 sm:grid-cols-[140px_1fr] lg:grid-cols-[180px_1fr] lg:gap-10">
                  <div>
                    {app.headshot_url ? (
                      <div className="relative aspect-[4/5] overflow-hidden rounded-md border border-stone-300 bg-stone-100">
                        <Image
                          src={app.headshot_url}
                          alt={`${app.full_name}`}
                          fill
                          sizes="180px"
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-[4/5] items-center justify-center rounded-md border border-dashed border-stone-300 bg-stone-50 text-[0.62rem] uppercase tracking-[0.16em] text-stone-400">
                        No photo
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-stone-200 pb-4">
                      <div>
                        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-amber-700">
                          Entry {String(index + 1).padStart(2, '0')} ·{' '}
                          {category?.shortName ?? app.category_slug}
                        </p>
                        <h2 className="mt-2 font-display text-3xl font-medium leading-tight text-stone-900">
                          {app.full_name}
                        </h2>
                        <p className="mt-1 font-display text-base italic text-stone-600">
                          {app.business_name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="rounded-full border border-stone-300 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-stone-700">
                          {STATUS_LABEL[app.status] ?? app.status}
                        </p>
                        <p className="mt-2 text-[0.62rem] uppercase tracking-[0.16em] text-stone-500">
                          Submitted{' '}
                          {new Date(app.created_at).toLocaleDateString('en-NG', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
                      <Detail label="Email" value={app.email} />
                      <Detail label="WhatsApp" value={app.whatsapp_number} />
                      <Detail label="Alt. number" value={app.alternative_number} />
                      <Detail label="Age" value={app.age} />
                      <Detail label="Sex" value={app.sex} />
                      <Detail label="Marital status" value={app.marital_status} />
                      <Detail label="Address" value={app.business_address} wide />
                      <Detail label="Staff strength" value={app.staff_strength} />
                      <Detail
                        label="Annual turnover"
                        value={
                          app.annual_turnover
                            ? `₦${Number(app.annual_turnover).toLocaleString('en-NG')}`
                            : null
                        }
                      />
                      <Detail label="Social media" value={app.social_media_id} wide />
                    </dl>

                    <div className="mt-6">
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-stone-500">
                        Their statement
                      </p>
                      <p className="mt-2 whitespace-pre-line text-[0.95rem] leading-relaxed text-stone-800">
                        {app.statement}
                      </p>
                    </div>

                    {app.admin_notes && (
                      <div className="mt-5 rounded-md border-l-4 border-amber-600 bg-amber-50 px-4 py-3">
                        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-amber-700">
                          Panel note
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-stone-800">
                          {app.admin_notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ol>

        <footer className="mt-16 border-t border-stone-300 pt-8 text-center text-[0.62rem] uppercase tracking-[0.22em] text-stone-500">
          LAYEAWARDS · layeaward.com
        </footer>
      </article>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="font-display text-4xl text-stone-900">{value}</p>
      <p className="mt-1 text-[0.62rem] uppercase tracking-[0.2em] text-stone-500">{label}</p>
    </div>
  )
}

function Detail({
  label,
  value,
  wide,
}: {
  label: string
  value: string | number | null
  wide?: boolean
}) {
  return (
    <div className={wide ? 'sm:col-span-3' : undefined}>
      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-stone-500">
        {label}
      </p>
      <p className="mt-1 whitespace-pre-line break-words text-stone-800">{value ?? '—'}</p>
    </div>
  )
}
