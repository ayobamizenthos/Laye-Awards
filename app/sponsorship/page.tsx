import type { Metadata } from 'next'
import { ArrowUpRight } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { sponsorshipTiers, advertisingRates } from '@/lib/content/content'
import { PageHeader } from '@/components/ui/PageHeader'
import { Section, Container } from '@/components/ui/Section'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { Reveal } from '@/components/motion/Reveal'
import { StaggerReveal, StaggerItem } from '@/components/motion/StaggerReveal'
import { Button } from '@/components/ui/Button'
import { SponsorTierCard } from '@/components/sponsorship/SponsorTierCard'

function advertMailto(name: string, priceLabel: string) {
  const subject = `Advertising Enquiry: ${name} · ${siteConfig.edition.eyebrow}`
  const body = `Hello LAYEAWARDS team,

We would like to place an advert in the ${siteConfig.fullName} (${siteConfig.edition.ordinal} Edition): ${name} (${priceLabel}).

Please share the artwork specifications, deadline and next steps to confirm this placement.

Our details:
• Organisation:
• Contact name:
• Phone:
`
  return `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`
}

export const metadata: Metadata = {
  title: 'Sponsorship & Partnership',
  description:
    'Partner with the Lagos Young Entrepreneurs Awards, six sponsorship tiers from ₦2M to ₦50M, plus magazine advertising.',
  alternates: { canonical: '/sponsorship' },
  openGraph: {
    title: `Sponsorship · ${siteConfig.name}`,
    description:
      'Stand beside Lagos’ boldest night. Six sponsorship tiers, plus magazine advertising and table reservations.',
    url: `${siteConfig.url}/sponsorship`,
  },
}

export default function SponsorshipPage() {
  return (
    <>
      <PageHeader
        eyebrow="Sponsorship & Partnership"
        heading={
          <>
            Stand beside Lagos&apos; <em className="italic text-gilded">boldest</em> night.
          </>
        }
        lead="Six editions of credibility, a black-tie audience of decision-makers, and brand visibility built to deliver measurable return."
      />

      <div className="theme-light">
        <Section spacing="lg" className="bg-surface">
          <Container>
            <span className="eyebrow text-gold-deep">Investment Tiers</span>
            <StaggerReveal
              className="mt-8 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
              stagger={0.08}
              y={28}
            >
              {sponsorshipTiers.map(tier => (
                <StaggerItem key={tier.name} className="h-full">
                  <SponsorTierCard tier={tier} />
                </StaggerItem>
              ))}
            </StaggerReveal>
          </Container>
        </Section>

        <Section spacing="lg" className="">
          <Container>
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <SectionIntro
                eyebrow="Advertising"
                heading={
                  <>
                    The LAYE Awards <em className="italic text-gilded">Magazine</em>.
                  </>
                }
                lead="Place your brand in front of decision-makers through the commemorative magazine and venue branding."
              />
            </div>

            <StaggerReveal
              className="mt-12 grid lg:mt-16 lg:grid-cols-2 lg:gap-x-12"
              stagger={0.07}
              y={28}
            >
              {advertisingRates.map(rate => (
                <StaggerItem key={rate.name}>
                  <a
                    href={advertMailto(rate.name, rate.priceLabel)}
                    data-cursor-hover
                    className="group/ad flex items-baseline justify-between gap-6 border-b border-gold/25 py-6 transition-colors duration-300 hover:border-gold/60"
                  >
                    <div>
                      <h3 className="flex items-center gap-2 font-display text-2xl font-medium text-ink transition-colors duration-300 group-hover/ad:text-gold-deep">
                        {rate.name}
                        <ArrowUpRight
                          className="size-4 text-gold-deep opacity-0 transition-all duration-300 group-hover/ad:translate-x-0.5 group-hover/ad:-translate-y-0.5 group-hover/ad:opacity-100"
                          strokeWidth={2}
                        />
                      </h3>
                      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-ink-soft">
                        {rate.note}
                      </p>
                    </div>
                    <span className="shrink-0 font-display text-2xl text-gilded">
                      {rate.priceLabel}
                    </span>
                  </a>
                </StaggerItem>
              ))}
            </StaggerReveal>
            <Reveal delay={0.1} className="mt-8">
              <p className="text-sm text-ink-faint">
                All placements are allocated first-come, first-served, early confirmation secures
                premium positioning.
              </p>
            </Reveal>
          </Container>
        </Section>

        <Section spacing="lg">
          <Container>
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-6">
                <SectionIntro
                  eyebrow="Secure Your Place"
                  heading={
                    <>
                      Ready to <em className="italic text-gilded">partner</em>?
                    </>
                  }
                  lead="Reach the team to confirm a sponsorship tier, an advert placement or a table reservation."
                />
                <Reveal delay={0.15} className="mt-8 flex flex-wrap gap-4">
                  <Button href="/contact" withArrow>
                    Contact the Team
                  </Button>
                  <Button href="/categories" variant="secondary">
                    Sponsor a Category
                  </Button>
                </Reveal>
              </div>

              <Reveal y={36} delay={0.1} className="lg:col-span-5 lg:col-start-8">
                <div className="rounded-2xl border border-gold/35 bg-gradient-to-b from-gold/[0.08] to-transparent p-7 lg:p-9">
                  <p className="eyebrow text-gold-deep">Pay by transfer</p>
                  <p className="mt-5 font-display text-2xl leading-snug text-ink lg:text-3xl">
                    Sponsor account details.
                  </p>
                  <dl className="mt-6 space-y-4 text-sm">
                    <div>
                      <dt className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                        Account name
                      </dt>
                      <dd className="mt-1 font-display text-xl text-ink">
                        {siteConfig.payment.accountName}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                        Account number
                      </dt>
                      <dd className="mt-1 font-display text-2xl tabular-nums text-gilded">
                        {siteConfig.payment.accountNumber}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                        Bank
                      </dt>
                      <dd className="mt-1 font-display text-xl text-ink">
                        {siteConfig.payment.bank}
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-6 text-sm leading-relaxed text-ink-soft">
                    Send proof of transfer to{' '}
                    <a
                      href={`mailto:${siteConfig.contact.email}`}
                      className="text-ink hover:text-gold-deep"
                    >
                      {siteConfig.contact.email}
                    </a>{' '}
                    to confirm your placement.
                  </p>
                </div>
              </Reveal>
            </div>
          </Container>
        </Section>
      </div>
    </>
  )
}
