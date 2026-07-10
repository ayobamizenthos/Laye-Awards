import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { siteConfig } from '@/config/site'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { signOutAction } from '@/lib/supabase/actions'
import { ConsoleNav } from '@/components/dashboard/ConsoleNav'
import { Logo } from '@/components/layout/Logo'

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

const applicantNav = [
  { href: '/dashboard', label: 'My Application' },
  { href: '/dashboard/profile', label: 'Profile' },
]

const adminNav = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/applications', label: 'Applications' },
  { href: '/admin/nominees', label: 'Nominees' },
  { href: '/admin/votes', label: 'Votes' },
  { href: '/admin/members', label: 'Members' },
  { href: '/admin/settings', label: 'Settings' },
]

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/dashboard')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  const { data: latestApplication } = await supabase
    .from('applications')
    .select('headshot_url')
    .eq('applicant_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const isAdmin = profile?.role === 'admin'
  const nav = isAdmin ? adminNav : applicantNav
  const initials = (profile?.full_name ?? user.email ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase() ?? '')
    .join('')
  const avatarUrl = latestApplication?.headshot_url ?? null

  return (
    <div className="min-h-dvh bg-canvas pt-8 sm:pt-10 lg:pt-12">
      <header>
        <div className="mx-auto max-w-7xl px-4 pb-7 pt-2 sm:px-6 sm:pb-9 lg:px-8 lg:pb-10">
          <Logo />

          <div className="mt-6 flex flex-col gap-5 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-6 lg:mt-12">
            <div className="min-w-0">
              <h1 className="font-display text-[1.875rem] font-medium leading-[1.08] text-ink sm:text-4xl lg:text-6xl">
                {isAdmin ? (
                  <>
                    The <em className="italic text-gilded">control room</em>.
                  </>
                ) : (
                  <>Welcome back, {profile?.full_name?.split(' ')[0] ?? 'friend'}.</>
                )}
              </h1>
            </div>

            <div className="flex items-center justify-between gap-4 sm:justify-end sm:gap-5">
              <div className="min-w-0 sm:text-right">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-ink-faint sm:text-[0.68rem]">
                  Signed in as
                </p>
                <p className="mt-1.5 truncate font-display text-base text-ink sm:text-xl">
                  {profile?.full_name ?? user.email?.split('@')[0]}
                </p>
                <p className="truncate text-[0.7rem] text-ink-faint sm:text-xs">{user.email}</p>
              </div>
              <div className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold/35 bg-gold/[0.06] font-display text-base text-gilded sm:size-14 sm:text-xl">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt=""
                    fill
                    sizes="56px"
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <span aria-hidden>{initials || 'A'}</span>
                )}
              </div>
            </div>
          </div>

          <ConsoleNav items={nav} />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 sm:pb-24 sm:pt-12 lg:px-8 lg:pb-32 lg:pt-16">
        {children}
      </div>

      <footer>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <Link
            href="/"
            className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gold-deep transition-colors duration-200 hover:text-gold sm:text-[0.7rem]"
          >
            ← Back to {siteConfig.name}
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gold-deep transition-colors duration-200 hover:text-gold sm:text-[0.7rem]"
            >
              Sign out
            </button>
          </form>
        </div>
      </footer>
    </div>
  )
}
