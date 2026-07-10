import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import { PageHeader } from '@/components/ui/PageHeader'
import { Section, Container } from '@/components/ui/Section'
import { Reveal } from '@/components/motion/Reveal'
import { ContactForm } from '@/components/contact/ContactForm'
import {
  InstagramIcon,
  FacebookIcon,
  LinkedinIcon,
  YoutubeIcon,
  WhatsAppIcon,
} from '@/components/ui/SocialIcon'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the LAYEAWARDS team, for nominations, partnerships and press.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: `Contact · ${siteConfig.name}`,
    description: 'Reach the team behind the Lagos Young Entrepreneurs Awards.',
    url: `${siteConfig.url}/contact`,
  },
}

const socials = [
  { label: 'Instagram', href: siteConfig.socials.instagram, Icon: InstagramIcon },
  { label: 'LinkedIn', href: siteConfig.socials.linkedin, Icon: LinkedinIcon },
  { label: 'YouTube', href: siteConfig.socials.youtube, Icon: YoutubeIcon },
  { label: 'Facebook', href: siteConfig.socials.facebook, Icon: FacebookIcon },
]

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        heading={
          <>
            Start a <em className="italic text-gilded">conversation</em>.
          </>
        }
        lead="Questions about nominations, partnerships or press? The LAYEAWARDS team is listening."
      />

      <div className="theme-light">
        <Section spacing="lg">
          <Container>
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-5">
                <Reveal y={28}>
                  <p className="font-display text-3xl leading-snug text-ink lg:text-4xl">
                    Reach the team behind {siteConfig.name}.
                  </p>
                </Reveal>

                <Reveal y={24} delay={0.1} className="mt-10 space-y-8">
                  <div>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ink-faint">
                      Call us
                    </p>
                    <div className="mt-2 space-y-1">
                      {siteConfig.contact.phones.map(phone => (
                        <a
                          key={phone}
                          href={`tel:${phone.replace(/\s/g, '')}`}
                          data-cursor-hover
                          className="block font-display text-2xl text-ink transition-colors hover:text-gold-deep"
                        >
                          {phone}
                        </a>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ink-faint">
                      Chat with us
                    </p>
                    <a
                      href={siteConfig.socials.whatsapp}
                      target="_blank"
                      rel="noreferrer noopener"
                      data-cursor-hover
                      className="mt-3 inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_-12px_rgba(37,211,102,0.7)] transition-transform duration-300 hover:scale-[1.03]"
                    >
                      <WhatsAppIcon className="size-5" />
                      Chat on WhatsApp
                    </a>
                  </div>

                  {siteConfig.contact.address && (
                    <div>
                      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ink-faint">
                        Address
                      </p>
                      <p className="mt-2 max-w-xs text-lg text-ink-soft">
                        {siteConfig.contact.address}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ink-faint">
                      Follow
                    </p>
                    <div className="mt-3 flex gap-3">
                      {socials.map(({ label, href, Icon }) => (
                        <a
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noreferrer noopener"
                          aria-label={label}
                          data-cursor-hover
                          className="flex size-11 items-center justify-center rounded-full border border-hairline text-ink-soft transition-all duration-300 hover:border-gold hover:bg-gold hover:text-ink"
                        >
                          <Icon className="size-4" />
                        </a>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </div>

              <Reveal y={36} delay={0.12} className="lg:col-span-6 lg:col-start-7">
                <ContactForm />
              </Reveal>
            </div>
          </Container>
        </Section>
      </div>
    </>
  )
}
