'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { UserRound } from 'lucide-react'
import { primaryNav } from '@/config/site'
import { useSmoothScroll } from '@/components/providers/SmoothScroll'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/layout/Logo'
import { cn } from '@/lib/utils'

type SessionState = 'unknown' | 'guest' | 'applicant' | 'admin'

export function Navbar() {
  const pathname = usePathname()
  const { scrollTo, stop, start } = useSmoothScroll()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [atFooter, setAtFooter] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)
  const scrollPauseTimer = useRef<number | undefined>(undefined)
  const [session, setSession] = useState<SessionState>('unknown')

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    let cancelled = false
    const resolve = async () => {
      const { data } = await supabase.auth.getUser()
      if (cancelled) return
      if (!data.user) {
        setSession('guest')
        return
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()
      if (cancelled) return
      setSession(profile?.role === 'admin' ? 'admin' : 'applicant')
    }
    resolve()
    const { data: subscription } = supabase.auth.onAuthStateChange(() => resolve())
    return () => {
      cancelled = true
      subscription.subscription.unsubscribe()
    }
  }, [pathname])

  const isDashboardRoute = pathname.startsWith('/admin') || pathname.startsWith('/dashboard')
  const accountHref =
    session === 'admin' ? '/admin' : session === 'applicant' ? '/dashboard' : '/login'
  const showApply = session !== 'admin' && session !== 'applicant'

  useEffect(() => {
    if (isDashboardRoute) return
    const onScroll = () => {
      const scrollY = window.scrollY
      setScrolled(scrollY > 18)
      const bottom = scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4
      setAtFooter(bottom)

      const previous = lastScrollY.current
      const delta = scrollY - previous
      if (scrollY < 80) {
        setHidden(false)
      } else if (delta > 6) {
        setHidden(true)
      } else if (delta < -6) {
        setHidden(false)
      }
      lastScrollY.current = scrollY

      // Reveal the header once scrolling pauses.
      window.clearTimeout(scrollPauseTimer.current)
      scrollPauseTimer.current = window.setTimeout(() => setHidden(false), 150)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.clearTimeout(scrollPauseTimer.current)
    }
  }, [pathname, isDashboardRoute])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (menuOpen) stop()
    else start()
    return () => start()
  }, [menuOpen, stop, start])

  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#') && pathname === '/') {
      event.preventDefault()
      scrollTo(href.slice(1), -90)
      setMenuOpen(false)
    }
  }

  if (isDashboardRoute) return null

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 px-3 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-6 lg:px-10',
          scrolled ? 'pt-3 sm:pt-4' : 'pt-4 sm:pt-5 lg:pt-6',
          (hidden || atFooter) && !menuOpen && '-translate-y-[150%]'
        )}
      >
        <div
          className={cn(
            'relative mx-auto flex w-full max-w-[120rem] items-center justify-between rounded-full px-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-6 lg:px-8',
            scrolled
              ? 'h-14 border border-gold/35 bg-canvas/90 shadow-[0_18px_50px_-22px_rgba(12,10,7,0.7),0_0_0_1px_rgba(203,169,78,0.12)_inset] backdrop-blur-xl lg:h-16'
              : 'h-16 border border-hairline/60 bg-canvas/55 backdrop-blur-md lg:h-18'
          )}
        >
          <span
            aria-hidden
            className={cn(
              'pointer-events-none absolute inset-x-12 -bottom-px h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent transition-opacity duration-500',
              scrolled ? 'opacity-100' : 'opacity-0'
            )}
          />

          <Logo />

          <nav className="hidden items-center gap-7 xl:flex">
            {primaryNav.map(item => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={event => handleNavClick(event, item.href)}
                  data-cursor-hover
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'group/nav relative text-[0.7rem] font-medium uppercase tracking-[0.18em] transition-colors duration-300',
                    isActive ? 'text-ink' : 'text-ink-soft hover:text-ink'
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      'absolute -bottom-1.5 left-0 h-px w-full bg-gold transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                      isActive
                        ? 'origin-left scale-x-100'
                        : 'origin-right scale-x-0 group-hover/nav:origin-left group-hover/nav:scale-x-100'
                    )}
                  />
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href={accountHref}
              aria-label={session === 'guest' ? 'Sign in' : 'Account'}
              data-cursor-hover
              className="group/account hidden size-11 items-center justify-center rounded-full border border-hairline text-ink-soft transition-all duration-300 hover:border-gold hover:text-gold-deep xl:flex"
            >
              <UserRound className="size-4" strokeWidth={1.75} />
            </Link>

            {showApply && (
              <div className="hidden xl:block">
                <Button href="/apply" size="sm" withArrow>
                  Register Now
                </Button>
              </div>
            )}

            <button
              type="button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(open => !open)}
              data-cursor-hover
              className="relative z-50 flex size-11 items-center justify-center xl:hidden"
            >
              <span className="relative flex h-3.5 w-6 flex-col justify-between">
                <span
                  className={cn(
                    'h-px w-full bg-ink transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    menuOpen && 'translate-y-[6px] rotate-45'
                  )}
                />
                <span
                  className={cn(
                    'h-px w-full bg-ink transition-all duration-300',
                    menuOpen && 'opacity-0'
                  )}
                />
                <span
                  className={cn(
                    'h-px w-full bg-ink transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    menuOpen && '-translate-y-[6px] -rotate-45'
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <MobileMenu
            onNavClick={handleNavClick}
            accountHref={accountHref}
            showApply={showApply}
            session={session}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function MobileMenu({
  onNavClick,
  accountHref,
  showApply,
  session,
}: {
  onNavClick: (event: React.MouseEvent<HTMLAnchorElement>, href: string) => void
  accountHref: string
  showApply: boolean
  session: SessionState
}) {
  const pathname = usePathname()
  return (
    <motion.div
      initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-canvas xl:hidden"
    >
      <div className="flex min-h-full flex-col px-6 pb-10 pt-24 sm:pt-28">
        <nav className="flex flex-col">
          {primaryNav.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ y: 32, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.12 + index * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="border-b border-hairline"
            >
              <Link
                href={item.href}
                onClick={event => onNavClick(event, item.href)}
                aria-current={pathname === item.href ? 'page' : undefined}
                className="flex items-baseline justify-between py-2.5 sm:py-3"
              >
                <span
                  className={cn(
                    'font-display text-[1.6rem] leading-tight sm:text-3xl',
                    pathname === item.href || pathname.startsWith(`${item.href}/`)
                      ? 'italic text-gilded'
                      : 'text-ink'
                  )}
                >
                  {item.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </nav>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-8 sm:mt-10"
        >
          {showApply && (
            <Button href="/apply" size="md" withArrow className="w-full">
              Register Now
            </Button>
          )}
          <Link
            href={accountHref}
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-full border border-hairline px-5 py-3 text-[0.78rem] font-medium uppercase tracking-[0.16em] text-ink-soft transition-colors duration-300 hover:border-gold hover:text-gold-deep',
              showApply && 'mt-3'
            )}
          >
            <UserRound className="size-4" strokeWidth={1.75} />
            {session === 'guest' ? 'Sign in' : session === 'admin' ? 'Admin' : 'Dashboard'}
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}
