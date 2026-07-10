import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { createSupabaseServiceClient } from '@/lib/supabase/server'
import { getCategoryBySlug } from '@/lib/content/categories'
import { DeleteMemberButton } from '@/components/admin/DeleteMemberButton'

export const dynamic = 'force-dynamic'

interface ProfileRow {
  id: string
  full_name: string | null
  phone: string | null
  role: string | null
  avatar_url: string | null
  business_name: string | null
  business_address: string | null
  instagram_handle: string | null
  twitter_handle: string | null
  facebook_handle: string | null
  created_at: string
}

interface ApplicationRow {
  id: string
  status: string
  full_name: string | null
  business_name: string | null
  category_slug: string
  created_at: string
}

export default async function AdminMemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const service = createSupabaseServiceClient()

  const { data: profile } = (await service
    .from('profiles')
    .select(
      'id, full_name, phone, role, avatar_url, business_name, business_address, instagram_handle, twitter_handle, facebook_handle, created_at'
    )
    .eq('id', id)
    .maybeSingle()) as { data: ProfileRow | null }

  if (!profile) notFound()

  const { data: authUser } = await service.auth.admin.getUserById(id)
  const email = authUser?.user?.email ?? '—'

  const { data: applications } = (await service
    .from('applications')
    .select('id, status, full_name, business_name, category_slug, created_at')
    .eq('applicant_id', id)
    .order('created_at', { ascending: false })) as { data: ApplicationRow[] | null }

  const apps = applications ?? []
  const displayName = profile.full_name?.trim() || email.split('@')[0]
  const initial = (displayName[0] ?? 'A').toUpperCase()

  return (
    <div className="space-y-8 sm:space-y-10">
      <Link
        href="/admin/members"
        className="inline-flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-gold-deep transition-colors duration-200 hover:text-gold sm:text-[0.7rem]"
      >
        <ArrowLeft className="size-3.5 sm:size-4" strokeWidth={1.75} />
        All members
      </Link>

      <section className="grid gap-7 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-gold/35 bg-gold/[0.06]">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt=""
                fill
                sizes="(max-width: 1024px) 90vw, 30vw"
                unoptimized
                className="object-cover"
              />
            ) : (
              <span
                aria-hidden
                className="flex h-full w-full items-center justify-center font-display text-7xl text-gilded"
              >
                {initial}
              </span>
            )}
          </div>
        </div>

        <div className="lg:col-span-8">
          <span
            className={`inline-block rounded-full border px-3 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.16em] sm:text-[0.66rem] ${
              profile.role === 'admin'
                ? 'border-gold/45 text-gold-deep'
                : 'border-ink-faint/30 text-ink-faint'
            }`}
          >
            {profile.role ?? 'applicant'}
          </span>
          <h1 className="mt-3 font-display text-3xl font-medium leading-tight text-ink sm:text-4xl lg:text-5xl">
            {displayName}
          </h1>
          {profile.business_name && (
            <p className="mt-2 font-display text-lg italic text-ink-soft sm:text-xl">
              {profile.business_name}
            </p>
          )}

          <dl className="mt-7 grid gap-x-6 gap-y-4 sm:grid-cols-2">
            <Detail label="Email" value={email} />
            <Detail label="Phone" value={profile.phone ?? '—'} />
            <Detail label="Business address" value={profile.business_address ?? '—'} />
            <Detail
              label="Joined"
              value={new Date(profile.created_at).toLocaleDateString('en-NG', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            />
            <Detail label="Instagram" value={profile.instagram_handle ?? '—'} />
            <Detail label="X (Twitter)" value={profile.twitter_handle ?? '—'} />
            <Detail label="Facebook" value={profile.facebook_handle ?? '—'} />
          </dl>

          <div className="mt-8 border-t border-hairline pt-6">
            <DeleteMemberButton memberId={profile.id} name={displayName} />
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between border-b border-hairline pb-3 sm:pb-4">
          <h2 className="font-display text-xl text-ink sm:text-2xl">Applications</h2>
          <span className="text-[0.66rem] text-ink-faint sm:text-[0.7rem]">
            {apps.length} {apps.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>
        {apps.length === 0 ? (
          <p className="mt-6 text-sm text-ink-soft sm:text-base">
            This member has not submitted any application yet.
          </p>
        ) : (
          <ul className="mt-2">
            {apps.map(application => {
              const category = getCategoryBySlug(application.category_slug)
              return (
                <li key={application.id}>
                  <Link
                    href={`/admin/applications#app-${application.id}`}
                    className="group/row flex items-center gap-3 border-b border-hairline py-3.5 transition-colors duration-200 hover:border-gold/45 sm:gap-4 sm:py-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-base text-ink sm:text-lg">
                        {application.business_name ?? application.full_name ?? '—'}
                      </p>
                      <p className="truncate text-[0.7rem] text-ink-faint sm:text-sm">
                        {category?.shortName ?? application.category_slug} ·{' '}
                        {new Date(application.created_at).toLocaleDateString('en-NG', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full border border-hairline bg-canvas/60 px-2 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-ink-faint sm:px-2.5 sm:py-1 sm:text-[0.62rem]">
                      {application.status}
                    </span>
                    <ArrowUpRight
                      className="size-4 shrink-0 text-ink-soft transition-transform duration-200 group-hover/row:translate-x-0.5 group-hover/row:-translate-y-0.5 group-hover/row:text-gold-deep"
                      strokeWidth={1.75}
                    />
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-ink-faint sm:text-[0.66rem]">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm text-ink sm:text-base">{value}</dd>
    </div>
  )
}
