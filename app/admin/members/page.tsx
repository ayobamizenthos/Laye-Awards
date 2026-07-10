import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { createSupabaseServiceClient } from '@/lib/supabase/server'
import { CreateMemberForm } from '@/components/admin/CreateMemberForm'

export const dynamic = 'force-dynamic'

interface ProfileRow {
  id: string
  full_name: string | null
  phone: string | null
  role: string | null
  avatar_url: string | null
  business_name: string | null
  created_at: string
}

interface ApplicationRow {
  id: string
  applicant_id: string
  status: string
  full_name: string | null
  business_name: string | null
  category_slug: string
}

export default async function AdminMembersPage() {
  const service = createSupabaseServiceClient()
  const { data: profiles } = (await service
    .from('profiles')
    .select('id, full_name, phone, role, avatar_url, business_name, created_at')
    .order('created_at', { ascending: false })) as { data: ProfileRow[] | null }

  const profileRows = profiles ?? []
  const ids = profileRows.map(profile => profile.id)
  let applicationsByUser = new Map<string, ApplicationRow[]>()
  const votesByUser = new Map<string, number>()
  if (ids.length) {
    const { data: applications } = (await service
      .from('applications')
      .select('id, applicant_id, status, full_name, business_name, category_slug')
      .in('applicant_id', ids)
      .order('created_at', { ascending: false })) as {
      data: ApplicationRow[] | null
    }
    applicationsByUser = (applications ?? []).reduce((acc, application) => {
      const list = acc.get(application.applicant_id) ?? []
      list.push(application)
      acc.set(application.applicant_id, list)
      return acc
    }, new Map<string, ApplicationRow[]>())

    const applicationIds = (applications ?? []).map(application => application.id)
    const userByApplication = new Map(
      (applications ?? []).map(application => [application.id, application.applicant_id])
    )
    if (applicationIds.length) {
      const { data: nominees } = (await service
        .from('nominees')
        .select('application_id, total_votes')
        .in('application_id', applicationIds)) as {
        data: { application_id: string; total_votes: number }[] | null
      }
      ;(nominees ?? []).forEach(nominee => {
        const userId = userByApplication.get(nominee.application_id)
        if (!userId) return
        votesByUser.set(userId, (votesByUser.get(userId) ?? 0) + (nominee.total_votes ?? 0))
      })
    }
  }

  profileRows.sort((a, b) => {
    const voteGap = (votesByUser.get(b.id) ?? 0) - (votesByUser.get(a.id) ?? 0)
    if (voteGap !== 0) return voteGap
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  })

  const { data: authData } = await service.auth.admin.listUsers({ perPage: 1000 })
  const emailById = new Map<string, string>()
  authData.users.forEach(user => {
    if (user.id && user.email) emailById.set(user.id, user.email)
  })

  return (
    <div className="space-y-8 sm:space-y-10 lg:space-y-12">
      <section className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <span className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-gold-deep sm:text-[0.7rem]">
            Member directory
          </span>
          <h1 className="mt-3 font-display text-2xl font-medium text-ink sm:text-3xl lg:text-4xl">
            Everyone who has signed up.
          </h1>
        </div>
        <p className="text-[0.66rem] uppercase tracking-[0.16em] text-ink-faint sm:text-[0.7rem]">
          {profileRows.length} {profileRows.length === 1 ? 'member' : 'members'}
        </p>
      </section>

      <CreateMemberForm />

      <ul className="space-y-3 sm:space-y-4">
        {profileRows.map(profile => {
          const applications = applicationsByUser.get(profile.id) ?? []
          const email = emailById.get(profile.id) ?? '—'
          const displayName = profile.full_name?.trim() || email.split('@')[0]
          return (
            <li key={profile.id}>
              <Link
                href={`/admin/members/${profile.id}`}
                className="group/row flex items-center gap-4 rounded-2xl border border-hairline bg-surface p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/45 hover:shadow-[0_20px_50px_-30px_rgba(203,169,78,0.4)] sm:gap-5 sm:p-5"
              >
                <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold/35 bg-gold/[0.06] font-display text-base text-gilded sm:size-14">
                  {profile.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt=""
                      fill
                      sizes="56px"
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <span aria-hidden>{displayName[0]?.toUpperCase() ?? 'A'}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-base text-ink sm:text-lg">
                    {displayName}
                  </p>
                  <p className="truncate text-[0.72rem] text-ink-faint sm:text-sm">{email}</p>
                </div>
                <div className="hidden flex-col items-end gap-1 sm:flex">
                  <span
                    className={`rounded-full border px-3 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.14em] sm:text-[0.62rem] ${
                      profile.role === 'admin'
                        ? 'border-gold/45 text-gold-deep'
                        : 'border-ink-faint/30 text-ink-faint'
                    }`}
                  >
                    {profile.role ?? 'applicant'}
                  </span>
                  <span className="text-[0.6rem] text-ink-faint sm:text-[0.65rem]">
                    {applications.length}{' '}
                    {applications.length === 1 ? 'application' : 'applications'}
                  </span>
                </div>
                <ArrowUpRight
                  className="size-4 shrink-0 text-ink-soft transition-transform duration-300 group-hover/row:translate-x-0.5 group-hover/row:-translate-y-0.5 group-hover/row:text-gold-deep"
                  strokeWidth={1.75}
                />
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
