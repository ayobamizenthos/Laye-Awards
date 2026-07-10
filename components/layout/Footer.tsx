'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight } from 'lucide-react'
import { siteConfig, primaryNav } from '@/config/site'
import { Logo } from '@/components/layout/Logo'
import {
  InstagramIcon,
  FacebookIcon,
  LinkedinIcon,
  YoutubeIcon,
  WhatsAppIcon,
} from '@/components/ui/SocialIcon'

const socialLinks = [
  { label: 'Instagram', href: siteConfig.socials.instagram, Icon: InstagramIcon },
  { label: 'LinkedIn', href: siteConfig.socials.linkedin, Icon: LinkedinIcon },
  { label: 'YouTube', href: siteConfig.socials.youtube, Icon: YoutubeIcon },
  { label: 'Facebook', href: siteConfig.socials.facebook, Icon: FacebookIcon },
  { label: 'WhatsApp', href: siteConfig.socials.whatsapp, Icon: WhatsAppIcon },
]

export function Footer() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) return null

  const isLightPage =
    pathname === '/nominees' ||
    [
      '/blog',
      '/apply',
      '/register',
      '/about',
      '/gallery',
      '/categories',
      '/contact',
      '/sponsorship',
      '/editions',
    ].some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`))

  return (
    <div style={{ backgroundColor: isLightPage ? '#f4eddb' : '#1d130b' }}>
      <footer className="relative overflow-hidden rounded-t-[2.5rem] border-t-[3px] border-gold bg-onyx shadow-[0_-12px_40px_-12px_rgba(203,169,78,0.55)] sm:rounded-t-[4rem] lg:rounded-t-[5.5rem]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-52 bg-[radial-gradient(ellipse_52%_100%_at_50%_0%,rgba(201,168,76,0.22),transparent_72%)]"
        />

        <div className="relative mx-auto max-w-[120rem] px-5 pt-16 pb-0 sm:px-8 lg:px-12 lg:pt-24 lg:pb-0">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <Logo variant="full" className="w-24 sm:w-32 lg:w-44" />
              <p className="mt-7 max-w-sm font-display text-2xl leading-snug text-ink sm:text-3xl">
                {siteConfig.tagline}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-2.5 sm:gap-3">
                {socialLinks.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    data-cursor-hover
                    className="flex size-11 items-center justify-center rounded-full border border-hairline text-ink-soft transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-gold hover:bg-gold hover:text-onyx"
                  >
                    <Icon className="size-4" />
                  </a>
                ))}
              </div>
            </div>

            <nav className="lg:col-span-3 lg:col-start-7">
              <p className="eyebrow text-ink-faint">Explore</p>
              <ul className="mt-6 space-y-3.5">
                {primaryNav.map(item => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      data-cursor-hover
                      className="group/fl inline-flex items-center gap-1.5 text-base text-ink-soft transition-colors duration-300 hover:text-gold"
                    >
                      {item.label}
                      <ArrowUpRight
                        className="size-3.5 opacity-0 transition-opacity duration-300 group-hover/fl:opacity-100"
                        strokeWidth={1.75}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="lg:col-span-3">
              <p className="eyebrow text-ink-faint">Connect</p>
              <ul className="mt-6 space-y-3.5">
                <li>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    data-cursor-hover
                    className="text-base text-ink-soft transition-colors duration-300 hover:text-gold"
                  >
                    {siteConfig.contact.email}
                  </a>
                </li>
                {siteConfig.contact.phones.map(phone => (
                  <li key={phone}>
                    <a
                      href={`tel:${phone.replace(/\s/g, '')}`}
                      data-cursor-hover
                      className="text-base text-ink-soft transition-colors duration-300 hover:text-gold"
                    >
                      {phone}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div aria-hidden className="mt-0 select-none lg:mt-1">
            <svg
              viewBox="0 0 1100 211"
              preserveAspectRatio="xMidYMid meet"
              className="block w-full"
            >
              <text
                x="550"
                y="160"
                textAnchor="middle"
                textLength="1100"
                lengthAdjust="spacingAndGlyphs"
                className="font-display fill-gold opacity-[0.13]"
                style={{ fontSize: 230, fontWeight: 600 }}
              >
                Layeawards
              </text>
            </svg>
          </div>
        </div>
      </footer>
    </div>
  )
}
